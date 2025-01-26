import { BaseClient } from '../client';
import { Transcript, TranslatedTranscript } from '../types';
export interface TranscriptParams {
    videoId: string;
    lang?: string;
    text?: boolean;
}
export interface TranslateParams extends TranscriptParams {
    lang: string;
}
export declare class YouTubeService extends BaseClient {
    transcript(params: TranscriptParams): Promise<Transcript>;
    translate(params: TranslateParams): Promise<TranslatedTranscript>;
}
