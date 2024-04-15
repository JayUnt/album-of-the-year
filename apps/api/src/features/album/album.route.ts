import AlbumController, { GetRandomQueryString, GetRandomReply, IHeaders } from '@/features/album/album.controller';
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

    fastify.get<{
      Querystring: GetRandomQueryString,
      Headers: IHeaders,
      Reply: GetRandomReply
    }>(`${this.path}/random`, this.albumController.getRandom)
    
    fastify.route({
      method: 'GET',
      url: `${this.path}/:id`,
      handler: this.albumController.getById
    });
    
    // fastify.route({
    //   method: 'GET',
    //   url: `${this.path}/random`,
    //   schema: {
    //     querystring: GetRandomQueryString,
    //     response: GetRandomReply,
    //     headers: GetRandomHeaders,
    //   },
    //   handler: this.albumController.getRandom
    // });


    done();
  }
}

export default AlbumRoute;