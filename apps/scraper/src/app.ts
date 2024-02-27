const browserObject = require("./puppeteer/browser");
const scraperController = require("./puppeteer/page-controller");

(async () => {
  //Start the browser and create a browser instance
  let browserInstance = browserObject.startBrowser();

  // Pass the browser instance to the scraper controller
  scraperController(browserInstance);

  return;
})();
