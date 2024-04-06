import { GenreRepository } from "@repo/prisma";
import { GenreInterface } from "@repo/types";

export interface GetAllGenresResponse {
  message: string;
  token: string;
  data: GenreInterface[];
}

export class GenreService {
  #genreRepository: GenreRepository;

  constructor() {
    this.#genreRepository = new GenreRepository();
  }

  #mapGenreToInterface = (genre: any): GenreInterface => ({
    id: genre.id,
    name: genre.name,
    aotyExternalId: genre.aotyExternalId,
  });

  #mapGenresToInterface = (albums: any[]): GenreInterface[] => {
    return albums.map(this.#mapGenreToInterface);
  };

  getAll = async (): Promise<GenreInterface[]> => {
    return await this.#genreRepository
      .getAll()
      .then(this.#mapGenresToInterface);
  };

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
