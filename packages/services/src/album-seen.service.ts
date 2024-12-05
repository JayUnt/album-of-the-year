import { Prisma } from "@repo/prisma";
import { AlbumSeenRepository } from "@repo/prisma/src/repositories/albun-seen.repository";
import {
  UserInterface,
  CreateUserInterface,
  AlbumSeenType,
  AlbumSeenInterface,
} from "@repo/types";

export class AlbumSeenService {
  #repository: AlbumSeenRepository;

  constructor() {
    this.#repository = new AlbumSeenRepository();
  }

  #mapToInterface = (data: any): AlbumSeenInterface => {
    return {
      userId: data.id,
      // user

      albumId: data.albumId,
      album: data.album,

      seenAt: data.seenAt,
      seenType: data.seenType,
    };
  };

  async getByUserId(userId: string): Promise<AlbumSeenInterface | null> {
    return await this.#repository
      .getByUserId(userId)
      .then((user) => {
        if (!user) {
          throw new Error("No user found");
        }
        return user;
      })
      .then(this.#mapToInterface);
  }

  async seenAlbum(
    userId: string,
    albumId: string,
    seenType: AlbumSeenType
  ): Promise<void> {
    await this.#repository.create({userId, albumId, seenAt: new Date(), seenType});
  }
}
