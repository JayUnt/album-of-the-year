import { AlbumInterface } from "../album";

export interface ArtistInterface {
    id: string;
    name: string;
    aotyExternalId?: string;

    // albums?: AlbumInterface[];
}

export interface CreateArtistInterface extends Omit<ArtistInterface, 'id'> {}