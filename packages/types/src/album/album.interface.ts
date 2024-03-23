export interface AlbumInterface {
    id: string;
    title: string;
    aotyExternalId?: string | null;
    imageUrl: string | null;
    genre: string;
    releaseDate: Date;
    spotifyUrl: string | null;
    appleMusicLink: string | null;
    amazonMusicLink: string | null;
    artist?: {
        id: string;
        name: string;
        aotyExternalId: string | null;
    };
    // ratings UserAlbumRating[]
  
    createdAt: Date;
    updatedAt: Date;
}