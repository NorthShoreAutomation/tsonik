/**
 * Integration tests for FileSetResource
 * Tests real API calls against Iconik FileSet API
 */

import { 
  ApiResponse,
  PaginatedResponse,
  Asset
} from '../types';
import { 
  FileSet, 
  AssetFileSetsListParams, 
  CreateFileSetRequest, 
  DeleteFileSetOptions, 
  FileSetFilesListParams,
  FileSetFile
} from '../types/filesets';
import { setupTestData, cleanupTestData, trackCreatedFileset, TestData } from './test-utils';

describe('FileSetResource Integration Tests', () => {
  let testData: TestData;

  // Setup test environment with real test data
  beforeAll(async () => {
    testData = await setupTestData('FileSet Integration Test Asset');
  }, 30000);

  afterAll(async () => {
    await cleanupTestData(testData);
  });

  describe('list asset filesets', () => {
    it('should list filesets for an asset', async () => {
      const response = await testData.client.filesets.getAssetFilesets(testData.testAssetId);
      
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('objects');
      expect(Array.isArray(response.data.objects)).toBe(true);
      
      // Even if empty, should return valid structure
      if (response.data.objects.length > 0) {
        const fileset = response.data.objects[0];
        expect(fileset).toHaveProperty('id');
        expect(fileset).toHaveProperty('asset_id');
        expect(fileset.asset_id).toBe(testData.testAssetId);
      }
    }, 30000);

    it('should list filesets with pagination', async () => {
      const params: AssetFileSetsListParams = {
        per_page: 5
      };

      const response = await testData.client.filesets.getAssetFilesets(testData.testAssetId, params);
      
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('objects');
      // Note: per_page may not be returned if no pagination is needed
      if (response.data.per_page !== undefined) {
        expect(response.data.per_page).toBe(5);
      }
    }, 30000);

    it('should list filesets with file count', async () => {
      const params: AssetFileSetsListParams = {
        per_page: 10,
        file_count: true
      };

      const response = await testData.client.filesets.getAssetFilesets(testData.testAssetId, params);
      
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('objects');
      
      // Basic validation that response is well-formed
      response.data.objects.forEach((fileset: FileSet) => {
        expect(fileset).toHaveProperty('id');
        if (fileset.asset_id) {
          expect(fileset.asset_id).toBe(testData.testAssetId);
        }
      });
    }, 30000);

    it('should handle listing filesets for non-existent asset', async () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000';
      
      try {
        await testData.client.filesets.getAssetFilesets(nonExistentId);
        fail('Expected error was not thrown');
      } catch (error: any) {
        // Can be 400 (bad request) or 404 (not found) depending on validation
        expect([400, 404]).toContain(error.statusCode || error.response?.status || error.status);
      }
    }, 30000);

    it('should validate asset ID is required', async () => {
      try {
        await testData.client.filesets.getAssetFilesets('');
        fail('Expected error was not thrown');
      } catch (error: any) {
        expect(error.message).toEqual('Asset ID is required');
      }
    }, 30000);

    it('should validate asset ID cannot be whitespace', async () => {
      try {
        await testData.client.filesets.getAssetFilesets('   ');
        fail('Expected error was not thrown');
      } catch (error: any) {
        expect(error.message).toEqual('Asset ID is required');
      }
    }, 30000);
  });

  describe('create asset fileset validation', () => {
    it('should validate asset ID is required for creation', async () => {
      const createData: CreateFileSetRequest = {
        storage_id: 'storage-test'
      };

      try {
        await testData.client.filesets.createAssetFileset('', createData);
        fail('Expected error was not thrown');
      } catch (error: any) {
        expect(error.message).toEqual('Asset ID is required');
      }
    }, 30000);

    it('should validate asset ID cannot be whitespace for creation', async () => {
      const createData: CreateFileSetRequest = {
        storage_id: 'storage-test'
      };

      try {
        await testData.client.filesets.createAssetFileset('   ', createData);
        fail('Expected error was not thrown');
      } catch (error: any) {
        expect(error.message).toEqual('Asset ID is required');
      }
    }, 30000);

    it('should handle API validation errors when creating filesets', async () => {
      // Test with invalid data to ensure API validation is working
      const createData: CreateFileSetRequest = {
        storage_id: 'invalid-storage-id',
        name: 'Test FileSet'
      };

      try {
        await testData.client.filesets.createAssetFileset(testData.testAssetId, createData);
        fail('Expected validation error was not thrown');
      } catch (error: any) {
        // Should get 400 Bad Request due to invalid storage_id format
        expect(error.statusCode || error.response?.status || error.status).toBe(400);
      }
    }, 30000);

    it('should handle creating fileset for non-existent asset', async () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000';
      const createData: CreateFileSetRequest = {
        storage_id: '11111111-1111-1111-1111-111111111111', // Valid UUID format
        name: 'Test FileSet'
      };
      
      try {
        await testData.client.filesets.createAssetFileset(nonExistentId, createData);
        fail('Expected error was not thrown');
      } catch (error: any) {
        // Can be 400 (validation) or 404 (not found) depending on API implementation
        expect([400, 404]).toContain(error.statusCode || error.response?.status || error.status);
      }
    }, 30000);
  });

  describe('delete asset fileset validation', () => {
    it('should validate asset ID is required for deletion', async () => {
      try {
        await testData.client.filesets.deleteAssetFileset('', 'fileset-123');
        fail('Expected error was not thrown');
      } catch (error: any) {
        expect(error.message).toEqual('Asset ID is required');
      }
    }, 30000);

    it('should validate fileset ID is required for deletion', async () => {
      try {
        await testData.client.filesets.deleteAssetFileset('asset-123', '');
        fail('Expected error was not thrown');
      } catch (error: any) {
        expect(error.message).toEqual('FileSet ID is required');
      }
    }, 30000);

    it('should handle deleting non-existent fileset', async () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000';
      
      try {
        await testData.client.filesets.deleteAssetFileset(testData.testAssetId, nonExistentId);
        fail('Expected error was not thrown');
      } catch (error: any) {
        // Can be 400 (bad request) or 404 (not found)
        expect([400, 404]).toContain(error.statusCode || error.response?.status || error.status);
      }
    }, 30000);
  });

  describe('list fileset files validation', () => {
    it('should validate fileset ID is required for listing files', async () => {
      try {
        await testData.client.filesets.getFileSetFiles(testData.testAssetId, '');
        fail('Expected error was not thrown');
      } catch (error: any) {
        expect(error.message).toEqual('FileSet ID is required');
      }
    }, 30000);

    it('should validate fileset ID cannot be whitespace for listing files', async () => {
      try {
        await testData.client.filesets.getFileSetFiles(testData.testAssetId, '   ');
        fail('Expected error was not thrown');
      } catch (error: any) {
        expect(error.message).toEqual('FileSet ID is required');
      }
    }, 30000);

    it('should handle listing files for non-existent fileset', async () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000';
      
      try {
        await testData.client.filesets.getFileSetFiles(testData.testAssetId, nonExistentId);
        fail('Expected error was not thrown');
      } catch (error: any) {
        // Can be 400 (bad request) or 404 (not found)
        expect([400, 404]).toContain(error.statusCode || error.response?.status || error.status);
      }
    }, 30000);
  });

  describe('fileset resource methods', () => {
    it('should have all required methods available', () => {
      // Test that all methods exist on the resource
      expect(typeof testData.client.filesets.getAssetFilesets).toBe('function');
      expect(typeof testData.client.filesets.createAssetFileset).toBe('function');
      expect(typeof testData.client.filesets.deleteAssetFileset).toBe('function');
      expect(typeof testData.client.filesets.getFileSetFiles).toBe('function');
    });

    it('should handle basic HTTP method calls correctly', async () => {
      // Test that the resource can make basic API calls without errors
      const response = await testData.client.filesets.getAssetFilesets(testData.testAssetId);
      expect(response).toHaveProperty('status');
      expect(response).toHaveProperty('data');
      expect(response.status).toBe(200);
    }, 30000);
  });
});