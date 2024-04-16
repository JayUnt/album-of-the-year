import UserController from './user.controller';
import { Routes } from '@/routes/routes.interface';
import { FastifyInstance, RouteOptions } from 'fastify';


class AlbumRoute implements Routes {
  public path = '/users';

  public userController = new UserController();

  public routes(fastify: FastifyInstance, opts: RouteOptions, done: () => void) {
    
    // fastify.route({
    //   method: 'GET',
    //   url: this.path,
    //   handler: this.userController.getAll
    // });

    // fastify.get(`${this.path}/current`, this.userController.getCurrent)

    fastify.post(`${this.path}/create`, this.userController.create)
    
    
    // fastify.route({
    //   method: 'GET',
    //   url: `${this.path}/random`,
    //   schema: {
    //     querystring: GetRandomQueryString,
    //     response: GetRandomReply,
    //     headers: GetRandomHeaders,
    //   },
    //   handler: this.userController.getRandom
    // });


    done();
  }
}

export default AlbumRoute;