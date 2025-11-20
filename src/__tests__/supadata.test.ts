import fetchMock from 'jest-fetch-mock';
import { Supadata } from '../index.js';
import type {
  CrawlJob,
  JobId,
  JobResult,
  Metadata,
  Scrape,
  SiteMap,
  Transcript,
  TranslatedTranscript,
  YoutubeBatchJob,
  YoutubeBatchResults,
  YoutubeChannel,
  YoutubePlaylist,
  YoutubeVideo,
  YoutubeSearchResponse,
} from '../types.js';

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
          headers: expect.objectContaining({
            'x-api-key': 'test-api-key',
            'Content-Type': 'application/json',
            'User-Agent': expect.stringContaining('supadata-js'),
          }),
        })
      );
    });

    it('should get the channel info', async () => {
      const channelId = 'UCsBjURrPoezykLs9EqgamOA';
      const mockResponse = {
        id: channelId,
        name: 'Fireship',
        handle: '@Fireship',
        description:
          'High-intensity ⚡ code tutorials and tech news to help you ship your app faster. New videos every week covering the topics every programmer should know. ',
        videoCount: 719,
        subscriberCount: 3770000,
        thumbnail:
          'https://yt3.googleusercontent.com/ytc/AIdro_mKzklyPPhghBJQH5H3HpZ108YcE618DBRLAvRUD1AjKNw=s160-c-k-c0x00ffffff-no-rj',
        banner:
          'https://yt3.googleusercontent.com/62Kw34f1ysmycFceeNIFGsWpRDyqgDUSn2mAn29gwv7axMjN4NUVkJWqwEi4XKBE0016l7C4=w2560-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj',
      };

      fetchMock.mockResponse(JSON.stringify(mockResponse), {
        headers: { 'content-type': 'application/json' },
      });

      const result = await supadata.youtube.channel({ id: channelId });

      expect(result).toEqual(mockResponse);
      expect(fetchMock).toHaveBeenCalledWith(
        `https://api.supadata.ai/v1/youtube/channel?id=${channelId}`,
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'x-api-key': 'test-api-key',
            'Content-Type': 'application/json',
            'User-Agent': expect.stringContaining('supadata-js'),
          }),
        })
      );
    });

    it("should throw error when channel doesn't exist", async () => {
      const channelId = 'UCsBjURrPoezyLs9EqgamOA';
      const mockResponse = {
        error: 'not-found',
        message: 'The requested item could not be found',
        details: 'The requested item could not be found.',
      };

      fetchMock.mockResponseOnce(JSON.stringify(mockResponse), {
        status: 404,
        headers: { 'content-type': 'application/json' },
      });

      await expect(supadata.youtube.channel({ id: channelId })).rejects.toThrow(
        'The requested item could not be found'
      );
    });

    it('should get a list of videos in the channel without limit', async () => {
      const channelId = 'UCsBjURrPoezyLs9EqgamOA';
      const mockResponse = {
        videoIds: ['PQ2WjtaPfXU', 'UIVADiGfwWc'],
      };

      fetchMock.mockResponse(JSON.stringify(mockResponse), {
        headers: { 'content-type': 'application/json' },
      });

      const result = await supadata.youtube.channel.videos({ id: channelId });

      expect(result).toEqual(mockResponse);
      expect(fetchMock).toHaveBeenCalledWith(
        `https://api.supadata.ai/v1/youtube/channel/videos?id=${channelId}`,
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'x-api-key': 'test-api-key',
            'Content-Type': 'application/json',
            'User-Agent': expect.stringContaining('supadata-js'),
          }),
        })
      );
    });

    it('should get a list of videos in the channel with limit', async () => {
      const channelId = 'UCsBjURrPoezyLs9EqgamOA';
      const mockResponse = {
        videoIds: ['PQ2WjtaPfXU', 'UIVADiGfwWc'],
      };

      fetchMock.mockResponse(JSON.stringify(mockResponse), {
        headers: { 'content-type': 'application/json' },
      });

      const limit = 2;
      const result = await supadata.youtube.channel.videos({
        id: channelId,
        limit: limit,
      });

      expect(result).toEqual(mockResponse);
      expect(fetchMock).toHaveBeenCalledWith(
        `https://api.supadata.ai/v1/youtube/channel/videos?id=${channelId}&limit=${limit}`,
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'x-api-key': 'test-api-key',
            'Content-Type': 'application/json',
            'User-Agent': expect.stringContaining('supadata-js'),
          }),
        })
      );
    });

    it("should throw error when channel doesn't exist", async () => {
      const channelId = 'UCsBjURrPoezyLs9EqgamOA';
      const mockResponse = {
        error: 'not-found',
        message: 'The requested item could not be found',
        details: 'The requested item could not be found.',
      };

      fetchMock.mockResponseOnce(JSON.stringify(mockResponse), {
        status: 404,
        headers: { 'content-type': 'application/json' },
      });

      await expect(
        supadata.youtube.channel.videos({ id: channelId })
      ).rejects.toThrow('The requested item could not be found');
    });

    it('should throw an error with invalid limit', async () => {
      await expect(
        supadata.youtube.channel.videos({ id: 'test-id', limit: 0 })
      ).rejects.toThrow('Invalid limit for operation.');

      await expect(
        supadata.youtube.channel.videos({ id: 'test-id', limit: -1 })
      ).rejects.toThrow('Invalid limit for operation.');

      await expect(
        supadata.youtube.channel.videos({ id: 'test-id', limit: 10000 })
      ).rejects.toThrow('Invalid limit for operation.');
    });

    it('should get the playlist info', async () => {
      const playlistId = 'PL0vfts4VzfNjQOM9VClyL5R0LeuTxlAR3';
      const mockResponse = {
        id: playlistId,
        title: 'CS101',
        videoCount: 17,
        viewCount: 440901,
        lastUpdated: '2024-07-06T00:00:00.000Z',
        channel: { id: 'UCsBjURrPoezykLs9EqgamOA', name: 'Fireship' },
      };

      fetchMock.mockResponse(JSON.stringify(mockResponse), {
        headers: { 'content-type': 'application/json' },
      });

      const result = await supadata.youtube.playlist({ id: playlistId });

      expect(result).toEqual(mockResponse);
      expect(fetchMock).toHaveBeenCalledWith(
        `https://api.supadata.ai/v1/youtube/playlist?id=${playlistId}`,
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'x-api-key': 'test-api-key',
            'Content-Type': 'application/json',
            'User-Agent': expect.stringContaining('supadata-js'),
          }),
        })
      );
    });

    it("should throw error when playlist doesn't exist", async () => {
      const playlistId = 'PL0vfts4VzfNjQOM9VClyL50LeuTxlAR3';
      const mockResponse = {
        error: 'not-found',
        message: 'The requested item could not be found',
        details: 'The requested item could not be found.',
      };

      fetchMock.mockResponseOnce(JSON.stringify(mockResponse), {
        status: 404,
        headers: { 'content-type': 'application/json' },
      });

      await expect(
        supadata.youtube.playlist({ id: playlistId })
      ).rejects.toThrow('The requested item could not be found');
    });

    it('should get a list of videos in the playlist without limit', async () => {
      const playlistId = 'PL0vfts4VzfNjQOM9VClyL5R0LeuTxlAR3';
      const mockResponse = {
        videoIds: ['PQ2WjtaPfXU', 'UIVADiGfwWc'],
      };

      fetchMock.mockResponse(JSON.stringify(mockResponse), {
        headers: { 'content-type': 'application/json' },
      });

      const result = await supadata.youtube.playlist.videos({ id: playlistId });

      expect(result).toEqual(mockResponse);
      expect(fetchMock).toHaveBeenCalledWith(
        `https://api.supadata.ai/v1/youtube/playlist/videos?id=${playlistId}`,
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'x-api-key': 'test-api-key',
            'Content-Type': 'application/json',
            'User-Agent': expect.stringContaining('supadata-js'),
          }),
        })
      );
    });

    it('should get a list of videos in the playlist with limit', async () => {
      const playlistId = 'PL0vfts4VzfNjQOM9VClyL5R0LeuTxlAR3';
      const mockResponse = {
        videoIds: ['PQ2WjtaPfXU', 'UIVADiGfwWc'],
      };

      fetchMock.mockResponse(JSON.stringify(mockResponse), {
        headers: { 'content-type': 'application/json' },
      });

      const limit = 2;
      const result = await supadata.youtube.playlist.videos({
        id: playlistId,
        limit: limit,
      });

      expect(result).toEqual(mockResponse);
      expect(fetchMock).toHaveBeenCalledWith(
        `https://api.supadata.ai/v1/youtube/playlist/videos?id=${playlistId}&limit=${limit}`,
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'x-api-key': 'test-api-key',
            'Content-Type': 'application/json',
            'User-Agent': expect.stringContaining('supadata-js'),
          }),
        })
      );
    });

    it("should throw error when playlist doesn't exist", async () => {
      const playlistId = 'PL0vfts4VzfNjQOM9VClyL50LeuTxlAR3';
      const mockResponse = {
        error: 'not-found',
        message: 'The requested item could not be found',
        details: 'The requested item could not be found.',
      };

      fetchMock.mockResponseOnce(JSON.stringify(mockResponse), {
        status: 404,
        headers: { 'content-type': 'application/json' },
      });

      await expect(
        supadata.youtube.playlist.videos({ id: playlistId })
      ).rejects.toThrow('The requested item could not be found');
    });

    it('should throw an error with invalid limit', async () => {
      await expect(
        supadata.youtube.playlist.videos({ id: 'test-id', limit: 0 })
      ).rejects.toThrow('Invalid limit for operation.');

      await expect(
        supadata.youtube.playlist.videos({ id: 'test-id', limit: -1 })
      ).rejects.toThrow('Invalid limit for operation.');

      await expect(
        supadata.youtube.playlist.videos({ id: 'test-id', limit: 10000 })
      ).rejects.toThrow('Invalid limit for operation.');
    });

    describe('Transcript Batch', () => {
      it('should start a transcript batch job with video IDs', async () => {
        const mockRequest = {
          videoIds: ['dQw4w9WgXcQ', 'xvFZjo5PgG0'],
          lang: 'en',
          text: true,
        };
        const mockResponse: YoutubeBatchJob = {
          jobId: '123e4567-e89b-12d3-a456-426614174000',
        };

        fetchMock.mockResponseOnce(JSON.stringify(mockResponse), {
          status: 200,
          headers: { 'content-type': 'application/json' },
        });

        const result = await supadata.youtube.transcript.batch(mockRequest);

        expect(result).toEqual(mockResponse);
        expect(fetchMock).toHaveBeenCalledWith(
          'https://api.supadata.ai/v1/youtube/transcript/batch',
          expect.objectContaining({
            method: 'POST',
            body: JSON.stringify(mockRequest),
          })
        );
      });

      it('should start a transcript batch job with playlist ID and limit', async () => {
        const mockRequest = {
          playlistId: 'PLlaN88a7y2_plecYoJxvRFTLHVbIVAOoc',
          limit: 20,
        };
        const mockResponse: YoutubeBatchJob = {
          jobId: '123e4567-e89b-12d3-a456-426614174001',
        };

        fetchMock.mockResponseOnce(JSON.stringify(mockResponse), {
          status: 200,
          headers: { 'content-type': 'application/json' },
        });

        const result = await supadata.youtube.transcript.batch(mockRequest);

        expect(result).toEqual(mockResponse);
        expect(fetchMock).toHaveBeenCalledWith(
          'https://api.supadata.ai/v1/youtube/transcript/batch',
          expect.objectContaining({
            method: 'POST',
            body: JSON.stringify(mockRequest),
          })
        );
      });

      it('should throw error for transcript batch job with invalid limit', async () => {
        const mockRequest = {
          playlistId: 'some-playlist',
          limit: 0, // Invalid limit
        };

        await expect(
          supadata.youtube.transcript.batch(mockRequest)
        ).rejects.toThrow('Invalid limit for batch operation.');
        expect(fetchMock).not.toHaveBeenCalled();
      });
    });

    describe('Video Batch', () => {
      it('should start a video metadata batch job with channel ID', async () => {
        const mockRequest = {
          channelId: 'UC_9-kyTW8ZkZNDHQJ6FgpwQ',
        };
        const mockResponse: YoutubeBatchJob = {
          jobId: '123e4567-e89b-12d3-a456-426614174002',
        };

        fetchMock.mockResponseOnce(JSON.stringify(mockResponse), {
          status: 200,
          headers: { 'content-type': 'application/json' },
        });

        const result = await supadata.youtube.video.batch(mockRequest);

        expect(result).toEqual(mockResponse);
        expect(fetchMock).toHaveBeenCalledWith(
          'https://api.supadata.ai/v1/youtube/video/batch',
          expect.objectContaining({
            method: 'POST',
            body: JSON.stringify(mockRequest),
          })
        );
      });

      it('should throw error for video batch job with invalid limit', async () => {
        const mockRequest = {
          channelId: 'some-channel',
          limit: 5001, // Invalid limit
        };

        await expect(supadata.youtube.video.batch(mockRequest)).rejects.toThrow(
          'Invalid limit for batch operation.'
        );
        expect(fetchMock).not.toHaveBeenCalled();
      });
    });

    describe('General Batch Operations', () => {
      it('should get batch results', async () => {
        const jobId = '123e4567-e89b-12d3-a456-426614174000';
        const mockResponse: YoutubeBatchResults = {
          status: 'completed',
          results: [],
          stats: { total: 0, succeeded: 0, failed: 0 },
        };

        fetchMock.mockResponseOnce(JSON.stringify(mockResponse), {
          status: 200,
          headers: { 'content-type': 'application/json' },
        });

        const result = await supadata.youtube.batch.getBatchResults(jobId);

        expect(result).toEqual(mockResponse);
        expect(fetchMock).toHaveBeenCalledWith(
          `https://api.supadata.ai/v1/youtube/batch/${jobId}`,
          expect.objectContaining({
            method: 'GET',
          })
        );
      });

      it('should throw error when getting batch results with no jobId', async () => {
        await expect(
          supadata.youtube.batch.getBatchResults('')
        ).rejects.toThrow('Missing jobId');
        expect(fetchMock).not.toHaveBeenCalled();
      });
    });

    describe('search', () => {
      it('should search YouTube with query only', async () => {
        const mockResponse: YoutubeSearchResponse = {
          query: 'rick astley never gonna give you up',
          results: [
            {
              type: 'video',
              id: 'dQw4w9WgXcQ',
              title: 'Rick Astley - Never Gonna Give You Up (Official Video)',
              description:
                'The official video for "Never Gonna Give You Up" by Rick Astley...',
              thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
              duration: 213,
              viewCount: 1400000000,
              uploadDate: '2009-10-25T00:00:00.000Z',
              channel: {
                id: 'UCuAXFkgsw1L7xaCfnd5JJOw',
                name: 'Rick Astley',
              },
            },
          ],
          totalResults: 1000,
          nextPageToken: 'CAoQAA',
        };

        fetchMock.mockResponseOnce(JSON.stringify(mockResponse), {
          headers: { 'content-type': 'application/json' },
        });

        const result = await supadata.youtube.search({
          query: 'rick astley never gonna give you up',
        });

        expect(result).toEqual(mockResponse);
        expect(fetchMock).toHaveBeenCalledWith(
          'https://api.supadata.ai/v1/youtube/search?query=rick+astley+never+gonna+give+you+up',
          expect.objectContaining({
            method: 'GET',
            headers: expect.objectContaining({
              'x-api-key': 'test-api-key',
              'Content-Type': 'application/json',
              'User-Agent': expect.stringContaining('supadata-js'),
            }),
          })
        );
      });

      it('should search YouTube with all filters', async () => {
        const mockResponse: YoutubeSearchResponse = {
          query: 'programming tutorial',
          results: [
            {
              type: 'video',
              id: 'abc123',
              title: 'Python Programming Tutorial',
              description: 'Learn Python programming...',
              thumbnail: 'https://i.ytimg.com/vi/abc123/maxresdefault.jpg',
              duration: 600,
              viewCount: 100000,
              uploadDate: '2024-01-01T00:00:00.000Z',
              channel: {
                id: 'channel123',
                name: 'Tech Channel',
              },
            },
          ],
          totalResults: 500,
          nextPageToken: 'CDIQAA',
        };

        fetchMock.mockResponseOnce(JSON.stringify(mockResponse), {
          headers: { 'content-type': 'application/json' },
        });

        const result = await supadata.youtube.search({
          query: 'programming tutorial',
          type: 'video',
          uploadDate: 'month',
          duration: 'medium',
          sortBy: 'views',
          limit: 20,
          features: ['HD', 'Subtitles'],
          nextPageToken: 'CAoQAA',
        });

        expect(result).toEqual(mockResponse);
        expect(fetchMock).toHaveBeenCalledWith(
          'https://api.supadata.ai/v1/youtube/search?query=programming+tutorial&type=video&uploadDate=month&duration=medium&sortBy=views&limit=20&features=HD&features=Subtitles&nextPageToken=CAoQAA',
          expect.objectContaining({
            method: 'GET',
            headers: expect.objectContaining({
              'x-api-key': 'test-api-key',
              'Content-Type': 'application/json',
              'User-Agent': expect.stringContaining('supadata-js'),
            }),
          })
        );
      });

      it('should search and return channel results', async () => {
        const mockResponse: YoutubeSearchResponse = {
          query: 'fireship',
          results: [
            {
              type: 'channel',
              id: 'UCsBjURrPoezykLs9EqgamOA',
              name: 'Fireship',
              handle: '@Fireship',
              description:
                'High-intensity code tutorials to help you build & ship your app faster...',
              thumbnail:
                'https://yt3.googleusercontent.com/ytc/channel_thumbnail',
              subscriberCount: 2000000,
              videoCount: 500,
            },
          ],
          totalResults: 10,
        };

        fetchMock.mockResponseOnce(JSON.stringify(mockResponse), {
          headers: { 'content-type': 'application/json' },
        });

        const result = await supadata.youtube.search({
          query: 'fireship',
          type: 'channel',
        });

        expect(result).toEqual(mockResponse);
      });

      it('should search and return playlist results', async () => {
        const mockResponse: YoutubeSearchResponse = {
          query: 'javascript tutorials',
          results: [
            {
              type: 'playlist',
              id: 'PLrAXtmErZgOdP_8GztsuRmjqMA_WbZkrH',
              title: 'JavaScript Full Course',
              description: 'Complete JavaScript tutorial playlist...',
              thumbnail:
                'https://i.ytimg.com/vi/playlist_thumbnail/maxresdefault.jpg',
              videoCount: 50,
              channel: {
                id: 'channel456',
                name: 'Code Academy',
              },
            },
          ],
          totalResults: 100,
        };

        fetchMock.mockResponseOnce(JSON.stringify(mockResponse), {
          headers: { 'content-type': 'application/json' },
        });

        const result = await supadata.youtube.search({
          query: 'javascript tutorials',
          type: 'playlist',
        });

        expect(result).toEqual(mockResponse);
      });

      it('should throw error when query is missing', async () => {
        await expect(supadata.youtube.search({} as any)).rejects.toThrow(
          'Missing query parameter'
        );
        expect(fetchMock).not.toHaveBeenCalled();
      });

      it('should throw error when limit is invalid', async () => {
        await expect(
          supadata.youtube.search({
            query: 'test',
            limit: 10000,
          })
        ).rejects.toThrow('Invalid limit for search.');
        expect(fetchMock).not.toHaveBeenCalled();

        await expect(
          supadata.youtube.search({
            query: 'test',
            limit: 0,
          })
        ).rejects.toThrow('Invalid limit for search.');
        expect(fetchMock).not.toHaveBeenCalled();
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
          headers: expect.objectContaining({
            'x-api-key': 'test-api-key',
            'Content-Type': 'application/json',
            'User-Agent': expect.stringContaining('supadata-js'),
          }),
        })
      );
    });

    it('should map website', async () => {
      const mockResponse: SiteMap = {
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
          headers: expect.objectContaining({
            'x-api-key': 'test-api-key',
            'Content-Type': 'application/json',
            'User-Agent': expect.stringContaining('supadata-js'),
          }),
        })
      );
    });
  });

  describe('Transcript Service', () => {
    it('should get transcript directly (synchronous response)', async () => {
      const mockResponse: Transcript = {
        content: [
          { text: 'Hello world', offset: 0, duration: 1000, lang: 'en' },
        ],
        lang: 'en',
        availableLangs: ['en', 'es'],
      };

      fetchMock.mockResponseOnce(JSON.stringify(mockResponse), {
        headers: { 'content-type': 'application/json' },
      });

      const result = await supadata.transcript({
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        lang: 'en',
        text: false,
      });

      expect(result).toEqual(mockResponse);
      expect(fetchMock).toHaveBeenCalledWith(
        'https://api.supadata.ai/v1/transcript?url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DdQw4w9WgXcQ&lang=en&text=false',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'x-api-key': 'test-api-key',
            'Content-Type': 'application/json',
            'User-Agent': expect.stringContaining('supadata-js'),
          }),
        })
      );
    });

    it('should get job id for async processing', async () => {
      const mockResponse: JobId = {
        jobId: '123e4567-e89b-12d3-a456-426614174000',
      };

      fetchMock.mockResponseOnce(JSON.stringify(mockResponse), {
        headers: { 'content-type': 'application/json' },
      });

      const result = await supadata.transcript({
        url: 'https://www.tiktok.com/@user/video/1234567890',
        mode: 'generate',
      });

      expect(result).toEqual(mockResponse);
      expect(fetchMock).toHaveBeenCalledWith(
        'https://api.supadata.ai/v1/transcript?url=https%3A%2F%2Fwww.tiktok.com%2F%40user%2Fvideo%2F1234567890&mode=generate',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'x-api-key': 'test-api-key',
            'Content-Type': 'application/json',
            'User-Agent': expect.stringContaining('supadata-js'),
          }),
        })
      );
    });

    it('should get transcript with all parameters', async () => {
      const mockResponse: Transcript = {
        content: 'Hello world transcript',
        lang: 'en',
        availableLangs: ['en'],
      };

      fetchMock.mockResponseOnce(JSON.stringify(mockResponse), {
        headers: { 'content-type': 'application/json' },
      });

      const result = await supadata.transcript({
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        lang: 'en',
        text: true,
        chunkSize: 500,
        mode: 'auto',
      });

      expect(result).toEqual(mockResponse);
      expect(fetchMock).toHaveBeenCalledWith(
        'https://api.supadata.ai/v1/transcript?url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DdQw4w9WgXcQ&lang=en&text=true&chunkSize=500&mode=auto',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'x-api-key': 'test-api-key',
            'Content-Type': 'application/json',
            'User-Agent': expect.stringContaining('supadata-js'),
          }),
        })
      );
    });

    it('should get job status when job is completed', async () => {
      const jobId = '123e4567-e89b-12d3-a456-426614174000';
      const mockResponse: JobResult<Transcript> = {
        status: 'completed',
        result: {
          content: [
            {
              text: 'Completed transcript',
              offset: 0,
              duration: 1000,
              lang: 'en',
            },
          ],
          lang: 'en',
          availableLangs: ['en'],
        },
        error: null,
      };

      fetchMock.mockResponseOnce(JSON.stringify(mockResponse), {
        headers: { 'content-type': 'application/json' },
      });

      const result = await supadata.transcript.getJobStatus(jobId);

      expect(result).toEqual(mockResponse);
      expect(fetchMock).toHaveBeenCalledWith(
        `https://api.supadata.ai/v1/transcript/${jobId}`,
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'x-api-key': 'test-api-key',
            'Content-Type': 'application/json',
            'User-Agent': expect.stringContaining('supadata-js'),
          }),
        })
      );
    });

    it('should get job status when job is still active', async () => {
      const jobId = '123e4567-e89b-12d3-a456-426614174001';
      const mockResponse: JobResult<Transcript> = {
        status: 'active',
        result: null,
        error: null,
      };

      fetchMock.mockResponseOnce(JSON.stringify(mockResponse), {
        headers: { 'content-type': 'application/json' },
      });

      const result = await supadata.transcript.getJobStatus(jobId);

      expect(result).toEqual(mockResponse);
      expect(fetchMock).toHaveBeenCalledWith(
        `https://api.supadata.ai/v1/transcript/${jobId}`,
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'x-api-key': 'test-api-key',
            'Content-Type': 'application/json',
            'User-Agent': expect.stringContaining('supadata-js'),
          }),
        })
      );
    });

    it('should get job status when job failed', async () => {
      const jobId = '123e4567-e89b-12d3-a456-426614174002';
      const mockResponse: JobResult<Transcript> = {
        status: 'failed',
        result: null,
        error: {
          error: 'transcript-unavailable',
          message: 'Transcript not available',
          details: 'The video does not have a transcript available',
        },
      };

      fetchMock.mockResponseOnce(JSON.stringify(mockResponse), {
        headers: { 'content-type': 'application/json' },
      });

      const result = await supadata.transcript.getJobStatus(jobId);

      expect(result).toEqual(mockResponse);
      expect(fetchMock).toHaveBeenCalledWith(
        `https://api.supadata.ai/v1/transcript/${jobId}`,
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'x-api-key': 'test-api-key',
            'Content-Type': 'application/json',
            'User-Agent': expect.stringContaining('supadata-js'),
          }),
        })
      );
    });

    it('should throw error when getting job status with no jobId', async () => {
      await expect(supadata.transcript.getJobStatus('')).rejects.toThrow(
        'Missing jobId'
      );
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it('should handle API errors', async () => {
      const mockResponse = {
        error: 'not-found',
        message: 'Video not found',
        details: 'The specified video could not be found',
      };

      fetchMock.mockResponseOnce(JSON.stringify(mockResponse), {
        status: 404,
        headers: { 'content-type': 'application/json' },
      });

      await expect(
        supadata.transcript({
          url: 'https://www.youtube.com/watch?v=invalid',
        })
      ).rejects.toThrow('Video not found');
    });
  });

  it('should initialize with config', () => {
    expect(supadata).toBeInstanceOf(Supadata);
  });

  describe('Metadata Service', () => {
    it('should get metadata from YouTube video', async () => {
      const mockResponse: Metadata = {
        platform: 'youtube',
        type: 'video',
        id: 'dQw4w9WgXcQ',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        title: 'Rick Astley - Never Gonna Give You Up',
        description: 'Official music video for Never Gonna Give You Up',
        author: {
          username: 'RickAstleyVEVO',
          displayName: 'Rick Astley',
          avatarUrl: 'https://example.com/avatar.jpg',
          verified: true,
        },
        stats: {
          views: 1234567890,
          likes: 12345678,
          comments: 200000,
          shares: null,
        },
        media: {
          type: 'video',
          url: 'https://example.com/video.mp4',
          duration: 213,
          width: 1920,
          height: 1080,
          thumbnailUrl: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
        },
        tags: ['music', 'rick astley', '80s'],
        createdAt: '2009-10-25T00:00:00.000Z',
        additionalData: {},
      };

      fetchMock.mockResponseOnce(JSON.stringify(mockResponse), {
        headers: { 'content-type': 'application/json' },
      });

      const result = await supadata.metadata({
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      });

      expect(result).toEqual(mockResponse);
      expect(fetchMock).toHaveBeenCalledWith(
        'https://api.supadata.ai/v1/metadata?url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DdQw4w9WgXcQ',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'x-api-key': 'test-api-key',
            'Content-Type': 'application/json',
            'User-Agent': expect.stringContaining('supadata-js'),
          }),
        })
      );
    });

    it('should get metadata from TikTok video', async () => {
      const mockResponse: Metadata = {
        platform: 'tiktok',
        type: 'video',
        id: '1234567890',
        url: 'https://www.tiktok.com/@user/video/1234567890',
        title: null,
        description: 'Amazing video #trending',
        author: {
          username: 'user',
          displayName: 'Test User',
          avatarUrl: 'https://example.com/avatar.jpg',
          verified: false,
        },
        stats: {
          views: 1000000,
          likes: 50000,
          comments: 1500,
          shares: 2000,
        },
        media: {
          type: 'video',
          url: 'https://example.com/tiktok-video.mp4',
          duration: 15,
          width: 720,
          height: 1280,
          thumbnailUrl: 'https://example.com/thumbnail.jpg',
        },
        tags: ['trending', 'viral'],
        createdAt: '2024-01-15T12:00:00.000Z',
        additionalData: {},
      };

      fetchMock.mockResponseOnce(JSON.stringify(mockResponse), {
        headers: { 'content-type': 'application/json' },
      });

      const result = await supadata.metadata({
        url: 'https://www.tiktok.com/@user/video/1234567890',
      });

      expect(result).toEqual(mockResponse);
      expect(result.platform).toBe('tiktok');
    });

    it('should get metadata from Instagram post', async () => {
      const mockResponse: Metadata = {
        platform: 'instagram',
        type: 'image',
        id: 'ABC123',
        url: 'https://www.instagram.com/p/ABC123/',
        title: null,
        description: 'Beautiful sunset 🌅',
        author: {
          username: 'photographer',
          displayName: 'Pro Photographer',
          avatarUrl: 'https://example.com/avatar.jpg',
          verified: true,
        },
        stats: {
          views: null,
          likes: 25000,
          comments: 500,
          shares: null,
        },
        media: {
          type: 'image',
          url: 'https://example.com/image.jpg',
          width: 1080,
          height: 1080,
        },
        tags: ['sunset', 'photography'],
        createdAt: '2024-02-10T18:30:00.000Z',
        additionalData: {},
      };

      fetchMock.mockResponseOnce(JSON.stringify(mockResponse), {
        headers: { 'content-type': 'application/json' },
      });

      const result = await supadata.metadata({
        url: 'https://www.instagram.com/p/ABC123/',
      });

      expect(result).toEqual(mockResponse);
      expect(result.platform).toBe('instagram');
      expect(result.type).toBe('image');
    });

    it('should get metadata from Twitter/X post', async () => {
      const mockResponse: Metadata = {
        platform: 'twitter',
        type: 'post',
        id: '1234567890123456789',
        url: 'https://twitter.com/user/status/1234567890123456789',
        title: null,
        description: null,
        author: {
          username: 'elonmusk',
          displayName: 'Elon Musk',
          avatarUrl: 'https://example.com/avatar.jpg',
          verified: true,
        },
        stats: {
          views: 5000000,
          likes: 100000,
          comments: 5000,
          shares: 10000,
        },
        media: {
          type: 'post',
          text: 'This is a tweet',
        },
        tags: [],
        createdAt: '2024-03-01T10:00:00.000Z',
        additionalData: {},
      };

      fetchMock.mockResponseOnce(JSON.stringify(mockResponse), {
        headers: { 'content-type': 'application/json' },
      });

      const result = await supadata.metadata({
        url: 'https://twitter.com/user/status/1234567890123456789',
      });

      expect(result).toEqual(mockResponse);
      expect(result.platform).toBe('twitter');
      expect(result.type).toBe('post');
    });

    it('should handle carousel media type', async () => {
      const mockResponse: Metadata = {
        platform: 'instagram',
        type: 'carousel',
        id: 'CAROUSEL123',
        url: 'https://www.instagram.com/p/CAROUSEL123/',
        title: null,
        description: 'Travel photos',
        author: {
          username: 'traveler',
          displayName: 'World Traveler',
          avatarUrl: 'https://example.com/avatar.jpg',
          verified: false,
        },
        stats: {
          views: null,
          likes: 15000,
          comments: 300,
          shares: null,
        },
        media: {
          type: 'carousel',
          items: [
            {
              type: 'image',
              url: 'https://example.com/image1.jpg',
              width: 1080,
              height: 1080,
            },
            {
              type: 'image',
              url: 'https://example.com/image2.jpg',
              width: 1080,
              height: 1080,
            },
          ],
        },
        tags: ['travel', 'adventure'],
        createdAt: '2024-04-15T14:00:00.000Z',
        additionalData: {},
      };

      fetchMock.mockResponseOnce(JSON.stringify(mockResponse), {
        headers: { 'content-type': 'application/json' },
      });

      const result = await supadata.metadata({
        url: 'https://www.instagram.com/p/CAROUSEL123/',
      });

      expect(result).toEqual(mockResponse);
      expect(result.type).toBe('carousel');
      expect(result.media.type).toBe('carousel');
    });

    it('should throw error when metadata not found', async () => {
      const mockResponse = {
        error: 'not-found',
        message: 'The requested item could not be found',
        details: 'The specified URL does not exist or is not accessible',
      };

      fetchMock.mockResponseOnce(JSON.stringify(mockResponse), {
        status: 404,
        headers: { 'content-type': 'application/json' },
      });

      await expect(
        supadata.metadata({
          url: 'https://www.youtube.com/watch?v=INVALID',
        })
      ).rejects.toThrow('The requested item could not be found');
    });
  });
});
