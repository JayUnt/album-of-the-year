import { UserService } from "@repo/services";
import { FastifyReply, FastifyRequest } from "fastify";

import { log } from "@repo/logger";
import { CreateUserInterface } from "@repo/types";

class AlbumController {
  #userService: UserService;

  constructor() {
    this.#userService = new UserService();
  }

  getById = async (
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> => {
    log("info", "AlbumController.getById called");
    const { id } = request.params as { id: string };
    try {
      const album = await this.#userService.getById(id);
      
      if(!album) {
        return reply.code(404).send({ error: "No user found" });
      }

      return reply.code(200).send({ data: { album } });
    } catch (error) {
      return reply.code(500).send({ message: (error as Error).message });
    }
  };

  create = async (
    request: FastifyRequest<{
      Body: CreateUserInterface
    }>,
    reply: FastifyReply
  ): Promise<void> => {
    log("info", "UserController.create called");
    try {
      const user = await this.#userService.create(request.body);
      return reply.code(200).send({ data: { user } });
    } catch (error) {
      return reply.code(500).send({ message: (error as Error).message });
    }
  }

}

export default AlbumController;
