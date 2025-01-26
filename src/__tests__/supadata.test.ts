import { Supadata } from '../index.js';

global.fetch = jest.fn();

describe('Supadata SDK', () => {
  const config = { apiKey: 'test-api-key' };
  let supadata: Supadata;

  beforeEach(() => {
    supadata = new Supadata(config);
    (global.fetch as jest.Mock).mockClear();
  });

  describe('YouTube Service', () => {
    it('should get transcript', async () => {
      const mockResponse = {
        content: [{ text: 'Hello', offset: 0, duration: 1000, lang: 'en' }],
        lang: 'en',
        availableLangs: ['en']
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await supadata.youtube.transcript({ videoId: 'test-id' });
      expect(result).toEqual(mockResponse);
    });

    it('should translate transcript', async () => {
      const mockResponse = {
        content: [{ text: 'Hola', offset: 0, duration: 1000, lang: 'es' }],
        lang: 'es'
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await supadata.youtube.translate({ 
        videoId: 'test-id',
        lang: 'es'
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('Web Service', () => {
    it('should scrape web content', async () => {
      const mockResponse = {
        url: 'https://supadata.ai',
        content: '# Title',
        name: 'Example',
        description: 'Test page',
        ogUrl: 'https://supadata.ai/og.png',
        countCharacters: 100,
        urls: ['https://supadata.ai']
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await supadata.web.scrape('https://supadata.ai');
      expect(result).toEqual(mockResponse);
    });

    it('should map website', async () => {
      const mockResponse = {
        urls: ['https://supadata.ai', 'https://supadata.ai/docs']
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await supadata.web.map('https://supadata.ai');
      expect(result).toEqual(mockResponse);
    });
  });
});