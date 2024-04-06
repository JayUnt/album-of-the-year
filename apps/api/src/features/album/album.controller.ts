import { AlbumService } from "@repo/services";
import { FastifyReply, FastifyRequest, FastifySchema } from "fastify";

import { AlbumsInterface } from "./types/albums.interface";
import { log } from "@repo/logger";
import { AlbumInterface } from "@repo/types";

export interface GetAllAlbumsResponse {
  data: AlbumsInterface;
}

class AlbumController {
  #albumService: AlbumService;

  constructor() {
    this.#albumService = new AlbumService();
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
      const albums = await this.#albumService.getAll();
      return reply.code(200).send({ data: { albums } });
    } catch (error) {
      return reply.code(500).send({ message: error });
    }
  };

  getById = async (
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> => {
    log("info", "AlbumController.getById called")
    const { id } = request.params as { id: string };
    try {
      const album = await this.#albumService.getById(id);
      return reply.code(200).send({ data: { album } });
    } catch (error) {
      return reply.code(500).send({ message: error });
    }
  }
}

export default AlbumController;
