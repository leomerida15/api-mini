import { preHandlerHookHandler } from 'fastify';

export * as Doc from './docs';

interface token {
	id: number;
	roles: number;
	email: string;
}

export const validRol: preHandlerHookHandler = (req, reply, done) => {
	try {
		if (!req.headers.authorization) throw { message: 'debe enviar un token valido', code: 401 };
		const token: token = JSON.parse(req.headers.authorization);

		done();
	} catch (err) {
		done(err as any);
	}
};
