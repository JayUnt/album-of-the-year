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
      handler: this.albumController.getAll
    });

    fastify.get(`${this.path}/random`, this.albumController.getRandom)

    // fastify.get(`${this.path}/current`, this.albumController.getCurrent)
    
    fastify.route({
      method: 'GET',
      url: `${this.path}/:id`,
      handler: this.albumController.getById
    });
    
    done();
  }
}

export default AlbumRoute;