import { Supadata } from '../index.js';
import { SupadataError } from '../types.js';
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

describe('Error Handling', () => {
  const config = {
    apiKey: 'test-api-key',
    baseUrl: 'https://api.supadata.ai/v1',
  };
  let supadata: Supadata;

  beforeEach(() => {
    fetchMock.resetMocks();
    supadata = new Supadata(config);
  });

  describe('API Errors', () => {
    it('should handle standard API error response', async () => {
      const errorResponse = {
        error: 'video-not-found' as const,
        message: 'Video not found',
        details: 'The requested video ID does not exist',
        documentationUrl: 'https://docs.supadata.ai/errors',
      };

      fetchMock.mockResponseOnce(JSON.stringify(errorResponse), {
        status: 400,
        headers: { 'content-type': 'application/json' },
      });

      await expect(
        supadata.youtube.transcript({ videoId: 'invalid-id' })
      ).rejects.toMatchObject(errorResponse);
    });

    it('should handle non-JSON error response', async () => {
      const responseText = 'some text';
      fetchMock.mockResponseOnce(responseText, {
        status: 500,
        headers: { 'content-type': 'text/plain' },
      });

      await expect(
        supadata.youtube.transcript({ videoId: 'test-id' })
      ).rejects.toMatchObject({
        error: 'internal-error',
        message: 'Unexpected error response format',
        details: responseText,
      });
    });

    it('should handle invalid JSON response', async () => {
      fetchMock.mockResponseOnce('invalid json', {
        status: 200,
        headers: { 'content-type': 'application/json' },
      });

      await expect(
        supadata.youtube.transcript({ videoId: 'test-id' })
      ).rejects.toMatchObject({
        error: 'internal-error',
        message: 'Failed to parse response',
      });
    });

    it('should handle wrong content type in successful response', async () => {
      fetchMock.mockResponseOnce('some text', {
        status: 200,
        headers: { 'content-type': 'text/plain; charset=utf-8' },
      });

      await expect(
        supadata.youtube.transcript({ videoId: 'test-id' })
      ).rejects.toMatchObject({
        error: 'internal-error',
        details: 'Invalid response format',
      });
    });
  });

  describe('SupadataError Class', () => {
    it('should create error with minimal parameters', () => {
      const error = new SupadataError({ error: 'invalid-request' });
      expect(error).toMatchObject({
        error: 'invalid-request',
        message: 'An unexpected error occurred',
        details: 'An unexpected error occurred',
        documentationUrl: '',
        name: 'SupadataError',
      });
    });

    it('should create error with all parameters', () => {
      const errorData = {
        error: 'internal-error' as const,
        message: 'An unexpected error occurred',
        details: 'An unexpected error occurred',
        documentationUrl: 'https://docs.supadata.ai/errors',
      };
      const error = new SupadataError(errorData);
      expect(error).toMatchObject(errorData);
      expect(error.name).toBe('SupadataError');
    });
  });
});
