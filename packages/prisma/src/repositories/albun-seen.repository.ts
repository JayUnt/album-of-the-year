import { log } from "@repo/logger";
import { prisma } from "@repo/prisma";
import { CreateAlbumSeenInterface } from "@repo/types";

export class AlbumSeenRepository {
  #db;
  #collection;

  constructor() {
    this.#db = prisma;
    this.#collection = this.#db.userAlbumSeenHistory;
  }

  async getByUserId(userId: string) {
    return await this.#collection.findMany({
      where: { userId },
    });
  }

  async create(data: CreateAlbumSeenInterface) {
    log("AlbumSeenRepository.create called", data)

    return await this.#collection.create({
      data: {
        userId: data.userId,
        albumId: data.albumId,
        seenAt: data.seenAt,
        seenType: data.seenType,
      },
    });
  }
}
