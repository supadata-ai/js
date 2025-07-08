import { BaseClient } from '../client.js';
import {
  JobId,
  JobResult,
  SupadataError,
  Transcript,
  TranscriptOrJobId,
} from '../types.js';

export interface GeneralTranscriptParams {
  url: string;
  lang?: string;
  text?: boolean;
  chunkSize?: number;
  mode?: 'native' | 'auto' | 'generate';
}

export class TranscriptService extends BaseClient {
  /**
   * Get transcript from a supported video platform or file URL.
   * @param params - Parameters for fetching the transcript
   * @returns A promise that resolves to either a Transcript or JobId for async processing
   */
  get = async (params: GeneralTranscriptParams): Promise<TranscriptOrJobId> => {
    return this.fetch<TranscriptOrJobId>('/transcript', params);
  };

  /**
   * Get results for a transcript job by job ID.
   * @param jobId - The ID of the transcript job
   * @returns A promise that resolves to the job result containing status and transcript if completed
   * @throws {SupadataError} If jobId is not provided
   */
  getJobStatus = async (jobId: string): Promise<JobResult<Transcript>> => {
    if (!jobId) {
      throw new SupadataError({
        error: 'invalid-request',
        message: 'Missing jobId',
        details:
          'The jobId parameter is required to get transcript job status.',
      });
    }
    return this.fetch<JobResult<Transcript>>(`/transcript/${jobId}`);
  };
}
