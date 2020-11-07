# Scraper with Google search

A scraper that gets product data from its website. It can be set to go and scrape a URL directly or to search a product on Google and scraping the first result.

## Usage

This was made for a specific purpose, if you want to adapt it to your needs, first make sure to change the current selectors in src/scrape.js.

Index.js receives a JSON file named products.json, which must contain a list of products, each with the following fields:

DESCRIPTION, URL or DOMAIN

Depending on whether a certain product has a URL or DOMAIN, this script will do a Google search. The results will be stored in data.txt on the root directory.
