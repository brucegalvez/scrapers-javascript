import puppeteer from "puppeteer";
import fs from "fs";

const searchAndScrape = async (browser, query) => {
  try {
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
    await page.close();
    return url;
  } catch (err) {
    console.error(err);
  }
};

const scrapeSocialAccounts = async (vcList) => {
  const date = new Date();
  const newFileName = `${date.getTime()}.json`;
  const browser = await puppeteer.launch({
    headless: false,
    args: ["--lang=en-US,en"],
  });
  for (let i = 0; i < vcList.length; i++) {
    const getData = async () => {
      const [linkedin, instagram, twitter] = await Promise.all([
        searchAndScrape(browser, `site:linkedin.com ${vcList[i].vcName}`),
        searchAndScrape(browser, `site:instagram.com ${vcList[i].vcName}`),
        searchAndScrape(browser, `site:twitter.com ${vcList[i].vcName}`),
      ]);
      return { linkedin, instagram, twitter };
    };
    const data = await getData();
    fs.writeFile(
      `./data/${newFileName}`,
      JSON.stringify({ ...vcList[i], ...data }) + ",",
      { flag: "a" },
      (err) => {
        if (err) {
          console.log(err);
        }
      }
    );
  }
  await browser.close();
};

export default scrapeSocialAccounts;
