import { AlbumInterface } from "@repo/types";

export const getAlbumUrl = (album: AlbumInterface): string | null => {
    if(!album.aotyExternalId) {
        return null;
    }
    
    return `https://www.albumoftheyear.org/album/${album.aotyExternalId}`;
}