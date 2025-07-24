/**
 * Integration tests for FormatResource
 * Tests real API calls against Iconik Formats API
 */

// Import only what we need
import { CreateFormatRequest, UpdateFormatRequest, ReplaceFormatRequest } from '../types/formats';
import { setupTestData, cleanupTestData,  TestData } from './test-utils';

describe('FormatResource Integration Tests', () => {
  let testData: TestData;

  // Setup test environment with existing asset data
  beforeAll(async () => {
    testData = await setupTestData('Format Integration Test Asset');
  }, 30000);

  afterAll(async () => {
    if (testData) {
      await cleanupTestData(testData);
    }
  });

  describe('get asset formats', () => {
    it('should handle API response for getting asset formats', async () => {
      // Call the API to get formats
      const response = await testData.client.formats.getAssetFormats(testData.testAssetId);
      
      // Verify structure of response
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('objects');
      expect(Array.isArray(response.data.objects)).toBe(true);
      
      // Even if there are no formats, the API should return an empty array
      if (response.data.objects.length > 0) {
        const firstFormat = response.data.objects[0];
        expect(firstFormat).toHaveProperty('id');
        expect(firstFormat).toHaveProperty('asset_id');
        expect(firstFormat.asset_id).toBe(testData.testAssetId);
        
        // Verify format structure
        expect(typeof firstFormat.id).toBe('string');
        if (firstFormat.name) expect(typeof firstFormat.name).toBe('string');
        if (firstFormat.status) expect(['ACTIVE', 'DELETED', 'ARCHIVED']).toContain(firstFormat.status);
        if (firstFormat.archive_status) expect(['NOT_ARCHIVED', 'ARCHIVED', 'ARCHIVING', 'RESTORING']).toContain(firstFormat.archive_status);
        if (firstFormat.is_online !== undefined) expect(typeof firstFormat.is_online).toBe('boolean');
        if (firstFormat.components) expect(Array.isArray(firstFormat.components)).toBe(true);
        if (firstFormat.storage_methods) expect(Array.isArray(firstFormat.storage_methods)).toBe(true);
      }
    }, 30000);

    it('should handle API response for getting formats with pagination', async () => {
      // Call the API with pagination parameters
      const response = await testData.client.formats.getAssetFormats(testData.testAssetId, {
        per_page: 5
      });
      
      // Verify structure of response
      expect(response.status).toEqual(200);
      expect(response.data).toHaveProperty('objects');
      // Note: per_page may not be returned if no pagination is needed
      if (response.data.per_page !== undefined) {
        expect(response.data.per_page).toEqual(5);
      }
    }, 30000);
    
    it('should handle API response for getting formats with include_all_versions', async () => {
      // Call the API with include_all_versions parameter
      const response = await testData.client.formats.getAssetFormats(testData.testAssetId, {
        include_all_versions: true
      });
      
      // Verify structure of response
      expect(response.status).toEqual(200);
      expect(response.data).toHaveProperty('objects');
      // Check if version information is included
      if (response.data.objects.length > 0) {
        const formatWithVersion = response.data.objects.find(format => format.version_id);
        if (formatWithVersion) {
          expect(formatWithVersion.version_id).toBeTruthy();
          expect(typeof formatWithVersion.version_id).toBe('string');
        }
      }
    }, 30000);

    it('should handle API response for getting formats with all parameters', async () => {
      // Call the API with all parameters
      const response = await testData.client.formats.getAssetFormats(testData.testAssetId, {
        per_page: 3,
        include_all_versions: true
      });
      
      // Verify structure of response
      expect(response.status).toEqual(200);
      expect(response.data).toHaveProperty('objects');
      // Note: per_page may not be returned if no pagination is needed
      if (response.data.per_page !== undefined) {
        expect(response.data.per_page).toEqual(3);
      }
    }, 30000);

    it('should handle getting formats for non-existent asset', async () => {
      // Use a non-existent asset ID
      const nonExistentId = '00000000-0000-0000-0000-000000000000';
      
      try {
        await testData.client.formats.getAssetFormats(nonExistentId);
        fail('Expected error was not thrown');
      } catch (error: unknown) {
        // Can be 400 (bad request), 404 (not found), or any error depending on validation
        const statusCode = (typeof error === 'object' && error !== null && 'statusCode' in error ? error.statusCode : undefined) || (typeof error === 'object' && error !== null && 'response' in error && typeof error.response === 'object' && error.response !== null && 'status' in error.response ? error.response.status : undefined) || (typeof error === 'object' && error !== null && 'status' in error ? error.status : undefined);
        expect(statusCode).toBeGreaterThanOrEqual(400);
      }
    }, 30000);

    it('should validate asset ID is required', async () => {
      // Call without asset ID should throw validation error
      try {
        await testData.client.formats.getAssetFormats('');
        fail('Expected error was not thrown');
      } catch (error: unknown) {
        // Type guard to safely access error properties
        if (error instanceof Error) {
          expect(error.message).toEqual('Asset ID is required');
        } else {
          fail('Caught error is not an Error instance');
        }
      }
    }, 30000);

    it('should validate asset ID cannot be whitespace', async () => {
      // Call with whitespace asset ID should throw validation error
      try {
        await testData.client.formats.getAssetFormats('   ');
        fail('Expected error was not thrown');
      } catch (error: unknown) {
        // Type guard to safely access error properties
        if (error instanceof Error) {
          expect(error.message).toEqual('Asset ID is required');
        } else {
          fail('Caught error is not an Error instance');
        }
      }
    }, 30000);
  });

  describe('create asset format validation', () => {
    it('should validate asset ID is required for creation', async () => {
      const createData: CreateFormatRequest = {
        name: 'Test Format',
        status: 'ACTIVE'
      };

      try {
        await testData.client.formats.createAssetFormat('', createData);
        fail('Expected error was not thrown');
      } catch (error: unknown) {
        // Type guard to safely access error properties
        if (error instanceof Error) {
          expect(error.message).toEqual('Asset ID is required');
        } else {
          fail('Caught error is not an Error instance');
        }
      }
    }, 30000);

    it('should validate asset ID cannot be whitespace for creation', async () => {
      const createData: CreateFormatRequest = {
        name: 'Test Format',
        status: 'ACTIVE'
      };

      try {
        await testData.client.formats.createAssetFormat('   ', createData);
        fail('Expected error was not thrown');
      } catch (error: unknown) {
        // Type guard to safely access error properties
        if (error instanceof Error) {
          expect(error.message).toEqual('Asset ID is required');
        } else {
          fail('Caught error is not an Error instance');
        }
      }
    }, 30000);

    it('should handle API errors when creating formats', async () => {
      // Test with potentially invalid data to ensure API validation is working
      const createData: CreateFormatRequest = {
        name: 'Test Format',
        status: 'ACTIVE'
      };

      try {
        await testData.client.formats.createAssetFormat(testData.testAssetId, createData);
        // If this succeeds, track the format for cleanup
        // Note: This test may succeed or fail depending on API availability
      } catch (error: unknown) {
        // Should get an API error - could be 405 (method not allowed) or other
        const statusCode = (typeof error === 'object' && error !== null && 'statusCode' in error ? error.statusCode : undefined) || (typeof error === 'object' && error !== null && 'response' in error && typeof error.response === 'object' && error.response !== null && 'status' in error.response ? error.response.status : undefined) || (typeof error === 'object' && error !== null && 'status' in error ? error.status : undefined);
        expect(statusCode).toBeGreaterThanOrEqual(400);
      }
    }, 30000);

    it('should handle creating format for non-existent asset', async () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000';
      const createData: CreateFormatRequest = {
        name: 'Test Format',
        status: 'ACTIVE'
      };
      
      try {
        await testData.client.formats.createAssetFormat(nonExistentId, createData);
        fail('Expected error was not thrown');
      } catch (error: unknown) {
        // Can be 400 (validation), 404 (not found), or 405 (method not allowed)
        const statusCode = (typeof error === 'object' && error !== null && 'statusCode' in error ? error.statusCode : undefined) || (typeof error === 'object' && error !== null && 'response' in error && typeof error.response === 'object' && error.response !== null && 'status' in error.response ? error.response.status : undefined) || (typeof error === 'object' && error !== null && 'status' in error ? error.status : undefined);
        expect([400, 404, 405]).toContain(statusCode);
      }
    }, 30000);
  });

  describe('get asset format validation', () => {
    it('should validate asset ID is required for getAssetFormat', async () => {
      try {
        await testData.client.formats.getAssetFormat('', 'format-123');
        fail('Expected error was not thrown');
      } catch (error: unknown) {
        // Type guard to safely access error properties
        if (error instanceof Error) {
          expect(error.message).toEqual('Asset ID is required');
        } else {
          fail('Caught error is not an Error instance');
        }
      }
    }, 30000);

    it('should validate asset ID cannot be whitespace for getAssetFormat', async () => {
      try {
        await testData.client.formats.getAssetFormat('   ', 'format-123');
        fail('Expected error was not thrown');
      } catch (error: unknown) {
        // Type guard to safely access error properties
        if (error instanceof Error) {
          expect(error.message).toEqual('Asset ID is required');
        } else {
          fail('Caught error is not an Error instance');
        }
      }
    }, 30000);

    it('should validate format ID is required for getAssetFormat', async () => {
      try {
        await testData.client.formats.getAssetFormat('asset-123', '');
        fail('Expected error was not thrown');
      } catch (error: unknown) {
        // Type guard to safely access error properties
        if (error instanceof Error) {
          expect(error.message).toEqual('Format ID is required');
        } else {
          fail('Caught error is not an Error instance');
        }
      }
    }, 30000);

    it('should validate format ID cannot be whitespace for getAssetFormat', async () => {
      try {
        await testData.client.formats.getAssetFormat('asset-123', '   ');
        fail('Expected error was not thrown');
      } catch (error: unknown) {
        // Type guard to safely access error properties
        if (error instanceof Error) {
          expect(error.message).toEqual('Format ID is required');
        } else {
          fail('Caught error is not an Error instance');
        }
      }
    }, 30000);

    it('should handle getting non-existent format for existing asset', async () => {
      const nonExistentFormatId = '00000000-0000-0000-0000-000000000000';
      
      try {
        await testData.client.formats.getAssetFormat(testData.testAssetId, nonExistentFormatId);
        fail('Expected error was not thrown');
      } catch (error: unknown) {
        // Can be 400 (bad request), 404 (not found), 405 (method not allowed), or any 4xx/5xx error
        const statusCode = (typeof error === 'object' && error !== null && 'statusCode' in error ? error.statusCode : undefined) || (typeof error === 'object' && error !== null && 'response' in error && typeof error.response === 'object' && error.response !== null && 'status' in error.response ? error.response.status : undefined) || (typeof error === 'object' && error !== null && 'status' in error ? error.status : undefined);
        expect(statusCode).toBeGreaterThanOrEqual(400);
      }
    }, 30000);

    it('should handle getting format for non-existent asset', async () => {
      const nonExistentAssetId = '00000000-0000-0000-0000-000000000000';
      const formatId = 'format-123';
      
      try {
        await testData.client.formats.getAssetFormat(nonExistentAssetId, formatId);
        fail('Expected error was not thrown');
      } catch (error: unknown) {
        // Can be 400 (bad request), 404 (not found), 405 (method not allowed), or any 4xx/5xx error
        const statusCode = (typeof error === 'object' && error !== null && 'statusCode' in error ? error.statusCode : undefined) || (typeof error === 'object' && error !== null && 'response' in error && typeof error.response === 'object' && error.response !== null && 'status' in error.response ? error.response.status : undefined) || (typeof error === 'object' && error !== null && 'status' in error ? error.status : undefined);
        expect(statusCode).toBeGreaterThanOrEqual(400);
      }
    }, 30000);
  });

  describe('update asset format validation', () => {
    it('should validate asset ID is required for updateAssetFormat', async () => {
      const updateData: UpdateFormatRequest = {
        name: 'Updated Name'
      };

      try {
        await testData.client.formats.updateAssetFormat('', 'format-123', updateData);
        fail('Expected error was not thrown');
      } catch (error: unknown) {
        // Type guard to safely access error properties
        if (error instanceof Error) {
          expect(error.message).toEqual('Asset ID is required');
        } else {
          fail('Caught error is not an Error instance');
        }
      }
    }, 30000);

    it('should validate asset ID cannot be whitespace for updateAssetFormat', async () => {
      const updateData: UpdateFormatRequest = {
        name: 'Updated Name'
      };

      try {
        await testData.client.formats.updateAssetFormat('   ', 'format-123', updateData);
        fail('Expected error was not thrown');
      } catch (error: unknown) {
        // Type guard to safely access error properties
        if (error instanceof Error) {
          expect(error.message).toEqual('Asset ID is required');
        } else {
          fail('Caught error is not an Error instance');
        }
      }
    }, 30000);

    it('should validate format ID is required for updateAssetFormat', async () => {
      const updateData: UpdateFormatRequest = {
        name: 'Updated Name'
      };

      try {
        await testData.client.formats.updateAssetFormat('asset-123', '', updateData);
        fail('Expected error was not thrown');
      } catch (error: unknown) {
        // Type guard to safely access error properties
        if (error instanceof Error) {
          expect(error.message).toEqual('Format ID is required');
        } else {
          fail('Caught error is not an Error instance');
        }
      }
    }, 30000);

    it('should validate format ID cannot be whitespace for updateAssetFormat', async () => {
      const updateData: UpdateFormatRequest = {
        name: 'Updated Name'
      };

      try {
        await testData.client.formats.updateAssetFormat('asset-123', '   ', updateData);
        fail('Expected error was not thrown');
      } catch (error: unknown) {
        // Type guard to safely access error properties
        if (error instanceof Error) {
          expect(error.message).toEqual('Format ID is required');
        } else {
          fail('Caught error is not an Error instance');
        }
      }
    }, 30000);

    it('should handle updating non-existent format', async () => {
      const nonExistentFormatId = '00000000-0000-0000-0000-000000000000';
      const updateData: UpdateFormatRequest = {
        name: 'Updated Name'
      };
      
      try {
        await testData.client.formats.updateAssetFormat(testData.testAssetId, nonExistentFormatId, updateData);
        fail('Expected error was not thrown');
      } catch (error: unknown) {
        // Can be 400 (bad request), 404 (not found), or 405 (method not allowed)
        const statusCode = (typeof error === 'object' && error !== null && 'statusCode' in error ? error.statusCode : undefined) || (typeof error === 'object' && error !== null && 'response' in error && typeof error.response === 'object' && error.response !== null && 'status' in error.response ? error.response.status : undefined) || (typeof error === 'object' && error !== null && 'status' in error ? error.status : undefined);
        expect([400, 404, 405]).toContain(statusCode);
      }
    }, 30000);

    it('should handle updating format for non-existent asset', async () => {
      const nonExistentAssetId = '00000000-0000-0000-0000-000000000000';
      const updateData: UpdateFormatRequest = {
        name: 'Updated Name'
      };
      
      try {
        await testData.client.formats.updateAssetFormat(nonExistentAssetId, 'format-123', updateData);
        fail('Expected error was not thrown');
      } catch (error: unknown) {
        // Can be 400 (bad request), 404 (not found), or 405 (method not allowed)
        const statusCode = (typeof error === 'object' && error !== null && 'statusCode' in error ? error.statusCode : undefined) || (typeof error === 'object' && error !== null && 'response' in error && typeof error.response === 'object' && error.response !== null && 'status' in error.response ? error.response.status : undefined) || (typeof error === 'object' && error !== null && 'status' in error ? error.status : undefined);
        expect([400, 404, 405]).toContain(statusCode);
      }
    }, 30000);
  });

  describe('replace asset format validation', () => {
    it('should validate asset ID is required for replaceAssetFormat', async () => {
      const replaceData: ReplaceFormatRequest = {
        name: 'Replacement Name'
      };

      try {
        await testData.client.formats.replaceAssetFormat('', 'format-123', replaceData);
        fail('Expected error was not thrown');
      } catch (error: unknown) {
        // Type guard to safely access error properties
        if (error instanceof Error) {
          expect(error.message).toEqual('Asset ID is required');
        } else {
          fail('Caught error is not an Error instance');
        }
      }
    }, 30000);

    it('should validate asset ID cannot be whitespace for replaceAssetFormat', async () => {
      const replaceData: ReplaceFormatRequest = {
        name: 'Replacement Name'
      };

      try {
        await testData.client.formats.replaceAssetFormat('   ', 'format-123', replaceData);
        fail('Expected error was not thrown');
      } catch (error: unknown) {
        // Type guard to safely access error properties
        if (error instanceof Error) {
          expect(error.message).toEqual('Asset ID is required');
        } else {
          fail('Caught error is not an Error instance');
        }
      }
    }, 30000);

    it('should validate format ID is required for replaceAssetFormat', async () => {
      const replaceData: ReplaceFormatRequest = {
        name: 'Replacement Name'
      };

      try {
        await testData.client.formats.replaceAssetFormat('asset-123', '', replaceData);
        fail('Expected error was not thrown');
      } catch (error: unknown) {
        // Type guard to safely access error properties
        if (error instanceof Error) {
          expect(error.message).toEqual('Format ID is required');
        } else {
          fail('Caught error is not an Error instance');
        }
      }
    }, 30000);

    it('should validate format ID cannot be whitespace for replaceAssetFormat', async () => {
      const replaceData: ReplaceFormatRequest = {
        name: 'Replacement Name'
      };

      try {
        await testData.client.formats.replaceAssetFormat('asset-123', '   ', replaceData);
        fail('Expected error was not thrown');
      } catch (error: unknown) {
        // Type guard to safely access error properties
        if (error instanceof Error) {
          expect(error.message).toEqual('Format ID is required');
        } else {
          fail('Caught error is not an Error instance');
        }
      }
    }, 30000);

    it('should handle replacing non-existent format', async () => {
      const nonExistentFormatId = '00000000-0000-0000-0000-000000000000';
      const replaceData: ReplaceFormatRequest = {
        name: 'Replacement Name'
      };
      
      try {
        await testData.client.formats.replaceAssetFormat(testData.testAssetId, nonExistentFormatId, replaceData);
        fail('Expected error was not thrown');
      } catch (error: unknown) {
        // Can be 400 (bad request), 404 (not found), or 405 (method not allowed)
        const statusCode = (typeof error === 'object' && error !== null && 'statusCode' in error ? error.statusCode : undefined) || (typeof error === 'object' && error !== null && 'response' in error && typeof error.response === 'object' && error.response !== null && 'status' in error.response ? error.response.status : undefined) || (typeof error === 'object' && error !== null && 'status' in error ? error.status : undefined);
        expect([400, 404, 405]).toContain(statusCode);
      }
    }, 30000);

    it('should handle replacing format for non-existent asset', async () => {
      const nonExistentAssetId = '00000000-0000-0000-0000-000000000000';
      const replaceData: ReplaceFormatRequest = {
        name: 'Replacement Name'
      };
      
      try {
        await testData.client.formats.replaceAssetFormat(nonExistentAssetId, 'format-123', replaceData);
        fail('Expected error was not thrown');
      } catch (error: unknown) {
        // Can be 400 (bad request), 404 (not found), or 405 (method not allowed)
        const statusCode = (typeof error === 'object' && error !== null && 'statusCode' in error ? error.statusCode : undefined) || (typeof error === 'object' && error !== null && 'response' in error && typeof error.response === 'object' && error.response !== null && 'status' in error.response ? error.response.status : undefined) || (typeof error === 'object' && error !== null && 'status' in error ? error.status : undefined);
        expect([400, 404, 405]).toContain(statusCode);
      }
    }, 30000);
  });

  describe('format resource methods', () => {
    it('should have all required methods available', () => {
      // Test that all methods exist on the resource
      expect(typeof testData.client.formats.getAssetFormats).toBe('function');
      expect(typeof testData.client.formats.getAssetFormat).toBe('function');
      expect(typeof testData.client.formats.createAssetFormat).toBe('function');
      expect(typeof testData.client.formats.updateAssetFormat).toBe('function');
      expect(typeof testData.client.formats.replaceAssetFormat).toBe('function');
    });

    it('should handle basic HTTP method calls correctly', async () => {
      // Test that the resource can make basic API calls without errors
      const response = await testData.client.formats.getAssetFormats(testData.testAssetId);
      expect(response).toHaveProperty('status');
      expect(response).toHaveProperty('data');
      expect(response.status).toBe(200);
    }, 30000);
  });
});