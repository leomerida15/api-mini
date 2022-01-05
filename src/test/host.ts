export const prod: boolean = process.env.NODE_ENV === 'development';

export const host: string = prod
	? `http://localhost:${process.env.PORT}/`
	: `http://localhost:${process.env.PORT}/`;
