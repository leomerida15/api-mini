import Rols from '../../db/models/Rols';
export const validToken = (route: string) => {
	const list = ['elections', 'options', 'users'];

	const valid = route.split('/').find((item: string) => list.includes(item));

	return valid ? true : false;
};

type roles = 'Admin' | 'Proponente' | 'Votante' | 'Revisor' | 'Bloqueado' | '*';

interface ListValidRols {
	roles: roles[];
	routerPath: string;
	routerMethod: 'POST' | 'GET' | 'PUT' | 'DELETE';
}

interface routerOptions {
	routerPath: string;
	routerMethod: 'POST' | 'GET' | 'PUT' | 'DELETE' | string;
}


export const validRolByToken = (roles: Rols[], { routerPath, routerMethod }: routerOptions): boolean => {
	const Rols = roles.map((rol) => rol.name);

	if (Rols.includes('Admin')) return true;


	const list: ListValidRols[] = [
		// ? Elections Routes
		// 
		{ routerPath: '/v1/elections', routerMethod: 'POST', roles: [] },
		{ routerPath: '/v1/elections', routerMethod: 'GET', roles: [] },
		{ routerPath: '/v1/elections/:id', routerMethod: 'GET', roles: [] },
		{ routerPath: '/v1/elections/:id', routerMethod: 'DELETE', roles: [] },
		{ routerPath: '/v1/elections/:id', routerMethod: 'PUT', roles: [] },
		{ routerPath: '/v1/elections/ultimate', routerMethod: 'PUT', roles: ['*'] },
		{ routerPath: '/v1/elections/:id_election/:id_option', routerMethod: 'PUT', roles: ['Votante'] },
		//
		// ? Options Routes
		//
		{ routerPath: '/v1/options', routerMethod: 'POST', roles: ['Proponente'] },
		{ routerPath: '/v1/options', routerMethod: 'GET', roles: [] },
		{ routerPath: '/v1/options', routerMethod: 'PUT', roles: [] },
		{ routerPath: '/v1/options/:id', routerMethod: 'DELETE', roles: [] },
		//
		// ? Users Routes
		//
		{ routerPath: '/v1/users/:id', routerMethod: 'PUT', roles: ['Admin'] },
		{ routerPath: '/v1/users', routerMethod: 'GET', roles: ['Admin'] },

	];

	const validRoute = list.find((item: ListValidRols) => item.routerPath === routerPath && item.routerMethod === routerMethod)

	if (!validRoute) return false

	if (!validRoute.roles.length) return true;

	const validRol = validRoute.roles.find((rol: roles) => Rols.includes(rol))

	if (!validRol) return false

	return true;
}