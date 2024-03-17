import { FastifyInstance, RouteOptions } from 'fastify';

export interface Routes {
  path: string;
  routes: (fastify: FastifyInstance, opts: RouteOptions, done: () => void) => void;
}