"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YouTubeService = void 0;
const client_1 = require("../client");
class YouTubeService extends client_1.BaseClient {
    async transcript(params) {
        const response = await this.client.get('/youtube/transcript', { params });
        return response.data;
    }
    async translate(params) {
        const response = await this.client.get('/youtube/transcript/translate', { params });
        return response.data;
    }
}
exports.YouTubeService = YouTubeService;
