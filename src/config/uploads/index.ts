import multer, { diskStorage } from 'fastify-multer'; // or import multer from 'fastify-multer'
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { FastifyRequest, preValidationHookHandler } from 'fastify';
import Jimp from 'jimp/*';
import * as Doc from '../../hooks/docs';

const filename = (req: FastifyRequest, file: any, cb: any) => {
	cb(null, uuidv4() + '@' + file.originalname.replace(/ /gi, '_'));
};

const storage = diskStorage({
	destination: path.resolve('static'),
	filename,

});


export const upload = multer({
	storage,
	fileFilter: (req, file, cb) => {
		console.log('file', file);


		const filetypes = /.jpeg|.jpg|.png|.pdf|.xlsx/;
		const mimetype = filetypes.test(file.mimetype);
		console.log('mimetype', mimetype);

		const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

		console.log('extname', extname);


		if (mimetype && extname) {
			return cb(null, true);
		}
		cb(new Error('el formato del archivo no es valido'), false);
	},
});

const isJson = (str: string) => {
	try {
		JSON.parse(str);
	} catch (e) {
		return false;
	}
	return true;
}

const Format = (body: any): { [k: string | number | symbol]: any } => {

	const bodyArray = Object.entries(body)

	const resp = bodyArray.map(([key, value]: [any, any]): [any, any] => {

		if (/^[0-9]*$/.test(value)) return [key, parseInt(value)];

		if (Array.isArray(value)) {
			const arrayFormat = value.map((item: any): number | { [k: string]: any } | void => {

				if (/^[0-9]*$/.test(item)) return parseInt(item);

				if (typeof item === 'object') return Format(item);

			})

			return [key, arrayFormat];
		}

		// return [key, value]
		if (typeof value === 'object') return [key, Format(value)];

		if (isJson(value)) return [key, JSON.parse(value)]

		return [key, value]
	})

	return Object.fromEntries(resp);
};

const valid: preValidationHookHandler = async (req, reply, done): Promise<void> => {
	const { files }: any = req;

	const filePath = path.join(path.resolve(), 'static', files.file.filename);


	const stop = files.map(async (file: any, i: number) => {


		await Doc.Convert(file.filename, 'jpg');

		let filename = file.filename.split('.');
		filename[filename.length - 1] = 'jpg';
		files[i].filename = filename.join('.');

		file.mimetype = file.mimetype.replace(file.filename.split('.')[file.filename.split('.').length - 1], 'jpg');
		files[i].mimetype = file.mimetype;



		return {
			path: path.join('/static', file.filename),
			format: file.mimetype,
		};
	})

	const Imgs = await Promise.all(stop);

	req.body = {
		...Format(req.body),
		Imgs
	};

	req.log.info('req.body', req.body);

	done();
};


export const FormatData: preValidationHookHandler[] = [upload.array('images', 20), valid]

