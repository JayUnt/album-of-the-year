import { NextResponse, NextRequest } from "next/server";
import puppeteer from "puppeteer-core";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(
    req.url as string,
    `http://${req.headers.host}`
  );
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: 'No URL provided' }, { status: 500 })
  }

  const browser = await puppeteer.connect({
    browserWSEndpoint: `wss://chrome.browserless.io?token=${process.env.BLESS_TOKEN}`,
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto(url);

  return new Response(await page.pdf(), {
    headers: { "content-type": "application/pdf" },
  });
}
