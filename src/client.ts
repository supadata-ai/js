import { SupadataConfig, SupadataError } from './types.js';
import { mapGatewayError } from './gateway-error-mapper.js';

export class BaseClient {
  protected config: SupadataConfig;

  constructor(config: SupadataConfig) {
    this.config = config;
  }

  async fetch<T>(
    endpoint: string,
    params: Record<string, unknown> | object
  ): Promise<T> {
    const baseUrl = this.config.baseUrl || 'https://api.supadata.ai/v1';
    let url = `${baseUrl}${
      endpoint.startsWith('/') ? endpoint : `/${endpoint}`
    }`;

    if (params) {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
      url += `?${queryParams.toString()}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-api-key': this.config.apiKey,
        'Content-Type': 'application/json',
      },
    });

    const contentType = response.headers.get('content-type');

    if (!response.ok) {
      if (contentType?.includes('application/json')) {
        const errorData = await response.json();
        throw new SupadataError(errorData);
      } else {
        const errorText = await response.text();
        throw mapGatewayError(response.status, errorText);
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
