import { SupadataConfig } from './types';
import { YouTubeService } from './services/youtube';
import { WebService } from './services/web';
export * from './types';
export * from './client';
export * from './services/youtube';
export * from './services/web';
export declare class Supadata {
    readonly youtube: YouTubeService;
    readonly web: WebService;
    constructor(config: SupadataConfig);
}
