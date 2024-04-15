import { ArtistInterface } from "@repo/types";

export const getArtistUrl = (artist: ArtistInterface): string | null => {
    if(!artist.aotyExternalId) {
        return null;
    }

    // TODO: save url from scraper instead of building it here.
    const artistName = artist.name.replace(' ', '-').toLowerCase();
    return `https://www.albumoftheyear.org/artist/${artist.aotyExternalId}-${artistName}/`;
}