import { BaseClient } from '../client.js';
import { Scrape, Map, CrawlRequest, Crawl, CrawlJob } from '../types.js';

export class WebService extends BaseClient {
  async scrape(url: string): Promise<Scrape> {
    return this.fetch<Scrape>('/web/scrape', { url });
  }

  async map(url: string): Promise<Map> {
    return this.fetch<Map>('/web/map', { url });
  }

  async crawl(request: CrawlRequest): Promise<Crawl> {
    return this.fetch<Crawl>('/web/crawl', request, 'POST');
  }

  async getCrawlResults(jobId: string): Promise<CrawlJob> {
    let response: CrawlJob;
    let pages: Scrape[] = [];
    let nextUrl: string | undefined;

    do {
      response = await (nextUrl
        ? this.fetchUrl<CrawlJob>(nextUrl)
        : this.fetch<CrawlJob>(`/web/crawl/${jobId}`));

      if (response.pages) {
        pages = [...pages, ...response.pages];
      }
      nextUrl = response.next;
    } while (nextUrl);

    return response;
  }
}
