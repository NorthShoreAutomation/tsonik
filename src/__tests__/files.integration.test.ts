/**
 * Integration tests for FileResource
 * Tests real API calls against Iconik Files API
 */

import { Tsonik } from '../client';
import { 
  ApiResponse,
  PaginatedResponse
} from '../types';
import { AssetFile, AssetFilesListParams } from '../types/files';

describe('FileResource Integration Tests', () => {
  let client: Tsonik | null = null;
  let testAssetId: string | null = null;

  // Setup test environment
  beforeAll(async () => {
    if (!process.env.ICONIK_BASE_URL || !process.env.ICONIK_APP_ID || !process.env.ICONIK_AUTH_TOKEN) {
      console.warn('Integration test environment not configured properly');
      return;
    }

    client = new Tsonik({
      baseUrl: process.env.ICONIK_BASE_URL || 'https://app.iconik.io',
      appId: process.env.ICONIK_APP_ID!,
      authToken: process.env.ICONIK_AUTH_TOKEN!
    });

    // Find a valid test asset ID for testing files
    try {
      if (client) {
        const assetsResponse = await client.assets.list({ per_page: 1 });
        if (assetsResponse.data.objects && assetsResponse.data.objects.length > 0) {
          testAssetId = assetsResponse.data.objects[0].id;
        }
      }
    } catch (error) {
      console.warn('Error finding test asset:', error);
    }
  });

  afterAll(() => {
    // Cleanup if needed
  });

  describe('get asset files', () => {
    it('should get files for an asset with default parameters', async () => {
      if (!client) {
        console.warn('Skipping test: no client configured');
        return;
      }
      
      if (!testAssetId) {
        console.warn('Skipping test: no test asset found');
        return;
      }

      // Call the API to get files
      const response = await client.files.getAssetFiles(testAssetId);
      
      // Verify structure of response
      expect(response.status).toEqual(200);
      expect(response.data).toHaveProperty('objects');
      expect(Array.isArray(response.data.objects)).toBe(true);
      
      // Even if there are no files, the API should return an empty array
      if (response.data.objects.length > 0) {
        const firstFile = response.data.objects[0];
        expect(firstFile).toHaveProperty('id');
        expect(firstFile).toHaveProperty('asset_id');
        expect(firstFile).toHaveProperty('name');
      }
    }, 30000);

    it('should get files with pagination parameters', async () => {
      if (!client) {
        console.warn('Skipping test: no client configured');
        return;
      }
      
      if (!testAssetId) {
        console.warn('Skipping test: no test asset found');
        return;
      }

      // Call the API with pagination parameters
      const response = await client.files.getAssetFiles(testAssetId, {
        per_page: 5
      });
      
      // Verify structure of response
      expect(response.status).toEqual(200);
      expect(response.data).toHaveProperty('objects');
      expect(response.data).toHaveProperty('per_page');
      expect(response.data.per_page).toEqual(5);
    }, 30000);
    
    it('should get files with generate_signed_url parameter', async () => {
      if (!client) {
        console.warn('Skipping test: no client configured');
        return;
      }
      
      if (!testAssetId) {
        console.warn('Skipping test: no test asset found');
        return;
      }

      // Call the API with generate_signed_url parameter
      const response = await client.files.getAssetFiles(testAssetId, {
        generate_signed_url: true
      });
      
      // Verify structure of response
      expect(response.status).toEqual(200);
      expect(response.data).toHaveProperty('objects');
      
      // If there are files with URLs, check them
      if (response.data.objects.length > 0) {
        const fileWithUrl = response.data.objects.find(file => file.url);
        if (fileWithUrl) {
          expect(fileWithUrl.url).toBeTruthy();
          expect(typeof fileWithUrl.url).toBe('string');
        }
      }
    }, 30000);

    it('should get files with content_disposition parameter', async () => {
      if (!client) {
        console.warn('Skipping test: no client configured');
        return;
      }
      
      if (!testAssetId) {
        console.warn('Skipping test: no test asset found');
        return;
      }

      // Call the API with content_disposition parameter
      const response = await client.files.getAssetFiles(testAssetId, {
        generate_signed_url: true,
        content_disposition: 'attachment'
      });
      
      // Verify structure of response
      expect(response.status).toEqual(200);
      expect(response.data).toHaveProperty('objects');
    }, 30000);

    it('should handle getting files for non-existent asset', async () => {
      if (!client) {
        console.warn('Skipping test: no client configured');
        return;
      }

      // Use a non-existent asset ID
      const nonExistentId = '00000000-0000-0000-0000-000000000000';
      
      try {
        await client.files.getAssetFiles(nonExistentId);
        fail('Expected error was not thrown');
      } catch (error: any) {
        // Should return 404 for non-existent asset
        expect(error.statusCode).toEqual(404);
      }
    }, 30000);

    it('should validate asset ID is required', async () => {
      if (!client) {
        console.warn('Skipping test: no client configured');
        return;
      }

      // Call without asset ID should throw validation error
      try {
        // @ts-ignore: Testing invalid input
        await client.files.getAssetFiles('');
        fail('Expected error was not thrown');
      } catch (error: any) {
        expect(error.message).toEqual('Asset ID is required');
      }
    }, 30000);

    it('should validate asset ID cannot be whitespace', async () => {
      if (!client) {
        console.warn('Skipping test: no client configured');
        return;
      }

      // Call with whitespace asset ID should throw validation error
      try {
        await client.files.getAssetFiles('   ');
        fail('Expected error was not thrown');
      } catch (error: any) {
        expect(error.message).toEqual('Asset ID is required');
      }
    }, 30000);
  });
});
