import puppeteer from "puppeteer";

export const searchAndScrape = async (query) => {
  try {
    const browser = await puppeteer.launch({
      // headless: false,
      args: ["--lang=en-US,en"],
    });
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(0);
    await page.setExtraHTTPHeaders({
      "Accept-Language": "en",
    });
    await page.goto("https://google.com");
    await page.type("input.gLFyf.gsfi", query);
    page.keyboard.press("Enter");
    await page.waitForSelector("div#rso");
    const url = await page.evaluate(() =>
      Array.from(document.querySelectorAll("div.yuRUbf>a"), (a) =>
        a.getAttribute("href")
      )
    );
    await browser.close();
    return url;
  } catch (err) {
    console.error(err);
  }
};
