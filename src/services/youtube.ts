import { BaseClient } from '../client.js';
import {
  Transcript,
  TranslatedTranscript,
  YouTubeVideo,
  YouTubeChannel,
  YouTubePlaylist,
  YouTubeChannelVideos,
  YouTubePlaylistVideos,
  SupadataConfig,
} from '../types.js';

/**
 * Ensures exactly one property from the specified keys is provided.
 * @example
 * // Valid: { id: "..." }
 * // Invalid: {}
 */
type ExactlyOne<T, Keys extends keyof T> = {
  [K in Keys]: { [P in K]-?: T[P] } & { [P in Exclude<Keys, K>]?: never };
}[Keys] &
  Omit<T, Keys>;

export type VideoIdParam = ExactlyOne<{
  id?: string;
  url?: string;
}, 'id' | 'url'>;

export type TranscriptParams = {
  lang?: string;
  text?: boolean;
  chunkSize?: number;
} & VideoIdParam;

export interface TranslateParams extends Omit<TranscriptParams, 'lang'> {
  lang: string;
}

export type VideoParams = {
  part?: string;
} & VideoIdParam;

export type ChannelParams = {
  part?: string;
} & VideoIdParam;

export type PlaylistParams = {
  part?: string;
} & VideoIdParam;

export type ChannelVideosParams = {
  limit?: number;
} & VideoIdParam;

export type PlaylistVideosParams = {
  limit?: number;
} & VideoIdParam;

class VideoService extends BaseClient {
  constructor(private youtubeService: YouTubeService) {
    super(youtubeService.getConfig());
  }

  /**
   * Fetches details about a YouTube video.
   *
   * @param params - Parameters for fetching the video details
   * @param params.id - The YouTube video ID (provide either this OR url)
   * @param params.url - The YouTube video URL (provide either this OR id)
   * @param params.part - Optional parts to include in the response
   * @returns A promise that resolves to the video details
   */
  async get(params: VideoParams): Promise<YouTubeVideo> {
    if ((!params.id && !params.url) || (params.id && params.url)) {
      throw new Error("Please specify either 'id' or 'url', but not both.");
    }
    return this.fetch<YouTubeVideo>('/youtube/video', params);
  }
}

class ChannelService extends BaseClient {
  constructor(private youtubeService: YouTubeService) {
    super(youtubeService.getConfig());
  }

  /**
   * Fetches details about a YouTube channel.
   *
   * @param params - Parameters for fetching the channel details
   * @param params.id - YouTube channel URL, handle or ID
   * @param params.url - The YouTube channel URL (provide either this OR id)
   * @param params.part - Optional parts to include in the response
   * @returns A promise that resolves to the channel details
   */
  async get(params: ChannelParams): Promise<YouTubeChannel> {
    if ((!params.id && !params.url) || (params.id && params.url)) {
      throw new Error("Please specify either 'id' or 'url', but not both.");
    }
    return this.fetch<YouTubeChannel>('/youtube/channel', params);
  }

  /**
   * Fetches videos from a YouTube channel.
   *
   * @param params - Parameters for fetching the channel videos
   * @param params.id - YouTube channel URL, handle or ID
   * @param params.url - The YouTube channel URL (provide either this OR id)
   * @param params.limit - Optional maximum number of video IDs to return (default: 30, max: 5000)
   * @returns A promise that resolves to an object containing an array of video IDs
   */
  async videos(params: ChannelVideosParams): Promise<YouTubeChannelVideos> {
    if ((!params.id && !params.url) || (params.id && params.url)) {
      throw new Error("Please specify either 'id' or 'url', but not both.");
    }
    return this.fetch<YouTubeChannelVideos>('/youtube/channel/videos', params);
  }
}

class PlaylistService extends BaseClient {
  constructor(private youtubeService: YouTubeService) {
    super(youtubeService.getConfig());
  }

  /**
   * Fetches details about a YouTube playlist.
   *
   * @param params - Parameters for fetching the playlist details
   * @param params.id - The YouTube playlist ID (provide either this OR url)
   * @param params.url - The YouTube playlist URL (provide either this OR id)
   * @param params.part - Optional parts to include in the response
   * @returns A promise that resolves to the playlist details
   */
  async get(params: PlaylistParams): Promise<YouTubePlaylist> {
    if ((!params.id && !params.url) || (params.id && params.url)) {
      throw new Error("Please specify either 'id' or 'url', but not both.");
    }
    return this.fetch<YouTubePlaylist>('/youtube/playlist', params);
  }

  /**
   * Fetches videos from a YouTube playlist.
   *
   * @param params - Parameters for fetching the playlist videos
   * @param params.id - The YouTube playlist ID (provide either this OR url)
   * @param params.url - The YouTube playlist URL (provide either this OR id)
   * @param params.limit - Optional maximum number of video IDs to return (default: 100, max: 5000)
   * @returns A promise that resolves to an object containing an array of video IDs
   */
  async videos(params: PlaylistVideosParams): Promise<YouTubePlaylistVideos> {
    if ((!params.id && !params.url) || (params.id && params.url)) {
      throw new Error("Please specify either 'id' or 'url', but not both.");
    }
    return this.fetch<YouTubePlaylistVideos>('/youtube/playlist/videos', params);
  }
}

export class YouTubeService extends BaseClient {
  public readonly video: VideoService;
  public readonly channel: ChannelService;
  public readonly playlist: PlaylistService;

  constructor(config: SupadataConfig) {
    super(config);
    this.video = new VideoService(this);
    this.channel = new ChannelService(this);
    this.playlist = new PlaylistService(this);
  }

  /**
   * Returns the configuration for nested services
   */
  getConfig() {
    return this.config;
  }

  /**
   * Fetches a transcript for a YouTube video.
   *
   * @param params - Parameters for fetching the transcript
   * @param params.id - The YouTube video ID (provide either this OR url)
   * @param params.url - The YouTube video URL (provide either this OR id)
   * @param params.lang - Optional language code for the transcript (ISO 639-1)
   * @param params.text - Optional flag to return plain text instead of timestamped list
   * @param params.chunkSize - Optional maximum characters per transcript chunk (only when text=false)
   * @returns A promise that resolves to the video transcript
   */
  async transcript(params: TranscriptParams): Promise<Transcript> {
    if ((!params.id && !params.url) || (params.id && params.url)) {
      throw new Error("Please specify either 'id' or 'url', but not both.");
    }
    return this.fetch<Transcript>('/youtube/transcript', params);
  }

  /**
   * Translates a YouTube video transcript to a specified language.
   * Note: This endpoint has longer than usual response times (20+ seconds).
   * Please make sure to increase the request timeout in your application.
   * Pricing: 1 minute of transcript = 30 credits
   *
   * @param params - Parameters for translating the transcript
   * @param params.id - The YouTube video ID (provide either this OR url)
   * @param params.url - The YouTube video URL (provide either this OR id)
   * @param params.lang - The target language code for translation (ISO 639-1)
   * @param params.text - Optional flag to return plain text instead of timestamped list
   * @param params.chunkSize - Optional maximum characters per transcript chunk (only when text=false)
   * @returns A promise that resolves to the translated transcript
   */
  async translate(params: TranslateParams): Promise<TranslatedTranscript> {
    if ((!params.id && !params.url) || (params.id && params.url)) {
      throw new Error("Please specify either 'id' or 'url', but not both.");
    }
    return this.fetch<TranslatedTranscript>(
      '/youtube/transcript/translation',
      params
    );
  }
}
