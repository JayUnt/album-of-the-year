import { Prisma, prisma } from "@repo/prisma";
import { AlbumInterface } from "@repo/types";
import { CreateAlbumInterface } from "@repo/types/src/album/album.interface";

export class AlbumRepository {
  #db;

  #includeProps = {
    artist: true,
  };

  constructor() {
    this.#db = prisma;
  }

  getAll = async () => {
    return await this.#db.album.findMany({
      include: this.#includeProps,
    });
  };

  getByMonthAndYear = async (month: number, year: number) => {
    return await this.#db.album.findMany({
      where: {
        releaseDate: {
          gte: new Date(year, month - 1, 1),
          lte: new Date(year, month, 0),
        },
      },
      include: this.#includeProps,
    });
  };

  async getById(id: string) {
    return await this.#db.album.findUnique({
      where: { id },
      include: this.#includeProps,
    });
  }

  async search(data: Prisma.AlbumFindManyArgs) {
    return await this.#db.album.findMany(data);
  }

  async getRandom(where: Prisma.AlbumWhereInput) {
    const totalCount = await this.#db.album.count({
      where,
    });
    const skip = Math.floor(Math.random() * totalCount);

    const albums = await this.#db.album.findMany({
      take: 1,
      skip: skip,
      where,
      include: this.#includeProps,
    });

    if(albums.length == 0) {
      throw new Error('No album found');
    }

    return albums[0];
  }

  async create(album: CreateAlbumInterface) {
    return await this.#db.album.create({
      data: {
        title: album.title,
        aotyExternalId: album.aotyExternalId,
        imageBase64: album.imageBase64,
        spotifyMusicUrl: album.spotifyMusicUrl,
        appleMusicUrl: album.appleMusicUrl,
        amazonMusicUrl: album.amazonMusicUrl,
        artist: {
          connect: { id: album.artistId },
        },
        releaseDate: album.releaseDate,
        genres: {
          connect: album.genres.map((genre) => ({ id: genre.id })),
        },
      },
      include: this.#includeProps,
    });
  }

  update = async (album: AlbumInterface) => {
    return await this.#db.album.update({
      where: { id: album.id },
      data: {
        id: album.id,
        title: album.title,
        aotyExternalId: album.aotyExternalId,
        spotifyMusicUrl: album.spotifyMusicUrl,
        appleMusicUrl: album.appleMusicUrl,
        amazonMusicUrl: album.amazonMusicUrl,
        artistId: album.artist?.id,
        releaseDate: album.releaseDate,
        updatedAt: new Date(),
        genres: {
          connect: album.genres.map((genre) => ({ id: genre.id })),
        },
      },
      include: this.#includeProps,
    });
  };
}
