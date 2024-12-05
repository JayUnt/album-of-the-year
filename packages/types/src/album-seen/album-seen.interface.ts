import { AlbumInterface } from "../album";

export type AlbumSeenType = "random";

export interface AlbumSeenInterface {
    userId: string;

    albumId: string;
    album: AlbumInterface;
    
    seenAt: Date;
    seenType: AlbumSeenType;
}
export interface CreateAlbumSeenInterface {
    userId: AlbumSeenInterface['userId'];
    albumId: AlbumSeenInterface['albumId'];
    seenAt: AlbumSeenInterface['seenAt'];
    seenType: AlbumSeenInterface['seenType'];
}
