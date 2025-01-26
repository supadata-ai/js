"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebService = void 0;
const client_1 = require("../client");
class WebService extends client_1.BaseClient {
    async scrape(url) {
        const response = await this.client.get('/web/scrape', { params: { url } });
        return response.data;
    }
    async map(url) {
        const response = await this.client.get('/web/map', { params: { url } });
        return response.data;
    }
}
exports.WebService = WebService;
