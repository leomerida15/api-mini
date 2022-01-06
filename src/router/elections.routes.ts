import { RouteHandlerMethod, RouteOptions } from 'fastify';
import S from 'fluent-json-schema';
import { Resp } from '../config/server';
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
					.prop(
						'info',
						S.array()
							.minItems(0)
							.contains(
								S.object()
									.prop('id', S.number())
									.prop('name', S.string())
									.prop('status', S.object().prop('id', S.number()).prop('name', S.string()))
									.prop('deleteAt', S.raw({ type: 'date', format: 'date' }))
									.prop('createdAt', S.raw({ type: 'date', format: 'date' }))
									.prop('updatedAt', S.raw({ type: 'date', format: 'date' }))
									.prop(
										'Options',
										S.array()
											.minItems(0)
											.items(
												S.object()
													.prop('title', S.string().required())
													.prop('descript', S.string().required())
													.prop('election', S.number().minimum(1))
													.prop('votes', S.number().minimum(0))
													.prop('id', S.number().minimum(1))
													.prop('creator', S.number().minimum(1))
													.prop('status', S.boolean())
													.prop(
														'Imgs',
														S.array()
															.minItems(0)
															.items(
																S.object()
																	.prop('id', S.number().minimum(1))
																	.prop('path', S.string())
																	.prop('format', S.string())
															)
													)
											)
									)
							)
					)
			),
		},
		handler: getElectionsAll as RouteHandlerMethod,
	},
	{
		method: 'GET',
		url: '/elections/:id',
		schema: {
			params: S.object().prop('id', S.string().required()),
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
							.prop(
								'Options',
								S.array()
									.minItems(0)
									.items(
										S.object()
											.prop('title', S.string().required())
											.prop('descript', S.string().required())
											.prop('election', S.number().minimum(1))
											.prop('votes', S.number().minimum(0))
											.prop('id', S.number().minimum(1))
											.prop('creator', S.number().minimum(1))
											.prop('status', S.boolean())
											.prop(
												'Imgs',
												S.array()
													.minItems(0)
													.items(
														S.object()
															.prop('id', S.number().minimum(1))
															.prop('path', S.string())
															.prop('format', S.string())
													)
											)
									)
							)
					)
			),
		},
		handler: getElectionsById as RouteHandlerMethod,
	},
	{
		method: 'PUT',
		url: '/elections/:id_election',
		schema: {
			body: S.object()
				.prop('name', S.string().required())
				.prop('Options', S.array().items(S.number()))
				.prop('status', S.object().prop('id', S.number()).prop('name', S.string())),

			params: S.object().prop('id_election', S.string().required()),

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
							.prop(
								'Options',
								S.array()
									.minItems(0)
									.items(
										S.object()
											.prop('title', S.string().required())
											.prop('descript', S.string().required())
											.prop('election', S.number().minimum(1))
											.prop('votes', S.number().minimum(0))
											.prop('id', S.number().minimum(1))
											.prop('creator', S.number().minimum(1))
											.prop('status', S.boolean())
											.prop(
												'Imgs',
												S.array()
													.minItems(0)
													.items(
														S.object()
															.prop('id', S.number().minimum(1))
															.prop('path', S.string())
															.prop('format', S.string())
													)
											)
									)
							)
					)
			),
		},
		handler: editElectionsById as RouteHandlerMethod,
	},
	{
		method: 'DELETE',
		url: '/elections/:id_election',
		schema: {
			params: S.object().prop('id_election', S.string().required()),
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
