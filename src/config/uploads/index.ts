import multer, { diskStorage } from 'fastify-multer'; // or import multer from 'fastify-multer'
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { FastifyRequest, preValidationHookHandler } from 'fastify';

const filename = (req: FastifyRequest, file: any, cb: any) => {
	cb(null, uuidv4() + '@' + file.originalname.replace(/ /gi, '_'));
};

const storage = diskStorage({
	destination: path.resolve('static'),
	filename,

});

const options = {
	storage,
};

export const uploads = multer(options);

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

const valid: preValidationHookHandler = (req, reply, done): void => {
	const { files }: any = req;
	req.body = {
		...Format(req.body),
		Imgs: files.map((img: any) => {
			return {
				path: path.join('/static', img.filename),
				format: img.mimetype,
			};
		})
	};

	req.log.info('req.body', req.body);

	done();
};


export const FormatData: preValidationHookHandler[] = [multer(options).array('images', 20), valid]

export const upload = multer(options);