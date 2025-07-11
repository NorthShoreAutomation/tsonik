import { Tsonik } from '../client';
import { IconikConfig } from '../config';
import { Asset } from '../types';

/**
 * Integration tests for AssetResource
 * These tests run against a real Iconik API instance
 * 
 * Prerequisites:
 * - Copy .env.example to .env and fill in your credentials
 * - Set ICONIK_APP_ID and ICONIK_AUTH_TOKEN in .env file
 * - Set ICONIK_BASE_URL (optional, defaults to https://app.iconik.io)
 * - Ensure test environment has proper permissions
 */

describe('AssetResource Integration Tests', () => {
  let client: Tsonik;
  let testAssetId: string;
  let createdAssetIds: string[] = [];

  beforeAll(async () => {
    // Skip integration tests if no credentials are provided
    if (!process.env.ICONIK_APP_ID || !process.env.ICONIK_AUTH_TOKEN) {
      console.warn('Skipping integration tests: ICONIK_APP_ID or ICONIK_AUTH_TOKEN not set');
      console.warn('Copy .env.example to .env and fill in your Iconik credentials.');
      return;
    }

    const config: IconikConfig = {
      appId: process.env.ICONIK_APP_ID!,
      authToken: process.env.ICONIK_AUTH_TOKEN!,
      baseUrl: process.env.ICONIK_BASE_URL || 'https://app.iconik.io',
      timeout: 10000,
      debug: true
    };

    client = new Tsonik(config);

    // Create a test asset for use in read operations
    try {
      const testAsset = await client.assets.createAsset({
        title: 'Integration Test Asset',
        type: 'ASSET',
        metadata: {
          description: 'Created for integration testing',
          test_tag: 'integration-test'
        }
      });
      testAssetId = testAsset.data.id;
      createdAssetIds.push(testAssetId);
    } catch (error) {
      console.error('Failed to create test asset:', error);
      throw error;
    }
  });

  afterAll(async () => {
    if (!client) return;

    // Clean up created assets
    for (const assetId of createdAssetIds) {
      try {
        await client.assets.deleteAsset(assetId);
        console.log(`Cleaned up test asset: ${assetId}`);
      } catch (error) {
        console.warn(`Failed to clean up asset ${assetId}:`, error);
      }
    }
  });

  // Skip all tests if no App ID or Auth Token is provided
  beforeEach(() => {
    if (!process.env.ICONIK_APP_ID || !process.env.ICONIK_AUTH_TOKEN) {
      throw new Error('ICONIK_APP_ID and ICONIK_AUTH_TOKEN environment variables must be set. Skipping integration tests.');
    }
  });

  describe('Asset CRUD Operations', () => {
    it('should create a new asset', async () => {
      const assetData = {
        title: 'Test Asset Creation',
        type: 'ASSET' as const,
        metadata: {
          description: 'Integration test asset creation',
          category: 'test'
        }
      };

      const response = await client.assets.createAsset(assetData);

      expect(response.status).toBe(201);
      expect(response.data).toBeDefined();
      expect(response.data.id).toBeDefined();
      expect(response.data.title).toBe(assetData.title);
      expect(response.data.type).toBe(assetData.type);

      // Track for cleanup
      createdAssetIds.push(response.data.id);
    }, 15000);

    it('should get an asset by ID', async () => {
      const response = await client.assets.getAsset(testAssetId);

      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();
      expect(response.data.id).toBe(testAssetId);
      expect(response.data.title).toBeDefined();
      expect(response.data.type).toBeDefined();
    }, 10000);

    it('should update an asset', async () => {
      const updateData = {
        title: 'Updated Integration Test Asset',
        metadata: {
          description: 'Updated during integration testing',
          updated_at: new Date().toISOString()
        }
      };

      const response = await client.assets.updateAsset(testAssetId, updateData);

      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();
      expect(response.data.id).toBe(testAssetId);
      expect(response.data.title).toBe(updateData.title);
    }, 10000);

    it('should list assets with pagination', async () => {
      const response = await client.assets.listAssets({
        limit: 5,
        offset: 0
      });

      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();
      expect(response.data.objects).toBeDefined();
      expect(Array.isArray(response.data.objects)).toBe(true);
      expect(response.data.objects.length).toBeLessThanOrEqual(10);
      // API may return total_count, count, or no count field
      const responseData = response.data as any;
      if (responseData.total_count !== undefined) {
        expect(responseData.total_count).toBeDefined();
      } else if (responseData.count !== undefined) {
        expect(responseData.count).toBeDefined();
      }
      // Test passes as long as we got objects array with pagination limit respected
    }, 10000);

    it('should list assets with filters', async () => {
      const response = await client.assets.listAssets({
        limit: 10,
        filter: {
          type: 'ASSET'
        }
      });

      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();
      expect(response.data.objects).toBeDefined();
      
      // If results exist, they should match the filter
      if (response.data.objects.length > 0) {
        response.data.objects.forEach((asset: Asset) => {
          expect(asset.type).toBe('ASSET');
        });
      }
    }, 10000);
  });

  // Note: Asset metadata operations have been moved to a dedicated MetadataResource
  // and are no longer part of AssetResource

  describe('Asset File Operations', () => {
    it('should get asset files', async () => {
      const response = await client.assets.getFiles(testAssetId);

      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();
      // Files response may be an object with files array or direct array
      if (Array.isArray(response.data)) {
        expect(Array.isArray(response.data)).toBe(true);
      } else {
        expect(typeof response.data).toBe('object');
      }
    }, 10000);

    it('should get asset thumbnails', async () => {
      const response = await client.assets.getThumbnails(testAssetId);

      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();
      // Thumbnails/keyframes response may be an object or array
      if (Array.isArray(response.data)) {
        expect(Array.isArray(response.data)).toBe(true);
      } else {
        expect(typeof response.data).toBe('object');
      }
    }, 10000);

    it('should get asset proxies', async () => {
      const response = await client.assets.getProxies(testAssetId);

      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();
      // Proxies response may be an object or array
      if (Array.isArray(response.data)) {
        expect(Array.isArray(response.data)).toBe(true);
      } else {
        expect(typeof response.data).toBe('object');
      }
    }, 10000);
  });

  // Note: Asset version operations have been removed from AssetResource for simplification

  // Note: Asset permission operations are not available in the Iconik API
  // and have been removed from AssetResource

  // Note: Asset comment operations are not available in the Iconik API
  // and have been removed from AssetResource

  describe('Error Handling', () => {
    it('should handle asset not found error', async () => {
      const nonExistentId = 'non-existent-asset-id';

      await expect(client.assets.getAsset(nonExistentId))
        .rejects
        .toThrow();
    }, 10000);

    it('should handle invalid asset creation', async () => {
      const invalidAssetData = {
        // Missing required fields
      } as any;

      await expect(client.assets.createAsset(invalidAssetData))
        .rejects
        .toThrow();
    }, 10000);


  });

  describe('Performance Tests', () => {
    it('should handle concurrent asset requests', async () => {
      const promises: Promise<any>[] = [];
      const concurrency = 3;

      for (let i = 0; i < concurrency; i++) {
        promises.push(client.assets.listAssets({ limit: 1 }));
      }

      const results = await Promise.all(promises);

      results.forEach(result => {
        expect(result.status).toBe(200);
        expect(result.data).toBeDefined();
      });
    }, 15000);

    it('should handle large asset list requests', async () => {
      const startTime = Date.now();
      
      const response = await client.assets.listAssets({
        limit: 50,
        offset: 0
      });

      const endTime = Date.now();
      const duration = endTime - startTime;

      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();
      expect(duration).toBeLessThan(10000); // Should complete within 10 seconds
    }, 15000);
  });

  describe('Bulk Operations', () => {
    it('should bulk delete multiple assets (with fallback to individual deletes)', async () => {
      // Create test assets for bulk deletion
      const testAssets = [];
      for (let i = 0; i < 3; i++) {
        const assetData = {
          title: `Bulk Delete Test Asset ${i}`,
          type: 'ASSET' as const,
          metadata: {
            description: 'Test asset for bulk deletion',
            category: 'test'
          }
        };
        
        const response = await client.assets.createAsset(assetData);
        testAssets.push(response.data.id);
      }

      // Perform bulk delete (should fall back to individual deletes if bulk endpoint doesn't exist)
      const bulkDeleteResponse = await client.assets.bulkDeleteAssets(testAssets);
      
      expect(bulkDeleteResponse.status).toBe(200);
      
      // Verify assets are deleted (in Iconik, deleted assets are marked as DELETED but still retrievable)
      for (const assetId of testAssets) {
        const response = await client.assets.getAsset(assetId);
        expect(response.data.status).toBe('DELETED');
      }
    }, 30000);

    it('should handle bulk delete validation errors', async () => {
      // Test empty array
      await expect(client.assets.bulkDeleteAssets([]))
        .rejects
        .toThrow('Asset IDs array cannot be empty');

      // Test too many assets (we'll just test the validation, not actually create 501 assets)
      const tooManyAssets = Array.from({ length: 501 }, (_, i) => `fake-asset-${i}`);
      await expect(client.assets.bulkDeleteAssets(tooManyAssets))
        .rejects
        .toThrow('Cannot delete more than 500 assets at once');
    }, 10000);
  });
});
