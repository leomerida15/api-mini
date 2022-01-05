import { FastifyInstance, RouteOptions, FastifyLoggerInstance, FastifyRequest, FastifyReply } from 'fastify';
import Auth from './auth.routes';
import elections_Routes from './elections.routes';
import { Roles } from './global.routes';
import Options_Routes from './options.routes';

const Router = (fastify: FastifyInstance): void => {
    const Routes: RouteOptions[] = ([] as RouteOptions[]).concat(Auth, elections_Routes, Roles, Options_Routes);

    Routes.forEach((options) => {

        fastify.register((fastify, opts, done) => {
            fastify.route(options);
            done()
        }, { prefix: 'v1' });

    });
};

export default Router;