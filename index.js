import { searchAndScrape } from "./src/scrape";
import fs from "fs";
import vcList from "./vcs.json";

const scrape = async (vcList) => {
  for (let i = 0; i < 3; i++) {
    const getData = async () => {
      const linkedin = await searchAndScrape(
        `site:linkedin.com ${vcList[i].vcName}`
      );
      const instagram = await searchAndScrape(
        `site:instagram.com ${vcList[i].vcName}`
      );
      const twitter = await searchAndScrape(
        `site:twitter.com ${vcList[i].vcName}`
      );
      return { linkedin, instagram, twitter };
    };
    const data = await getData();
    fs.writeFile(
      "data.json",
      JSON.stringify({ ...vcList[i], ...data }) + ",",
      { flag: "a" },
      (err) => {
        if (err) {
          console.log(err);
        }
      }
    );
  }
};

scrape(vcList);
