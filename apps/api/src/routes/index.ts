import { FastifyPluginCallbackTypebox } from '@fastify/type-provider-typebox';
import { FastifyPluginOptions } from 'fastify';

import { Routes } from '@interfaces/routes.interface';
import AlbumRoute from './album.route';

export const initializeRoutes: FastifyPluginCallbackTypebox<FastifyPluginOptions> = (server, options, done) => {
  // add the new routes here
  const routes = [new AlbumRoute()];
  routes.forEach((route: Routes) => {
    server.register(route.initializeRoutes.bind(route));
  });
  done();
};