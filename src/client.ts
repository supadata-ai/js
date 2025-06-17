import { SupadataConfig, SupadataError } from './types.js';

export class BaseClient {
  protected config: SupadataConfig;

  constructor(config: SupadataConfig) {
    this.config = config;
  }

  protected async fetch<T>(
    endpoint: string,
    params: Record<string, any> = {},
    method: 'GET' | 'POST' = 'GET'
  ): Promise<T> {
    const baseUrl = this.config.baseUrl || 'https://api.supadata.ai/v1';
    let url = `${baseUrl}${
      endpoint.startsWith('/') ? endpoint : `/${endpoint}`
    }`;

    if (method === 'GET' && Object.keys(params).length > 0) {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
      url += `?${queryParams.toString()}`;
    }

    return this.fetchUrl<T>(url, method, params);
  }

  protected async fetchUrl<T>(
    url: string,
    method: 'GET' | 'POST' = 'GET',
    body?: Record<string, any>
  ): Promise<T> {
    const options: RequestInit = {
      method,
      headers: {
        'x-api-key': this.config.apiKey,
        'Content-Type': 'application/json',
      },
    };

    if (method === 'POST' && body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);

    const contentType = response.headers.get('content-type');

    if (!response.ok) {
      // Handle standard API errors
      if (contentType?.includes('application/json')) {
        const errorData = await response.json();
        throw new SupadataError(errorData);
      } else {
        // Fallback for unexpected non-JSON errors
        throw new SupadataError({
          error: 'internal-error',
          message: 'Unexpected error response format',
          details: await response.text(),
        });
      }
    }

    try {
      if (!contentType?.includes('application/json')) {
        throw new SupadataError({
          error: 'internal-error',
          message: 'Invalid response format',
          details: 'Expected JSON response but received different content type',
        });
      }

      return (await response.json()) as T;
    } catch (error) {
      throw new SupadataError({
        error: 'internal-error',
        message: 'Failed to parse response',
        details: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}
