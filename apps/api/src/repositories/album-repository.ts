import { AlbumsInterface } from "@/interfaces/albums.interface";
import prisma from "@/utils/prisma";
import { Prisma } from "@prisma/client";

class AlbumRepository {
  // public db = prisma;


  constructor() {
    console.log('AlbumRepository')
    // console.log('this.prisma', this.db)
    console.log('AlbumRepository end')
  }

  async getAll() {
    // console.log('this.db', prisma);
    // return await prisma.album.findMany();
    return Promise.resolve<AlbumsInterface>([
      {
        id: "1",
        title: "title",
        aotyExternalId: "aotyExternalId",
        spotifyUrl: "spotifyUrl",
        createdAt: new Date(2022, 0, 1),
        updatedAt: new Date(2022, 0, 2),
      },
      {
        id: "2",
        title: "title",
        aotyExternalId: "aotyExternalId",
        spotifyUrl: "spotifyUrl",
        createdAt: new Date(2022, 1, 1),
        updatedAt: new Date(2022, 1, 2),
      },
    ]);
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
