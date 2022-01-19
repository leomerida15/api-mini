import Users from '../db/models/Users';
import fastify, { FastifyRequest, FastifyReply } from 'fastify';
import { getRepository, Not, In, getConnection } from 'typeorm';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Options } from 'multer';
import mailMsg from '../hooks/mail';
import { mailer } from '../hooks/mail/index';
import Elections from 'db/models/Elections';

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

	const passValid = await bcrypt.compare(req.body.password, user.password);

	if (!passValid) throw { message: 'contraseña incorrecta' };

	const { id, roles } = user;

	const token = jwt.sign({ id, roles, email }, 'nojodas');

	const { password, ...info } = user;



	const election = await (async () => {


		const activas = ((await getRepository('Elections').findOne({
			where: [{ status: Not(4) }],
			relations: ['Options', 'status'],
			orderby: { createAt: 'DESC' },
		})) as Elections | undefined)

		if (activas) return activas;

		return ((await getRepository('Elections').findOne({
			where: [{ status: 4 }],
			relations: ['Options', 'status'],
			orderby: { createAt: 'DESC' },
		})) as Elections | undefined);
	})()

	let option: any = {};

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

export const newPassEmail = async (
	req: FastifyRequest<{
		Body: Users;
	}>,
	reply: FastifyReply
): Promise<void> => {
	const { email } = req.body;
	const user = (await getRepository('Users').findOne({ email }) as Users | undefined);
	if (!user) throw { message: 'el correo suministrado no existe', code: 400 };

	// const password = 
	const randon = Math.random().toString(36).slice(-8);
	const password = await bcrypt.hash(randon, 12);

	await getRepository('Users').update(user.id!, { password });

	/** Shipping email */
	const info = await mailer.sendMail({
		from: 'dev@grandiose-pear.com',
		to: email,
		subject: 'Nueva contraseña',
		html: mailMsg(user.name, randon),
	});

	reply.status(200).send({ message: 'Correo enviado' });
};

export const newPass = async (
	req: FastifyRequest<{
		Body: Users;
	}>,
	reply: FastifyReply
): Promise<void> => {
	const token = JSON.parse(req.headers.authorization as string);

	const password = await bcrypt.hash(req.body.password, 12);

	await getRepository('Users').update({ email: token.email }, { password });

	reply.status(200).send({ message: 'contraseña editada' });
};

export const editUser = async (
	req: FastifyRequest<{
		Body: Users;
		Params: { id: string };
	}>,
	reply: FastifyReply
): Promise<void> => {
	// 
	const { id } = req.params;

	const user = (await getRepository('Users').findOne({ id }) as Users | undefined);
	if (!user) throw { message: 'el correo suministrado no existe', code: 400 };

	const { roles, ...data } = req.body;
	await getRepository('Users').update(id, data);

	if (roles) {
		await getRepository('R_User_Rols').delete({ id_user: id });

		const rolesData = roles.map((role: any) => (`(${id}, ${role.id})`)).join(', ');

		await getConnection().query(/*sql*/`
		INSERT INTO public."R_User_Rols"
		(id_user, id_rol)
		VALUES ${rolesData};`);

	}

	reply.status(200).send({ message: 'usuario editado' });
};

export const deleteUser = async (
	req: FastifyRequest<{
		Body: Users;
	}>,
	reply: FastifyReply
): Promise<void> => {

	const { id } = req.body;
	const user = (await getRepository('Users').findOne({ id }) as Users | undefined);
	if (!user) throw { message: 'el correo suministrado no existe', code: 400 };

	await getRepository('Users').delete(id);

	reply.status(200).send({ message: 'usuario eliminado' });
};