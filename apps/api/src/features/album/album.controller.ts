import { AlbumSeenService, AlbumService, GetRandomProps } from "@repo/services";
import { FastifyReply, FastifyRequest, FastifySchema } from "fastify";

import { log } from "@repo/logger";
import { AlbumInterface } from "@repo/types";

export interface GetAllAlbumsResponse {
  data: AlbumInterface[];
}


// export interface IHeaders {
//   "h-Custom": string;
// }

// export interface GetRandomReply {
//   200: {
//     success: boolean;
//     data: {
//       album: AlbumInterface;
//     };
//   };
//   302: { url: string };
//   "4xx": { error: string };
// }

class AlbumController {
  #service: AlbumService;
  #albumSeenService: AlbumSeenService;

  constructor() {
    this.#service = new AlbumService();
    this.#albumSeenService = new AlbumSeenService();
  }

  /**
   * @description Retrieve all albums
   *
   * @param req: FastifyRequest
   * @param res: FastifyReply
   * @returns {Promise<void>}
   * @memberof AuthController
   */
  getAll = async (
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<GetAllAlbumsResponse> => {
    try {
      const albums = await this.#service.getAll();
      return reply.code(200).send({ data: { albums } });
    } catch (error) {
      return reply.code(500).send({ message: (error as Error).message });
    }
  };

  getById = async (
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> => {
    const { id } = request.params as { id: string };
    try {
      const album = await this.#service.getById(id);

      if (!album) {
        return reply.code(404).send({ error: "No album found" });
      }

      // TODO: get userId from auth
      // TODO: convert AlbumSeenType to const 
      this.#albumSeenService.seenAlbum('TODO', album.id, 'random')

      return reply.code(200).send({ data: { album } });
    } catch (error) {
      return reply.code(500).send({ message: (error as Error).message });
    }
  };

  getRandomSchema = {
    schema: {
      querystring: {
        type: "object",
        properties: {
          releaseMonth: { type: "integer" },
          releaseYear: { type: "integer" },
          genreIds: {
            type: "array",
            default: [],
          },
        },
      },
    },
  };

  // getCurrent = async (
  //   request: FastifyRequest,
  //   reply: FastifyReply
  // ): Promise<void> => {
  //   log("info", "AlbumController.getCurrent called");
  //   try {
  //     const album = await this.#albumService.getCurrent();

  //     if(!album) {
  //       return reply.code(404).send({ error: "No album found" });
  //     }

  //     return reply.code(200).send({ data: { album } });
  //   } catch (error) {
  //     return reply.code(500).send({ message: (error as Error).message });
  //   }
  // }

  getRandom = async (
    request: FastifyRequest<{
      Querystring: {
        releaseMonth: number;
        releaseYear: number;
        genreIds: string[];
      };
      // Headers: IHeaders;
      // Reply: GetRandomReply;
    }>,
    reply: FastifyReply
  ): Promise<void> => {
    try {
      const { query } = request;
      const params: GetRandomProps = {};

      if (query.releaseMonth && query.releaseYear) {
        params.release = {
          month: query.releaseMonth,
          year: query.releaseYear,
        };
      }

      if (query.genreIds) {
        params.genreIds = query.genreIds;
      }

      const album = await this.#service.getRandom(params);

      if (!album) {
        return reply.code(404).send({ error: "No album found" });
      }

      return reply.code(200).send({ data: { album } });
    } catch (error) {
      return reply.code(500).send({ message: (error as Error).message });
    }
  };
}

export default AlbumController;
