import { AlbumRepository } from "@repo/prisma";
import { AlbumsInterface, AlbumInterface } from "@repo/types";
import { CreateAlbumInterface } from "@repo/types/src/album/album.interface";

export interface GetAllAlbumsResponse {
  message: string;
  token: string;
  data: AlbumsInterface;
}


export class AlbumService {
  #albumRepository: AlbumRepository;

  constructor() {
    this.#albumRepository = new AlbumRepository();
  }

  #mapAlbumToInterface = (album: any): AlbumInterface => ({
    id: album.id,
    title: album.title,
    aotyExternalId: album.aotyExternalId,
    imageBase64: album.imageBase64,
    spotifyMusicUrl: album.spotifyMusicUrl,
    amazonMusicUrl: album.amazonMusicUrl,
    appleMusicUrl: album.appleMusicUrl,
    artistId: album.artistId,
    artist: album.artist ? {
      id: album.artist.id,
      name: album.artist.name,
      aotyExternalId: album.artist.aotyExternalId,
    } : undefined,
    releaseDate: album.releaseDate,
    createdAt: album.createdAt,
    updatedAt: album.updatedAt,

    genres: [],
    // ratings UserAlbumRating[]
  });

  #mapAlbumsToInterface = (albums: any[]): AlbumsInterface => {
    return albums.map(this.#mapAlbumToInterface);
  };

  getAll = async (): Promise<AlbumsInterface> => {
    return await this.#albumRepository
      .getAll()
      .then(this.#mapAlbumsToInterface);
  };

  getByMonthAndYear = async (
    month: number,
    year: number
  ): Promise<AlbumsInterface> => {
    return await this.#albumRepository
      .getByMonthAndYear(month, year)
      .then(this.#mapAlbumsToInterface);
  };

  async getById(id: string): Promise<AlbumInterface | null> {
    return await this.#albumRepository.getById(id).then(this.#mapAlbumToInterface);
  }

  // async search(data: {
  //   title: string;
  //   artistId: string;
  // }): Promise<AlbumsInterface> {
  //   const query = { where: {} };
  //   if (data.title) {
  //     query.where = {
  //       title: {
  //         contains: data.title,
  //       },
  //     };
  //   }
  //   if (data.artistId) {
  //     query.where = {
  //       artistId: {
  //         equals: data.artistId,
  //       },
  //     };
  //   }

  //   return await this.albumRepository.search(query).then((albums) => {
  //     return albums.map(this.mapAlbumToInterface);
  //   });
  // }

  async create(album: CreateAlbumInterface): Promise<AlbumInterface> {
    return await this.#albumRepository
      .create(album)
      .then(this.#mapAlbumToInterface);
  }

  async update(album: AlbumInterface): Promise<AlbumInterface> {
    return await this.#albumRepository
      .update(album)
      .then(this.#mapAlbumToInterface);
  }
}
