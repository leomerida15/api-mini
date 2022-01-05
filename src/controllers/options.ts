import Users from '../db/models/Users';
import { FastifyRequest, FastifyReply, HookHandlerDoneFunction } from 'fastify';
import { getRepository, In } from 'typeorm';
import Options from '../db/models/Options';
import path from 'path';
import Msg from '../hooks/messages/index';

export const getOptions = async (
	req: FastifyRequest<{
		Params: { id_option: string };
	}>,
	reply: FastifyReply
): Promise<any> => {
	const info = (await getRepository('Options').find({ relations: ['Imgs'] })) as Options[];

	// info.map((item) => console.log(item.Imgs))

	reply.status(200).send({ message: Msg('Optione').getAll, info });
};

export const createOptions = async (
	req: FastifyRequest<{
		Body: Options;
		Params: { id_option: string };
	}>,
	reply: FastifyReply
): Promise<void> => {
	const option = await getRepository('Options').save(req.body);
	const info = await getRepository('Options').findOne({ where: { title: req.body.title }, relations: ['Imgs'] });

	reply.status(200).send({ message: 'opciones creada', info });
};

export const removeOption = async (
	req: FastifyRequest<{
		Params: { id_option: string };
	}>,
	reply: FastifyReply
): Promise<void> => {
	await getRepository('Options').delete(req.params.id_option);

	reply.status(200).send({ message: Msg('Opcion').delete });
};

export const getOptionsById = async (
	req: FastifyRequest<{
		Params: { id_option: string };
	}>,
	reply: FastifyReply
): Promise<void> => {
	const info = await getRepository(Options).findOne({ where: { id: req.params.id_option }, relations: ['Imgs'] });

	reply.status(200).send({ message: Msg('opcion').getBy('id'), info });
};

interface bodyEditOption extends Options {
	imgsDeletes: number[];
}

export const editOptions = async (
	req: FastifyRequest<{
		Body: bodyEditOption;
		Params: { id_option: string };
	}>,
	reply: FastifyReply
): Promise<void> => {
	await getRepository('Options').update(req.params.id_option, req.body);
	const info = await getRepository('Options').findOne({ where: { title: req.body.title }, relations: ['Imgs'] });

	reply.status(200).send({ message: 'opciones creada', info });
};
