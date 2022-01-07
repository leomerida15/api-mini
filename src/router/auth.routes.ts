import { RouteHandlerMethod, RouteOptions } from 'fastify';
import { register, login } from '../controllers/auth';
import S from 'fluent-json-schema';
import schemas from './schemas';
import { Resp } from '../config/server';

const Auth: RouteOptions[] = [
	{
		method: 'POST',
		url: '/auth/register',
		schema: {
			body: S.object()
				.prop('email', S.string().format('email').required())
				.prop('password', S.string().maxLength(12).minLength(8).required())
				.prop('name', S.string().required())
				.prop(
					'roles',
					S.array()
						.minItems(1)
						.maxItems(4)
						.contains(S.object().prop('id', S.number().required()).prop('name', S.string().required()))
				)
				.required(),
			response: Resp(
				S.object()
					.prop('message', S.string().required())
					.prop(
						'info',
						S.object()
							.prop('id', S.number())
							.prop('name', S.string())
							.prop('email', S.string())
							.prop('roles', S.array().contains(S.object().prop('Rol', S.number())))
							.prop('createdAt', S.raw({ type: 'date', format: 'date' }))
							.prop('updatedAt', S.raw({ type: 'date', format: 'date' }))
					)
			),
		},
		handler: register as RouteHandlerMethod,
	},
	{
		method: 'POST',
		url: '/auth/login',
		schema: {
			body: S.object()
				.prop('email', S.string().format('email').required())
				.prop('password', S.string().maxLength(12).minLength(8).required()),
			response: Resp(
				S.object()
					.prop('message', S.string().required())
					.prop('token', S.string().required())
					.prop('info', schemas.login)
					.prop('option', schemas.option)
					.prop('election', schemas.election)
			),
		},
		handler: login as RouteHandlerMethod,
	},
];

export default Auth;
