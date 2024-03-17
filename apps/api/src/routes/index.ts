import { FastifyPluginCallbackTypebox } from '@fastify/type-provider-typebox';
import { FastifyPluginOptions } from 'fastify';

import { Routes } from '@/routes/routes.interface';
import AlbumRoute from '../features/album/album.route';

export const initializeRoutes: FastifyPluginCallbackTypebox<FastifyPluginOptions> = (server, options, done) => {
  // add the new routes here
  const routes = [
    new AlbumRoute(),
  ];
  routes.forEach((route: Routes) => {
    server.register(route.routes.bind(route));
  });
  done();
};