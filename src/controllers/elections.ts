import { FastifyRequest, FastifyReply } from 'fastify';
import { getRepository, Not, In } from 'typeorm';
import Elections from '../db/models/Elections';
import Msg from '../hooks/messages';
import Options from '../db/models/Options';
import R_User_Options from 'db/models/R_User_Options';
import { DateTime } from 'luxon';
import Election_Status from 'db/models/Election_Status';

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
		relations: ['Options', 'Options.Imgs', 'status'],
		orderby: { Options: { id: 'DESC' } },
	});

	if (!info) throw { message: 'La eleccion suministrada no existe', statusCode: 400 };

	return reply.status(200).send({ message: 'Eleccion', info });
};

export const getStatusToElections = async (
	req: FastifyRequest,
	reply: FastifyReply
): Promise<void> => {
	const info = await getRepository('Election_Status').find() as Election_Status[];

	reply.status(200).send({ message: 'Estado de elecciones', info });
}

export const getElectionsAll = async (
	req: FastifyRequest<{
		Body: Elections;
	}>,
	reply: FastifyReply
): Promise<void> => {
	const info = await getRepository('Elections').find({
		relations: ['Options', 'Options.Imgs', 'status'],
	});
	if (!info.length) throw { message: 'No existen elecciones', statusCode: 400 };

	reply.status(200).send({ message: 'Elecciones', info });
};

export const createElections = async (
	req: FastifyRequest<{
		Body: Elections;
	}>,
	reply: FastifyReply
): Promise<void> => {
	const valid = await getRepository('Elections').count({ status: Not(4) });
	if (valid) throw { message: 'Ya existe una eleccion activa', statusCode: 400 };
	//
	req.body.status = 1;
	// 
	// req.body.voteingAt = req.body.voteingAt ?? DateTime.local().toFormat('DD-MM-YYYY').toString();
	// // 
	// req.body.voteingAt = req.body.voteingAt ?? DateTime.local().plus({ days: 5 }).toFormat('DD-MM-YYYY').toString();
	// // 
	// req.body.finishAt = req.body.finishAt ?? DateTime.local().plus({ days: 10 }).toFormat('DD-MM-YYYY').toString();

	const resp = await getRepository('Elections').save(req.body);

	const info = await getRepository('Elections').findOne({
		where: { id: resp.id },
		relations: ['Options', 'Options.Imgs', 'status'],
	});

	reply.status(200).send({ message: 'Eleccion creada', info });
};

export const removeElections = async (
	req: FastifyRequest<{
		Body: Elections;
		Params: { id: string };
	}>,
	reply: FastifyReply
): Promise<void> => {
	//
	await getRepository('Elections').delete(req.params.id);

	reply.status(200).send({ message: 'Eleccion eliminada' });
};

export const editElectionsById = async (
	req: FastifyRequest<{
		Body: Elections;
		Params: { id: string };
	}>,
	reply: FastifyReply
): Promise<void> => {
	const { status } = req.body;

	if (status && status !== 4) {
		const valid = await getRepository('Elections').count({ status: Not(4), id: Not(req.params.id) });
		if (valid) throw { message: 'Ya existe una eleccion activa', statusCode: 400 };
	}

	await getRepository('Elections').update(req.params.id, req.body);

	const info = await getRepository('Elections').findOne({
		where: { id: req.params.id },
		relations: ['Options', 'Options.Imgs', 'status'],
	});

	reply.status(200).send({ message: Msg('Elections ').edit });
};

export const voteOptionToElection = async (
	req: FastifyRequest<{
		Params: { id_election: string; id_option: string };
		Headers: { authorization: string };
	}>,
	reply: FastifyReply
): Promise<void> => {
	const election = (await getRepository('Elections').findOne({
		where: { id: req.params.id_election },
		relations: ['Options', 'Options.Imgs'],
	})) as Elections | undefined;

	const option = (await getRepository('Options').findOne({
		where: { id: req.params.id_option },
		relations: ['Imgs'],
	})) as Options | undefined;

	if (!option || !election) throw { message: 'La opcion o la eleccion suministradas no existe', statusCode: 400 };

	const ids_options = election.Options!
		.map((option) => option.id);

	const token = JSON.parse(req.headers.authorization);
	let info;

	const valid = await getRepository('R_User_Options').count({
		User: token.id,
		Option: In(ids_options),
	});

	if (!valid) {
		await getRepository('R_User_Options').save({
			User: token.id,
			Option: req.params.id_option,
		});

		info = await getRepository('Options').update(req.params.id_option, { votes: option.votes + 1 });
	} else if (valid) {
		const valid = await getRepository('R_User_Options').findOne({
			where: {
				User: token.id,
				Option: In(ids_options),
			},
			relations: ['Option'],
		}) as R_User_Options;

		const { id: id_option, votes } = valid.Option as Options;

		if (`${id_option}` === req.params.id_option) throw { message: 'Ya voto por esta opcion', statusCode: 400 };

		await getRepository('R_User_Options').update(valid.id, { Option: req.params.id_option });

		await getRepository('Options').update(id_option, { votes: votes - 1 });

		info = await getRepository('Options').update(req.params.id_option, { votes: option.votes + 1 });
	}

	reply.status(200).send({ message: 'Su voto fue efectuado con exito', info });
};

export const getUltimateElection = async (
	req: FastifyRequest,
	reply: FastifyReply
): Promise<void> => {
	const info = await getRepository('Elections').findOne({
		relations: ['Options', 'Options.Imgs', 'status'],
		order: { createdAt: 'DESC' }
	});

	if (!info) throw { message: 'No existe una eleccion activa', statusCode: 400 };

	reply.status(200).send({ message: 'Ultima eleccion', info });
}