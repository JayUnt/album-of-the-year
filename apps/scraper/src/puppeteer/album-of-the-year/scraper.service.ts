import { AlbumInterface, AlbumsInterface, GenreInterface } from "@repo/types";
import { log } from "@repo/logger";
import { Page } from "puppeteer";
import * as cheerio from "cheerio";


import { createCluster } from "../../puppeteer/cluster";
import { ScraperAlbumDetailsInterface, ScraperAlbumListInterface } from "../../types";
import axios from "axios";

export interface GenreAlbumInterface {
  title: string;
  aotyExternalId?: string;
  spotifyUrl?: string;
  artist: {
    name: string;
    aotyExternalId?: string;
  };
  genres: GenreInterface[];
}

export class ScraperService {
  siteCode = "ALBUM_OF_THE_YEAR";
  siteBaseUrl = "https://www.albumoftheyear.org";

  #getGenreUrl = (
    year: number,
    month: number,
    aotyExternalId: string
  ): string => {
    const monthNum = ("0" + month).slice(-2);
    const monthStr = [
      "ACCOUNT FOR 0 INDEX",
      "january",
      "february",
      "march",
      "april",
      "may",
      "june",
      "july",
      "august",
      "september",
      "october",
      "november",
      "december",
    ][month];

    return `${this.siteBaseUrl}/${year}/releases/${monthStr}-${monthNum}.php?genre=${aotyExternalId}`;
  };

  #getAlbumUrl = (album: ScraperAlbumListInterface): string => {
    return `${this.siteBaseUrl}/album/${album.aotyExternalId}`;
  };

  // #scrapeGenrePageTask = async () => {
  //   return this.#cluster.task(
  //     async ({ page, data: url }: { page: Page; data: string }) => {
  //       console.log("page.goto", url);
  //       await page.goto(url);

  //       // const { hostname } = new URL(url)
  //       // const { captchas } = await page.findRecaptchas()
  //       // console.log(`Found ${captchas.length} captcha on ${hostname}`)

  //       await page.waitForSelector("#centerContent");
  //       const pageContent = await page.content();
  //       console.log("pageContent", pageContent);

  //       return pageContent;
  //     }
  //   );
  // };

  #parseAlbumList = async (
    pageContent: string,
    genre: GenreInterface
  ): Promise<ScraperAlbumListInterface[]> => {
    const $ = cheerio.load(pageContent);

    const albumList: ScraperAlbumListInterface[] = [];

    $(".albumBlock").map((i, el) => {
      const $albumTitle = $(el).find(".albumTitle");
      const albumTitle = $albumTitle.text();
      const albumPath = $albumTitle.parent().attr("href");
      const externalId = albumPath?.split("-")[0]?.split("/").pop();

      const $artistTitle = $(el).find(".artistTitle");
      const artistTitle = $artistTitle.text();
      const artistPath = $artistTitle.parent().attr("href");
      const artistExternalId = artistPath?.split("-")[0]?.split("/").pop();

      if (!externalId || !artistExternalId) {
        return;
      }

      const album: ScraperAlbumListInterface = {
        title: albumTitle,
        aotyExternalId: externalId,
        artistName: artistTitle,
        artistAotyExternalId: artistExternalId,
        genres: [genre]
      };

      albumList.push(album);
    });

    return albumList;
  };

  #parseAlbumDetails = async (
    pageContent: string,
    album: ScraperAlbumListInterface
  ): Promise<ScraperAlbumDetailsInterface> => {
    const $ = cheerio.load(pageContent);

    let releaseDate: Date | undefined = undefined;
    const $dateSpan = $(".albumTopBox.info .detailRow span").filter(
      function () {
        return $(this).text().includes("Release Date");
      }
    );
    const dateStr = $dateSpan.parent()?.text()?.split("/");
    if (dateStr && dateStr.length > 0 && dateStr[0]) {
      const date = new Date(dateStr[0].trim());
      date.setHours(0, 0, 0, 0);
      releaseDate = date;
    }

    let format: string | undefined = undefined;
    const $formatSpan = $(".albumTopBox.info .detailRow span").filter(
      function () {
        return $(this).text().includes("Format");
      }
    );
    const formatPieces = $formatSpan.parent().text().split("/");
    if (formatPieces.length > 0 && formatPieces[0]) {
      format = formatPieces[0].trim();
    }

    let imageUrl = $(".albumTopBox.cover img").attr("src") || "";
    let imageBase64;
    if(imageUrl){
      // https://stackoverflow.com/questions/17124053/node-js-get-image-from-web-and-encode-with-base64

      try {
        let image = await axios.get(imageUrl, {responseType: 'arraybuffer'});
        imageBase64 = Buffer.from(image.data).toString('base64');
      } catch (error) {
        // If image fails to load, just continue
      }
    }

    const spotifyMusicUrl = $("a[data-track-action='Spotify']").attr("href") || null;
    const appleMusicUrl =
      $("a[data-track-action='Apple Music']").attr("href") || null;
    const amazonMusicUrl =
      $("a[data-track-action='Amazon']").attr("href") || null;

    const albumDetails: ScraperAlbumDetailsInterface = {
      title: album.title,
      aotyExternalId: album.aotyExternalId,
      imageBase64,
      genres: album.genres,
      artistName: album.artistName,
      artistAotyExternalId: album.artistAotyExternalId,
      releaseDate,
      spotifyMusicUrl,
      appleMusicUrl,
      amazonMusicUrl,
      format,
    };
    return albumDetails;
  };

  scrapeGenreAlbumsList = async (
    year: number,
    month: number,
    genres: GenreInterface[]
  ): Promise<Map<string, ScraperAlbumListInterface> | undefined> => {
    const cluster = await createCluster();

    if (!cluster) {
      return;
    }

    const genreUrls = genres
      .filter((genre) => genre.aotyExternalId)
      .map((genre) => ({
        genre,
        url: this.#getGenreUrl(year, month, genre.aotyExternalId!),
      }));

    if (!genreUrls.length) {
      log("No genre urls to scrape");
      return;
    }

    const albumList: ScraperAlbumListInterface[] = [];
    await cluster.task(
      async ({
        page,
        data: { genre, url },
      }: {
        page: Page;
        data: {
          genre: GenreInterface;
          url: string;
        };
      }) => {
        try {
          page.setJavaScriptEnabled(false);

          await page.goto(url);
          await page.waitForSelector("#centerContent");
          const pageContent = await page.content();
          const genreAlbums = await this.#parseAlbumList(pageContent, genre);
          albumList.push(...genreAlbums);
        } catch (err) {
          log("Error scraping genre page", err);
        }
      }
    );

    genreUrls.forEach((genreUrl) => {
      cluster.queue(genreUrl);
    });

    await cluster.idle();
    await cluster.close();

    const albums = new Map<string, ScraperAlbumListInterface>();

    albumList.forEach((album) => {
      const genre = album.genres[0];

      if (!genre || !album.aotyExternalId) {
        return;
      }

      const existingAlbum = albums.get(album.aotyExternalId);
      if (!existingAlbum) {
        albums.set(album.aotyExternalId, album);
      } else {
        existingAlbum.genres.some((g) => g.name === genre.name) ||
          existingAlbum.genres.push(genre);
      }
    });

    return albums;
  };

  scrapeAlbumsDetails = async (
    albumsToFetch: Map<string, ScraperAlbumListInterface>
  ) => {
    const cluster = await createCluster();

    if (!cluster) {
      return;
    }

    const albumDetails = new Map<string, ScraperAlbumDetailsInterface>();
    await cluster.task(
      async ({
        page,
        data: albumToFetch,
      }: {
        page: Page;
        data: ScraperAlbumListInterface;
      }) => {
        try {
          page.setJavaScriptEnabled(false);

          await page.goto(this.#getAlbumUrl(albumToFetch));
          const pageContent = await page.content();
          const album = await this.#parseAlbumDetails(pageContent, albumToFetch);
          albumDetails.set(album.aotyExternalId, album);
        } catch (err) {
          log("Error scraping details page", err);
        }
      }
    );

    albumsToFetch.forEach((albumToFetch) => {
      cluster.queue(albumToFetch);
    });

    await cluster.idle();
    await cluster.close();

    return albumDetails;
  };
}
