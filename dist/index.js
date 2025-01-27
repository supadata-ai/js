import { YouTubeService } from './services/youtube.js';
import { WebService } from './services/web.js';
export * from './types.js';
export * from './client.js';
export * from './services/youtube.js';
export * from './services/web.js';
export class Supadata {
    youtube;
    web;
    constructor(config) {
        this.youtube = new YouTubeService(config);
        this.web = new WebService(config);
    }
}
