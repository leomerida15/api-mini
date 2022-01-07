import S from 'fluent-json-schema';

const imgs = S.object().prop('id', S.number().minimum(1)).prop('path', S.string()).prop('format', S.string());

const option = S.object()
	.prop('title', S.string().required())
	.prop('descript', S.string().required())
	.prop('election', S.number().minimum(1))
	.prop('votes', S.number().minimum(0))
	.prop('id', S.number().minimum(1))
	.prop('creator', S.number().minimum(1))
	.prop('status', S.boolean())
	.prop('Imgs', S.array().minItems(0).items(imgs));

const election = S.object()
	.prop('id', S.number())
	.prop('name', S.string())
	.prop('status', S.object().prop('id', S.number()).prop('name', S.string()))
	.prop('deleteAt', S.raw({ type: 'date', format: 'date' }))
	.prop('createdAt', S.raw({ type: 'date', format: 'date' }))
	.prop('updatedAt', S.raw({ type: 'date', format: 'date' }))
	.prop('Options', S.array().minItems(0).items(option));

const login = S.object()
	.prop('id', S.number())
	.prop('name', S.string())
	.prop('email', S.string())
	.prop('roles', S.array().contains(S.object().prop('Rol', S.number())))
	.prop('createdAt', S.raw({ type: 'date', format: 'date' }))
	.prop('updatedAt', S.raw({ type: 'date', format: 'date' }));

const SchoemaObject = {
	election,
	option,
	login,
};

export default SchoemaObject;
