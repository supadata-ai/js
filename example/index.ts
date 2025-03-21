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

    // Example 2: Get YouTube video info
    console.log('\nℹ️ Getting YouTube video info...');
    const videoInfo = await supadata.youtube.video({
      id: 'dQw4w9WgXcQ', // Famous Rick Astley video as an example
    });
    console.log('ℹ️ Video info:', videoInfo);

    // Example 3: Get YouTube channel info
    console.log('\nℹ️ Getting YouTube channel info...');
    const channelInfo = await supadata.youtube.channel({
      id: 'https://www.youtube.com/@Fireship', // Fireship channel as an example
    });
    console.log('ℹ️ Channel info:', channelInfo);

    // Example 4: Get YouTube channel videos
    console.log('\nℹ️ Getting YouTube channel videos...');
    const channelVideos = await supadata.youtube.channel.videos({
      id: 'https://www.youtube.com/@Fireship', // Fireship channel as an example
    });
    console.log('ℹ️ Channel videos:', channelVideos);

    // Example 5: Get YouTube playlist info
    console.log('\nℹ️ Getting YouTube playlist info...');
    const playlistInfo = await supadata.youtube.playlist({
      id: 'PL0vfts4VzfNjnYhJMfTulea5McZbQLM7G', // Fireship playlist as an example
    });
    console.log('ℹ️ Playlist info:', playlistInfo);

    // Example 6: Get YouTube playlist videos
    console.log('\nℹ️ Getting YouTube playlist videos...');
    const playlistVideos = await supadata.youtube.playlist.videos({
      id: 'PL0vfts4VzfNjnYhJMfTulea5McZbQLM7G', // Fireship playlist as an example
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
