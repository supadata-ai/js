import {
  JobResult,
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

export * from './types.js';
export * from './client.js';
export * from './services/youtube.js';
export * from './services/web.js';
export {
  TranscriptService,
  GeneralTranscriptParams,
} from './services/transcript.js';

export class Supadata {
  readonly youtube: YouTubeService;
  readonly web: WebService;
  private _transcriptService: TranscriptService;

  constructor(config: SupadataConfig) {
    this.youtube = new YouTubeService(config);
    this.web = new WebService(config);
    this._transcriptService = new TranscriptService(config);
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
}
