import { RouteHandlerMethod, RouteOptions } from 'fastify';
import { register, login, getUsers, newPass, newPassEmail, editUser } from '../controllers/auth';
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
					.prop('election', schemas.election.prop('status', S.number()))
					.prop('vote', schemas.option)
			),
		},
		handler: login as RouteHandlerMethod,
	},
	{
		method: 'POST',
		url: '/auth/newPassEmail',
		schema: {
			body: S.object().prop('email', S.string().format('email').required()),
			response: Resp(),
		},
		handler: newPassEmail as RouteHandlerMethod,
	},
	{
		method: 'POST',
		url: '/auth/users/newPass',
		schema: {
			body: S.object()
				.prop('password', S.string().maxLength(12).minLength(8).required()),
			response: Resp(),
		},
		handler: newPass as RouteHandlerMethod,
	},
	{
		method: 'GET',
		url: '/users',
		handler: getUsers as RouteHandlerMethod,
	},
	{
		method: 'PUT',
		url: '/users/:id',
		schema: {
			body: S.object()
				.prop('email', S.string().format('email'))
				.prop('password', S.string().maxLength(12).minLength(8))
				.prop('name', S.string())
				.prop(
					'roles',
					S.array()
						.minItems(1)
						.maxItems(4)
						.contains(S.object().prop('id', S.number()).prop('name', S.string()))
				),

			params: S.object().prop('id', S.string().required()),

		},
		handler: editUser as RouteHandlerMethod,
	},
];

export default Auth;
