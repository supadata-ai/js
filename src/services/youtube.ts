import { BaseClient } from '../client.js';
import {
  SupadataError,
  Transcript,
  TranslatedTranscript,
  YoutubeBatchJob,
  YoutubeBatchResults,
  YoutubeChannel,
  YoutubePlaylist,
  YoutubeTranscriptBatchRequest,
  YoutubeVideo,
  YoutubeVideoBatchRequest,
} from '../types.js';

/**
 * Ensures exactly one property from the specified keys is provided.
 * @example
 * // Valid: { url: "..." } or { videoId: "..." }
 * // Invalid: {} or { url: "...", videoId: "..." }
 */
type ExactlyOne<T, Keys extends keyof T> = {
  [K in Keys]: { [P in K]-?: T[P] } & { [P in Exclude<Keys, K>]?: never };
}[Keys] &
  Omit<T, Keys>;

export type TranscriptParams = {
  lang?: string;
  text?: boolean;
} & ExactlyOne<{ videoId: string; url: string }, 'videoId' | 'url'>;

export interface TranslateParams extends Omit<TranscriptParams, 'lang'> {
  lang: string;
}

export interface ResourceParams {
  id: string;
}

export interface ChannelVideosParams extends ResourceParams {
  limit?: number;
  type?: 'video' | 'short' | 'live' | 'all';
}

export interface PlaylistVideosParams extends ResourceParams {
  limit?: number;
}

export interface VideoIds {
  videoIds: string[];
  shortIds: string[];
  liveIds: string[];
}

export class YouTubeService extends BaseClient {
  /**
   * Handles YouTube Transcript operations.
   */
  transcript = Object.assign(
    /**
     * Fetches a transcript for a YouTube video.
     * @param params - Parameters for fetching the transcript
     * @param params.videoId - The YouTube video ID (mutually exclusive with url)
     * @param params.url - The YouTube video URL (mutually exclusive with videoId)
     * @param params.lang - The language code for the transcript (optional)
     * @param params.text - Whether to return only the text content (optional)
     * @returns A promise that resolves to a Transcript object
     */
    async (params: TranscriptParams): Promise<Transcript> => {
      return this.fetch<Transcript>('/youtube/transcript', params);
    },
    {
      /**
       * Batch fetches transcripts for multiple YouTube videos.
       * @param params - Parameters for the transcript batch job
       * @param params.videoIds - Array of YouTube video IDs to fetch transcripts for
       * @param params.lang - The language code for the transcripts (optional)
       * @param params.limit - Maximum number of videos to process (optional, default: 10, max: 5000)
       * @param params.text - Whether to return only the text content (optional)
       * @returns A promise that resolves to a YoutubeBatchJob object with the job ID
       */
      batch: async (
        params: YoutubeTranscriptBatchRequest
      ): Promise<YoutubeBatchJob> => {
        this.validateBatchLimit(params);
        return this.fetch<YoutubeBatchJob>(
          '/youtube/transcript/batch',
          params,
          'POST'
        );
      },
    }
  );

  /**
   * Handles YouTube video operations.
   */
  video = Object.assign(
    /**
     * Fetches a YouTube video based on the provided parameters.
     * @param params - The parameters required to fetch the YouTube video
     * @param params.id - The YouTube video ID
     * @returns A promise that resolves to a YoutubeVideo object
     */
    async (params: ResourceParams): Promise<YoutubeVideo> => {
      return this.fetch<YoutubeVideo>('/youtube/video', params);
    },
    {
      /**
       * Batch fetches metadata for multiple YouTube videos.
       * @param params - Parameters for the video metadata batch job
       * @param params.videoIds - Array of YouTube video IDs to fetch metadata for
       * @param params.limit - Maximum number of videos to process (optional, default: 10, max: 5000)
       * @returns A promise that resolves to a YoutubeBatchJob object with the job ID
       */
      batch: async (
        params: YoutubeVideoBatchRequest
      ): Promise<YoutubeBatchJob> => {
        this.validateBatchLimit(params);
        return this.fetch<YoutubeBatchJob>(
          '/youtube/video/batch',
          params,
          'POST'
        );
      },
    }
  );

