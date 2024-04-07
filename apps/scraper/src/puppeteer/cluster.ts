import { Cluster } from "puppeteer-cluster";
import vanillaPuppeteer from "puppeteer";

import { addExtra } from "puppeteer-extra";
import Stealth from "puppeteer-extra-plugin-stealth";
// const Recaptcha = require('puppeteer-extra-plugin-recaptcha')

export async function createCluster() {
  let cluster: Cluster;
  try {
    const puppeteer = addExtra(vanillaPuppeteer);
    puppeteer.use(Stealth());
    // puppeteer.use(Recaptcha())

    cluster = await Cluster.launch({
      puppeteer,
      maxConcurrency: 2,
      concurrency: Cluster.CONCURRENCY_BROWSER,
      puppeteerOptions: {
        args: [
          "--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36",
          "--disable-features=site-per-process",
        ],
      },
    });
    
    return cluster;
  } catch (err) {
    console.log("Could not create a browser instance => : ", err);
  }
}
