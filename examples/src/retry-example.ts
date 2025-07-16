import { Tsonik, RetryPresets } from 'tsonik';

/**
 * Example demonstrating automatic retry functionality
 */
async function retryExample() {
  // Basic client with default retry settings
  const defaultClient = new Tsonik({
    appId: process.env.ICONIK_APP_ID!,
    authToken: process.env.ICONIK_AUTH_TOKEN!,
    debug: true, // Enable debug logging to see retry attempts
  });

  try {
    // This will automatically retry on failures
    const assets = await defaultClient.assets.listAssets({ limit: 10 });
    console.log(`✅ Successfully retrieved ${assets.data.objects.length} assets`);
  } catch (error) {
    console.error('❌ Failed after retries:', error);
  }

  // Custom retry configuration
  const customClient = new Tsonik({
    appId: process.env.ICONIK_APP_ID!,
    authToken: process.env.ICONIK_AUTH_TOKEN!,
    retry: {
      attempts: 5,           // More attempts
      minDelay: 200,         // Start with 200ms delay
      maxDelay: 10000,       // Max 10 second delay
      factor: 1.5,           // Gentler backoff
      randomize: 0.2,        // More jitter
      retryOnMethods: ['GET', 'HEAD', 'OPTIONS'], // Safe methods only
    },
  });

  try {
    const asset = await customClient.assets.getAsset('some-asset-id');
    console.log(`✅ Retrieved asset: ${asset.data.title}`);
  } catch (error) {
    console.error('❌ Failed with custom retry:', error);
  }

  // Using retry presets
  const conservativeClient = new Tsonik({
    appId: process.env.ICONIK_APP_ID!,
    authToken: process.env.ICONIK_AUTH_TOKEN!,
    retry: RetryPresets.conservative(), // 2 attempts, read-only
  });

  const aggressiveClient = new Tsonik({
    appId: process.env.ICONIK_APP_ID!,
    authToken: process.env.ICONIK_AUTH_TOKEN!,
    retry: RetryPresets.aggressive(), // 5 attempts, includes writes
  });

  const rateLimitClient = new Tsonik({
    appId: process.env.ICONIK_APP_ID!,
    authToken: process.env.ICONIK_AUTH_TOKEN!,
    retry: RetryPresets.rateLimit(), // Only retry on 429
  });

  // Disable retry for specific scenarios
  const noRetryClient = new Tsonik({
    appId: process.env.ICONIK_APP_ID!,
    authToken: process.env.ICONIK_AUTH_TOKEN!,
    retry: {
      enabled: false, // No retries
    },
  });

  try {
    const collections = await noRetryClient.collections.listCollections();
    console.log(`✅ Got ${collections.data.objects.length} collections (no retry)`);
  } catch (error) {
    console.error('❌ Failed immediately (no retry):', error);
  }

  // Custom retry logic
  const smartRetryClient = new Tsonik({
    appId: process.env.ICONIK_APP_ID!,
    authToken: process.env.ICONIK_AUTH_TOKEN!,
    retry: {
      attempts: 3,
      shouldRetry: (error: unknown, attemptNumber: number) => {
        // Custom logic: only retry on specific errors
        if (attemptNumber >= 2) return false;
        
        // Check if it's a rate limit error
        if (error && typeof error === 'object' && 'response' in error) {
          const axiosError = error as any;
          if (axiosError.response?.status === 429) {
            console.log('💤 Rate limited, will retry...');
            return true;
          }
        }
        
        // Check for network errors
        if (error && typeof error === 'object' && 'code' in error) {
          const networkError = error as any;
          if (networkError.code === 'ECONNRESET') {
            console.log('🔌 Connection reset, will retry...');
            return true;
          }
        }
        
        return false; // Don't retry other errors
      },
    },
  });

  try {
    const jobs = await smartRetryClient.jobs.listJobs();
    console.log(`✅ Got ${jobs.data.objects.length} jobs (smart retry)`);
  } catch (error) {
    console.error('❌ Failed with smart retry:', error);
  }
}

// Method-specific retry configuration example
async function methodSpecificRetryExample() {
  // Different retry behavior for read vs write operations
  const readClient = new Tsonik({
    appId: process.env.ICONIK_APP_ID!,
    authToken: process.env.ICONIK_AUTH_TOKEN!,
    retry: {
      attempts: 5,
      retryOnMethods: ['GET', 'HEAD', 'OPTIONS'], // Only safe methods
      maxDelay: 30000,
    },
  });

  const writeClient = new Tsonik({
    appId: process.env.ICONIK_APP_ID!,
    authToken: process.env.ICONIK_AUTH_TOKEN!,
    retry: {
      attempts: 2, // Fewer attempts for write operations
      retryOnMethods: ['GET', 'HEAD', 'OPTIONS', 'POST', 'PUT', 'PATCH'],
      retryOnStatus: [500, 502, 503, 504], // Only server errors
      maxDelay: 5000, // Shorter delays
    },
  });

  // Read operations with aggressive retry
  try {
    const assets = await readClient.assets.listAssets();
    console.log(`✅ Read ${assets.data.objects.length} assets with aggressive retry`);
  } catch (error) {
    console.error('❌ Read failed:', error);
  }

  // Write operations with conservative retry
  try {
    const newAsset = await writeClient.assets.createAsset({
      title: 'Test Asset',
      type: 'ASSET',
    });
    console.log(`✅ Created asset: ${newAsset.data.id}`);
  } catch (error) {
    console.error('❌ Write failed:', error);
  }
}

// Monitoring retry attempts
async function monitoringExample() {
  const client = new Tsonik({
    appId: process.env.ICONIK_APP_ID!,
    authToken: process.env.ICONIK_AUTH_TOKEN!,
    debug: true, // This will show retry attempts in console
    retry: {
      attempts: 3,
      // Note: onRetry is not part of the current RetryConfig interface
      // Debug mode will show retry attempts instead
    },
  });

  try {
    const metadata = await client.metadata.getMetadata('assets', 'some-asset-id');
    console.log('✅ Got metadata:', metadata);
  } catch (error) {
    console.error('❌ All retries exhausted:', error);
  }
}

// Export for documentation
export {
  retryExample,
  methodSpecificRetryExample,
  monitoringExample,
};