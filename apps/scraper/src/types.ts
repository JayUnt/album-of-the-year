import { GenreInterface } from "@repo/types";

export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

export interface ScraperAlbumListInterface {
  title: string;
  aotyExternalId: string;
  artistName: string;
  artistAotyExternalId: string;
  genres: GenreInterface[];
}

export interface ScraperAlbumDetailsInterface {
  title: string;
  aotyExternalId: string;
  artistName: string;
  artistAotyExternalId: string;
  genres: GenreInterface[];
  imageBase64?: string | null;
  releaseDate?: Date | null;
  format?: string | null;
  spotifyMusicUrl?: string | null;
  appleMusicUrl?: string | null;
  amazonMusicUrl?: string | null;
}
