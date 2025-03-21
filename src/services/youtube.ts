import { BaseClient } from '../client.js';
import {
  Transcript,
  TranslatedTranscript,
  YoutubeVideo,
  YoutubeChannel,
  YoutubePlaylist,
  YoutubeVideoList,
  SupadataConfig,
  SupadataError,
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

export class YouTubeService extends BaseClient {
  private _channel: YouTubeService.Channel;
  private _playlist: YouTubeService.Playlist;

  constructor(config: SupadataConfig) {
    super(config);
    this._channel = new YouTubeService.Channel(config);
    this._playlist = new YouTubeService.Playlist(config);
  }

  /**
   * Fetches a transcript for a YouTube video.
   *
   * @param params - Parameters for fetching the transcript
   * @param params.videoId - The YouTube video ID (provide either this OR url)
   * @param params.url - The YouTube video URL (provide either this OR videoId)
   * @param params.lang - Optional language code for the transcript
   * @param params.text - Optional flag to return plain text instead of timestamped list
   * @returns A promise that resolves to the video transcript
   */
  async transcript(params: TranscriptParams): Promise<Transcript> {
    return this.fetch<Transcript>('/youtube/transcript', params);
  }

  /**
   * Translates a YouTube video transcript to a specified language.
   *
   * @param params - Parameters for translating the transcript
   * @param params.videoId - The YouTube video ID (provide either this OR url)
   * @param params.url - The YouTube video URL (provide either this OR videoId)
   * @param params.lang - The target language code for translation
   * @param params.text - Optional flag to return plain text instead of timestamped list
   * @returns A promise that resolves to the translated transcript
   */
  async translate(params: TranslateParams): Promise<TranslatedTranscript> {
    return this.fetch<TranslatedTranscript>(
      '/youtube/transcript/translate',
      params
    );
  }

  /**
   * Validates a YouTube video ID
   * @param id - The video ID to validate
   * @throws {SupadataError} If the video ID is invalid
   */
  private validateVideoId(id: string): void {
    if (!id || typeof id !== 'string' || id.trim().length === 0) {
      throw new SupadataError({
        error: 'video-id-invalid',
        message: 'Invalid video ID provided',
        details: 'Video ID must be a non-empty string',
      });
    }
  }

  /**
   * Fetches details for a YouTube video.
   *
   * @param id - The YouTube video ID
   * @returns A promise that resolves to the video details
   * @throws {SupadataError} If the video ID is invalid
   */
  async video(id: string): Promise<YoutubeVideo> {
    this.validateVideoId(id);
    return this.fetch<YoutubeVideo>('/youtube/video', { id });
  }

  /**
   * Access channel-related operations
   */
  get channel(): YouTubeService.Channel {
    return this._channel;
  }

  /**
   * Access playlist-related operations
   */
  get playlist(): YouTubeService.Playlist {
    return this._playlist;
  }
}

export namespace YouTubeService {
  export class Channel extends BaseClient {
    constructor(config: SupadataConfig) {
      super(config);
    }

    /**
     * Fetches details for a YouTube channel.
     *
     * @param id - The YouTube channel ID
     * @returns A promise that resolves to the channel details
     */
    async get(id: string): Promise<YoutubeChannel> {
      return this.fetch<YoutubeChannel>('/youtube/channel', { id });
    }

    /**
     * Fetches video IDs from a YouTube channel.
     *
     * @param id - The YouTube channel ID
     * @param limit - Optional limit on the number of video IDs to return (max 5000)
     * @returns A promise that resolves to the list of video IDs
     */
    async videos(id: string, limit?: number): Promise<string[]> {
      if (limit !== undefined && (limit <= 0 || limit > 5000)) {
        throw new Error('Limit must be between 1 and 5000');
      }
      const params: Record<string, any> = { id };
      if (limit !== undefined) {
        params.limit = limit;
      }
      const response = await this.fetch<YoutubeVideoList>('/youtube/channel/videos', params);
      return response.videoIds;
    }
  }

  export class Playlist extends BaseClient {
    constructor(config: SupadataConfig) {
      super(config);
    }

    /**
     * Fetches details for a YouTube playlist.
     *
     * @param id - The YouTube playlist ID
     * @returns A promise that resolves to the playlist details
     */
    async get(id: string): Promise<YoutubePlaylist> {
      return this.fetch<YoutubePlaylist>('/youtube/playlist', { id });
    }

    /**
     * Fetches video IDs from a YouTube playlist.
     *
     * @param id - The YouTube playlist ID
     * @param limit - Optional limit on the number of video IDs to return (max 5000)
     * @returns A promise that resolves to the list of video IDs
     */
    async videos(id: string, limit?: number): Promise<string[]> {
      if (limit !== undefined && (limit <= 0 || limit > 5000)) {
        throw new Error('Limit must be between 1 and 5000');
      }
      const params: Record<string, any> = { id };
      if (limit !== undefined) {
        params.limit = limit;
      }
      const response = await this.fetch<YoutubeVideoList>('/youtube/playlist/videos', params);
      return response.videoIds;
    }
  }
}
