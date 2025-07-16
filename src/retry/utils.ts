import pRetry, { AbortError } from 'p-retry';
import { AxiosError } from 'axios';
import { RetryConfig, mergeRetryConfig } from './config';

/**
 * Determine if an error should be retried based on configuration
 */
export function shouldRetryError(error: unknown, config: Required<RetryConfig>): boolean {
  // If retry is disabled, never retry
  if (!config.enabled) {
    return false;
  }
  
  // Check if it's an Axios error
  if (error && typeof error === 'object' && 'isAxiosError' in error && error.isAxiosError) {
    const axiosError = error as AxiosError;
    
    // Check HTTP status code
    if (axiosError.response?.status) {
      const status = axiosError.response.status;
      
      // Don't retry client errors (4xx) except for specific cases
      if (status >= 400 && status < 500) {
        return config.retryOnStatus.includes(status);
      }
      
      // Retry server errors (5xx) if configured
      if (status >= 500) {
        return config.retryOnStatus.includes(status);
      }
    }
    
    // Check network errors
    if (axiosError.code && config.retryOnNetworkErrors.includes(axiosError.code)) {
      return true;
    }
    
    // Check HTTP method
    const method = axiosError.config?.method?.toUpperCase();
    if (method && !config.retryOnMethods.includes(method)) {
      return false;
    }
  }
  
  // Check for common network error patterns
  if (error && typeof error === 'object' && 'code' in error && 
      typeof error.code === 'string' && config.retryOnNetworkErrors.includes(error.code)) {
    return true;
  }
  
  // Use custom retry condition if provided
  return config.shouldRetry(error, 0);
}

/**
 * Calculate delay for exponential backoff with jitter
 */
export function calculateDelay(
  attemptNumber: number,
  config: Required<RetryConfig>
): number {
  const exponentialDelay = config.minDelay * Math.pow(config.factor, attemptNumber - 1);
  const clampedDelay = Math.min(exponentialDelay, config.maxDelay);
  
  // Add jitter to prevent thundering herd
  const jitter = clampedDelay * config.randomize * Math.random();
  return Math.round(clampedDelay + jitter);
}

/**
 * Create a retry wrapper function for HTTP requests
 */
export function createRetryWrapper<T>(
  requestFn: () => Promise<T>,
  retryConfig: RetryConfig = {}
): Promise<T> {
  const config = mergeRetryConfig(retryConfig);
  
  if (!config.enabled) {
    return requestFn();
  }
  
  return pRetry(
    async (_attemptNumber: number) => {
      try {
        return await requestFn();
      } catch (error) {
        // Check if we should retry this error
        if (!shouldRetryError(error, config)) {
          // If we shouldn't retry, throw AbortError to stop retrying
          throw new AbortError(error as Error);
        }
        
        // Let p-retry handle the retry logic
        throw error;
      }
    },
    {
      retries: config.attempts,
      minTimeout: config.minDelay,
      maxTimeout: config.maxDelay,
      factor: config.factor,
      randomize: config.randomize > 0,
      onFailedAttempt: (error) => {
        // Optional: Add logging for failed attempts
        if (process.env.NODE_ENV !== 'production') {
          const requestInfo = extractRequestInfo(error);
          // eslint-disable-next-line no-console
          console.warn(
            `Retry attempt ${error.attemptNumber} failed. ${error.retriesLeft} retries left.`,
            {
              error: error.message,
              status: requestInfo.status,
              method: requestInfo.method,
              url: requestInfo.url,
            }
          );
        }
      },
    }
  );
}

/**
 * Extract request information for logging
 */
export function extractRequestInfo(error: unknown): {
  method?: string;
  url?: string;
  status?: number;
  code?: string;
} {
  if (error && typeof error === 'object' && 'isAxiosError' in error && error.isAxiosError) {
    const axiosError = error as AxiosError;
    return {
      method: axiosError.config?.method?.toUpperCase(),
      url: axiosError.config?.url,
      status: axiosError.response?.status,
      code: axiosError.code,
    };
  }
  
  return {
    code: error && typeof error === 'object' && 'code' in error ? 
      String(error.code) : undefined,
  };
}

/**
 * Create a retry configuration for specific use cases
 */
export const RetryPresets = {
  /**
   * Conservative retry for read operations
   */
  conservative: (): RetryConfig => ({
    attempts: 2,
    minDelay: 200,
    maxDelay: 10000,
    factor: 2,
    retryOnMethods: ['GET', 'HEAD', 'OPTIONS'],
  }),
  
  /**
   * Aggressive retry for critical operations
   */
  aggressive: (): RetryConfig => ({
    attempts: 5,
    minDelay: 100,
    maxDelay: 60000,
    factor: 2.5,
    retryOnMethods: ['GET', 'HEAD', 'OPTIONS', 'POST', 'PUT', 'PATCH'],
  }),
  
  /**
   * Rate limit specific retry
   */
  rateLimit: (): RetryConfig => ({
    attempts: 3,
    minDelay: 1000,
    maxDelay: 30000,
    factor: 3,
    retryOnStatus: [429], // Only retry rate limits
  }),
  
  /**
   * Network error specific retry
   */
  networkOnly: (): RetryConfig => ({
    attempts: 3,
    minDelay: 500,
    maxDelay: 15000,
    factor: 2,
    retryOnStatus: [], // Don't retry HTTP errors
  }),
};