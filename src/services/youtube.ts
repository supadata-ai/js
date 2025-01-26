import { BaseClient } from '../client.js';
import { Transcript, TranslatedTranscript } from '../types.js';

export interface TranscriptParams {
  videoId: string;
  lang?: string;
  text?: boolean;
}

export interface TranslateParams extends TranscriptParams {
  lang: string;
}

export class YouTubeService extends BaseClient {
  async transcript(params: TranscriptParams): Promise<Transcript> {
    return this.fetch<Transcript>('/youtube/transcript', params);
  }

  async translate(params: TranslateParams): Promise<TranslatedTranscript> {
    return this.fetch<TranslatedTranscript>('/youtube/transcript/translate', params);
  }
}