  /**
   * Handles YouTube channel operations.
   */
  channel = Object.assign(
    /**
     * Fetches YouTube channel information.
     * @param params - The parameters required to fetch the YouTube channel information
     * @param params.id - The YouTube channel ID
     * @returns A promise that resolves to a YoutubeChannel object containing the channel information
     */
    async (params: ResourceParams): Promise<YoutubeChannel> => {
      return this.fetch<YoutubeChannel>('/youtube/channel', params);
    },
    {
      /**
       * Fetches the videos of a YouTube channel.
       * @param params - The parameters required to fetch the YouTube channel videos
       * @param params.id - The YouTube channel ID
       * @param params.limit - The maximum number of videos to fetch (default: 30, max: 5000)
       * @param params.type - The type of videos to fetch ('video', 'short', 'live', or 'all', default: 'video')
       * @returns A promise that resolves to an object containing arrays of video IDs, short IDs, and live IDs
       * @throws {SupadataError} If the limit is invalid (less than 1 or greater than 5000)
       */
      videos: async (params: ChannelVideosParams): Promise<VideoIds> => {
        this.validateLimit(params);
        return this.fetch<VideoIds>('/youtube/channel/videos', params);
      },
    }
  );

  /**
   * Handles YouTube playlist operations.
   */
  playlist = Object.assign(
    /**
     * Fetches a YouTube playlist.
     * @param params - The parameters required to fetch the playlist
     * @param params.id - The YouTube playlist ID
     * @returns A promise that resolves to a YoutubePlaylist object
     */
    async (params: ResourceParams): Promise<YoutubePlaylist> => {
      return this.fetch<YoutubePlaylist>('/youtube/playlist', params);
    },
    {
      /**
       * Fetches the videos of a YouTube playlist.
       * @param params - The parameters required to fetch the playlist videos
       * @param params.id - The YouTube playlist ID
       * @param params.limit - The maximum number of videos to fetch (default: 30, max: 5000)
       * @returns A promise that resolves to an object containing arrays of video IDs, short IDs, and live IDs
       * @throws {SupadataError} If the limit is invalid (less than 1 or greater than 5000)
       */
      videos: async (params: PlaylistVideosParams): Promise<VideoIds> => {
        this.validateLimit(params);
        return this.fetch<VideoIds>('/youtube/playlist/videos', params);
      },
    }
  );

  /**
   * Handles YouTube batch operations.
   */
  batch = {
    /**
     * Retrieves the status and results of a batch job.
     * @param jobId - The ID of the batch job
     * @returns A promise that resolves to the YoutubeBatchResults containing job status and results
     * @throws {SupadataError} If jobId is not provided
     */
    getBatchResults: async (jobId: string): Promise<YoutubeBatchResults> => {
      if (!jobId) {
        throw new SupadataError({
          error: 'missing-parameters',
          message: 'Missing jobId',
          details: 'The jobId parameter is required to get batch results.',
        });
      }
      return this.fetch<YoutubeBatchResults>(`/youtube/batch/${jobId}`);
    },
  };

  /**
   * Translates a YouTube video transcript to a specified language.
   * @param params - Parameters for translating the transcript
   * @param params.videoId - The YouTube video ID (mutually exclusive with url)
   * @param params.url - The YouTube video URL (mutually exclusive with videoId)
   * @param params.lang - The target language code for translation
   * @param params.text - Whether to return only the text content (optional)
   * @returns A promise that resolves to a TranslatedTranscript object
   */
  translate = async (
    params: TranslateParams
  ): Promise<TranslatedTranscript> => {
    return this.fetch<TranslatedTranscript>(
      '/youtube/transcript/translate',
      params
    );
  };

  private validateLimit(params: { limit?: number }) {
    if (
      params.limit != undefined &&
      params.limit != null &&
      (params.limit < 1 || params.limit > 5000)
    ) {
      throw new SupadataError({
        error: 'invalid-request',
        message: 'Invalid limit.',
        details: 'The limit must be between 1 and 5000.',
      });
    }
  }

  // Add a specific validator for batch limits as per documentation (Max: 5000, Default: 10)
  private validateBatchLimit(params: { limit?: number }) {
    if (
      params.limit != undefined &&
      params.limit != null &&
      (params.limit < 1 || params.limit > 5000)
    ) {
      throw new SupadataError({
        error: 'invalid-request',
        message: 'Invalid limit for batch operation.',
        details: 'The limit must be between 1 and 5000.',
      });
    }
  }
}
