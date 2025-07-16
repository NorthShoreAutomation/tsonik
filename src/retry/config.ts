/**
 * Retry configuration for HTTP requests
 */

export interface RetryConfig {
  /** Number of retry attempts (default: 3) */
  attempts?: number;
  
  /** Enable/disable retry functionality (default: true) */
  enabled?: boolean;
  
  /** Minimum delay between retries in ms (default: 100) */
  minDelay?: number;
  
  /** Maximum delay between retries in ms (default: 30000) */
  maxDelay?: number;
  
  /** Exponential backoff factor (default: 2) */
  factor?: number;
  
  /** Add randomization to delay (default: 0.1) */
  randomize?: number;
  
  /** HTTP status codes to retry on (default: safe server errors) */
  retryOnStatus?: number[];
  
  /** HTTP methods to retry (default: ['GET', 'HEAD', 'OPTIONS']) */
  retryOnMethods?: string[];
  
  /** Network error codes to retry on */
  retryOnNetworkErrors?: string[];
  
  /** Custom retry condition function */
  shouldRetry?: (error: unknown, attemptNumber: number) => boolean;
}

export const DEFAULT_RETRY_CONFIG: Required<RetryConfig> = {
  attempts: 3,
  enabled: true,
  minDelay: 100,
  maxDelay: 30000,
  factor: 2,
  randomize: 0.1,
  
  // Safe HTTP status codes to retry on
  retryOnStatus: [
    408, // Request Timeout
    429, // Too Many Requests
    500, // Internal Server Error
    502, // Bad Gateway
    503, // Service Unavailable
    504, // Gateway Timeout
    520, // Web Server Returned an Unknown Error
    521, // Web Server Is Down
    522, // Connection Timed Out
    523, // Origin Is Unreachable
    524, // A Timeout Occurred
  ],
  
  // Only retry safe HTTP methods by default
  retryOnMethods: ['GET', 'HEAD', 'OPTIONS'],
  
  // Network error codes that are safe to retry
  retryOnNetworkErrors: [
    'ECONNRESET',
    'ENOTFOUND', 
    'ECONNREFUSED',
    'ETIMEDOUT',
    'ECONNABORTED',
    'EHOSTUNREACH',
    'ENETUNREACH',
    'EAI_AGAIN',
  ],
  
  // Default retry condition (can be overridden)
  shouldRetry: () => true,
};

/**
 * Merge user config with defaults
 */
export function mergeRetryConfig(userConfig: RetryConfig = {}): Required<RetryConfig> {
  return {
    ...DEFAULT_RETRY_CONFIG,
    ...userConfig,
    retryOnStatus: userConfig.retryOnStatus ?? DEFAULT_RETRY_CONFIG.retryOnStatus,
    retryOnMethods: userConfig.retryOnMethods ?? DEFAULT_RETRY_CONFIG.retryOnMethods,
    retryOnNetworkErrors: userConfig.retryOnNetworkErrors ?? DEFAULT_RETRY_CONFIG.retryOnNetworkErrors,
  };
}