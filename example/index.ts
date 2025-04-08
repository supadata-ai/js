import { Supadata } from '../dist/index.mjs';
import {
  YoutubeBatchJob,
  YoutubeBatchResults,
  SupadataError,
} from '../dist/index.mjs';

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

    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Example 2: Get YouTube video info
    console.log('\nℹ️ Getting YouTube video info...');
    const videoInfo = await supadata.youtube.video({
      id: 'dQw4w9WgXcQ', // Famous Rick Astley video as an example
    });
    console.log('ℹ️ Video info:', videoInfo);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Example 3: Get YouTube channel info
    console.log('\nℹ️ Getting YouTube channel info...');
    const channelInfo = await supadata.youtube.channel({
      id: 'https://www.youtube.com/@Fireship', // Fireship channel as an example
    });
    console.log('ℹ️ Channel info:', channelInfo);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Example 4: Get YouTube channel videos
    console.log('\nℹ️ Getting YouTube channel videos...');
    const channelVideos = await supadata.youtube.channel.videos({
      id: 'https://www.youtube.com/@Fireship', // Fireship channel as an example
    });
    console.log('ℹ️ Channel videos:', channelVideos);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Example 5: Get YouTube playlist info
    console.log('\nℹ️ Getting YouTube playlist info...');
    const playlistInfo = await supadata.youtube.playlist({
      id: 'PL0vfts4VzfNjnYhJMfTulea5McZbQLM7G', // Fireship playlist as an example
    });
    console.log('ℹ️ Playlist info:', playlistInfo);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Example 6: Get YouTube playlist videos
    console.log('\nℹ️ Getting YouTube playlist videos...');
    const playlistVideos = await supadata.youtube.playlist.videos({
      id: 'PL0vfts4VzfNjnYhJMfTulea5McZbQLM7G', // Fireship playlist as an example
    });
    console.log('ℹ️ Playlist videos:', playlistVideos);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Example 7: Scrape web content
    console.log('\nℹ️ Scraping web content...');
    const webContent = await supadata.web.scrape('https://supadata.ai');
    console.log('ℹ️ Web content:', webContent);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Example 8: Map website URLs
    console.log('\nℹ️ Mapping website URLs...');
    const siteMap = await supadata.web.map('https://supadata.ai');
    console.log('ℹ️ Site map:', siteMap);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Example 9: Crawl website with limit
    console.log('\nℹ️ Crawling website...');
    const crawl = await supadata.web.crawl({
      url: 'https://supadata.ai',
      limit: 2, // Limiting to 2 pages for the example
    });
    console.log('ℹ️ Crawl job started:', crawl);

    await new Promise((resolve) => setTimeout(resolve, 5000));

    // Example 10: Get crawl results
    console.log('\nℹ️ Getting crawl results...');
    const crawlResults = await supadata.web.getCrawlResults(crawl.jobId);
    console.log('ℹ️ Crawl results:', crawlResults);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Example 11: Start YouTube transcript batch job
    console.log('\nℹ️ Starting YouTube transcript batch job...');
    const transcriptBatchJob: YoutubeBatchJob = await supadata.youtube.transcript.batch({
      videoIds: ['dQw4w9WgXcQ', 'xvFZjo5PgG0'],
      lang: 'en',
    });
    console.log('ℹ️ Transcript batch job started:', transcriptBatchJob);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Example 12: Start YouTube video metadata batch job
    console.log('\nℹ️ Starting YouTube video metadata batch job...');
    const videoBatchJob: YoutubeBatchJob = await supadata.youtube.video.batch({
      playlistId: 'PLlaN88a7y2_plecYoJxvRFTLHVbIVAOoc', // Example playlist
      limit: 5, // Limit for the example
    });
    console.log('ℹ️ Video metadata batch job started:', videoBatchJob);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Example 13: Poll and get batch results (using transcript job ID from Ex 11)
    console.log(
      `\nℹ️ Polling for batch results for job: ${transcriptBatchJob.jobId}...`
    );
    let batchResults: YoutubeBatchResults | null = null;
    let attempts = 0;
    const maxAttempts = 10; // Poll up to 10 times
    const pollInterval = 5000; // Poll every 5 seconds

    while (attempts < maxAttempts) {
      attempts++;
      try {
        batchResults = await supadata.youtube.batch.getBatchResults(
          transcriptBatchJob.jobId
        );
        console.log(
          `ℹ️ [Attempt ${attempts}] Batch job status: ${batchResults.status}`
        );

        if (batchResults.status === 'completed' || batchResults.status === 'failed') {
          break; // Exit loop if job finished or failed
        }
      } catch (error) {
        console.error(
          `🛑 [Attempt ${attempts}] Error polling batch results:`, error
        );
        // Decide if you want to break or continue polling on error
        break;
      }

      if (attempts < maxAttempts) {
        console.log(`ℹ️ Waiting ${pollInterval / 1000} seconds before next poll...`);
        await new Promise((resolve) => setTimeout(resolve, pollInterval));
      }
    }

    if (batchResults) {
      if (batchResults.status === 'completed') {
        console.log('\n✅ Batch job completed successfully:');
        console.log('ℹ️ Results:', batchResults.results);
        console.log('ℹ️ Stats:', batchResults.stats);
      } else if (batchResults.status === 'failed') {
        console.error('\n🛑 Batch job failed.');
        // Potentially log more details if the API provides them in the response
      } else {
        console.warn(
          '\n⚠️ Batch job did not complete within the polling time/attempts.'
        );
      }
    } else {
      console.error('\n🛑 Could not retrieve final batch job status.');
    }
  } catch (error) {
    console.error('🛑 An unexpected error occurred in main:', error);
    if (error instanceof SupadataError) {
      console.error('   Error Code:', error.error);
      console.error('   Details:', error.details);
    }
  }
}

main();
