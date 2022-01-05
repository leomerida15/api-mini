export default (route: string) => {
	const list = ['elections', 'options'];

	const valid = route.split('/').find((item: string) => list.includes(item));

	return valid ? true : false;
};
