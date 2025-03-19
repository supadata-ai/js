export interface TranscriptChunk {
  text: string;
  offset: number;
  duration: number;
  lang: string;
}

export interface Transcript {
  content: TranscriptChunk[] | string;
  lang: string;
  availableLangs: string[];
}

export interface TranslatedTranscript {
  content: TranscriptChunk[] | string;
  lang: string;
}

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  channelId: string;
  channelTitle: string;
  thumbnails: {
    default?: string;
    medium?: string;
    high?: string;
    standard?: string;
    maxres?: string;
  };
  tags?: string[];
  categoryId?: string;
  duration?: string;
  viewCount?: number;
  likeCount?: number;
  commentCount?: number;
}

export interface YouTubeChannel {
  id: string;
  name: string;
  description: string;
  publishedAt?: string;
  thumbnails?: {
    default?: string;
    medium?: string;
    high?: string;
    standard?: string;
    maxres?: string;
  };
  thumbnail?: string;
  banner?: string;
  subscriberCount?: number;
  videoCount?: number;
  viewCount?: number;
  country?: string;
}

export interface YouTubePlaylist {
  id: string;
  title: string;
  description: string;
  videoCount?: number;
  viewCount?: number;
  lastUpdated?: string;
  channel?: {
    id: string;
    name: string;
  };
}

export interface YouTubeChannelVideos {
  videoIds: string[];
}

export interface YouTubePlaylistVideos {
  videoIds: string[];
}

export interface Scrape {
  url: string;
  content: string;
  name: string;
  description: string;
  ogUrl: string;
  countCharacters: number;
  urls: string[];
}

export interface Map {
  urls: string[];
}

export interface CrawlRequest {
  url: string;
  limit?: number;
}

export interface Crawl {
  jobId: string;
}

export interface CrawlJob {
  status: 'scraping' | 'completed' | 'failed' | 'cancelled';
  pages?: Scrape[];
  next?: string;
}

export interface SupadataConfig {
  apiKey: string;
  baseUrl?: string;
}

export class SupadataError extends Error {
  error:
    | 'invalid-request'
    | 'missing-parameters'
    | 'internal-error'
    | 'transcript-unavailable'
    | 'video-not-found'
    | 'video-id-invalid'
    | 'youtube-api-error'
    | 'limit-exceeded';
  details: string;
  documentationUrl: string;

  constructor(error: {
    error: SupadataError['error'];
    message?: string;
    details?: string;
    documentationUrl?: string;
  }) {
    super(error.message || 'An unexpected error occurred');
    this.error = error.error || 'internal-error';
    this.details = error.details || 'An unexpected error occurred';
    this.documentationUrl = error.documentationUrl || '';
    this.name = 'SupadataError';
  }
}
