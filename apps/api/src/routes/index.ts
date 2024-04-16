import { FastifyPluginCallbackTypebox } from '@fastify/type-provider-typebox';
import { FastifyPluginOptions } from 'fastify';

import { Routes } from '@/routes/routes.interface';
import AlbumRoute from '../features/album/album.route';
import UserRoute from '../features/user/user.route';

export const initializeRoutes: FastifyPluginCallbackTypebox<FastifyPluginOptions> = (server, options, done) => {
  // add the new routes here
  const routes = [
    new AlbumRoute(),
    new UserRoute(),
  ];
  routes.forEach((route: Routes) => {
    server.register(route.routes.bind(route));
  });
  done();
};