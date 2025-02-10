import { SupadataError } from './types';

/*
The API gateway returns errors in text/plain content type. 
As a temporary workaround we're mapping them to SupadataError.
*/

const GATEWAY_STATUS_ERRORS = {
  403: {
    error: 'invalid-request' as const,
    message: 'Invalid or missing API key',
    details: 'Please ensure you have provided a valid API key',
  },
  404: {
    error: 'invalid-request' as const,
    message: 'Endpoint does not exist',
    details: 'The API endpoint you are trying to access does not exist',
  },
  429: {
    error: 'limit-exceeded' as const,
    message: 'Limit exceeded',
    details: 'You have exceeded the allowed request rate or quota limits',
  },
};

export const mapGatewayError = (
  statusCode: number,
  errorText: string
): SupadataError => {
  if (statusCode in GATEWAY_STATUS_ERRORS) {
    return new SupadataError({
      ...GATEWAY_STATUS_ERRORS[
        statusCode as keyof typeof GATEWAY_STATUS_ERRORS
      ],
      message:
        GATEWAY_STATUS_ERRORS[statusCode as keyof typeof GATEWAY_STATUS_ERRORS]
          .message,
      details:
        errorText ||
        GATEWAY_STATUS_ERRORS[statusCode as keyof typeof GATEWAY_STATUS_ERRORS]
          .details,
    });
  }

  // Default error if status code is not recognized
  return new SupadataError({
    error: 'internal-error',
    message: 'An unexpected error occurred',
    details: errorText,
  });
};
