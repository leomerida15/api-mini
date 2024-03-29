import fastify from './config/server';
// import 'reflect-metadata';
import { FastifyInstance } from 'fastify';
import Router from './router';
import * as env from 'dotenv';
import { createConnection } from 'typeorm';
// import CronJobs from './config/jobs';

const start = async (): Promise<FastifyInstance | void> => {
	try {
		env.config();

		const { NODE_ENV, PORT, HOST, PASSWORD, DATABASE }: any = process.env;

		// ? levantando DB
		await createConnection();

		// ? levantando Router
		Router(fastify);

		// ? levantando servidor
		if (NODE_ENV === 'developing') {

			const http = await fastify.listen(PORT);

			console.log('http', http);
		}
		// 
		else {


			const http = await fastify.listen(PORT, HOST);

			console.log('http', http);
		}

		// ? cron jobs
		// 
		// CronJobs();


		console.log('_________');
		console.log('|       |');
		console.log('| ()_() |');
		console.log(`| (o.o) |`);
		console.log('| (|_|)*|');
		console.log('|_______|');
		console.log('| DB OK |');
		console.log(`| ${PORT}  |`);
		console.log(`|_______|`);

		return fastify;
	} catch (err) {
		fastify.log.error(err);
		process.exit(1);
	}
};

start();

export default start;
