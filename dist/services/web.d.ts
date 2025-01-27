import { BaseClient } from '../client.js';
import { Scrape, Map } from '../types.js';
export declare class WebService extends BaseClient {
    scrape(url: string): Promise<Scrape>;
    map(url: string): Promise<Map>;
}
