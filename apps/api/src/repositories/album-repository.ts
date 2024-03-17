import prisma from "@/utils/prisma";
import { PrismaClient } from "@prisma/client";

class AlbumRepository {
  #db;

  constructor() {
    this.#db = new PrismaClient({
      log: ["warn", "error"],
    });
  }

  getAll = async () => {
    return await this.#db.album.findMany({
      include: {
        artist: true,
      },
    });
  }

  // async getById(id: string) {
  //   return await this.db.album.findUnique({
  //     where: { id },
  //   });
  // }

  // async search(data: Prisma.AlbumFindManyArgs) {
  //   return await this.db.album.findMany(data);
  // }
}

export default AlbumRepository;
