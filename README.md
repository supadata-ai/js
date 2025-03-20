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
  YoutubeVideo,
  YoutubeChannel,
  YoutubePlaylist,
} from '@supadata/js';

// Initialize the client
const supadata = new Supadata({
  apiKey: 'YOUR_API_KEY',
});

// Get YouTube transcript
const transcript: Transcript = await supadata.youtube.transcript({
  url: 'https://youtu.be/dQw4w9WgXcQ',
});

// Translate YouTube transcript
const translated: Transcript = await supadata.youtube.translate({
  videoId: 'dQw4w9WgXcQ',
  lang: 'es',
});

// Get YouTube video details
const video: YoutubeVideo = await supadata.youtube.video('dQw4w9WgXcQ');

// Get YouTube channel details
const channel: YoutubeChannel = await supadata.youtube.channel.get('CHANNEL_ID');

// Get YouTube playlist details
const playlist: YoutubePlaylist = await supadata.youtube.playlist.get('PLAYLIST_ID');

// Get channel videos (with optional limit)
const channelVideos: string[] = await supadata.youtube.channel.videos('CHANNEL_ID', 10);

// Get playlist videos (with optional limit)
const playlistVideos: string[] = await supadata.youtube.playlist.videos('PLAYLIST_ID', 10);

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
    videoId: 'INVALID_ID',
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
