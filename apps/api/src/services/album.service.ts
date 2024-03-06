import { AlbumInterface } from "@/interfaces/album.interface";
import AlbumRepository from "@/repositories/album-repository";

import { AlbumsInterface } from "@/interfaces/albums.interface";

export interface GetAllAlbumsResponse {
  message: string;
  token: string;
  data: AlbumsInterface;
}

class AlbumService {
  // public albumRepository: AlbumRepository;

  constructor() {
    console.log("AlbumService");
    // this.albumRepository = new AlbumRepository();
    console.log("AlbumService end");
  }

  mapAlbumToInterface = (album: any): AlbumInterface => ({
    id: album.id,
    title: album.title,
    aotyExternalId: album.aotyExternalId,
    spotifyUrl: album.spotifyUrl,
    // artist    Artist?    @relation(fields: [artistId], references: [id])
    // artistId  Int?
    // ratings UserAlbumRating[]
    createdAt: album.createdAt,
    updatedAt: album.updatedAt,
  });

  async getAll(): Promise<AlbumsInterface> {
    console.log("album.service", "getAll");
    const albumRepository = new AlbumRepository();
    // console.log('this.albumRepository', this.albumRepository)
    return await albumRepository.getAll().then((albums) => {
      console.log('from repo', albums);
      return albums.map(this.mapAlbumToInterface);
    });    
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
