import Users from '../db/models/Users';
import fastify, { FastifyRequest, FastifyReply } from 'fastify';
import { getRepository, Not, In } from 'typeorm';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Options } from 'multer';

export const register = async (
	req: FastifyRequest<{
		Body: Users;
	}>,
	reply: FastifyReply,
	done: any
): Promise<FastifyReply | void> => {
	//
	const { email, password } = req.body;

	const valid = await getRepository('Users').count({ email });

	if (valid) throw { message: 'el correo suministrado ya existe', code: 400 };

	req.body.password = await bcrypt.hash(password, 12);
	const user: Users = req.body;

	await getRepository('Users').save(user);

	const info = await getRepository('Users').findOne({ where: { email }, relations: ['roles'] });

	return reply.status(200).send({ message: 'usuario registrado', info });
};

export const login = async (
	req: FastifyRequest<{
		Body: Users;
	}>,
	reply: FastifyReply
): Promise<void> => {
	//
	const { email } = req.body;

	const user = (await getRepository('Users').findOne({
		where: { email },
		select: ['password', 'id', 'name', 'email'],
		relations: ['roles'],
	})) as Users | undefined;

	if (!user) throw { message: 'el correo suministrado no existe', code: 400 };

	const passValid = bcrypt.compare(req.body.password, user.password);
	if (!passValid) throw { message: 'contraseña incorrecta' };

	const { id, roles } = user;

	const token = jwt.sign({ id, roles, email }, 'nojodas');

	const { password, ...info } = user;

	const election =
		((await getRepository('Elections').findOne({
			where: { status: Not(4) },
			relations: ['Options'],

		})) as any | undefined) ?? {};

	let option: any = {};

	let ids_options = election.Options?.map(({ id }: any) => id);

	let vote: any = {};

	if (election) {
		option = await getRepository('Options').findOne({
			where: { election: election.id, creator: user.id },
		}) as Options | undefined ?? {}

		let ids_options = election.Options!.map(({ id }: any) => id);

		vote = await getRepository('R_User_Options').findOne({
			where: { Option: In(ids_options), User: user.id },
			relations: ['Option'],
		}) as any | undefined ?? {};
	}

	reply.status(200).send({ message: 'usuario logeado', info, token, option, election, vote: vote.Option ? vote.Option : {} });
};

export const getUsers = async (
	req: FastifyRequest<{
		Body: Users;
	}>,
	reply: FastifyReply
): Promise<void> => {
	//
	const info = (await getRepository('Users').find({
		select: ['id', 'name', 'email'],
		relations: ['roles'],
	})) as Users[];

	reply.status(200).send({ message: 'usuarios', info });
};
