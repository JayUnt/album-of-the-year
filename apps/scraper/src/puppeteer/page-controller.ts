const pageScraper = require('./page-scraper');

async function scrapeAll(browserInstance: any){
	let browser;
	try{
		browser = await browserInstance;
		const content = await pageScraper.scraper(browser);	

	}
	catch(err){
		console.log("Could not resolve the browser instance => ", err);
	}
}

module.exports = (browserInstance: any) => scrapeAll(browserInstance)