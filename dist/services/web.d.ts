import { BaseClient } from '../client';
import { Scrape, Map } from '../types';
export declare class WebService extends BaseClient {
    scrape(url: string): Promise<Scrape>;
    map(url: string): Promise<Map>;
}
