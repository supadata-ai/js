import { Supadata } from '../index.js';
import fetchMock from 'jest-fetch-mock';
import type {
  Transcript,
  TranslatedTranscript,
  Scrape,
  Map,
  YoutubeVideo,
  YoutubeChannel,
  YoutubePlaylist,
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

    describe('video', () => {
      it('should fetch video details', async () => {
        const mockResponse: YoutubeVideo = {
          id: 'test-video-id',
          title: 'Test Video',
          description: 'Test Description',
          duration: 120,
          channel: {
            id: 'test-channel-id',
            name: 'Test Channel',
          },
          tags: ['test', 'video'],
          thumbnail: 'https://example.com/thumbnail.jpg',
          uploadedDate: '2024-03-20T00:00:00Z',
          viewCount: 1000,
          likeCount: 100,
          transcriptLanguages: ['en'],
        };

        fetchMock.mockResponseOnce(JSON.stringify(mockResponse), {
          headers: { 'content-type': 'application/json' },
        });

        const result = await supadata.youtube.video('test-video-id');

        expect(result).toEqual(mockResponse);
        expect(fetchMock).toHaveBeenCalledWith(
          expect.stringContaining('/youtube/video?id=test-video-id'),
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

    describe('channel', () => {
      it('should fetch channel details', async () => {
        const mockResponse: YoutubeChannel = {
          id: 'test-channel-id',
          name: 'Test Channel',
          handle: '@testchannel',
          description: 'Test Description',
          subscriberCount: 1000,
          videoCount: 100,
          thumbnail: 'https://example.com/thumbnail.jpg',
          banner: 'https://example.com/banner.jpg',
        };

        fetchMock.mockResponseOnce(JSON.stringify(mockResponse), {
          headers: { 'content-type': 'application/json' },
        });

        const result = await supadata.youtube.channel.get('test-channel-id');

        expect(result).toEqual(mockResponse);
        expect(fetchMock).toHaveBeenCalledWith(
          expect.stringContaining('/youtube/channel?id=test-channel-id'),
          expect.objectContaining({
            method: 'GET',
            headers: {
              'x-api-key': 'test-api-key',
              'Content-Type': 'application/json',
            },
          })
        );
      });

      describe('videos', () => {
        it('should fetch channel video IDs', async () => {
          const mockResponse = {
            videoIds: ['video1', 'video2', 'video3'],
          };

          fetchMock.mockResponseOnce(JSON.stringify(mockResponse), {
            headers: { 'content-type': 'application/json' },
          });

          const result = await supadata.youtube.channel.videos('test-channel-id');

          expect(result).toEqual(mockResponse.videoIds);
          expect(fetchMock).toHaveBeenCalledWith(
            expect.stringContaining('/youtube/channel/videos?id=test-channel-id'),
            expect.objectContaining({
              method: 'GET',
              headers: {
                'x-api-key': 'test-api-key',
                'Content-Type': 'application/json',
              },
            })
          );
        });

        it('should handle limit parameter', async () => {
          const mockResponse = {
            videoIds: ['video1', 'video2'],
          };

          fetchMock.mockResponseOnce(JSON.stringify(mockResponse), {
            headers: { 'content-type': 'application/json' },
          });

          const result = await supadata.youtube.channel.videos('test-channel-id', 2);

          expect(result).toEqual(mockResponse.videoIds);
          expect(fetchMock).toHaveBeenCalledWith(
            expect.stringContaining('/youtube/channel/videos?id=test-channel-id&limit=2'),
            expect.objectContaining({
              method: 'GET',
              headers: {
                'x-api-key': 'test-api-key',
                'Content-Type': 'application/json',
              },
            })
          );
        });

        it('should throw error for invalid limit', async () => {
          await expect(supadata.youtube.channel.videos('test-channel-id', 0)).rejects.toThrow();
          await expect(supadata.youtube.channel.videos('test-channel-id', 5001)).rejects.toThrow();
        });
      });
    });

    describe('playlist', () => {
      it('should fetch playlist details', async () => {
        const mockResponse: YoutubePlaylist = {
          id: 'test-playlist-id',
          title: 'Test Playlist',
          videoCount: 10,
          viewCount: 1000,
          lastUpdated: '2024-03-20T00:00:00Z',
          channel: {
            id: 'test-channel-id',
            name: 'Test Channel',
          },
          description: 'Test Description',
        };

        fetchMock.mockResponseOnce(JSON.stringify(mockResponse), {
          headers: { 'content-type': 'application/json' },
        });

        const result = await supadata.youtube.playlist.get('test-playlist-id');

        expect(result).toEqual(mockResponse);
        expect(fetchMock).toHaveBeenCalledWith(
          expect.stringContaining('/youtube/playlist?id=test-playlist-id'),
          expect.objectContaining({
            method: 'GET',
            headers: {
              'x-api-key': 'test-api-key',
              'Content-Type': 'application/json',
            },
          })
        );
      });

      describe('videos', () => {
        it('should fetch playlist video IDs', async () => {
          const mockResponse = {
            videoIds: ['video1', 'video2', 'video3'],
          };

          fetchMock.mockResponseOnce(JSON.stringify(mockResponse), {
            headers: { 'content-type': 'application/json' },
          });

          const result = await supadata.youtube.playlist.videos('test-playlist-id');

          expect(result).toEqual(mockResponse.videoIds);
          expect(fetchMock).toHaveBeenCalledWith(
            expect.stringContaining('/youtube/playlist/videos?id=test-playlist-id'),
            expect.objectContaining({
              method: 'GET',
              headers: {
                'x-api-key': 'test-api-key',
                'Content-Type': 'application/json',
              },
            })
          );
        });

        it('should handle limit parameter', async () => {
          const mockResponse = {
            videoIds: ['video1', 'video2'],
          };

          fetchMock.mockResponseOnce(JSON.stringify(mockResponse), {
            headers: { 'content-type': 'application/json' },
          });

          const result = await supadata.youtube.playlist.videos('test-playlist-id', 2);

          expect(result).toEqual(mockResponse.videoIds);
          expect(fetchMock).toHaveBeenCalledWith(
            expect.stringContaining('/youtube/playlist/videos?id=test-playlist-id&limit=2'),
            expect.objectContaining({
              method: 'GET',
              headers: {
                'x-api-key': 'test-api-key',
                'Content-Type': 'application/json',
              },
            })
          );
        });

        it('should throw error for invalid limit', async () => {
          await expect(supadata.youtube.playlist.videos('test-playlist-id', 0)).rejects.toThrow();
          await expect(supadata.youtube.playlist.videos('test-playlist-id', 5001)).rejects.toThrow();
        });
      });
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
