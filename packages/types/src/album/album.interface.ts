export interface AlbumInterface {
    id: string;
    title: string;
    aotyExternalId?: string | null;
    spotifyUrl: string | null;
    artist?: {
        id: string;
        name: string;
        aotyExternalId: string | null;
    };
    // ratings UserAlbumRating[]
  
    createdAt: Date;
    updatedAt: Date;
}