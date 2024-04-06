import { GenreInterface } from "../genre";

interface AlbumArtistInterface {
    id: string;
    name: string;
    aotyExternalId: string | null;
}

export interface AlbumInterface {
    id: string;
    title: string;
    aotyExternalId?: string | null;
    imageBase64?: string | null;
    genres: GenreInterface[];
    releaseDate: Date;
    spotifyMusicUrl?: string | null;
    appleMusicUrl?: string | null;
    amazonMusicUrl?: string | null;
    artistId: string;
    artist?: AlbumArtistInterface;
    // ratings UserAlbumRating[]
    format?: string | null;

    createdAt: Date;
    updatedAt: Date;
}

export interface CreateAlbumInterface extends Omit<AlbumInterface, 'id' | 'createdAt' | 'updatedAt'> {}