import { Prisma } from "@prisma/client";
import { prisma } from "@repo/prisma";

export class ArtistRepository {
  #db;

  constructor() {
    this.#db = prisma
  }

  // getAll = async () => {
  //   return await this.#db.artist.findMany();
  // };

  async getByName(name: string) {
    return await this.#db.artist.findUnique({
      where: { name },
    });
  }

  async getByAotyExternalId(aotyExternalId: string) {
    return await this.#db.artist.findUnique({
      where: { aotyExternalId },
    });
  }

  create = async (data: Prisma.ArtistCreateArgs) => {
    return await this.#db.artist.create(data);
  }

  async update(data: Prisma.ArtistUpdateArgs) {
    return await this.#db.artist.update(data);
  }

  // async search(data: Prisma.AlbumFindManyArgs) {
  //   return await this.db.album.findMany(data);
  // }
}
