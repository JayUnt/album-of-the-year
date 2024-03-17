import AlbumController from '@/controllers/album.controller';
import { Routes } from '@/interfaces/routes.interface';
import { FastifyInstance, RouteOptions } from 'fastify';


class AlbumRoute implements Routes {
  public path = '/albums';

  public albumController = new AlbumController();

  public initializeRoutes(fastify: FastifyInstance, opts: RouteOptions, done: () => void) {
    console.log('albumController', this.albumController)
    fastify.route({
      method: 'GET',
      url: this.path,
      // schema: this.albumController.getAllSchema,
      handler: this.albumController.getAll
    });
    done();
  }
}

export default AlbumRoute;