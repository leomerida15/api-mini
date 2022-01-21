import Users from '../db/models/Users';
import { FastifyRequest, FastifyReply } from 'fastify';
import { getRepository } from 'typeorm';

export const getRols = async (
	req: FastifyRequest<{
		Body: Users;
	}>,
	reply: FastifyReply
): Promise<FastifyReply | void> => {
	const info = await getRepository('Rols').find();

	return reply.status(200).send({ message: 'Roles', info });
};
