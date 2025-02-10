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
} from '@supadata/js';

// Initialize the client
const supadata = new Supadata({
  apiKey: 'YOUR_API_KEY',
});

// Get YouTube transcript
const transcript: Transcript = await supadata.youtube.transcript({
  videoId: 'VIDEO_ID',
});

// Translate YouTube transcript
const translated: Transcript = await supadata.youtube.translate({
  videoId: 'VIDEO_ID',
  lang: 'es',
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
