import { ArtistRepository } from "@repo/prisma";
import { ArtistInterface, CreateArtistInterface } from "@repo/types";
import { Optional } from "@repo/types/src/common";

export class ArtistService {
  #artistRepository: ArtistRepository;

  constructor() {
    this.#artistRepository = new ArtistRepository();
  }

  #mapArtistToInterface = (artist: any): ArtistInterface => ({
    id: artist.id,
    name: artist.name,
    aotyExternalId: artist.aotyExternalId,
  });

  async getByName(name: string): Promise<ArtistInterface | null> {
    return await this.#artistRepository.getByName(name).then((artist) => {
      if (!artist) {
        return null;
      }

      return this.#mapArtistToInterface(artist);
    });
  }

  async getByAotyExternalId(
    aotyExternalId: string
  ): Promise<ArtistInterface | null> {
    return await this.#artistRepository
      .getByAotyExternalId(aotyExternalId)
      .then((artist) => {
        if (!artist) {
          return null;
        }

        return this.#mapArtistToInterface(artist);
      });
  }

  async create(artist: CreateArtistInterface): Promise<ArtistInterface> {
    return await this.#artistRepository
      .create({
        data: {
          name: artist.name,
          aotyExternalId: artist.aotyExternalId,
        },
      })
      .then(this.#mapArtistToInterface)
  }
}
