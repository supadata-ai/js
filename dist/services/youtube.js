import { BaseClient } from "../client.js";
export class YouTubeService extends BaseClient {
    async transcript(params) {
        return this.fetch("/youtube/transcript", params);
    }
    async translate(params) {
        return this.fetch("/youtube/transcript/translate", params);
    }
}
