import Users from '../db/models/Users';
import { FastifyRequest, FastifyReply, HookHandlerDoneFunction } from 'fastify';
import { getConnection, getRepository, In } from 'typeorm';
import Options from '../db/models/Options';
import path from 'path';
import Msg from '../hooks/messages/index';
import Imgs from '../db/models/Imgs';

export const getOptions = async (
	req: FastifyRequest,
	reply: FastifyReply
): Promise<any> => {
	const info = (await getRepository('Options').find({ relations: ['Imgs'] })) as Options[];

	reply.status(200).send({ message: Msg('Optione').getAll, info });
};

export const createOptions = async (
	req: FastifyRequest<{
		Body: Options;
	}>,
	reply: FastifyReply
): Promise<void> => {
	req.body.creator = JSON.parse(req.headers.authorization as any).id;

	const info = await getRepository('Options').save(req.body);

	reply.status(200).send({ message: 'opciones creada', info });
};

export const addImgToOption = async (
	req: FastifyRequest<{
		Params: { id: string };
		Body: Options;
	}>,
	reply: FastifyReply
): Promise<void> => {

	const valid = await getRepository('Options').count({ where: { id: req.params.id } });
	if (!valid) throw { message: 'no existe la opcion', statusCode: 400 };


	const imgs = await getRepository('Imgs').save(req.body.Imgs!);

	await getConnection().query(/*sql*/`

	INSERT INTO public."R_Img_Options" (id_option, id_img) VALUES(${req.params.id}, ${imgs[0].id});

	`);

	const info = await getRepository('Options').findOne({ where: { id: req.params.id }, relations: ['Imgs'] });

	reply.status(200).send({ message: 'Imagen agregada', info });
}

export const removeOption = async (
	req: FastifyRequest<{
		Params: { id: string };
	}>,
	reply: FastifyReply
): Promise<void> => {
	await getRepository('Options').delete(req.params.id);

	reply.status(200).send({ message: Msg('Opcion').delete });
};

export const getOptionsById = async (
	req: FastifyRequest<{
		Params: { id: string };
	}>,
	reply: FastifyReply
): Promise<void> => {
	const info = await getRepository(Options).findOne({ where: { id: req.params.id }, relations: ['Imgs'] });

	reply.status(200).send({ message: Msg('opcion').getBy('id'), info });
};

interface bodyEditOption extends Options {
	imgsDeletes: number[];
}

export const editOptions = async (
	req: FastifyRequest<{
		Body: bodyEditOption;
		Params: { id: string };
	}>,
	reply: FastifyReply
): Promise<void> => {

	await getRepository('Options').update(req.params.id, req.body);

	const info = await getRepository('Options').findOne({ where: { id: req.params.id }, relations: ['Imgs'] });

	reply.status(200).send({ message: 'opciones editada', info });
};
