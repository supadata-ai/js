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
    it('should get transcript', async () => {
      const mockResponse: Transcript = {
        content: [{ text: 'Hello', offset: 0, duration: 1000, lang: 'en' }],
        lang: 'en',
        availableLangs: ['en'],
      };

      fetchMock.mockResponseOnce(JSON.stringify(mockResponse), {
        headers: { 'content-type': 'application/json' },
      });

      const result = await supadata.youtube.transcript({
        videoId: 'test-id',
      });
      expect(result).toEqual(mockResponse);
      expect(fetchMock).toHaveBeenCalledWith(
        'https://api.supadata.ai/v1/youtube/transcript?videoId=test-id',
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
        videoId: 'test-id',
        lang: 'es',
      });
      expect(result).toEqual(mockResponse);
      expect(fetchMock).toHaveBeenCalledWith(
        'https://api.supadata.ai/v1/youtube/transcript/translate?videoId=test-id&lang=es',
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

      const result = await supadata.youtube.video({
        videoId: 'test-id',
      });
      expect(result).toEqual(mockResponse);
      expect(fetchMock).toHaveBeenCalledWith(
        'https://api.supadata.ai/v1/youtube/video?videoId=test-id',
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
        title: 'Test Channel',
        description: 'This is a test channel',
        publishedAt: '2023-01-01T00:00:00Z',
        thumbnails: {
          default: 'https://example.com/channel-thumbnail.jpg',
        },
        subscriberCount: 1000,
        videoCount: 50,
      };

      fetchMock.mockResponseOnce(JSON.stringify(mockResponse), {
        headers: { 'content-type': 'application/json' },
      });

      const result = await supadata.youtube.channel({
        channelId: 'channel-id',
      });
      expect(result).toEqual(mockResponse);
      expect(fetchMock).toHaveBeenCalledWith(
        'https://api.supadata.ai/v1/youtube/channel?channelId=channel-id',
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
        publishedAt: '2023-01-01T00:00:00Z',
        channelId: 'channel-id',
        channelTitle: 'Test Channel',
        thumbnails: {
          default: 'https://example.com/playlist-thumbnail.jpg',
        },
        itemCount: 10,
      };

      fetchMock.mockResponseOnce(JSON.stringify(mockResponse), {
        headers: { 'content-type': 'application/json' },
      });

      const result = await supadata.youtube.playlist({
        playlistId: 'playlist-id',
      });
      expect(result).toEqual(mockResponse);
      expect(fetchMock).toHaveBeenCalledWith(
        'https://api.supadata.ai/v1/youtube/playlist?playlistId=playlist-id',
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
        channelId: 'channel-id',
        videos: [
          {
            id: 'video-id-1',
            title: 'Test Video 1',
            description: 'This is test video 1',
            publishedAt: '2023-01-01T00:00:00Z',
            channelId: 'channel-id',
            channelTitle: 'Test Channel',
            thumbnails: {
              default: 'https://example.com/thumbnail1.jpg',
            },
          },
          {
            id: 'video-id-2',
            title: 'Test Video 2',
            description: 'This is test video 2',
            publishedAt: '2023-01-02T00:00:00Z',
            channelId: 'channel-id',
            channelTitle: 'Test Channel',
            thumbnails: {
              default: 'https://example.com/thumbnail2.jpg',
            },
          },
        ],
        nextPageToken: 'next-page-token',
      };

      fetchMock.mockResponseOnce(JSON.stringify(mockResponse), {
        headers: { 'content-type': 'application/json' },
      });

      const result = await supadata.youtube.channelVideos({
        channelId: 'channel-id',
        maxResults: 2,
      });
      expect(result).toEqual(mockResponse);
      expect(fetchMock).toHaveBeenCalledWith(
        'https://api.supadata.ai/v1/youtube/channel/videos?channelId=channel-id&maxResults=2',
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
        playlistId: 'playlist-id',
        videos: [
          {
            id: 'video-id-1',
            title: 'Test Video 1',
            description: 'This is test video 1',
            publishedAt: '2023-01-01T00:00:00Z',
            channelId: 'channel-id',
            channelTitle: 'Test Channel',
            thumbnails: {
              default: 'https://example.com/thumbnail1.jpg',
            },
          },
          {
            id: 'video-id-2',
            title: 'Test Video 2',
            description: 'This is test video 2',
            publishedAt: '2023-01-02T00:00:00Z',
            channelId: 'channel-id',
            channelTitle: 'Test Channel',
            thumbnails: {
              default: 'https://example.com/thumbnail2.jpg',
            },
          },
        ],
        nextPageToken: 'next-page-token',
      };

      fetchMock.mockResponseOnce(JSON.stringify(mockResponse), {
        headers: { 'content-type': 'application/json' },
      });

      const result = await supadata.youtube.playlistVideos({
        playlistId: 'playlist-id',
        maxResults: 2,
      });
      expect(result).toEqual(mockResponse);
      expect(fetchMock).toHaveBeenCalledWith(
        'https://api.supadata.ai/v1/youtube/playlist/videos?playlistId=playlist-id&maxResults=2',
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
