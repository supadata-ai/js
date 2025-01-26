import { BaseClient } from '../client.js';
import { Scrape, Map } from '../types.js';

export class WebService extends BaseClient {
  async scrape(url: string): Promise<Scrape> {
    return this.fetch<Scrape>('/web/scrape', { url });
  }

  async map(url: string): Promise<Map> {
    return this.fetch<Map>('/web/map', { url });
  }
}