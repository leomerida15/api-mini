import fastify, { RouteHandlerMethod, RouteOptions } from 'fastify';
import { getRols } from '../controllers/global';

export const Roles: RouteOptions[] = [
	{
		method: 'GET',
		url: '/roles',
		handler: getRols as RouteHandlerMethod,
	},
];
