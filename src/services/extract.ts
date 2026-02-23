import { BaseClient } from '../client.js';
import {
  ExtractJobResult,
  ExtractParams,
  JobId,
  SupadataError,
} from '../types.js';

export class ExtractService extends BaseClient {
  /**
   * Start an extract job to analyze video content and extract structured data.
   * @param params - Parameters for the extract job
   * @returns A promise that resolves to a JobId for async processing
   */
  get = async (params: ExtractParams): Promise<JobId> => {
    return this.fetch<JobId>('/extract', params, 'POST');
  };

  /**
   * Get results for an extract job by job ID.
   * @param jobId - The ID of the extract job
   * @returns A promise that resolves to the extract job result
   * @throws {SupadataError} If jobId is not provided
   */
  getResults = async (jobId: string): Promise<ExtractJobResult> => {
    if (!jobId) {
      throw new SupadataError({
        error: 'invalid-request',
        message: 'Missing jobId',
        details:
          'The jobId parameter is required to get extract job results.',
      });
    }
    return this.fetch<ExtractJobResult>(`/extract/${jobId}`);
  };
}
