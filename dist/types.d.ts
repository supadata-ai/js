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
export interface Error {
    code: 'invalid-request' | 'missing-parameters' | 'internal-error' | 'transcript-unavailable' | 'video-not-found' | 'video-id-invalid' | 'youtube-api-error' | 'quota-exceeded' | 'rate-limit-exceeded';
    title: string;
    description: string;
    documentationUrl: string;
}
