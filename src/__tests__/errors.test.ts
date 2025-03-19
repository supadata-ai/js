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

  describe('Gateway Errors', () => {
    it('should handle 403 unauthorized error', async () => {
      const errorMessage = 'Invalid API key provided';
      fetchMock.mockResponseOnce(JSON.stringify({ message: errorMessage }), {
        status: 403,
        headers: { 'content-type': 'application/json' },
      });

      await expect(
        supadata.web.map('https://example.com')
      ).rejects.toMatchObject({
        error: 'invalid-request',
        message: 'Invalid or missing API key',
        details: errorMessage,
      });
    });

    it('should handle 404 not found error', async () => {
      const errorMessage = 'Endpoint not found';
      fetchMock.mockResponseOnce(JSON.stringify({ message: errorMessage }), {
        status: 404,
        headers: { 'content-type': 'application/json' },
      });

      await expect(
        supadata.web.map('https://example.com')
      ).rejects.toMatchObject({
        error: 'invalid-request',
        message: 'Endpoint does not exist',
        details: errorMessage,
      });
    });

    it('should handle 429 rate limit error', async () => {
      const errorMessage = 'Too many requests';
      fetchMock.mockResponseOnce(JSON.stringify({ message: errorMessage }), {
        status: 429,
        headers: { 'content-type': 'application/json' },
      });

      await expect(
        supadata.web.map('https://example.com')
      ).rejects.toMatchObject({
        error: 'limit-exceeded',
        message: 'Limit exceeded',
        details: errorMessage,
      });
    });

    it('should handle unknown gateway error', async () => {
      const errorMessage = 'Unknown error occurred';
      fetchMock.mockResponseOnce(JSON.stringify({ message: errorMessage }), {
        status: 500,
        headers: { 'content-type': 'application/json' },
      });

      await expect(
        supadata.web.map('https://example.com')
      ).rejects.toMatchObject({
        error: 'internal-error',
        details: 'An unexpected error occurred',
      });
    });
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
        supadata.youtube.transcript({ id: 'invalid-id' })
      ).rejects.toMatchObject(errorResponse);
    });

    it('should handle non-JSON error response', async () => {
      const responseText = 'some text';
      fetchMock.mockResponseOnce(responseText, {
        status: 500,
        headers: { 'content-type': 'text/plain' },
      });

      await expect(
        supadata.youtube.transcript({ id: 'test-id' })
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
        supadata.youtube.transcript({ id: 'test-id' })
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
        supadata.youtube.transcript({ id: 'test-id' })
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
        error: 'video-not-found' as const,
        message: 'Video not found',
        details: 'The requested video ID does not exist',
        documentationUrl: 'https://docs.supadata.ai/errors',
      };
      const error = new SupadataError(errorData);
      expect(error).toMatchObject(errorData);
      expect(error.name).toBe('SupadataError');
    });
  });

  describe('Parameter Validation', () => {
    it('should throw error when both id and url are provided for video.get', async () => {
      const params = { id: 'test-id', url: 'https://youtube.com/watch?v=test-id' } as any;
      await expect(
        supadata.youtube.video.get(params)
      ).rejects.toThrow("Please specify either 'id' or 'url', but not both.");
    });

    it('should throw error when neither id nor url are provided for video.get', async () => {
      const params = {} as any;
      await expect(
        supadata.youtube.video.get(params)
      ).rejects.toThrow("Please specify either 'id' or 'url', but not both.");
    });

    it('should throw error when both id and url are provided for channel.get', async () => {
      const params = { id: 'test-id', url: 'https://youtube.com/channel/test-id' } as any;
      await expect(
        supadata.youtube.channel.get(params)
      ).rejects.toThrow("Please specify either 'id' or 'url', but not both.");
    });

    it('should throw error when both id and url are provided for transcript', async () => {
      const params = { id: 'test-id', url: 'https://youtube.com/watch?v=test-id' } as any;
      await expect(
        supadata.youtube.transcript(params)
      ).rejects.toThrow("Please specify either 'id' or 'url', but not both.");
    });
  });
});
