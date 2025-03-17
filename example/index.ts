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

    // Example 2: Get YouTube video details
    console.log('\nℹ️ Getting YouTube video details...');
    const videoDetails = await supadata.youtube.video({
      videoId: 'dQw4w9WgXcQ',
    });
    console.log('ℹ️ Video details:', videoDetails);

    // Example 3: Get YouTube channel details
    console.log('\nℹ️ Getting YouTube channel details...');
    const channelDetails = await supadata.youtube.channel({
      url: 'https://www.youtube.com/@RickAstleyYT',
    });
    console.log('ℹ️ Channel details:', channelDetails);

    // Example 4: Get YouTube playlist details
    console.log('\nℹ️ Getting YouTube playlist details...');
    const playlistDetails = await supadata.youtube.playlist({
      playlistId: 'PL5cGwrD7cv8hK-qxPqRB25Dzs0BtLWhXz', // Rick Astley's official playlist
    });
    console.log('ℹ️ Playlist details:', playlistDetails);

    // Example 5: Get YouTube channel videos
    console.log('\nℹ️ Getting YouTube channel videos...');
    const channelVideos = await supadata.youtube.channelVideos({
      url: 'https://www.youtube.com/@RickAstleyYT',
      maxResults: 5,
    });
    console.log('ℹ️ Channel videos:', channelVideos);

    // Example 6: Get YouTube playlist videos
    console.log('\nℹ️ Getting YouTube playlist videos...');
    const playlistVideos = await supadata.youtube.playlistVideos({
      playlistId: 'PL5cGwrD7cv8hK-qxPqRB25Dzs0BtLWhXz',
      maxResults: 5,
    });
    console.log('ℹ️ Playlist videos:', playlistVideos);

    // Example 7: Scrape web content
    console.log('\nℹ️ Scraping web content...');
    const webContent = await supadata.web.scrape('https://supadata.ai');
    console.log('ℹ️ Web content:', webContent);

    // Example 8: Map website URLs
    console.log('\nℹ️ Mapping website URLs...');
    const siteMap = await supadata.web.map('https://supadata.ai');
    console.log('ℹ️ Site map:', siteMap);

    // Example 9: Crawl website with limit
    console.log('\nℹ️ Crawling website...');
    const crawl = await supadata.web.crawl({
      url: 'https://supadata.ai',
      limit: 3, // Limiting to 3 pages for the example
    });
    console.log('ℹ️ Crawl job started:', crawl);

    // Example 10: Get crawl results
    console.log('\nℹ️ Getting crawl results...');
    const crawlResults = await supadata.web.getCrawlResults(crawl.jobId);
    console.log('ℹ️ Crawl results:', crawlResults);
  } catch (error) {
    console.error('🛑 Error:', error);
  }
}

main();
