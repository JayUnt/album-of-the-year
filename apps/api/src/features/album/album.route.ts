import AlbumController from '@/features/album/album.controller';
import { Routes } from '@/routes/routes.interface';
import { FastifyInstance, RouteOptions } from 'fastify';


class AlbumRoute implements Routes {
  public path = '/albums';

  public albumController = new AlbumController();

  public routes(fastify: FastifyInstance, opts: RouteOptions, done: () => void) {
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