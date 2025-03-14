import { BaseClient } from '../client.js';
import { Transcript, TranslatedTranscript } from '../types.js';

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
}
