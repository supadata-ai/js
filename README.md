# Supadata JS SDK

[![NPM package](https://img.shields.io/npm/v/@supadata/js.svg?branch=main)](https://www.npmjs.com/package/@supadata/js)
[![MIT license](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat)](http://opensource.org/licenses/MIT)

The official TypeScript/JavaScript SDK for Supadata.

Get your free API key at [supadata.ai](https://supadata.ai) and start scraping data in minutes.

## Installation

```bash
npm install @supadata/js
```

## Usage

```typescript
import {
  Supadata,
  Transcript,
  Scrape,
  Map,
  Crawl,
  CrawlJob,
  YouTubeVideo,
  YouTubeChannel,
  YouTubePlaylist,
  YouTubeChannelVideos,
  YouTubePlaylistVideos,
} from '@supadata/js';

// Initialize the client
const supadata = new Supadata({
  apiKey: 'YOUR_API_KEY',
});

// Get YouTube transcript with ID
const transcript1: Transcript = await supadata.youtube.transcript({
  id: 'dQw4w9WgXcQ',
});

// Get YouTube transcript with URL and additional options
const transcript2: Transcript = await supadata.youtube.transcript({
  url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  lang: 'en',             // preferred language
  text: true,             // return plain text
  chunkSize: 500,         // max characters per chunk
});

// Translate YouTube transcript
const translated: Transcript = await supadata.youtube.translate({
  id: 'dQw4w9WgXcQ',
  lang: 'es',             // target language
  text: true,             // return plain text 
});

// Get YouTube video details
const videoDetails: YouTubeVideo = await supadata.youtube.video.get({
  id: 'dQw4w9WgXcQ',
});

// Get YouTube channel details
const channelDetails: YouTubeChannel = await supadata.youtube.channel.get({
  id: 'UCuAXFkgsw1L7xaCfnd5JJOw',
});

// Get YouTube playlist details
const playlistDetails: YouTubePlaylist = await supadata.youtube.playlist.get({
  id: 'PL5cGwrD7cv8hK-qxPqRB25Dzs0BtLWhXz',
});

// Get YouTube channel videos
const channelVideos: YouTubeChannelVideos = await supadata.youtube.channel.videos({
  id: 'UCuAXFkgsw1L7xaCfnd5JJOw',
  limit: 50,              // max number of video IDs to return (default: 30, max: 5000)
});

// Get YouTube playlist videos
const playlistVideos: YouTubePlaylistVideos = await supadata.youtube.playlist.videos({
  id: 'PL5cGwrD7cv8hK-qxPqRB25Dzs0BtLWhXz',
  limit: 20,              // max number of video IDs to return (default: 100, max: 5000)
});

// Scrape web content
const webContent: Scrape = await supadata.web.scrape('https://supadata.ai');

// Map website URLs
const siteMap: Map = await supadata.web.map('https://supadata.ai');

// Crawl website
const crawl: Crawl = await supadata.web.crawl({
  url: 'https://supadata.ai',
  limit: 10,
});

// Get crawl job results
const crawlResults: CrawlJob = await supadata.web.getCrawlResults(crawl.jobId);
```

## Error Handling

The SDK throws `SupadataError` for API-related errors. You can catch and handle these errors as follows:

```typescript
import { SupadataError } from '@supadata/js';

try {
  const transcript = await supadata.youtube.transcript({
    id: 'INVALID_ID',
  });
} catch (e) {
  if (e instanceof SupadataError) {
    console.error(e.error); // e.g., 'video-not-found'
    console.error(e.message); // Human readable error message
    console.error(e.details); // Detailed error description
    console.error(e.documentationUrl); // Link to error documentation (optional)
  }
}
```

## Example

See the [example](./example) directory for a simple example of how to use the SDK.

## API Reference

See the [Documentation](https://supadata.ai/documentation) for more details on all possible parameters and options.

## License

MIT
