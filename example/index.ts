import { Supadata } from '../dist/index.mjs';

// 🟡 Replace with your API key from https://supadata.ai
const API_KEY = 'YOUR_API_KEY';

async function main() {
  try {
    // Initialize the client
    const supadata = new Supadata({
      apiKey: API_KEY,
    });

    // Example 1: Get YouTube transcript with ID
    console.log('\nℹ️ Getting YouTube transcript with ID...');
    const transcriptById = await supadata.youtube.transcript({
      id: 'dQw4w9WgXcQ', // Famous Rick Astley video as an example
    });
    console.log('ℹ️ Transcript by ID:', transcriptById);

    // Example 1B: Get YouTube transcript with URL and options
    console.log('\nℹ️ Getting YouTube transcript with URL and options...');
    const transcriptByUrl = await supadata.youtube.transcript({
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      text: true,
      lang: 'en',
      chunkSize: 500
    });
    console.log('ℹ️ Transcript by URL (text format):', transcriptByUrl);

    // Example 2: Translate YouTube transcript
    console.log('\nℹ️ Translating YouTube transcript...');
    const translatedTranscript = await supadata.youtube.translate({
      id: 'dQw4w9WgXcQ',
      lang: 'es', // Spanish
    });
    console.log('ℹ️ Translated transcript:', translatedTranscript);

    // Example 3: Get YouTube video details
    console.log('\nℹ️ Getting YouTube video details...');
    const videoDetails = await supadata.youtube.video.get({
      id: 'dQw4w9WgXcQ',
    });
    console.log('ℹ️ Video details:', videoDetails);

    // Example 4: Get YouTube channel details
    console.log('\nℹ️ Getting YouTube channel details...');
    const channelDetails = await supadata.youtube.channel.get({
      id: 'UCuAXFkgsw1L7xaCfnd5JJOw', // Rick Astley channel
    });
    console.log('ℹ️ Channel details:', channelDetails);

    // Example 5: Get YouTube playlist details
    console.log('\nℹ️ Getting YouTube playlist details...');
    const playlistDetails = await supadata.youtube.playlist.get({
      id: 'PL5cGwrD7cv8hK-qxPqRB25Dzs0BtLWhXz', // Rick Astley's official playlist
    });
    console.log('ℹ️ Playlist details:', playlistDetails);

    // Example 6: Get YouTube channel videos
    console.log('\nℹ️ Getting YouTube channel videos...');
    const channelVideos = await supadata.youtube.channel.videos({
      id: 'UCuAXFkgsw1L7xaCfnd5JJOw',
      limit: 50,
    });
    console.log('ℹ️ Channel videos:', channelVideos);

    // Example 7: Get YouTube playlist videos
    console.log('\nℹ️ Getting YouTube playlist videos...');
    const playlistVideos = await supadata.youtube.playlist.videos({
      id: 'PL5cGwrD7cv8hK-qxPqRB25Dzs0BtLWhXz',
      limit: 20,
    });
    console.log('ℹ️ Playlist videos:', playlistVideos);

    // Example 8: Scrape web content
    console.log('\nℹ️ Scraping web content...');
    const webContent = await supadata.web.scrape('https://supadata.ai');
    console.log('ℹ️ Web content:', webContent);

    // Example 9: Map website URLs
    console.log('\nℹ️ Mapping website URLs...');
    const siteMap = await supadata.web.map('https://supadata.ai');
    console.log('ℹ️ Site map:', siteMap);

    // Example 10: Crawl website with limit
    console.log('\nℹ️ Crawling website...');
    const crawl = await supadata.web.crawl({
      url: 'https://supadata.ai',
      limit: 3, // Limiting to 3 pages for the example
    });
    console.log('ℹ️ Crawl job started:', crawl);

    // Example 11: Get crawl results
    console.log('\nℹ️ Getting crawl results...');
    const crawlResults = await supadata.web.getCrawlResults(crawl.jobId);
    console.log('ℹ️ Crawl results:', crawlResults);
  } catch (error) {
    console.error('🛑 Error:', error);
  }
}

main();
