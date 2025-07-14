import { Tsonik } from '../client';
import { IconikConfig } from '../config';
import { MetadataResponse, UpdateMetadataRequest } from '../types/metadata';

/**
 * Integration tests for MetadataResource
 * These tests run against a real Iconik API instance
 * 
 * Prerequisites:
 * - Copy .env.example to .env and fill in your credentials
 * - Set ICONIK_APP_ID and ICONIK_AUTH_TOKEN in .env file
 * - Set ICONIK_BASE_URL (optional, defaults to https://app.iconik.io)
 * - Ensure test environment has proper permissions
 */

describe('MetadataResource Integration Tests', () => {
  let client: Tsonik;
  let testAssetId: string;

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
      timeout: 30000,
      debug: true
    };

    client = new Tsonik(config);

    // Create a test asset for metadata operations
    try {
      const testAsset = await client.assets.createAsset({
        title: 'Metadata Integration Test Asset',
        type: 'ASSET',
        metadata: {
          description: 'Created for metadata integration testing',
          test_tag: 'metadata-integration-test'
        }
      });
      testAssetId = testAsset.data.id;
    } catch (error) {
      console.error('Failed to create test asset:', error);
      throw error;
    }
  });

  afterAll(async () => {
    if (!client || !testAssetId) return;

    // Clean up test asset
    try {
      await client.assets.deleteAsset(testAssetId);
      console.log(`Cleaned up test asset: ${testAssetId}`);
    } catch (error) {
      console.warn(`Failed to clean up asset ${testAssetId}:`, error);
    }
  });

  // Skip all tests if no App ID or Auth Token is provided
  beforeEach(() => {
    if (!process.env.ICONIK_APP_ID || !process.env.ICONIK_AUTH_TOKEN) {
      throw new Error('ICONIK_APP_ID and ICONIK_AUTH_TOKEN environment variables must be set. Skipping integration tests.');
    }
  });

  describe('Metadata Operations', () => {
    it('should get metadata for an asset', async () => {
      try {
        const response = await client.metadata.getMetadata('assets', testAssetId);

        expect(response.status).toBe(200);
        expect(response.data).toBeDefined();
        expect(response.data.object_id).toBe(testAssetId);
        expect(response.data.object_type).toBe('assets');
        expect(response.data.metadata_values).toBeDefined();
        expect(response.data.date_created).toBeDefined();
        expect(response.data.date_modified).toBeDefined();
        expect(response.data.version_id).toBeDefined();
      } catch (error: unknown) {
        // If metadata doesn't exist for the asset, that's expected behavior
        const typedError = error as { statusCode?: number };
        if (typedError.statusCode === 404) {
          console.log('No metadata found for asset (expected for new assets)');
          expect(typedError.statusCode).toBe(404);
        } else {
          throw error;
        }
      }
    }, 30000);

    it('should get metadata with query parameters', async () => {
      try {
        const response = await client.metadata.getMetadata('assets', testAssetId, {
          check_if_subclip: false,
          include_values_for_deleted_fields: false
        });

        expect(response.status).toBe(200);
        expect(response.data).toBeDefined();
        expect(response.data.object_id).toBe(testAssetId);
        expect(response.data.object_type).toBe('assets');
        expect(response.data.metadata_values).toBeDefined();
      } catch (error: unknown) {
        // If metadata doesn't exist for the asset, that's expected behavior
        const typedError = error as { statusCode?: number };
        if (typedError.statusCode === 404) {
          console.log('No metadata found for asset (expected for new assets)');
          expect(typedError.statusCode).toBe(404);
        } else {
          throw error;
        }
      }
    }, 30000);

    it('should handle metadata for different object types', async () => {
      // Create a test collection to get metadata for
      const testCollection = await client.collections.createCollection({
        title: 'Metadata Test Collection'
      });

      try {
        try {
          const response = await client.metadata.getMetadata('collections', testCollection.data.id);

          expect(response.status).toBe(200);
          expect(response.data).toBeDefined();
          expect(response.data.object_id).toBe(testCollection.data.id);
          expect(response.data.object_type).toBe('collections');
          expect(response.data.metadata_values).toBeDefined();
        } catch (error: unknown) {
          // If metadata doesn't exist for the collection, that's expected behavior
          const typedError = error as { statusCode?: number };
          if (typedError.statusCode === 404) {
            console.log('No metadata found for collection (expected for new collections)');
            expect(typedError.statusCode).toBe(404);
          } else {
            throw error;
          }
        }
      } finally {
        // Clean up test collection
        await client.collections.deleteCollection(testCollection.data.id);
      }
    }, 30000);

    it('should handle subclip parameter', async () => {
      try {
        const response = await client.metadata.getMetadata('assets', testAssetId, {
          check_if_subclip: true
        });

        expect(response.status).toBe(200);
        expect(response.data).toBeDefined();
        expect(response.data.object_id).toBe(testAssetId);
      } catch (error: unknown) {
        // If metadata doesn't exist for the asset, that's expected behavior
        const typedError = error as { statusCode?: number };
        if (typedError.statusCode === 404) {
          console.log('No metadata found for asset (expected for new assets)');
          expect(typedError.statusCode).toBe(404);
        } else {
          throw error;
        }
      }
    }, 30000);

    it('should handle include_values_for_deleted_fields parameter', async () => {
      try {
        const response = await client.metadata.getMetadata('assets', testAssetId, {
          include_values_for_deleted_fields: true
        });

        expect(response.status).toBe(200);
        expect(response.data).toBeDefined();
        expect(response.data.object_id).toBe(testAssetId);
      } catch (error: unknown) {
        // If metadata doesn't exist for the asset, that's expected behavior
        const typedError = error as { statusCode?: number };
        if (typedError.statusCode === 404) {
          console.log('No metadata found for asset (expected for new assets)');
          expect(typedError.statusCode).toBe(404);
        } else {
          throw error;
        }
      }
    }, 30000);
  });

  describe('Error Handling', () => {
    it('should handle metadata not found error', async () => {
      const nonExistentId = 'non-existent-asset-id';

      await expect(client.metadata.getMetadata('assets', nonExistentId))
        .rejects
        .toThrow();
    }, 30000);

    it('should handle invalid object type', async () => {
      await expect(client.metadata.getMetadata('invalid_type', testAssetId))
        .rejects
        .toThrow();
    }, 30000);
  });

  describe('Performance Tests', () => {
    it('should handle concurrent metadata requests', async () => {
      const promises: Promise<{status: number; data: MetadataResponse}>[] = [];
      const concurrency = 3;

      for (let i = 0; i < concurrency; i++) {
        promises.push(client.metadata.getMetadata('assets', testAssetId).catch(error => {
          const typedError = error as { statusCode?: number };
          if (typedError.statusCode === 404) {
            // Return a mock response for 404 errors
            return { status: 404, data: null as unknown as MetadataResponse };
          }
          throw error;
        }));
      }

      const results = await Promise.all(promises);

      results.forEach(result => {
        expect([200, 404]).toContain(result.status);
        if (result.status === 200) {
          expect(result.data).toBeDefined();
          expect(result.data.object_id).toBe(testAssetId);
        }
      });
    }, 30000);

    it('should complete metadata requests within reasonable time', async () => {
      const startTime = Date.now();
      
      try {
        const response = await client.metadata.getMetadata('assets', testAssetId);
        
        const endTime = Date.now();
        const duration = endTime - startTime;

        expect(response.status).toBe(200);
        expect(response.data).toBeDefined();
        expect(duration).toBeLessThan(10000); // Should complete within 10 seconds
      } catch (error: unknown) {
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        // If metadata doesn't exist for the asset, that's expected behavior
        const typedError = error as { statusCode?: number };
        if (typedError.statusCode === 404) {
          console.log('No metadata found for asset (expected for new assets)');
          expect(typedError.statusCode).toBe(404);
          expect(duration).toBeLessThan(10000); // Should still complete within 10 seconds
        } else {
          throw error;
        }
      }
    }, 30000);
  });

  describe('Metadata Update Operations', () => {
    it('should update metadata for an asset', async () => {
      const updateRequest: UpdateMetadataRequest = {
        metadata_values: {
          title: {
            field_values: [{ value: 'Updated Integration Test Asset' }],
            mode: 'overwrite'
          },
          description: {
            field_values: [{ value: 'Updated during integration testing' }],
            mode: 'overwrite'
          }
        }
      };

      const response = await client.metadata.putMetadata('assets', testAssetId, updateRequest);

      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();
      expect(response.data.object_id).toBe(testAssetId);
      expect(response.data.object_type).toBe('assets');
      expect(response.data.metadata_values).toBeDefined();
      expect(response.data.date_modified).toBeDefined();
    }, 30000);

    it('should update metadata with query parameters', async () => {
      const updateRequest: UpdateMetadataRequest = {
        metadata_values: {
          title: {
            field_values: [{ value: 'Updated with Query Params' }],
            mode: 'overwrite'
          }
        }
      };

      const response = await client.metadata.putMetadata('assets', testAssetId, updateRequest, {
        check_if_subclip: false,
        ignore_unchanged: true
      });

      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();
      expect(response.data.object_id).toBe(testAssetId);
      expect(response.data.object_type).toBe('assets');
    }, 30000);

    it('should handle append mode for metadata fields', async () => {
      const updateRequest: UpdateMetadataRequest = {
        metadata_values: {
          tags: {
            field_values: [{ value: 'integration-test' }, { value: 'metadata-append' }],
            mode: 'append'
          }
        }
      };

      const response = await client.metadata.putMetadata('assets', testAssetId, updateRequest);

      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();
      expect(response.data.object_id).toBe(testAssetId);
    }, 30000);

    it('should handle overwrite mode for metadata fields', async () => {
      const updateRequest: UpdateMetadataRequest = {
        metadata_values: {
          title: {
            field_values: [{ value: 'Overwritten Title' }],
            mode: 'overwrite'
          }
        }
      };

      const response = await client.metadata.putMetadata('assets', testAssetId, updateRequest);

      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();
      expect(response.data.object_id).toBe(testAssetId);
    }, 30000);

    it('should update metadata for different object types', async () => {
      // Create a test collection to update metadata for
      const testCollection = await client.collections.createCollection({
        title: 'Metadata Update Test Collection'
      });

      try {
        const updateRequest: UpdateMetadataRequest = {
          metadata_values: {
            description: {
              field_values: [{ value: 'Updated collection description' }],
              mode: 'overwrite'
            }
          }
        };

        const response = await client.metadata.putMetadata('collections', testCollection.data.id, updateRequest);

        expect(response.status).toBe(200);
        expect(response.data).toBeDefined();
        expect(response.data.object_id).toBe(testCollection.data.id);
        expect(response.data.object_type).toBe('collections');
      } finally {
        // Clean up test collection
        await client.collections.deleteCollection(testCollection.data.id);
      }
    }, 30000);
  });

  describe('Metadata Update Error Handling', () => {
    it('should handle metadata update for non-existent object', async () => {
      const nonExistentId = 'non-existent-asset-id';
      const updateRequest: UpdateMetadataRequest = {
        metadata_values: {
          title: {
            field_values: [{ value: 'This should fail' }],
            mode: 'overwrite'
          }
        }
      };

      await expect(client.metadata.putMetadata('assets', nonExistentId, updateRequest))
        .rejects
        .toThrow();
    }, 30000);

    it('should handle invalid metadata update request', async () => {
      // Empty metadata_values should still be processed
      const updateRequest: UpdateMetadataRequest = {
        metadata_values: {}
      };

      const response = await client.metadata.putMetadata('assets', testAssetId, updateRequest);

      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();
    }, 30000);
  });

  describe('Metadata Update Performance Tests', () => {
    it('should handle concurrent metadata update requests', async () => {
      const promises: Promise<{status: number; data: MetadataResponse}>[] = [];
      const concurrency = 2; // Keep lower to avoid overwhelming the API

      for (let i = 0; i < concurrency; i++) {
        const updateRequest: UpdateMetadataRequest = {
          metadata_values: {
            title: {
              field_values: [{ value: `Concurrent Update ${i}` }],
              mode: 'overwrite'
            }
          }
        };
        promises.push(client.metadata.putMetadata('assets', testAssetId, updateRequest));
      }

      const results = await Promise.all(promises);

      results.forEach(result => {
        expect(result.status).toBe(200);
        expect(result.data).toBeDefined();
        expect(result.data.object_id).toBe(testAssetId);
      });
    }, 30000);

    it('should complete metadata update requests within reasonable time', async () => {
      const startTime = Date.now();
      
      const updateRequest: UpdateMetadataRequest = {
        metadata_values: {
          title: {
            field_values: [{ value: 'Performance Test Update' }],
            mode: 'overwrite'
          }
        }
      };

      const response = await client.metadata.putMetadata('assets', testAssetId, updateRequest);
      
      const endTime = Date.now();
      const duration = endTime - startTime;

      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();
      expect(duration).toBeLessThan(10000); // Should complete within 10 seconds
    }, 30000);
  });
});