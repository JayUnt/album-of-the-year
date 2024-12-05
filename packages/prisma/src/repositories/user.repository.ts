import { log } from "@repo/logger";
import { prisma } from "@repo/prisma";
import { UserInterface, CreateUserInterface, AlbumSeenType } from "@repo/types";

export class UserRepository {
  #db;

  constructor() {
    this.#db = prisma;
  }

  async getById(id: string) {
    return await this.#db.user.findUnique({
      where: { id },
    });
  }

  async getByEmail(email: string) {
    return await this.#db.user.findUnique({
      where: { email },
    });
  }

  async create(user: CreateUserInterface) {
    log("UserRepository.create called", user)
    // Object.entries(user).forEach(([key, value]) => {  
    //   log('---',key, value)
    // });

    log({
      data: {
        email: user.email,
        auth0Id: user.auth0Id,
      },
    });

    return await this.#db.user.create({
      data: {
        email: user.email,
        auth0Id: user.auth0Id,
      },
    });
  }

  update = async (user: UserInterface) => {
    return await this.#db.user.update({
      where: { id: user.id },
      data: {
        email: user.email,
        auth0Id: user.auth0Id,
      },
    });
  };

  upsert = async (user: CreateUserInterface) => {
    return await this.#db.user.upsert({
      where: { email: user.email },
      create: {
          email: user.email,
          auth0Id: user.auth0Id,
      },
      update: {
          email: user.email,
          auth0Id: user.auth0Id,
      },
    });
  };
}
