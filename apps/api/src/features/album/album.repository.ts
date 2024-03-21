import { prisma } from "@repo/database";

class AlbumRepository {
  #db;

  constructor() {
    this.#db = prisma
  }

  getAll = async () => {
    return await this.#db.album.findMany({
      include: {
        artist: true,
      },
    });
  };

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
