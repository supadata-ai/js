import {
  ExtractJobResult,
  ExtractParams,
  JobId,
  JobResult,
  Metadata,
  SupadataConfig,
  Transcript,
  TranscriptOrJobId,
} from './types.js';
import { YouTubeService } from './services/youtube.js';
import { WebService } from './services/web.js';
import {
  TranscriptService,
  GeneralTranscriptParams,
} from './services/transcript.js';
import { ExtractService } from './services/extract.js';
import { BaseClient } from './client.js';

export * from './types.js';
export * from './client.js';
export * from './services/youtube.js';
export * from './services/web.js';
export {
  TranscriptService,
  GeneralTranscriptParams,
} from './services/transcript.js';
export { ExtractService } from './services/extract.js';

export interface MetadataParams {
  url: string;
}

export class Supadata extends BaseClient {
  readonly youtube: YouTubeService;
  readonly web: WebService;
  private _transcriptService: TranscriptService;
  private _extractService: ExtractService;

  constructor(config: SupadataConfig) {
    super(config);
    this.youtube = new YouTubeService(config);
    this.web = new WebService(config);
    this._transcriptService = new TranscriptService(config);
    this._extractService = new ExtractService(config);
  }

  /**
   * Get transcript from a supported video platform (YouTube, TikTok, Instagram, Twitter) or file URL.
   * If the video is too large to return transcript immediately, request returns a job ID.
   */
  transcript = Object.assign(
    async (params: GeneralTranscriptParams): Promise<TranscriptOrJobId> => {
      return this._transcriptService.get(params);
    },
    {
      getJobStatus: (jobId: string): Promise<JobResult<Transcript>> => {
        return this._transcriptService.getJobStatus(jobId);
      },
    }
  );

  /**
   * Get metadata from any supported platform (YouTube, TikTok, Instagram, Twitter).
   * @param params - Parameters for fetching metadata
   * @param params.url - Media URL from YouTube, TikTok, Instagram, or Twitter
   * @returns A promise that resolves to a Metadata object
   */
  metadata = async (params: MetadataParams): Promise<Metadata> => {
    return this.fetch<Metadata>('/metadata', params);
  };

  /**
   * Extract structured data from video content using AI.
   * Returns a job ID for asynchronous processing.
   * Use extract.getResults(jobId) to poll for results.
   */
  extract = Object.assign(
    async (params: ExtractParams): Promise<JobId> => {
      return this._extractService.get(params);
    },
    {
      getResults: (jobId: string): Promise<ExtractJobResult> => {
        return this._extractService.getResults(jobId);
      },
    }
  );
}
