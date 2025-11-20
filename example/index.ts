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

    // Example 1: Get metadata from any platform
    console.log('\nℹ️ Getting metadata from YouTube...');
    const youtubeMetadata = await supadata.metadata({
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    });
    console.log('ℹ️ YouTube Metadata:', youtubeMetadata);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Example 2: Get metadata from TikTok
    console.log('\nℹ️ Getting metadata from TikTok...');
    const tiktokMetadata = await supadata.metadata({
      url: 'https://www.tiktok.com/@subwaytakes/video/7520266642375331103',
    });
    console.log('ℹ️ TikTok Metadata:', tiktokMetadata);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Example 3: Get transcript from any platform (YouTube, TikTok, Instagram, Twitter) or file
    console.log('\nℹ️ Getting transcript from YouTube...');
    const transcriptResult = await supadata.transcript({
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      lang: 'en',
      text: true,
      mode: 'auto', // 'native', 'auto', or 'generate'
    });

    // Check if we got a transcript directly or a job ID for async processing
    if ('jobId' in transcriptResult) {
      console.log(
        `ℹ️ Got job ID for async processing: ${transcriptResult.jobId}`
      );

      // Poll for job status (simplified polling for example)
      let attempts = 0;
      const maxAttempts = 5;

      while (attempts < maxAttempts) {
        attempts++;
        await new Promise((resolve) => setTimeout(resolve, 3000)); // Wait 3 seconds

        const jobResult = await supadata.transcript.getJobStatus(
          transcriptResult.jobId
        );
        console.log(`ℹ️ [Attempt ${attempts}] Job status: ${jobResult.status}`);

        if (jobResult.status === 'completed') {
          console.log('ℹ️ Transcript result:', jobResult.result);
          break;
        } else if (jobResult.status === 'failed') {
          console.error('🛑 Transcript job failed:', jobResult.error);
          break;
        }
      }
    } else {
      console.log('ℹ️ Got transcript directly:', transcriptResult);
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Example 4: Get YouTube channel info
    console.log('\nℹ️ Getting YouTube channel info...');
    const channelInfo = await supadata.youtube.channel({
      id: 'https://www.youtube.com/@Fireship', // Fireship channel as an example
    });
    console.log('ℹ️ Channel info:', channelInfo);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Example 5: Get YouTube channel videos
    console.log('\nℹ️ Getting YouTube channel videos...');
    const channelVideos = await supadata.youtube.channel.videos({
      id: 'https://www.youtube.com/@Fireship', // Fireship channel as an example
    });
    console.log('ℹ️ Channel videos:', channelVideos);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Example 6: Get YouTube playlist info
    console.log('\nℹ️ Getting YouTube playlist info...');
    const playlistInfo = await supadata.youtube.playlist({
      id: 'PL0vfts4VzfNjnYhJMfTulea5McZbQLM7G', // Fireship playlist as an example
    });
    console.log('ℹ️ Playlist info:', playlistInfo);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Example 7: Get YouTube playlist videos
    console.log('\nℹ️ Getting YouTube playlist videos...');
    const playlistVideos = await supadata.youtube.playlist.videos({
      id: 'PL0vfts4VzfNjnYhJMfTulea5McZbQLM7G', // Fireship playlist as an example
    });
    console.log('ℹ️ Playlist videos:', playlistVideos);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Example 8: Search YouTube videos
    console.log('\nℹ️ Searching YouTube videos...');
    const searchResults = await supadata.youtube.search({
      query: 'rick astley never gonna give you up',
      type: 'video',
      limit: 5,
      sortBy: 'views',
    });
    console.log('ℹ️ Search results:', searchResults);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Example 9: Search YouTube with filters
    console.log('\nℹ️ Searching YouTube with filters...');
    const filteredSearch = await supadata.youtube.search({
      query: 'javascript tutorial',
      type: 'video',
      uploadDate: 'month',
      duration: 'medium',
      sortBy: 'date',
      limit: 3,
    });
    console.log('ℹ️ Filtered search results:', filteredSearch);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Example 10: Search YouTube channels
    console.log('\nℹ️ Searching YouTube channels...');
    const channelSearch = await supadata.youtube.search({
      query: 'fireship',
      type: 'channel',
      limit: 2,
    });
    console.log('ℹ️ Channel search results:', channelSearch);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Example 11: Scrape web content
    console.log('\nℹ️ Scraping web content...');
    const webContent = await supadata.web.scrape('https://supadata.ai');
    console.log('ℹ️ Web content:', webContent);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Example 12: Map website URLs
    console.log('\nℹ️ Mapping website URLs...');
    const siteMap = await supadata.web.map('https://supadata.ai');
    console.log('ℹ️ Site map:', siteMap);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Example 13: Crawl website with limit
    console.log('\nℹ️ Crawling website...');
    const crawl = await supadata.web.crawl({
      url: 'https://supadata.ai',
      limit: 2, // Limiting to 2 pages for the example
    });
    console.log('ℹ️ Crawl job started:', crawl);

    await new Promise((resolve) => setTimeout(resolve, 5000));

    // Example 14: Get crawl results
    console.log('\nℹ️ Getting crawl results...');
    const crawlResults = await supadata.web.getCrawlResults(crawl.jobId);
    console.log('ℹ️ Crawl results:', crawlResults);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Example 15: Start YouTube transcript batch job
    console.log('\nℹ️ Starting YouTube transcript batch job...');
    const transcriptBatchJob: YoutubeBatchJob =
      await supadata.youtube.transcript.batch({
        videoIds: ['dQw4w9WgXcQ', 'xvFZjo5PgG0'],
        lang: 'en',
      });
    console.log('ℹ️ Transcript batch job started:', transcriptBatchJob);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Example 16: Start YouTube video metadata batch job
    console.log('\nℹ️ Starting YouTube video metadata batch job...');
    const videoBatchJob: YoutubeBatchJob = await supadata.youtube.video.batch({
      playlistId: 'PLlaN88a7y2_plecYoJxvRFTLHVbIVAOoc', // Example playlist
      limit: 5, // Limit for the example
    });
    console.log('ℹ️ Video metadata batch job started:', videoBatchJob);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Example 17: Poll and get batch results (using transcript job ID from Example 15)
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

        if (
          batchResults.status === 'completed' ||
          batchResults.status === 'failed'
        ) {
          break; // Exit loop if job finished or failed
        }
      } catch (error) {
        console.error(
          `🛑 [Attempt ${attempts}] Error polling batch results:`,
          error
        );
        // Decide if you want to break or continue polling on error
        break;
      }

      if (attempts < maxAttempts) {
        console.log(
          `ℹ️ Waiting ${pollInterval / 1000} seconds before next poll...`
        );
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
    if (error instanceof SupadataError) {
      console.error(
        '🛑 Supadata Error Code:',
        error.error,
        'Details:',
        error.details
      );
    } else {
      console.error('🛑 An unexpected error occurred:', error);
    }
  }
}

main();
