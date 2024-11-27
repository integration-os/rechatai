/**
 * @jest-environment node
 */

import createApifyWebScraper from '../apifyWebScraper';


jest.mock('apify-client');

describe('createApifyWebScraper', () => {
  it('should scrape a given URL and return items', async () => {
 
  

    // Create scraper instance
    console.log(process.env.APIFY_TOKEN, "<<<<<<<<<");
    const scraper = createApifyWebScraper(process.env.APIFY_TOKEN as string);

    // Perform scraping
    const result = await scraper.scrape('https://developers.attio.com/docs/filtering-and-sorting');

   


    // Log the results
    console.log('Scraping results: >>>', result);
  });
});