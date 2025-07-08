import { BaseClient } from '../client.js';
import { CrawlJob, CrawlRequest, JobId, Scrape, SiteMap } from '../types.js';

export class WebService extends BaseClient {
  /**
   * Extract content from any web page to Markdown format.
   *
   * @param url - URL of the webpage to scrape
   * @returns A promise that resolves to the scraped content
   */
  async scrape(url: string): Promise<Scrape> {
    return this.fetch<Scrape>('/web/scrape', { url });
  }

  /**
   * Extract all links found on a webpage.
   *
   * @param url - URL of the webpage to map
   * @returns A promise that resolves to a map of URLs found on the page
   */
  async map(url: string): Promise<SiteMap> {
    return this.fetch<SiteMap>('/web/map', { url });
  }

  /**
   * Create a crawl job to extract content from all pages on a website.
   *
   * @param request - Crawl request parameters
   * @param request.url - URL of the website to crawl
   * @param request.limit - Maximum number of pages to crawl (default: 100, max: 5000)
   * @returns A promise that resolves to the crawl job id
   */
  async crawl(request: CrawlRequest): Promise<JobId> {
    return this.fetch<JobId>('/web/crawl', request, 'POST');
  }

  /**
   * Get the status and results of a crawl job.
   * Automatically handles pagination to retrieve all pages from the crawl.
   *
   * @param jobId - The ID of the crawl job to retrieve
   * @returns A promise that resolves to the complete crawl job results
   */
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
