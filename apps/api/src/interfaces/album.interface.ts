export interface AlbumInterface {
    id: string;
    title: string;
    aotyExternalId?: string | null;
    spotifyUrl: string | null;
    // artist    Artist?    @relation(fields: [artistId], references: [id])
    // artistId  Int?
    // ratings UserAlbumRating[]
  
    createdAt: Date;
    updatedAt: Date;
}