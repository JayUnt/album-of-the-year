import { AlbumInterface } from "@/interfaces/album.interface";
import AlbumRepository from "@/repositories/album-repository";

import { AlbumsInterface } from "@/interfaces/albums.interface";

export interface GetAllAlbumsResponse {
  message: string;
  token: string;
  data: AlbumsInterface;
}

class AlbumService {
  #albumRepository: AlbumRepository;

  constructor() {
    this.#albumRepository = new AlbumRepository();
  }

  #mapAlbumToInterface = (album: any): AlbumInterface => ({
    id: album.id,
    title: album.title,
    aotyExternalId: album.aotyExternalId,
    spotifyUrl: album.spotifyUrl,
    artist: album?.artist ? {
      id: album.artist.id,
      name: album.artist.name,
      aotyExternalId: album.artist.aotyExternalId,
    } : undefined,
    // ratings UserAlbumRating[]
    createdAt: album.createdAt,
    updatedAt: album.updatedAt,
  });

  #mapAlbumsToInterface = (albums: any[]): AlbumsInterface => {
    return albums.map(this.#mapAlbumToInterface);
  }

  getAll = async (): Promise<AlbumsInterface> => {
    return await this.#albumRepository.getAll().then(this.#mapAlbumsToInterface);
  }

  // async getById(id: string): Promise<AlbumInterface | null> {
  //   return await this.albumRepository.getById(id).then((album) => {
  //     return this.mapAlbumToInterface(album);
  //   });
  // }

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
}

export default AlbumService;
