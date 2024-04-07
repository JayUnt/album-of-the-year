import { GenreService, AlbumService, ArtistService } from "@repo/services";
import { ArtistInterface } from "@repo/types";
import { ScraperService } from "./puppeteer/album-of-the-year/scraper.service";
import {
  ScraperAlbumDetailsInterface,
  ScraperAlbumListInterface,
} from "./types";
import { CreateAlbumInterface } from "@repo/types/src/album/album.interface";
import { log } from "@repo/logger";

(async () => {
  const month = 1;
  const year = 2024;

  const genreService = new GenreService();
  const albumService = new AlbumService();
  const artistService = new ArtistService();

  // get genres from db
  const genres = await genreService.getAll();

  // get albums for each genre for the month from the db
  const dbAlbums = await albumService.getByMonthAndYear(month, year);
  const dbAlbumsMap = new Map(dbAlbums.map((obj) => [obj.aotyExternalId, obj]));

  // get albums from sctaper for the month
  const scraperService = new ScraperService();
  const newAlbumsMap = await scraperService.scrapeGenreAlbumsList(
    year,
    month,
    genres
  );

  if (!newAlbumsMap) {
    return;
  }

  // TODO: move this to its own service
  // if the albums is not in the db collection
  // mark it as toFetch
  // add it to the toSave collection
  // else if the album is in the toSave collection
  // check if the genre is on the album
  // if not add the genre to the album
  const toFetch = new Map<string, ScraperAlbumListInterface>();

  newAlbumsMap.forEach((newAlbum, key) => {
    const dbAlbum = dbAlbumsMap.get(key);

    // if the album is not in the db collection, fetch it
    if (!dbAlbum) {
      // fetch this album
      toFetch.set(key, newAlbum);
    } else {
      // if it is in the db, but the genre is not in the album, add it
      let albumUpdated = false;
      newAlbum.genres.forEach((genre) => {
        if (!dbAlbum.genres.includes(genre)) {
          dbAlbum.genres.push(genre);
          albumUpdated = true;
        }
      });
      if (albumUpdated) {
        albumService.update(dbAlbum);
      }
    }
  });

  let albumsCreated = 0;
  let artistsCreated = 0;

  if (toFetch.size) {
    const albumDetails = await scraperService.scrapeAlbumsDetails(toFetch);
    if (albumDetails) {
      const artistMap = new Map<string, ArtistInterface>();

      const createAlbum = async (albumDetail: ScraperAlbumDetailsInterface) => {
        // Get (or create) the artist
        let artist: ArtistInterface | null | undefined = artistMap.get(
          albumDetail.artistAotyExternalId
        );

        if (!artist) {
          artist = await artistService.getByAotyExternalId(
            albumDetail.artistAotyExternalId
          );

          if (!artist) {
            try {
              artist = await artistService.create({
                name: albumDetail.artistName,
                aotyExternalId: albumDetail.artistAotyExternalId,
              });
              artistsCreated++;
            } catch (err) {
              log("Error creating artist", {
                name: albumDetail.artistName,
                aotyExternalId: albumDetail.artistAotyExternalId,
                error: err,
              });
              return;
            }
          }
          artistMap.set(albumDetail.artistAotyExternalId, artist);
        }

        // Save the album
        const albumToSave: CreateAlbumInterface = {
          title: albumDetail.title,
          aotyExternalId: albumDetail.aotyExternalId,
          artistId: artist.id,
          genres: albumDetail.genres,
          releaseDate: albumDetail.releaseDate!,
          format: albumDetail.format,
          spotifyMusicUrl: albumDetail.spotifyMusicUrl,
          appleMusicUrl: albumDetail.appleMusicUrl,
          amazonMusicUrl: albumDetail.amazonMusicUrl,
          imageBase64: albumDetail.imageBase64,
        };
        await albumService.create(albumToSave);
        albumsCreated++;
      };

      const iterator = albumDetails.entries();
      let result = iterator.next();
      while (!result.done) {
        const [_, albumDetail] = result.value;
        await createAlbum(albumDetail);
        result = iterator.next();
      }

      log("Artists created", artistsCreated);
      log("Albums created", albumsCreated);
    }
  }

  return;
})();
