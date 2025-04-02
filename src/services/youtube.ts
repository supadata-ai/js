import { BaseClient } from '../client.js';
import {
  SupadataError,
  Transcript,
  TranslatedTranscript,
  YoutubeChannel,
  YoutubePlaylist,
  YoutubeVideo,
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
  type?: 'video' | 'short' | 'all';
}

export interface PlaylistVideosParams extends ResourceParams {
  limit?: number;
}

export interface VideoIds {
  videoIds: string[];
  shortIds: string[];
}

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
   * Fetches a YouTube video based on the provided parameters.
   *
   * @param params - The parameters required to fetch the YouTube video.
   * @param params.id - The YouTube video ID.
   * @returns A promise that resolves to a `YoutubeVideo` object.
   */
  async video(params: ResourceParams): Promise<YoutubeVideo> {
    return this.fetch<YoutubeVideo>('/youtube/video', params);
  }

  /**
   * Fetches YouTube channel information and videos.
   *
   * @param params - The parameters required to fetch the YouTube channel information.
   * @param params.id - The YouTube channel ID.
   * @returns A promise that resolves to a `YoutubeChannel` object containing the channel information.
   *
   * @property videos - Fetches the videos of the YouTube channel.
   * @param params - The parameters required to fetch the YouTube channel videos.
   * @param params.id - The YouTube channel ID.
   * @param params.limit - The maximum number of videos to fetch.
   *                       Default: 30. Max: 5000.
   * @param params.type - The type of videos to fetch.
   *                      Default: 'video'.
   *                      Allowed values: 'video', 'short', 'all'.
   * @returns A promise that resolves to an array of video IDs.
   *
   * @throws {SupadataError} If the limit is invalid (less than 1 or greater than 5000).
   */
  channel = Object.assign(
    async (params: ResourceParams): Promise<YoutubeChannel> => {
      return this.fetch<YoutubeChannel>('/youtube/channel', params);
    },
    {
      videos: async (params: ChannelVideosParams): Promise<VideoIds> => {
        // Validate the limit locally to avoid unnecessary API calls.
        this.validateLimit(params);
        return this.fetch<VideoIds>('/youtube/channel/videos', params);
      },
    }
  );

  /**
   * Fetches a YouTube playlist and its videos.
   *
   * @param params - The parameters required to fetch the playlist.
   * @param params.id - The YouTube playlist ID.
   * @returns A promise that resolves to a `YoutubePlaylist` object.
   *
   * @property videos - Fetches the videos of a YouTube playlist.
   * @param params - The parameters required to fetch the playlist videos.
   * @param params.id - The YouTube playlist ID.
   * @param params.limit - The maximum number of videos to fetch.
   *                       Default: 30. Max: 5000.
   * @returns A promise that resolves to an array of video IDs.
   *
   * @throws {SupadataError} If the limit is invalid (less than 1 or greater than 5000).
   */
  playlist = Object.assign(
    async (params: ResourceParams): Promise<YoutubePlaylist> => {
      return this.fetch<YoutubePlaylist>('/youtube/playlist', params);
    },
    {
      videos: async (params: PlaylistVideosParams): Promise<VideoIds> => {
        // Validate the limit locally to avoid unnecessary API calls.
        this.validateLimit(params);
        return this.fetch<VideoIds>('/youtube/playlist/videos', params);
      },
    }
  );

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
}
