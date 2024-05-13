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
    const { id } = request.params as { id: string };
    try {
      const user = await this.#userService.getById(id);
      
      if(!user) {
        return reply.code(404).send({ error: "No user found" });
      }

      return reply.code(200).send({ data: { user: user } });
    } catch (error) {
      return reply.code(500).send({ message: (error as Error).message });
    }
  };

  upsertBodySchema = {
    type: "object",
    properties: {
      email: { type: "string" },
      auth0Id: { type: "string" },
    },
    required: ["email", "auth0Id"],
  };
  upsert = async (
    request: FastifyRequest<{
      Body: CreateUserInterface
    }>,
    reply: FastifyReply
  ): Promise<void> => {
    log("info", "UserController.upsert called", request.body, typeof request.body); 

    try {
      const user = await this.#userService.upsert(request.body);
      return reply.code(200).send({ data: { user } });
    } catch (error) {
      return reply.code(500).send({ message: (error as Error).message });
    }
  }

}

export default AlbumController;
