import { BaseClient } from '../client.js';
import {
  Transcript,
  TranslatedTranscript,
  YouTubeVideo,
  YouTubeChannel,
  YouTubePlaylist,
  YouTubeChannelVideos,
  YouTubePlaylistVideos,
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

export type VideoParams = {
  videoId?: string;
  url?: string;
  part?: string;
} & ExactlyOne<{ videoId: string; url: string }, 'videoId' | 'url'>;

export type ChannelParams = {
  channelId?: string;
  url?: string;
  part?: string;
} & ExactlyOne<{ channelId: string; url: string }, 'channelId' | 'url'>;

export type PlaylistParams = {
  playlistId?: string;
  url?: string;
  part?: string;
} & ExactlyOne<{ playlistId: string; url: string }, 'playlistId' | 'url'>;

export type ChannelVideosParams = {
  channelId?: string;
  url?: string;
  maxResults?: number;
  pageToken?: string;
  order?: 'date' | 'rating' | 'relevance' | 'title' | 'videoCount' | 'viewCount';
} & ExactlyOne<{ channelId: string; url: string }, 'channelId' | 'url'>;

export type PlaylistVideosParams = {
  playlistId?: string;
  url?: string;
  maxResults?: number;
  pageToken?: string;
} & ExactlyOne<{ playlistId: string; url: string }, 'playlistId' | 'url'>;

export class YouTubeService extends BaseClient {
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
   * Fetches details about a YouTube video.
   *
   * @param params - Parameters for fetching the video details
   * @param params.videoId - The YouTube video ID (provide either this OR url)
   * @param params.url - The YouTube video URL (provide either this OR videoId)
   * @param params.part - Optional parts to include in the response
   * @returns A promise that resolves to the video details
   */
  async video(params: VideoParams): Promise<YouTubeVideo> {
    return this.fetch<YouTubeVideo>('/youtube/video', params);
  }

  /**
   * Fetches details about a YouTube channel.
   *
   * @param params - Parameters for fetching the channel details
   * @param params.channelId - The YouTube channel ID (provide either this OR url)
   * @param params.url - The YouTube channel URL (provide either this OR channelId)
   * @param params.part - Optional parts to include in the response
   * @returns A promise that resolves to the channel details
   */
  async channel(params: ChannelParams): Promise<YouTubeChannel> {
    return this.fetch<YouTubeChannel>('/youtube/channel', params);
  }

  /**
   * Fetches details about a YouTube playlist.
   *
   * @param params - Parameters for fetching the playlist details
   * @param params.playlistId - The YouTube playlist ID (provide either this OR url)
   * @param params.url - The YouTube playlist URL (provide either this OR playlistId)
   * @param params.part - Optional parts to include in the response
   * @returns A promise that resolves to the playlist details
   */
  async playlist(params: PlaylistParams): Promise<YouTubePlaylist> {
    return this.fetch<YouTubePlaylist>('/youtube/playlist', params);
  }

  /**
   * Fetches videos from a YouTube channel.
   *
   * @param params - Parameters for fetching the channel videos
   * @param params.channelId - The YouTube channel ID (provide either this OR url)
   * @param params.url - The YouTube channel URL (provide either this OR channelId)
   * @param params.maxResults - Optional maximum number of results to return
   * @param params.pageToken - Optional token to continue a previous request
   * @param params.order - Optional order of videos
   * @returns A promise that resolves to the channel videos
   */
  async channelVideos(params: ChannelVideosParams): Promise<YouTubeChannelVideos> {
    return this.fetch<YouTubeChannelVideos>('/youtube/channel/videos', params);
  }

  /**
   * Fetches videos from a YouTube playlist.
   *
   * @param params - Parameters for fetching the playlist videos
   * @param params.playlistId - The YouTube playlist ID (provide either this OR url)
   * @param params.url - The YouTube playlist URL (provide either this OR playlistId)
   * @param params.maxResults - Optional maximum number of results to return
   * @param params.pageToken - Optional token to continue a previous request
   * @returns A promise that resolves to the playlist videos
   */
  async playlistVideos(params: PlaylistVideosParams): Promise<YouTubePlaylistVideos> {
    return this.fetch<YouTubePlaylistVideos>('/youtube/playlist/videos', params);
  }
}
