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
