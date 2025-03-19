import { Supadata } from '../index.js';
import fetchMock from 'jest-fetch-mock';
import type {
  Transcript,
  TranslatedTranscript,
  Scrape,
  Map,
  YouTubeVideo,
  YouTubeChannel,
  YouTubePlaylist,
  YouTubeChannelVideos,
  YouTubePlaylistVideos,
} from '../types.js';

fetchMock.enableMocks();

describe('Supadata SDK', () => {
  const config = {
    apiKey: 'test-api-key',
    baseUrl: 'https://api.supadata.ai/v1',
  };
  let supadata: Supadata;

  beforeEach(() => {
    fetchMock.resetMocks();
    supadata = new Supadata(config);
  });

  describe('YouTube Service', () => {
    it('should get transcript with id', async () => {
      const mockResponse: Transcript = {
        content: [{ text: 'Hello', offset: 0, duration: 1000, lang: 'en' }],
        lang: 'en',
        availableLangs: ['en'],
      };

      fetchMock.mockResponseOnce(JSON.stringify(mockResponse), {
        headers: { 'content-type': 'application/json' },
      });

      const result = await supadata.youtube.transcript({
        id: 'test-id',
      });
      expect(result).toEqual(mockResponse);
      expect(fetchMock).toHaveBeenCalledWith(
        'https://api.supadata.ai/v1/youtube/transcript?id=test-id',
        expect.objectContaining({
          method: 'GET',
          headers: {
            'x-api-key': 'test-api-key',
            'Content-Type': 'application/json',
          },
        })
      );
    });

    it('should get transcript with url', async () => {
      const mockResponse: Transcript = {
        content: [{ text: 'Hello', offset: 0, duration: 1000, lang: 'en' }],
        lang: 'en',
        availableLangs: ['en'],
      };

      fetchMock.mockResponseOnce(JSON.stringify(mockResponse), {
        headers: { 'content-type': 'application/json' },
      });

      const result = await supadata.youtube.transcript({
        url: 'https://www.youtube.com/watch?v=test-id',
      });
      expect(result).toEqual(mockResponse);
      expect(fetchMock).toHaveBeenCalledWith(
        'https://api.supadata.ai/v1/youtube/transcript?url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3Dtest-id',
        expect.objectContaining({
          method: 'GET',
          headers: {
            'x-api-key': 'test-api-key',
            'Content-Type': 'application/json',
          },
        })
      );
    });

    it('should translate transcript', async () => {
      const mockResponse: TranslatedTranscript = {
        content: [{ text: 'Hola', offset: 0, duration: 1000, lang: 'es' }],
        lang: 'es',
      };

      fetchMock.mockResponseOnce(JSON.stringify(mockResponse), {
        headers: { 'content-type': 'application/json' },
      });

      const result = await supadata.youtube.translate({
        id: 'video-id',
        lang: 'es',
        chunkSize: 200,
      });
      expect(result).toEqual(mockResponse);
      expect(fetchMock).toHaveBeenCalledWith(
        'https://api.supadata.ai/v1/youtube/transcript/translation?id=video-id&lang=es&chunkSize=200',
        expect.objectContaining({
          method: 'GET',
          headers: {
            'x-api-key': 'test-api-key',
            'Content-Type': 'application/json',
          },
        })
      );
    });

    it('should get video details', async () => {
      const mockResponse: YouTubeVideo = {
        id: 'test-id',
        title: 'Test Video',
        description: 'This is a test video',
        publishedAt: '2023-01-01T00:00:00Z',
        channelId: 'channel-id',
        channelTitle: 'Test Channel',
        thumbnails: {
          default: 'https://example.com/thumbnail.jpg',
        },
        viewCount: 1000,
      };

      fetchMock.mockResponseOnce(JSON.stringify(mockResponse), {
        headers: { 'content-type': 'application/json' },
      });

      const result = await supadata.youtube.video.get({
        id: 'video-id',
      });
      expect(result).toEqual(mockResponse);
      expect(fetchMock).toHaveBeenCalledWith(
        'https://api.supadata.ai/v1/youtube/video?id=video-id',
        expect.objectContaining({
          method: 'GET',
          headers: {
            'x-api-key': 'test-api-key',
            'Content-Type': 'application/json',
          },
        })
      );
    });

    it('should get channel details', async () => {
      const mockResponse: YouTubeChannel = {
        id: 'channel-id',
        name: 'Test Channel',
        description: 'This is a test channel',
        publishedAt: '2023-01-01T00:00:00Z',
        thumbnail: 'https://example.com/channel-thumbnail.jpg',
        banner: 'https://example.com/channel-banner.jpg',
        subscriberCount: 1000,
        videoCount: 50,
      };

      fetchMock.mockResponseOnce(JSON.stringify(mockResponse), {
        headers: { 'content-type': 'application/json' },
      });

      const result = await supadata.youtube.channel.get({
        id: 'channel-id',
      });
      expect(result).toEqual(mockResponse);
      expect(fetchMock).toHaveBeenCalledWith(
        'https://api.supadata.ai/v1/youtube/channel?id=channel-id',
        expect.objectContaining({
          method: 'GET',
          headers: {
            'x-api-key': 'test-api-key',
            'Content-Type': 'application/json',
          },
        })
      );
    });

    it('should get playlist details', async () => {
      const mockResponse: YouTubePlaylist = {
        id: 'playlist-id',
        title: 'Test Playlist',
        description: 'This is a test playlist',
        videoCount: 25,
        viewCount: 1000000,
        lastUpdated: '2023-01-01T00:00:00.000Z',
        channel: {
          id: 'channel-id',
          name: 'Test Channel'
        }
      };

      fetchMock.mockResponseOnce(JSON.stringify(mockResponse), {
        headers: { 'content-type': 'application/json' },
      });

      const result = await supadata.youtube.playlist.get({
        id: 'playlist-id',
      });
      expect(result).toEqual(mockResponse);
      expect(fetchMock).toHaveBeenCalledWith(
        'https://api.supadata.ai/v1/youtube/playlist?id=playlist-id',
        expect.objectContaining({
          method: 'GET',
          headers: {
            'x-api-key': 'test-api-key',
            'Content-Type': 'application/json',
          },
        })
      );
    });

    it('should get channel videos', async () => {
      const mockResponse: YouTubeChannelVideos = {
        videoIds: [
          'video-id-1',
          'video-id-2'
        ]
      };

      fetchMock.mockResponseOnce(JSON.stringify(mockResponse), {
        headers: { 'content-type': 'application/json' },
      });

      const result = await supadata.youtube.channel.videos({
        id: 'channel-id',
        limit: 50,
      });
      expect(result).toEqual(mockResponse);
      expect(fetchMock).toHaveBeenCalledWith(
        'https://api.supadata.ai/v1/youtube/channel/videos?id=channel-id&limit=50',
        expect.objectContaining({
          method: 'GET',
          headers: {
            'x-api-key': 'test-api-key',
            'Content-Type': 'application/json',
          },
        })
      );
    });

    it('should get playlist videos', async () => {
      const mockResponse: YouTubePlaylistVideos = {
        videoIds: [
          'video-id-1',
          'video-id-2'
        ]
      };

      fetchMock.mockResponseOnce(JSON.stringify(mockResponse), {
        headers: { 'content-type': 'application/json' },
      });

      const result = await supadata.youtube.playlist.videos({
        id: 'playlist-id',
        limit: 20,
      });
      expect(result).toEqual(mockResponse);
      expect(fetchMock).toHaveBeenCalledWith(
        'https://api.supadata.ai/v1/youtube/playlist/videos?id=playlist-id&limit=20',
        expect.objectContaining({
          method: 'GET',
          headers: {
            'x-api-key': 'test-api-key',
            'Content-Type': 'application/json',
          },
        })
      );
    });

    it('should get transcript with additional options', async () => {
      const mockResponse: Transcript = {
        content: 'Hello, this is a text transcript',
        lang: 'en',
        availableLangs: ['en', 'es', 'fr'],
      };

      fetchMock.mockResponseOnce(JSON.stringify(mockResponse), {
        headers: { 'content-type': 'application/json' },
      });

      const result = await supadata.youtube.transcript({
        id: 'test-id',
        text: true,
        lang: 'en',
        chunkSize: 100,
      });
      expect(result).toEqual(mockResponse);
      expect(fetchMock).toHaveBeenCalledWith(
        'https://api.supadata.ai/v1/youtube/transcript?id=test-id&text=true&lang=en&chunkSize=100',
        expect.objectContaining({
          method: 'GET',
          headers: {
            'x-api-key': 'test-api-key',
            'Content-Type': 'application/json',
          },
        })
      );
    });
  });

  describe('Web Service', () => {
    it('should scrape web content', async () => {
      const mockResponse: Scrape = {
        url: 'https://supadata.ai',
        content: '# Title',
        name: 'Example',
        description: 'Test page',
        ogUrl: 'https://supadata.ai/og.png',
        countCharacters: 100,
        urls: ['https://supadata.ai'],
      };

      fetchMock.mockResponseOnce(JSON.stringify(mockResponse), {
        headers: { 'content-type': 'application/json' },
      });

      const result = await supadata.web.scrape('https://supadata.ai');
      expect(result).toEqual(mockResponse);
      expect(fetchMock).toHaveBeenCalledWith(
        'https://api.supadata.ai/v1/web/scrape?url=https%3A%2F%2Fsupadata.ai',
        expect.objectContaining({
          method: 'GET',
          headers: {
            'x-api-key': 'test-api-key',
            'Content-Type': 'application/json',
          },
        })
      );
    });

    it('should map website', async () => {
      const mockResponse: Map = {
        urls: ['https://supadata.ai', 'https://supadata.ai/docs'],
      };

      fetchMock.mockResponseOnce(JSON.stringify(mockResponse), {
        headers: { 'content-type': 'application/json' },
      });

      const result = await supadata.web.map('https://supadata.ai');
      expect(result).toEqual(mockResponse);
      expect(fetchMock).toHaveBeenCalledWith(
        'https://api.supadata.ai/v1/web/map?url=https%3A%2F%2Fsupadata.ai',
        expect.objectContaining({
          method: 'GET',
          headers: {
            'x-api-key': 'test-api-key',
            'Content-Type': 'application/json',
          },
        })
      );
    });
  });

  it('should initialize with config', () => {
    expect(supadata).toBeInstanceOf(Supadata);
  });
});
