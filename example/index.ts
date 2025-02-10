import { Supadata } from '../dist/index.mjs';

// 🟡 Replace with your API key from https://supadata.ai
const API_KEY = 'YOUR_API_KEY';

async function main() {
  try {
    // Initialize the client
    const supadata = new Supadata({
      apiKey: API_KEY,
    });

    // Example 1: Get YouTube transcript
    console.log('\nℹ️ Getting YouTube transcript...');
    const transcript = await supadata.youtube.transcript({
      videoId: 'dQw4w9WgXcQ', // Famous Rick Astley video as an example
    });
    console.log('ℹ️ Transcript:', transcript);

    // Example 2: Scrape web content
    console.log('\nℹ️ Scraping web content...');
    const webContent = await supadata.web.scrape('https://supadata.ai');
    console.log('ℹ️ Web content:', webContent);

    // Example 3: Map website URLs
    console.log('\nℹ️ Mapping website URLs...');
    const siteMap = await supadata.web.map('https://supadata.ai');
    console.log('ℹ️ Site map:', siteMap);

    // Example 4: Crawl website with limit
    console.log('\nℹ️ Crawling website...');
    const crawl = await supadata.web.crawl({
      url: 'https://supadata.ai',
      limit: 3, // Limiting to 3 pages for the example
    });
    console.log('ℹ️ Crawl job started:', crawl);

    // Example 5: Get crawl results
    console.log('\nℹ️ Getting crawl results...');
    const crawlResults = await supadata.web.getCrawlResults(crawl.jobId);
    console.log('ℹ️ Crawl results:', crawlResults);
  } catch (error) {
    console.error('🛑 Error:', error);
  }
}

main();
