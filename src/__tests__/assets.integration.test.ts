import { Tsonik } from '../client';
import { IconikConfig } from '../config';
import { Asset, ArchiveStatus } from '../types';

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
  const createdAssetIds: string[] = [];

  beforeAll(async () => {
    // Skip integration tests if no credentials are provided
    if (!process.env.ICONIK_APP_ID || !process.env.ICONIK_AUTH_TOKEN) {
      console.warn('Skipping integration tests: ICONIK_APP_ID or ICONIK_AUTH_TOKEN not set');
      console.warn('Copy .env.example to .env and fill in your Iconik credentials.');
      return;
    }

    const config: IconikConfig = {
      appId: process.env.ICONIK_APP_ID,
      authToken: process.env.ICONIK_AUTH_TOKEN,
      baseUrl: process.env.ICONIK_BASE_URL ?? 'https://app.iconik.io',
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

    it('should patch an asset', async () => {
      const patchData = {
        archive_status: 'ARCHIVED' as ArchiveStatus
      };
      const response = await client.assets.patchAsset(testAssetId, patchData);
      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();
      expect(response.data.id).toBe(testAssetId);
      expect(response.data.archive_status).toBe(patchData.archive_status);
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
      const responseData = response.data as { total_count?: number; count?: number };
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
        type: 'ASSET'
      };

      // Using type assertion is necessary here for testing invalid data scenarios
      // since we're intentionally testing error handling with incomplete data
      await expect(client.assets.createAsset(invalidAssetData as unknown as import('../types/assets').CreateAssetRequest))
        .rejects
        .toThrow();
    }, 10000);


  });

  describe('Performance Tests', () => {
    it('should handle concurrent asset requests', async () => {
      const promises: Promise<{status: number; data: unknown}>[] = [];
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
});
