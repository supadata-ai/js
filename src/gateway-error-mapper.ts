import { SupadataError } from './types';

/*
The API gateway returns errors in text/plain content type. 
As a temporary workaround we're mapping them to SupadataError.
*/

const GATEWAY_ERROR_PATTERNS = {
  'endpoint is not configured': {
    error: 'invalid-request' as const,
    message: 'The requested endpoint is not configured',
    details: 'The API endpoint you are trying to access does not exist',
  },
  'No valid access key found': {
    error: 'invalid-request' as const,
    message: 'Invalid or missing API key',
    details: 'Please ensure you have provided a valid API key',
  },
  'quota exceeded': {
    error: 'quota-exceeded' as const,
    message: 'API quota exceeded',
    details: 'You have exceeded your API quota for the current period',
  },
};

export const mapGatewayError = (
  statusCode: number,
  errorText: string
): SupadataError => {
  const matchedError = Object.entries(GATEWAY_ERROR_PATTERNS).find(
    ([pattern]) => errorText.includes(pattern)
  );

  if (matchedError) {
    return new SupadataError(matchedError[1]);
  }

  // Default error if no pattern matches
  return new SupadataError({
    error: 'internal-error',
    message: 'An unexpected error occurred',
    details: errorText,
  });
};
