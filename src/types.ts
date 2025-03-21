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

export interface YoutubeVideo {
  id: string;
  title: string;
  description: string;
  duration: number;
  channel: {
    id: string;
    name: string;
  }
  tags: string[];
  thumbnail: string;
  uploadDate: string;
  viewCount: number;
  likeCount: number;
  transcriptLanguages: string[];
}

export interface YoutubeChannel {
  id: string;
  name: string;
  handle: string
  description: string;
  subscriberCount: number;
  videoCount: number;
  thumbnail: string;
  banner: string;
}

export interface YoutubePlaylist {
  id: string;
  title: string;
  videoCount: number;
  viewCount: number;
  lastUpdated: string;
  description: string;
  thumbnail: string;
}