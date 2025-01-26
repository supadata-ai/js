import { SupadataConfig, Error } from './types.js';

export class BaseClient {
  protected config: SupadataConfig;

  constructor(config: SupadataConfig) {
    this.config = config;
  }

  protected async fetch<T>(path: string, params?: Record<string, string>): Promise<T> {
    const url = new URL(path, this.config.baseUrl || 'https://api.supadata.ai/v1');
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    const response = await fetch(url, {
      headers: {
        'x-api-key': this.config.apiKey,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      const error = data as Error;
      throw new SupadataError(error);
    }

    return data as T;
  }
}

export class SupadataError extends Error {
  code: Error['code'];
  title: string;
  documentationUrl: string;

  constructor(error: Error) {
    super(error.description);
    this.code = error.code;
    this.title = error.title;
    this.documentationUrl = error.documentationUrl;
  }
}