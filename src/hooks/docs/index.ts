/**
 * este hook se enfoca en el manejo de archivos en el servidor como
 * moverlos de carpetas, extraer el id del archivo y la url
 */

import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const host = '31.220.31.43'

// @ts-expect-error
import { default as pdfConverter } from 'pdf-poppler';

import Jimp from 'jimp';
import { existsSync } from 'fs';

// import svg2png from 'svg2png';

export const base: string = path.resolve('static');
//
export const ToFile: any = async (file: string | string[], title: string): Promise<string> => {
	const svg: string = (() => {
		if (typeof file == 'string') {
			return file;
		} else {
			return file.join(' ');
		}
	})();

	const id: string = uuidv4() + '@' + title.replace(/ /gi, '_') + '.svg';
	const url: string = path.join('static', id);

	await fs.writeFile(url, svg);
	return id;
};
//
export const fileExistin = async (folder: string) => {
	if (!existsSync(`${base}/${folder}`)) {
		await fs.mkdir(`${base}/${folder}`);
	}
};
//
export const base64ToFile = async (file: string, title: string, folder?: string): Promise<string> => {
	const id: string = uuidv4() + '@' + title.replace(/ /gi, '_') + '.png';

	const image: string = file.replace(/^data:image\/png;base64,/, '');

	const URL: string = await (async () => {
		if (folder) {
			await fileExistin(folder);
			return path.join(base, folder, id);
		} else {
			return path.join(base, id);
		}
	})();

	await fs.writeFile(URL, image, 'base64');

	return Route({ filename: id }, folder);
};
//
export const ID = (file: string) => file.split('/')[file.split('/').length - 1];
//
export const IDs = (files: string[]) => files.map((file: string) => file.split('/')[file.split('/').length - 1]);
//
export const Move = async (file: string, folder: string) => {
	if (folder) await fileExistin(folder);
	console.log('Mover imagen');

	console.log('path.join(base, file)', path.join(base, file));

	console.log(' path.join(base, folder, file)', path.join(base, folder, file));

	await fs.rename(path.join(base, file), path.join(base, folder, file));
	return `${host}/${folder}/${file}`;
};
//
export const Moves = async (files: string[], folder: string) => {
	if (folder) await fileExistin(folder);

	const resp: any = files.map(
		async (file: string) => await fs.rename(`${base}/${file}`, `${base}/${folder}/${file}`)
	);
	await Promise.all(resp);

	return files.map((file: any) => `${host}static/${folder}/${file}`);
};
//
export const Route = (file: any, folder?: string) => {
	return `${host}static/${folder ? folder + '/' : ''}${file.filename}`;
};
//
export const MoveRoute = async (file: any, folder: string) => {
	const resp: string = Route(file, folder);
	const id = ID(resp);
	await Move(id, folder);
	return resp;
};
//
export const Routes = (files: any, folder?: string) => {
	return files ? files.map((a: any) => `${host}static/${folder ? folder + '/' : ''}${a.filename}`) : [];
};
//
export const Delete = async (file: string, folder?: string) => {
	try {
		const route: string = (() => {
			if (folder) {
				return path.join(base, folder, file);
			} else {
				return path.join(base, file);
			}
		})();

		await fs.unlink(route);

		return true;
	} catch (err) {
		return false;
	}
};
//
export const Deletes = async (files: string[], folder?: string) => {
	try {
		const stop = files.map(async (file: string) => {
			const route: string = (() => {
				if (folder) {
					return path.join(base, folder, file);
				} else {
					return path.join(base, file);
				}
			})();

			await fs.unlink(route);
		});

		await Promise.all(stop);

		return true;
	} catch (err) {
		return false;
	}
};
//s
export const Catch = async (file: any, folder: string): Promise<string | false> => {
	if (file) {
		const routes: string = Route(file, folder);

		const id = ID(routes);

		await Move(id, folder);
		//
		return routes;
		//
	} else {
		return false;
	}
};
//
export const Catchs = async (files: any[], folder: string): Promise<string[]> => {
	const stop: Promise<string | false>[] = files.map(async (file: any) => {
		if (file) {
			const routes: string = Route(file, folder);
			const id = ID(routes);
			//
			return await Move(id, folder);
			//
		} else {
			return false;
		}
	});

	const resps: (string | false)[] = await Promise.all(stop);

	const data: any[] = resps.filter((resp: string | false) => resp);

	return data;
};
//
export const Path = (route: any) => {
	let valid: boolean = false;
	const split: string = route
		.split('/')
		.filter((item: string) => {
			if (item == 'static') valid = !valid;
			return valid && item != 'static';
		})
		.join('/');

	const direction: string = path.join(base, split);

	return direction;
};
//
export const replace = async (name: any, newName: any): Promise<any> => {
	await Delete(`${base}/${newName}`);
	await fs.rename(`${base}/${name}`, `${base}/${newName}`);
};
//
//
export const Convert = async (file: any, to: string): Promise<void> => {
	// console.log('file', file);

	const from: string = file.split('.')[file.split('.').length - 1];
	const filePath: string = path.join(base, file);

	// console.log('file', file);

	// console.log('path.basename(filePath, path.extname(filePath))', path.basename(filePath, path.extname(filePath)));

	let remove: boolean = false;
	if (from === 'png') {
		// open a file called "lenna.png"
		const lenna = await Jimp.read(filePath);
		lenna
			.resize(256, 256) // resize
			.quality(60) // set JPEG quality
			.greyscale() // set greyscale
			.write(filePath.replace('.png', '.' + to)); // save
		remove = true;
	} else if (from === 'jpeg') {
		// open a file called "lenna.png"

		await fs.rename(path.join(base, file), path.join(base, file.replace('.jpeg', '.jpg')));
	}

	if (remove) await Delete(path.join(base, file));
};
