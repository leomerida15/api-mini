import Fastify, { FastifyRequest } from 'fastify';
import S, { ArraySchema, ObjectSchema } from 'fluent-json-schema';
import validToken from './token';
// import moduleName from 'fastify-jwt'

import multer from 'fastify-multer'; // or import multer from 'fastify-multer'

const fastify = Fastify({
	logger: {
		level: 'warn',
		prettyPrint: true,
	},
	ajv: {
		customOptions: {
			coerceTypes: false,
			removeAdditional: false,
		},
	},
});

fastify.register(require('fastify-cors'), {
	origin: (origin: any, cb: (arg1: null, arg2: boolean) => any) => cb(null, true),
});

fastify.register(require('fastify-jwt'), {
	secret: 'nojodas'
})

/**
 * se define el manejador de errores
 */
fastify.setErrorHandler(function (error, request, reply): void {
	// Log error
	this.log.error(error);

	const message = error.message ? error.message : error.code;

	const code = error.statusCode ? error.statusCode : 500;

	// Send error response
	reply.status(code).send({ message, code });
});

// ? validar JWT
fastify.addHook('onRequest', (req, reply, done) => {
	try {
		const { authorization } = req.headers;

		if (validToken(req.url)) {
			if (!authorization) throw { message: 'no esta autorisado', statusCode: 403 };
			console.log(req.jwtVerify());

			req.headers.authorization = JSON.stringify(fastify.jwt.verify(authorization));
		}

		done();
	} catch (err: any) {
		done(err);
	}
});

// ? Manejo de archivos
fastify.register(multer.contentParser);

fastify.register(require('fastify-response-validation'));

export const Resp = (obj?: ObjectSchema | ArraySchema): unknown => {
	const resp: unknown = {
		'2xx': obj ? obj.valueOf() : S.object().prop('message', S.string().required()).valueOf(),
		'4xx': S.object().prop('message', S.string().required()).valueOf(),
		'5xx': S.object().prop('message', S.string().required()).valueOf(),
	};

	return resp;
};

export default fastify;
