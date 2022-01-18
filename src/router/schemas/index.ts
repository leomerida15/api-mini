import S from 'fluent-json-schema';

const imgs = S.object().prop('id', S.number().minimum(1)).prop('path', S.string()).prop('format', S.string());

const option = S.object()
	.prop('title', S.string())
	.prop('descript', S.string())
	.prop('election', S.number().minimum(1))
	.prop('votes', S.number().minimum(0))
	.prop('id', S.number().minimum(1))
	.prop('creator', S.number().minimum(1))
	.prop('status', S.boolean())
	.prop('Imgs', S.array().minItems(0).contains(imgs))


const election = S.object()
	.prop('id', S.number())
	.prop('name', S.string())
	.prop('status', S.object().prop('id', S.number()).prop('name', S.string()))
	.prop('deleteAt', S.raw({ type: 'date', format: 'date' }))
	.prop('createdAt', S.raw({ type: 'date', format: 'date' }))
	.prop('updatedAt', S.raw({ type: 'date', format: 'date' }))
	.prop('Options', S.array().minItems(0).contains(option));

const roles = S.object().prop('Rol', S.number())

const login = S.object()
	.prop('id', S.number())
	.prop('name', S.string())
	.prop('email', S.string())
	.prop('roles', S.array().contains(roles))
	.prop('createdAt', S.raw({ type: 'date', format: 'date' }))
	.prop('updatedAt', S.raw({ type: 'date', format: 'date' }));

const users = S.object()
	.prop('id', S.number())
	.prop('name', S.string())
	.prop('email', S.string())
	.prop('roles', S.array().contains(roles))

const SchoemaObject = {
	election,
	option,
	login,
	users
};

export default SchoemaObject;
