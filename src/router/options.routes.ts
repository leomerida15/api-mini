import { RouteHandlerMethod, RouteOptions } from 'fastify';
import S from 'fluent-json-schema';
import { Resp } from '../config/server';
import { uploads, FormatData, upload } from '../config/uploads/index';
import { createOptions, getOptions, getOptionsById, removeOption, editOptions, addImgToOption } from '../controllers/options';
import { removeElections } from '../controllers/elections';
import schemas from './schemas';

const Options_Routes: RouteOptions[] = [
	{
		method: 'POST',
		url: '/options',
		// preValidation: FormatData,
		schema: {
			body: schemas.option,

			response: Resp(
				S.object()
					.prop('message', S.string())
					.prop('info', schemas.option)
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
							.contains(schemas.option)
					)
			),
		},
		handler: getOptions as RouteHandlerMethod,
	},
	{
		method: 'GET',
		url: '/options/:id',
		schema: {
			params: S.object().prop('id', S.string().required()),
			response: Resp(
				S.object()
					.prop('message', S.string())
					.prop('info', schemas.option)
			),
		},
		handler: getOptionsById as RouteHandlerMethod,
	},
	{
		method: 'PUT',
		url: '/options/:id',
		schema: {
			params: S.object().prop('id', S.string().required()),

			body: schemas.option,

			response: Resp(
				S.object()
					.prop('message', S.string())
					.prop('info', schemas.option)
			),
		},
		handler: editOptions as RouteHandlerMethod,
	},
	{
		method: 'DELETE',
		url: '/options/:id',
		schema: {
			params: S.object().prop('id', S.string().required()),
			response: Resp(),
		},
		handler: removeOption as RouteHandlerMethod,
	},
	{
		method: 'PUT',
		url: '/options/:id/img',
		preValidation: FormatData,
		schema: {
			params: S.object().prop('id', S.string().required()),

			body: schemas.option,

			response: Resp(
				S.object()
					.prop('message', S.string())
					.prop('info', schemas.option)
			),
		},
		handler: addImgToOption as RouteHandlerMethod,
	}
];

export default Options_Routes;
