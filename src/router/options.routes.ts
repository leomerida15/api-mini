import { RouteHandlerMethod, RouteOptions } from 'fastify';
import S from 'fluent-json-schema';
import { Resp } from '../config/server';
import { uploads, FormatData, upload } from '../config/uploads/index';
import { createOptions, getOptions, getOptionsById, removeOption, editOptions } from '../controllers/options';
import { removeElections } from '../controllers/elections';

const Options_Routes: RouteOptions[] = [
	{
		method: 'POST',
		url: '/options',
		preValidation: FormatData,
		schema: {
			body: S.object()
				.prop('title', S.string().required())
				.prop('descript', S.string().required())
				.prop('election', S.number().minimum(1))
				.prop(
					'Imgs',
					S.array()
						.minItems(0)
						.items(
							S.object().prop('id', S.number().minimum(1)).prop('path', S.string()).prop('format', S.string())
						)
				),
			response: Resp(
				S.object()
					.prop('message', S.string())
					.prop(
						'info',
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
			),
		},
		handler: createOptions as RouteHandlerMethod,
	},
	{
		method: 'GET',
		url: '/options',
		schema: {
			response: Resp(
				S.object()
					.prop('message', S.string())
					.prop(
						'info',
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
			),
		},
		handler: getOptions as RouteHandlerMethod,
	},
	{
		method: 'GET',
		url: '/options/:id_option',
		schema: {
			body: S.object().prop('name', S.string().required()),
			params: S.object().prop('id_option', S.string().required()),
			response: Resp(
				S.object()
					.prop('message', S.string())
					.prop(
						'info',
						S.object()
							.prop('title', S.string().required())
							.prop('descript', S.string().required())
							.prop('election', S.number().minimum(1))
							.prop('votes', S.number().minimum(0))
							.prop('id', S.number().minimum(1))
							.prop('creator', S.number().minimum(1))
							.prop('status', S.boolean())
							.prop('imgs', S.array().items(S.number().minimum(1)))
					)
			),
		},
		handler: getOptionsById as RouteHandlerMethod,
	},
	{
		method: 'PUT',
		url: '/options/:id_option',
		schema: {
			params: S.object().prop('id_option', S.string().required()),
			body: S.object()
				.prop('title', S.string())
				.prop('descript', S.string())
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
							S.object().prop('id', S.number().minimum(1)).prop('path', S.string()).prop('format', S.string())
						)
				),
			response: Resp(
				S.object()
					.prop('message', S.string())
					.prop(
						'info',
						S.object()
							.prop('title', S.string().required())
							.prop('descript', S.string().required())
							.prop('election', S.number().minimum(1))
							.prop('votes', S.number().minimum(0))
							.prop('id', S.number().minimum(1))
							.prop('creator', S.number().minimum(1))
							.prop('status', S.boolean())
							.prop('imgs', S.array().items(S.number().minimum(1)))
					)
			),
		},
		handler: editOptions as RouteHandlerMethod,
	},
	{
		method: 'DELETE',
		url: '/options/:id_option',
		schema: {
			params: S.object().prop('id_option', S.string().required()),
			response: Resp(),
		},
		handler: removeOption as RouteHandlerMethod,
	},
];

export default Options_Routes;
