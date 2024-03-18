import AlbumService from "@/features/album/album.service";
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
    log("info", "AlbumController.getAll called")
    const list: AlbumInterface = {
      title: "test",
      id: "test",
      spotifyUrl: "test",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    try {
      const albums = await this.#albumService.getAll();
      return reply.code(200).send({ data: { albums } });
    } catch (error) {
      return reply.code(500).send({ message: error });
    }
  };
}

export default AlbumController;
