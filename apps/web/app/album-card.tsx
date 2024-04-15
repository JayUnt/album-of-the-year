import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { AlbumInterface } from "@repo/types";
import { getAlbumUrl, getArtistUrl } from "@repo/utils";

interface AlbumCardProps {
  album: AlbumInterface;
}

export const AlbumCard = ({ album }: AlbumCardProps) => {
  console.log(album);

  const albumAOYTUrl = getAlbumUrl(album);
  const artistAOYTUrl = album?.artist ? getArtistUrl(album.artist) : null;

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        component="img"
        sx={{ height: 345 }}
        image={`data:image/png;base64, ${album.imageBase64}`}
        title="green iguana"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {album.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {album.artist?.name}
        </Typography>
      </CardContent>
      {(album.spotifyMusicUrl ||
        album.appleMusicUrl ||
        album.amazonMusicUrl) && (
        <CardActions>
          Listen:
          {album.spotifyMusicUrl && (
            <Button href={album.spotifyMusicUrl} target="_blank" size="small">
              Spotify
            </Button>
          )}
          {album.appleMusicUrl && (
            <Button href={album.appleMusicUrl} target="_blank" size="small">
              Apple
            </Button>
          )}
          {album.amazonMusicUrl && (
            <Button href={album.amazonMusicUrl} target="_blank" size="small">
              Amazon
            </Button>
          )}
        </CardActions>
      )}
      {(albumAOYTUrl || artistAOYTUrl) && (
        <CardActions>
          AOTY:
          {albumAOYTUrl && (
            <Button href={albumAOYTUrl} target="_blank" size="small">
              Album
            </Button>
          )}
          {artistAOYTUrl && (
            <Button href={artistAOYTUrl} target="_blank" size="small">
              Artist
            </Button>
          )}
        </CardActions>
      )}
    </Card>
  );
};
