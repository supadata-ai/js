import { SupadataConfig } from './types.js';
import { YouTubeService } from './services/youtube.js';
import { WebService } from './services/web.js';
export * from './types.js';
export * from './client.js';
export * from './services/youtube.js';
export * from './services/web.js';
export declare class Supadata {
    readonly youtube: YouTubeService;
    readonly web: WebService;
    constructor(config: SupadataConfig);
}
