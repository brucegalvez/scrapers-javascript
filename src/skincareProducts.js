import puppeteer from "puppeteer";
import cheerio from "cheerio";
import fetch from "node-fetch";
import fs from "fs";

const searchAndScrape = async (query) => {
  try {
    const browser = await puppeteer.launch({
      headless: false,
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
    const links = await page.$$("div.r>a");
    await links[0].click();
    await page.waitForNavigation();
    const selectors = {
      name: 'document.querySelector(".txtTituProdu").textContent',
      description: 'document.querySelector(".txtDescripcion").textContent',
      summary: 'document.querySelector(".txt9").children[3].textContent',
      img: 'document.querySelector("div.fotoProdu9").getAttribute("style")',
    };
    let productData = {};
    for (const [key, value] of Object.entries(selectors)) {
      try {
        productData[key] = await page.evaluate(value);
      } catch (err) {
        console.log(err);
      }
    }
    productData["url"] = page.url();
    await browser.close();
    return productData;
  } catch (err) {
    console.error(err);
  }
};

const scrapeFromUrl = async (url) => {
  try {
    const res = await fetch(url);
    const html = await res.text();
    const $ = cheerio.load(html);
    return {
      url: url,
      name: $(`div[itemprop='name']`).text(),
      description: $(`div[itemprop='description']`).text(),
      data: $(`.tabs-panels`).text(),
      img: $(`.gallery-image`).attr("src"),
      imgs: $(`.cloud-zoom-gallery`).children().attr("src"),
    };
  } catch (e) {
    return e;
  }
};

const write = (data) => {
  fs.writeFile("data.txt", JSON.stringify(data) + ",", { flag: "a" }, (err) => {
    if (err) {
      console.log(err);
    }
  });
};

const scrape = async (productList) =>
  Promise.all(
    productList.map(async ({ DESCRIPTION, URL, DOMAIN }) => {
      if (URL) {
        write(await scrapeFromUrl(URL));
      } else {
        write(await searchAndScrape(`site: ${DOMAIN} ${DESCRIPTION}`));
      }
    })
  );

export default scrape;
