/*
* TODOS
* - figure out retry logic
* - should the genre call put the basic data in the database and then a follow up call to get the rest of the data?
*/

import * as cheerio from "cheerio";

interface Album {
  title: string;
  artist: string;
  releaseDate: string;
  genre: string;
  imageUrl: string;
  link: string;
  rating: number;
  review: string;
  reviewLink: string;
  spotifyLink: string;
  appleMusicLink: string;
  amazonMusicLink: string;
}

const logTime = false;

const timeStart = (label: string) => {
  if (logTime) {
    console.time(label);
  }
};

const timeEnd = (label: string) => {
  if (logTime) {
    console.timeEnd(label);
  }
};

const getId = (url: string) => {
  return url.split("/").pop();
};

interface AlbumData {
  releaseDate?: Date;

  externalId: string;
  title: string;
  url: string;
  format?: string;
  spotifyUrl?: string;

  artistExternalId: string;
  artistTitle: string;
  artistUrl: string;
}

interface Genre {
  name: string;
  externalId: string;
}
const genres: Genre[] = [
  {
    name: "Pop Rock",
    externalId: "103",
  },
  {
    name: "Pop Punk",
    externalId: "149",
  },
];

const BASE_URL = "https://www.albumoftheyear.org";

const scraperObject = {
  getPageUrl: (year: number, month: number, genre: Genre): string => {
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

    return `${BASE_URL}/${year}/releases/${monthStr}-${monthNum}.php?genre=${genre.externalId}`;
  },
  async scraper(browser: any) {
    const genre = genres[0];
    const currDate = new Date();
    const year = currDate.getFullYear();
    const month = currDate.getMonth() + 1;
    const pageUrl = this.getPageUrl(year, month, genre);

    let page = await browser.newPage();
    console.log(`Navigating to ${pageUrl}...`);

    timeStart("page.goto");
    page.goto(pageUrl).catch((err: any) => {
      // see if timeout, if so retry
      console.error("Error: ", err);
    });
    timeEnd("page.goto");

    timeStart("page.waitForSelector");
    await page.waitForSelector("#centerContent");
    timeEnd("page.waitForSelector");

    timeStart("page.content");
    const pageContent = await page.content();
    timeEnd("page.content");

    timeStart("cheerio.load");
    const $ = cheerio.load(pageContent);
    timeEnd("cheerio.load");

    const albums = $(".albumBlock").map((i, el) => {
      const $albumTitle = $(el).find(".albumTitle");
      const albumTitle = $albumTitle.text();
      const albumPath = $albumTitle.parent().attr("href");

      const externalId = albumPath?.split("-")[0].split("/").pop();

      const $artistTitle = $(el).find(".artistTitle");
      const artistTitle = $artistTitle.text();
      const artistPath = $artistTitle.parent().attr("href");
      const artistExternalId = artistPath?.split("-")[0].split("/").pop();

      const spotifyUrl = $(el)
        .find("a[data-track-action='Spotify']")
        .attr("href");

      return {
        externalId,
        title: albumTitle,
        url: `${BASE_URL}${albumPath}`,
        spotifyUrl,

        artistExternalId,
        artistTitle,
        artistUrl: `${BASE_URL}${artistPath}`,
      } as AlbumData;
    });

    // Loop through each of those links, open a new page instance and get the relevant data from them
    let pagePromise = (albumData: AlbumData) =>
      new Promise(async (resolve, reject) => {
        let dataObj = {};
        let newPage = await browser.newPage();

        timeStart("newPage.goto");
        await newPage.goto(albumData.url);
        timeEnd("newPage.goto");

        timeStart("newPage.content");
        const content = await newPage.content();
        timeEnd("newPage.content");

        timeStart("newPage cheerio.load");
        const $ = cheerio.load(content);
        timeEnd("newPage cheerio.load");

        const $dateSpan = $(".albumTopBox.info .detailRow span").filter(
          function () {
            return $(this).text().includes("Release Date");
          }
        );
        const dateStr = $dateSpan.parent().text().split("/")[0].trim();
        const date = new Date(dateStr);
        date.setHours(0, 0, 0, 0);
        albumData.releaseDate = date;

        const $formatSpan = $(".albumTopBox.info .detailRow span").filter(
          function () {
            return $(this).text().includes("Format");
          }
        );
        albumData.format = $formatSpan.parent().text().split("/")[0].trim();

        console.log(albumData);

        await newPage.close();
        resolve(albumData);
      });

    // albums.forEach(async (album) => {
    // when looping through albums, make sure we need the data
    // - see if we already the data in the database
    // - if we do, add genre to the album if needed
    //     let currentPageData = await pagePromise(album);
    //     // console.log(currentPageData);
    // });

    let currentPageData = await pagePromise(albums[0]);

      console.log('currentPageData', currentPageData);

    console.log("End");
  },
};

module.exports = scraperObject;
