import { BaseClient } from '../client.js';
export class WebService extends BaseClient {
    async scrape(url) {
        return this.fetch('/web/scrape', { url });
    }
    async map(url) {
        return this.fetch('/web/map', { url });
    }
}
