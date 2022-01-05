import Users from '../db/models/Users';
import { FastifyRequest, FastifyReply } from 'fastify';
import { getRepository, Not } from 'typeorm';
import Elections from '../db/models/Elections';
import Msg from '../hooks/messages';
import { FastifyJWT } from 'fastify-jwt';
import HookHandlerDoneFunction from 'fastify';
import Options from '../db/models/Options';

export const getElectionsById = async (
	req: FastifyRequest<{
		Body: Elections;
		Params: {
			id: string;
		};
	}>,
	reply: FastifyReply
): Promise<FastifyReply | void> => {
	const info = await getRepository('Elections').findOne({
		where: { id: req.params.id },
		relations: ['Options', 'Options.Imgs'],
	});

	return reply.status(200).send({ message: 'Eleccion', info });
};

export const getElectionsAll = async (
	req: FastifyRequest<{
		Body: Elections;
	}>,
	reply: FastifyReply
): Promise<FastifyReply | void> => {
	const info = await getRepository('Elections').find({
		relations: ['Options', 'Options.Imgs'],
	});
	if (!info.length) throw { message: 'no existen elecciones', statusCode: 400 };

	return reply.status(200).send({ message: 'Elecciones', info });
};

export const createElections = async (
	req: FastifyRequest<{
		Body: Elections;
	}>,
	reply: FastifyReply
): Promise<FastifyReply | void> => {
	const valid = await getRepository('Elections').count({ status: true });
	if (valid) throw { message: 'ya existe una eleccion activa', statusCode: 400 };
	//
	const info = await getRepository('Elections').save(req.body);

	await getRepository('Elections').update('*', { status: false });

	reply.status(200).send({ message: 'Eleccion creada', info });
};

export const removeElections = async (
	req: FastifyRequest<{
		Body: Elections;
		Params: { id_election: string };
	}>,
	reply: FastifyReply
): Promise<FastifyReply | void> => {
	//
	await getRepository('Elections').delete(req.params.id_election);

	return reply.status(200).send({ message: 'Eleccion eliminada' });
};

export const editElectionsById = async (
	req: FastifyRequest<{
		Body: Elections;
		Params: { id_election: string };
	}>,
	reply: FastifyReply,
	done: any
): Promise<void> => {
	await getRepository('Elections').update(req.params.id_election, req.body);

	const info = await getRepository('Elections').findOne({
		where: { id: req.params.id_election },
		relations: ['Options', 'Options.Imgs'],
	});

	reply.status(200).send({ message: Msg('Elections ').edit, info });
};

export const voteOptionToElection = async (
	req: FastifyRequest<{
		Params: { id_election: string; id_option: string };
		Headers: { authorization: string };
	}>,
	reply: FastifyReply
): Promise<void> => {
	const option = (await getRepository('Options').findOne(req.params.id_option)) as Options | undefined;
	if (!option) throw { message: 'no existe la opcion', statusCode: 400 };

	const token = JSON.parse(req.headers.authorization);
	let info;

	const valid = await getRepository('R_User_Options').count({
		id_user: token.id,
		id_option: req.params.id_option,
	});

	if (!valid) {
		await getRepository('R_User_Options').save({
			id_user: token.id,
			id_option: req.params.id_option,
		});

		info = await getRepository('Options').update(req.params.id_option, { votes: option.votes + 1 });
	} else if (valid === 1) {
		await getRepository('R_User_Options').delete({
			id_user: token.id,
			id_option: req.params.id_option,
		});

		info = await getRepository('Options').update(req.params.id_option, { votes: option.votes - 1 });
	}

	reply.status(200).send({ message: 'su voto fue exitoso', info });
};
