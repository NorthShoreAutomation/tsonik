# Retry Configuration

Tsonik includes built-in automatic retry functionality for HTTP requests using the `p-retry` library. This feature provides intelligent retry logic with exponential backoff to handle temporary network issues and server errors gracefully.

## Default Behavior

By default, Tsonik automatically retries failed requests with these safe settings:

- **Retry Attempts**: 3 attempts (initial request + 2 retries)
- **HTTP Methods**: Only safe, idempotent methods (`GET`, `HEAD`, `OPTIONS`)
- **Status Codes**: Server errors and specific client errors that are safe to retry
- **Backoff Strategy**: Exponential backoff with jitter (100ms to 30s)
- **Network Errors**: Automatic retry on connection timeouts and DNS failures

## Safe Error Codes

### HTTP Status Codes
The following HTTP status codes are automatically retried:

```typescript
const safeStatusCodes = [
  408, // Request Timeout
  429, // Too Many Requests (Rate Limiting)
  500, // Internal Server Error
  502, // Bad Gateway
  503, // Service Unavailable
  504, // Gateway Timeout
  520, // Web Server Returned an Unknown Error
  521, // Web Server Is Down
  522, // Connection Timed Out
  523, // Origin Is Unreachable
  524, // A Timeout Occurred
];
```

### Network Error Codes
These network-level errors are automatically retried:

```typescript
const networkErrors = [
  'ECONNRESET',    // Connection reset by peer
  'ENOTFOUND',     // DNS lookup failed
  'ECONNREFUSED',  // Connection refused
  'ETIMEDOUT',     // Request timeout
  'ECONNABORTED',  // Connection aborted
  'EHOSTUNREACH',  // Host unreachable
  'ENETUNREACH',   // Network unreachable
  'EAI_AGAIN',     // DNS lookup timeout
];
```

## Basic Usage

### Default Configuration
```typescript
import { Tsonik } from 'tsonik';

const client = new Tsonik({
  appId: 'your-app-id',
  authToken: 'your-auth-token',
  // Retry is enabled by default with safe settings
});

// This GET request will automatically retry on failures
const assets = await client.assets.listAssets();
```

### Disabling Retry
```typescript
const client = new Tsonik({
  appId: 'your-app-id',
  authToken: 'your-auth-token',
  retry: {
    enabled: false, // Disable all retry functionality
  },
});
```

## Advanced Configuration

### Custom Retry Settings
```typescript
const client = new Tsonik({
  appId: 'your-app-id',
  authToken: 'your-auth-token',
  retry: {
    attempts: 5,           // Maximum retry attempts
    minDelay: 200,         // Minimum delay between retries (ms)
    maxDelay: 60000,       // Maximum delay between retries (ms)
    factor: 2.5,           // Exponential backoff factor
    randomize: 0.2,        // Jitter factor (0-1)
  },
});
```

### Method-Specific Retry
```typescript
const client = new Tsonik({
  appId: 'your-app-id',
  authToken: 'your-auth-token',
  retry: {
    // Enable retry for write operations (use with caution)
    retryOnMethods: ['GET', 'HEAD', 'OPTIONS', 'POST', 'PUT'],
    attempts: 2, // Fewer attempts for write operations
  },
});
```

### Status Code Customization
```typescript
const client = new Tsonik({
  appId: 'your-app-id',
  authToken: 'your-auth-token',
  retry: {
    // Only retry on rate limits and server errors
    retryOnStatus: [429, 500, 502, 503],
    // Don't retry on network errors
    retryOnNetworkErrors: [],
  },
});
```

### Custom Retry Logic
```typescript
const client = new Tsonik({
  appId: 'your-app-id',
  authToken: 'your-auth-token',
  retry: {
    // Custom retry condition
    shouldRetry: (error: unknown, attemptNumber: number) => {
      // Custom logic to determine if we should retry
      if (attemptNumber >= 2) return false;
      
      // Only retry on specific conditions
      return error instanceof Error && 
             error.message.includes('timeout');
    },
  },
});
```

## Retry Presets

Tsonik includes pre-configured retry presets for common scenarios:

### Conservative Preset
```typescript
import { Tsonik, RetryPresets } from 'tsonik';

const client = new Tsonik({
  appId: 'your-app-id',
  authToken: 'your-auth-token',
  retry: RetryPresets.conservative(), // 2 attempts, read-only methods
});
```

### Aggressive Preset
```typescript
const client = new Tsonik({
  appId: 'your-app-id',
  authToken: 'your-auth-token',
  retry: RetryPresets.aggressive(), // 5 attempts, includes write methods
});
```

### Rate Limit Preset
```typescript
const client = new Tsonik({
  appId: 'your-app-id',
  authToken: 'your-auth-token',
  retry: RetryPresets.rateLimit(), // Only retry on 429 responses
});
```

