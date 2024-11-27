"use server";
import { ApifyClient, } from "apify-client";



const defaultConfig = {

  useSitemaps: true,
  crawlerType: "playwright:adaptive",
  includeUrlGlobs: [],
  excludeUrlGlobs: [],
  keepUrlFragments: false,
  ignoreCanonicalUrl: false,
  maxCrawlDepth: 20,
  maxCrawlPages: 9999999,
  initialConcurrency: 0,
  maxConcurrency: 200,
  initialCookies: [],
  proxyConfiguration: {
    useApifyProxy: true,
  },
  maxSessionRotations: 10,
  maxRequestRetries: 5,
  requestTimeoutSecs: 60,
  minFileDownloadSpeedKBps: 128,
  dynamicContentWaitSecs: 10,
  waitForSelector: "",
  maxScrollHeightPixels: 5000,
  removeElementsCssSelector: `nav, footer, script, style, noscript, svg,
        [role="alert"],
        [role="banner"],
        [role="dialog"],
        [role="alertdialog"],
        [role="region"][aria-label*="skip" i],
        [aria-modal="true"]`,
  removeCookieWarnings: true,
  expandIframes: true,
  clickElementsCssSelector: '[aria-expanded="false"]',
  htmlTransformer: "readableText",
  readableTextCharThreshold: 100,
  aggressivePrune: false,
  debugMode: false,
  debugLog: false,
  saveHtml: false,
  saveHtmlAsFile: false,
  saveMarkdown: true,
  saveFiles: false,
  saveScreenshots: false,
  maxResults: 9999999,
  clientSideMinChangePercentage: 15,
  renderingTypeDetectionPercentage: 10,
};

const createApifyWebScraper = (token: string) => {
  const client = new ApifyClient({ token });

  const scrape = async (
    url: string,
  ): Promise<any[]> => {
    const input = {
      startUrls: [{ url }],
      ...defaultConfig,
    };

    const run = await client.actor("aYG0l9s7dbB7j3gbS").call(input);
    const { items } = await client.dataset(run.defaultDatasetId).listItems();
    return items;
  };

  return { scrape };
};

export default createApifyWebScraper;
