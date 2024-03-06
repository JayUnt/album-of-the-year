import { AlbumsInterface } from "@/interfaces/albums.interface";
import AlbumService from "@services/album.service";
import { FastifyReply, FastifyRequest, FastifySchema } from "fastify";

export interface GetAllAlbumsResponse {
  data: AlbumsInterface;
}

class AlbumController {
  // #albumService: AlbumService;

  constructor() {
    console.log("AlbumController");
    // this.#albumService = new AlbumService();
    console.log("AlbumController end");
  }

  // /**
  //  * @description Retrieve all albums
  //  *
  //  * @param req: FastifyRequest
  //  * @param res: FastifyReply
  //  * @returns {Promise<void>}
  //  * @memberof AuthController
  //  */
  // async getAll(
  //   request: FastifyRequest,
  //   reply: FastifyReply
  // ): Promise<GetAllAlbumsResponse> {
  //   console.log('getAll')
  //   console.log('this.albumService', this.albumService)
  //   try {
  //     const albums = await this.albumService.getAll();
  //     console.log(albums);
  //     return reply
  //       .code(200)
  //       .send({ data: albums });
  //   } catch (error) {

  //     return reply.code(500).send({ message: error });
  //   //   return reply.code(500).send({ message: error.message });
  //   }
  // }

  public getAllSchema: FastifySchema = {
    response: {
      200: {
        type: "object",
        properties: {
          data: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "string" },
                title: { type: "string" },
                aotyExternalId: { type: "string" },
                spotifyUrl: { type: "string" },
                createdAt: { type: "string" },
                updatedAt: { type: "string" },
              },
            },
          },
        },
      },
    },
  };
  /**
   * @description Retrieve all albums
   *
   * @param req: FastifyRequest
   * @param res: FastifyReply
   * @returns {Promise<void>}
   * @memberof AuthController
   */
  async getAll(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<GetAllAlbumsResponse> {
    console.log("getAll");
    // console.log("this.albumService", this.#albumService);
    const albumService = new AlbumService();
    const albums = await albumService.getAll();
    console.log("albumService", albumService);

    return (
      reply
        .code(200)
        // .header('Content-Type', 'application/json; charset=utf-8')
        // .send(JSON.stringify({ data: [
        .send({
          data: albums.map((album) => ({
            id: album.id,
            title: album.title,
            aotyExternalId: album.aotyExternalId,
            spotifyUrl: album.spotifyUrl,
            createdAt: album.createdAt.toUTCString(),
            updatedAt: album.updatedAt.toUTCString(),
          })),
        })
    );
  }
}

export default AlbumController;
