import { RouteHandlerMethod, RouteOptions } from 'fastify';
import S from 'fluent-json-schema';
import schemas from './schemas';
import { Resp } from '../config/server';
import { getUltimateElection, getStatusToElections } from '../controllers/elections';
import {
	createElections,
	getElectionsAll,
	getElectionsById,
	removeElections,
	editElectionsById,
	voteOptionToElection,
} from '../controllers/elections';

const Elections_Routes: RouteOptions[] = [
	{
		method: 'POST',
		url: '/elections',
		schema: {
			body: S.object().prop('name', S.string().required()),
			response: Resp(
				S.object()
					.prop('message', S.string())
					.prop(
						'info',
						S.object()
							.prop('id', S.number())
							.prop('name', S.string())
							.prop('status', S.object().prop('id', S.number()).prop('name', S.string()))
							.prop('deleteAt', S.raw({ type: 'date', format: 'date' }))
							.prop('createdAt', S.raw({ type: 'date', format: 'date' }))
							.prop('updatedAt', S.raw({ type: 'date', format: 'date' }))
					)
			),
		},
		handler: createElections as RouteHandlerMethod,
	},
	{
		method: 'GET',
		url: '/elections',
		schema: {
			response: Resp(
				S.object()
					.prop('message', S.string())
					.prop('info',
						S.array().minItems(0)
							.items(schemas.election.prop('status', schemas.status))
					)
			),
		},
		handler: getElectionsAll as RouteHandlerMethod,
	},
	{
		method: 'GET',
		url: '/elections/ultimate',
		schema: {
			response: Resp(
				S.object().prop('message', S.string()).prop('info', schemas.election.prop('status', schemas.status))
			),
		},
		handler: getUltimateElection as RouteHandlerMethod,
	},
	{
		method: 'GET',
		url: '/elections/:id',
		schema: {
			params: S.object().prop('id', S.string().required()),

			response: Resp(S.object().prop('message', S.string()).prop('info', schemas.election)),
		},
		handler: getElectionsById as RouteHandlerMethod,
	},

	{
		method: 'GET',
		url: '/elections/status',
		schema: {

			response: Resp(
				S.object()
					.prop('message', S.string())
					.prop('info', S.array().minItems(0).items(schemas.election_status))
			),
		},
		handler: getStatusToElections as RouteHandlerMethod,
	},
	{
		method: 'PUT',
		url: '/elections/:id',
		schema: {
			body: S.object()
				.prop('name', S.string())
				.prop('status', S.number()),

			params: S.object().prop('id', S.string().required()),

			response: Resp(S.object().prop('message', S.string())),
		},
		handler: editElectionsById as RouteHandlerMethod,
	},
	{
		method: 'DELETE',
		url: '/elections/:id',
		schema: {
			params: S.object().prop('id', S.string().required()),
			response: Resp(),
		},
		handler: removeElections as RouteHandlerMethod,
	},
	{
		method: 'PUT',
		url: '/elections/:id_election/:id_option',
		schema: {
			params: S.object().prop('id_election', S.string().required()).prop('id_option', S.string().required()),
			response: Resp(),
		},
		handler: voteOptionToElection as RouteHandlerMethod,
	},
];

export default Elections_Routes;