### Network-Only Preset
```typescript
const client = new Tsonik({
  appId: 'your-app-id',
  authToken: 'your-auth-token',
  retry: RetryPresets.networkOnly(), // Only retry network errors
});
```

## Implementation Details

### Exponential Backoff Algorithm
The retry delay is calculated using exponential backoff with jitter:

```typescript
const delay = minDelay * Math.pow(factor, attemptNumber - 1);
const clampedDelay = Math.min(delay, maxDelay);
const jitter = clampedDelay * randomize * Math.random();
const finalDelay = Math.round(clampedDelay + jitter);
```

### Error Classification
The retry system intelligently classifies errors:

1. **HTTP Status Codes**: Checks if the status code is in the retry list
2. **HTTP Methods**: Ensures the method is safe to retry
3. **Network Errors**: Identifies network-level failures
4. **Custom Logic**: Applies user-defined retry conditions

### Abort Mechanism
When an error should not be retried, the system throws a `p-retry.AbortError` to immediately stop retry attempts, ensuring efficient failure handling.

## Best Practices

### 1. Use Safe Methods
Only enable retry for idempotent operations:
```typescript
// ✅ Good: Safe for retry
const assets = await client.assets.listAssets();
const asset = await client.assets.getAsset(id);

// ⚠️ Caution: May cause duplicates if retried
const newAsset = await client.assets.createAsset(data);
```

### 2. Configure Appropriate Timeouts
Match retry configuration with your application's timeout requirements:
```typescript
const client = new Tsonik({
  appId: 'your-app-id',
  authToken: 'your-auth-token',
  timeout: 10000, // 10 second request timeout
  retry: {
    attempts: 3,
    maxDelay: 5000, // Don't wait longer than 5 seconds
  },
});
```

### 3. Monitor Retry Attempts
In development, enable debug logging to monitor retry behavior:
```typescript
const client = new Tsonik({
  appId: 'your-app-id',
  authToken: 'your-auth-token',
  debug: true, // Shows retry attempts in console
});
```

### 4. Handle Circuit Breaking
For high-traffic applications, consider implementing circuit breaker patterns:
```typescript
const client = new Tsonik({
  appId: 'your-app-id',
  authToken: 'your-auth-token',
  retry: {
    shouldRetry: (error, attemptNumber) => {
      // Implement circuit breaker logic
      if (consecutiveFailures > 10) {
        return false; // Stop retrying
      }
      return attemptNumber < 3;
    },
  },
});
```

## Configuration Reference

### RetryConfig Interface
```typescript
interface RetryConfig {
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
  
  /** HTTP status codes to retry on */
  retryOnStatus?: number[];
  
  /** HTTP methods to retry */
  retryOnMethods?: string[];
  
  /** Network error codes to retry on */
  retryOnNetworkErrors?: string[];
  
  /** Custom retry condition function */
  shouldRetry?: (error: unknown, attemptNumber: number) => boolean;
}
```

### Default Configuration
```typescript
const DEFAULT_RETRY_CONFIG = {
  attempts: 3,
  enabled: true,
  minDelay: 100,
  maxDelay: 30000,
  factor: 2,
  randomize: 0.1,
  retryOnStatus: [408, 429, 500, 502, 503, 504, 520, 521, 522, 523, 524],
  retryOnMethods: ['GET', 'HEAD', 'OPTIONS'],
  retryOnNetworkErrors: [
    'ECONNRESET', 'ENOTFOUND', 'ECONNREFUSED', 'ETIMEDOUT',
    'ECONNABORTED', 'EHOSTUNREACH', 'ENETUNREACH', 'EAI_AGAIN'
  ],
  shouldRetry: () => true,
};
```

## Troubleshooting

### Common Issues

1. **Unexpected Retry Attempts**
   ```typescript
   // Check your method configuration
   retry: {
     retryOnMethods: ['GET'], // Only retry GET requests
   }
   ```

2. **Long Response Times**
   ```typescript
   // Reduce maximum delay
   retry: {
     maxDelay: 5000, // Maximum 5 second delay
   }
   ```

3. **Too Many Retry Attempts**
   ```typescript
   // Reduce attempt count
   retry: {
     attempts: 2, // Only 1 retry
   }
   ```

### Debug Logging
Enable debug mode to see retry attempts:
```typescript
const client = new Tsonik({
  appId: 'your-app-id',
  authToken: 'your-auth-token',
  debug: true,
});
```

This will log retry attempts in the console:
```
Retry attempt 1 failed. 2 retries left.
{
  error: "Request failed with status code 503",
  status: 503,
  method: "GET",
  url: "/API/assets/v1/assets"
}
```