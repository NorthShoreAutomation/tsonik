/**
 * Integration tests for FileSetResource
 * Tests real API calls against Iconik FileSet API
 */

import { Tsonik } from '../client';
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

describe('FileSetResource Integration Tests', () => {
  let client: Tsonik | null = null;
  let testAssetId: string | null = null;
  // Store format and storage IDs for use in tests
  let testFormatId: string | null = null;
  let testStorageId: string | null = null;
  let testBaseDir: string | null = null;
  let testComponentIds: string[] = [];
  // Track created filesets for cleanup
  const testFilesets: string[] = [];

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

    // Get an asset ID for testing
    try {
      const assetsResponse = await client.assets.listAssets({ per_page: 1 });
      if (assetsResponse.data.objects && assetsResponse.data.objects.length > 0) {
        testAssetId = assetsResponse.data.objects[0].id;
      }
    } catch (error) {
      console.warn('Error retrieving test assets:', error);
    }

    console.log('Using test asset ID:', testAssetId);
    
    // Get existing filesets to extract valid format/storage values for this asset
    if (client && testAssetId) {
      try {
        const response = await client.filesets.getAssetFilesets(testAssetId);
        if (response.data.objects && response.data.objects.length > 0) {
          const sampleFileset = response.data.objects[0];
          testFormatId = sampleFileset.format_id || null;
          testStorageId = sampleFileset.storage_id || null;
          testBaseDir = sampleFileset.base_dir || null;
          testComponentIds = sampleFileset.component_ids || [];
          
          console.log('Got test format_id:', testFormatId);
          console.log('Got test storage_id:', testStorageId);
        }
      } catch (error) {
        console.warn('Error retrieving test filesets:', error);
      }
    }
  }, 30000);

  describe('get asset filesets', () => {
    it('should get filesets for an asset with default parameters', async () => {
      if (!client) {
        console.warn('Skipping test: no client configured');
        return;
      }

      if (!testAssetId) {
        console.warn('Skipping test: no test asset available');
        return;
      }

      const response: ApiResponse<PaginatedResponse<FileSet>> = await client.filesets.getAssetFilesets(testAssetId);
      
      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();
      expect(response.data.objects).toBeInstanceOf(Array);
      // Note: FileSet API may not include total field - check if present
      if (response.data.total !== undefined) {
        expect(typeof response.data.total).toBe('number');
      }
      
      // Temporary logging to see real fileset data
      if (response.data.objects.length > 0) {
        console.log('Sample fileset data:', JSON.stringify(response.data.objects[0], null, 2));
      }
      
      // Verify filesets have required structure
      response.data.objects.forEach(fileset => {
        expect(fileset.id).toBeDefined();
        expect(typeof fileset.id).toBe('string');
        expect(fileset.asset_id).toBe(testAssetId);
      });
    }, 30000);

    it('should get filesets with pagination parameters', async () => {
      if (!client) {
        console.warn('Skipping test: no client configured');
        return;
      }

      if (!testAssetId) {
        console.warn('Skipping test: no test asset available');
        return;
      }

      const params: AssetFileSetsListParams = {
        per_page: 5,
        file_count: true
      };

      const response: ApiResponse<PaginatedResponse<FileSet>> = await client.filesets.getAssetFilesets(testAssetId, params);
      
      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();
      expect(response.data.objects).toBeInstanceOf(Array);
      expect(response.data.objects.length).toBeLessThanOrEqual(5);
      
      // Verify filesets have required id field
      response.data.objects.forEach(fileset => {
        expect(fileset.id).toBeDefined();
        expect(typeof fileset.id).toBe('string');
        expect(fileset.asset_id).toBe(testAssetId);
        // file_count should be present when requested
        if (fileset.file_count !== undefined) {
          expect(typeof fileset.file_count).toBe('number');
        }
      });
    }, 30000);

    it('should get filesets with file_count enabled', async () => {
      if (!client) {
        console.warn('Skipping test: no client configured');
        return;
      }

      if (!testAssetId) {
        console.warn('Skipping test: no test asset available');
        return;
      }

      const params: AssetFileSetsListParams = {
        file_count: true
      };

      const response: ApiResponse<PaginatedResponse<FileSet>> = await client.filesets.getAssetFilesets(testAssetId, params);
      
      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();
      expect(response.data.objects).toBeInstanceOf(Array);
      
      // Verify filesets have file count information
      response.data.objects.forEach(fileset => {
        expect(fileset.id).toBeDefined();
        expect(fileset.asset_id).toBe(testAssetId);
        if (fileset.file_count !== undefined) {
          expect(typeof fileset.file_count).toBe('number');
          expect(fileset.file_count).toBeGreaterThanOrEqual(0);
        }
      });
    }, 30000);

    it('should handle pagination with last_id', async () => {
      if (!client) {
        console.warn('Skipping test: no client configured');
        return;
      }

      if (!testAssetId) {
        console.warn('Skipping test: no test asset available');
        return;
      }

      // First get some filesets to find a valid last_id
      const initialResponse = await client.filesets.getAssetFilesets(testAssetId, { per_page: 1 });
      
      if (initialResponse.data.objects.length === 0) {
        console.warn('Skipping pagination test: no filesets found for asset');
        return;
      }

      // Use the first fileset ID as last_id for pagination test
      const params: AssetFileSetsListParams = {
        per_page: 2,
        last_id: initialResponse.data.objects[0].id
      };

      const response: ApiResponse<PaginatedResponse<FileSet>> = await client.filesets.getAssetFilesets(testAssetId, params);
      
      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();
      expect(response.data.objects).toBeInstanceOf(Array);
      expect(response.data.objects.length).toBeLessThanOrEqual(2);
    }, 30000);

    it('should handle getting filesets for non-existent asset', async () => {
      if (!client) {
        console.warn('Skipping test: no client configured');
        return;
      }

      const nonExistentAssetId = 'non-existent-asset-filesets';

      try {
        await client.filesets.getAssetFilesets(nonExistentAssetId);
        fail('Expected an error for non-existent asset');
      } catch (error: any) {
        // Should get a 404 error for non-existent asset
        expect(error.statusCode || error.response?.status || error.status).toBe(404);
      }
    }, 30000);

    it('should validate asset ID is required', async () => {
      if (!client) {
        console.warn('Skipping test: no client configured');
        return;
      }

      await expect(client.filesets.getAssetFilesets(''))
        .rejects
        .toThrow('Asset ID is required');
    }, 30000);

    it('should validate asset ID cannot be whitespace', async () => {
      if (!client) {
        console.warn('Skipping test: no client configured');
        return;
      }

      await expect(client.filesets.getAssetFilesets('   '))
        .rejects
        .toThrow('Asset ID is required');
    }, 30000);

    it('should handle filesets with various statuses', async () => {
      if (!client) {
        console.warn('Skipping test: no client configured');
        return;
      }

      if (!testAssetId) {
        console.warn('Skipping test: no test asset available');
        return;
      }

      const response = await client.filesets.getAssetFilesets(testAssetId);
      
      expect(response.status).toBe(200);
      expect(response.data.objects).toBeInstanceOf(Array);
      
      // Verify filesets have proper structure
      response.data.objects.forEach(fileset => {
        expect(fileset.id).toBeDefined();
        expect(typeof fileset.id).toBe('string');
        expect(fileset.asset_id).toBe(testAssetId);
        
        // Validate status if present
        if (fileset.status) {
          expect(['ACTIVE', 'DELETED', 'ARCHIVED']).toContain(fileset.status);
        }
        
        // Validate storage_id if present
        if (fileset.storage_id) {
          expect(typeof fileset.storage_id).toBe('string');
        }
        
        // Validate is_archive if present
        if (fileset.is_archive !== undefined) {
          expect(typeof fileset.is_archive).toBe('boolean');
        }
        
        // Validate component_ids if present
        if (fileset.component_ids) {
          expect(Array.isArray(fileset.component_ids)).toBe(true);
        }
      });
    }, 30000);

    it('should handle filesets with complete field structure', async () => {
      if (!client) {
        console.warn('Skipping test: no client configured');
        return;
      }

      if (!testAssetId) {
        console.warn('Skipping test: no test asset available');
        return;
      }

      const params: AssetFileSetsListParams = {
        file_count: true,
        per_page: 10
      };

      const response = await client.filesets.getAssetFilesets(testAssetId, params);
      
      expect(response.status).toBe(200);
      expect(response.data.objects).toBeInstanceOf(Array);
      
      // Check response structure - total may not be present in FileSet API
      if (response.data.total !== undefined) {
        expect(typeof response.data.total).toBe('number');
      }
      
      // Verify filesets have proper field types
      response.data.objects.forEach(fileset => {
        expect(fileset.id).toBeDefined();
        expect(typeof fileset.id).toBe('string');
        
        // Check required field
        expect(fileset.asset_id).toBe(testAssetId);
        
        // Check optional field types
        if (fileset.name) expect(typeof fileset.name).toBe('string');
        if (fileset.base_dir) expect(typeof fileset.base_dir).toBe('string');
        if (fileset.format_id) expect(typeof fileset.format_id).toBe('string');
        if (fileset.version_id) expect(typeof fileset.version_id).toBe('string');
        if (fileset.storage_id) expect(typeof fileset.storage_id).toBe('string');
        if (fileset.file_count !== undefined) expect(typeof fileset.file_count).toBe('number');
        if (fileset.is_archive !== undefined) expect(typeof fileset.is_archive).toBe('boolean');
        if (fileset.date_created) expect(typeof fileset.date_created).toBe('string');
        if (fileset.date_modified) expect(typeof fileset.date_modified).toBe('string');
        if (fileset.date_deleted) expect(typeof fileset.date_deleted).toBe('string');
        if (fileset.deleted_by_user) expect(typeof fileset.deleted_by_user).toBe('string');
        if (fileset.archive_file_set_id) expect(typeof fileset.archive_file_set_id).toBe('string');
        if (fileset.original_storage_id) expect(typeof fileset.original_storage_id).toBe('string');
        if (fileset.component_ids) expect(Array.isArray(fileset.component_ids)).toBe(true);
      });
    }, 30000);
  });

  describe('get single asset fileset', () => {
    it('should get a specific fileset by ID', async () => {
      if (!client) {
        console.warn('Skipping test: no client configured');
        return;
      }

      if (!testAssetId) {
        console.warn('Skipping test: no test asset available');
        return;
      }

      // First get filesets to find a valid fileset ID
      const filesetsResponse = await client.filesets.getAssetFilesets(testAssetId, { per_page: 1 });
      
      if (filesetsResponse.data.objects.length === 0) {
        console.warn('Skipping test: no filesets found for asset');
        return;
      }

      const testFilesetId = filesetsResponse.data.objects[0].id;

      // Now get the specific fileset
      const response: ApiResponse<FileSet> = await client.filesets.getAssetFileset(testAssetId, testFilesetId);
      
      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();
      expect(response.data.id).toBe(testFilesetId);
      expect(response.data.asset_id).toBe(testAssetId);
      
      // Verify required fields
      expect(typeof response.data.id).toBe('string');
      expect(response.data.id.length).toBeGreaterThan(0);
      
      // Verify optional fields have correct types if present
      if (response.data.name) expect(typeof response.data.name).toBe('string');
      if (response.data.storage_id) expect(typeof response.data.storage_id).toBe('string');
      if (response.data.format_id) expect(typeof response.data.format_id).toBe('string');
      if (response.data.status) expect(['ACTIVE', 'DELETED', 'ARCHIVED']).toContain(response.data.status);
      if (response.data.file_count !== undefined) expect(typeof response.data.file_count).toBe('number');
      if (response.data.is_archive !== undefined) expect(typeof response.data.is_archive).toBe('boolean');
      if (response.data.date_created) expect(typeof response.data.date_created).toBe('string');
    }, 30000);

    it('should get fileset with complete field validation', async () => {
      if (!client) {
        console.warn('Skipping test: no client configured');
        return;
      }

      if (!testAssetId) {
        console.warn('Skipping test: no test asset available');
        return;
      }

      // Get filesets to find one to test
      const filesetsResponse = await client.filesets.getAssetFilesets(testAssetId);
      
      if (filesetsResponse.data.objects.length === 0) {
        console.warn('Skipping test: no filesets found for asset');
        return;
      }

      const testFilesetId = filesetsResponse.data.objects[0].id;
      const response = await client.filesets.getAssetFileset(testAssetId, testFilesetId);
      
      expect(response.status).toBe(200);
      expect(response.data.id).toBe(testFilesetId);
      expect(response.data.asset_id).toBe(testAssetId);
      
      // Validate all possible field types
      const fileset = response.data;
      
      // Required fields
      expect(typeof fileset.id).toBe('string');
      
      // Optional string fields
      if (fileset.archive_file_set_id) expect(typeof fileset.archive_file_set_id).toBe('string');
      if (fileset.base_dir) expect(typeof fileset.base_dir).toBe('string');
      if (fileset.deleted_by_user) expect(typeof fileset.deleted_by_user).toBe('string');
      if (fileset.format_id) expect(typeof fileset.format_id).toBe('string');
      if (fileset.name) expect(typeof fileset.name).toBe('string');
      if (fileset.original_storage_id) expect(typeof fileset.original_storage_id).toBe('string');
      if (fileset.storage_id) expect(typeof fileset.storage_id).toBe('string');
      if (fileset.version_id) expect(typeof fileset.version_id).toBe('string');
      
      // Date fields
      if (fileset.date_created) expect(typeof fileset.date_created).toBe('string');
      if (fileset.date_deleted) expect(typeof fileset.date_deleted).toBe('string');
      if (fileset.date_modified) expect(typeof fileset.date_modified).toBe('string');
      
      // Number fields
      if (fileset.file_count !== undefined) expect(typeof fileset.file_count).toBe('number');
      
      // Boolean fields
      if (fileset.is_archive !== undefined) expect(typeof fileset.is_archive).toBe('boolean');
      
      // Array fields
      if (fileset.component_ids) expect(Array.isArray(fileset.component_ids)).toBe(true);
      
      // Enum fields
      if (fileset.status) expect(['ACTIVE', 'DELETED', 'ARCHIVED']).toContain(fileset.status);
    }, 30000);

    it('should handle getting non-existent fileset', async () => {
      if (!client) {
        console.warn('Skipping test: no client configured');
        return;
      }

      if (!testAssetId) {
        console.warn('Skipping test: no test asset available');
        return;
      }

      const nonExistentFilesetId = 'non-existent-fileset-id';

      try {
        await client.filesets.getAssetFileset(testAssetId, nonExistentFilesetId);
        fail('Expected an error for non-existent fileset');
      } catch (error: any) {
        // Should get a 404 error for non-existent fileset
        expect(error.statusCode || error.response?.status || error.status).toBe(404);
      }
    }, 30000);

    it('should handle getting fileset for non-existent asset', async () => {
      if (!client) {
        console.warn('Skipping test: no client configured');
        return;
      }

      const nonExistentAssetId = 'non-existent-asset-id';
      const someFilesetId = 'some-fileset-id';

      try {
        await client.filesets.getAssetFileset(nonExistentAssetId, someFilesetId);
        fail('Expected an error for non-existent asset');
      } catch (error: any) {
        // Should get a 404 error for non-existent asset
        expect(error.statusCode || error.response?.status || error.status).toBe(404);
      }
    }, 30000);

    it('should validate asset ID is required for getAssetFileset', async () => {
      if (!client) {
        console.warn('Skipping test: no client configured');
        return;
      }

      await expect(client.filesets.getAssetFileset('', 'fileset-123'))
        .rejects
        .toThrow('Asset ID is required');
    }, 30000);

    it('should validate asset ID cannot be whitespace for getAssetFileset', async () => {
      if (!client) {
        console.warn('Skipping test: no client configured');
        return;
      }

      await expect(client.filesets.getAssetFileset('   ', 'fileset-123'))
        .rejects
        .toThrow('Asset ID is required');
    }, 30000);

    it('should validate fileset ID is required for getAssetFileset', async () => {
      if (!client) {
        console.warn('Skipping test: no client configured');
        return;
      }

      await expect(client.filesets.getAssetFileset('asset-123', ''))
        .rejects
        .toThrow('File set ID is required');
    }, 30000);

    it('should validate fileset ID cannot be whitespace for getAssetFileset', async () => {
      if (!client) {
        console.warn('Skipping test: no client configured');
        return;
      }

      await expect(client.filesets.getAssetFileset('asset-123', '   '))
        .rejects
        .toThrow('File set ID is required');
    }, 30000);
  });

  describe('create and delete asset filesets', () => {
    it('should create a new fileset for an asset', async () => {
      if (!client) {
        console.warn('Skipping test: no client configured');
        return;
      }

      if (!testAssetId) {
        console.warn('Skipping test: no test asset available');
        return;
      }

      // Skip if we don't have the required test values
      if (!testStorageId || !testFormatId || !testBaseDir) {
        console.warn('Skipping test: missing required test values');
        return;
      }
      
      const createData: CreateFileSetRequest = {
        name: 'Test Fileset',
        storage_id: testStorageId,
        format_id: testFormatId,
        base_dir: testBaseDir,
        component_ids: testComponentIds.length > 0 ? [testComponentIds[0]] : [], // Use first component ID if available
        status: 'ACTIVE'
      };

      const response: ApiResponse<FileSet> = await client.filesets.createAssetFileset(testAssetId, createData);
      
      expect(response.status).toBe(201);
      expect(response.data).toBeDefined();
      expect(response.data.id).toBeDefined();
      expect(typeof response.data.id).toBe('string');
      expect(response.data.asset_id).toBe(testAssetId);
      expect(response.data.date_created).toBeDefined();

      // Add to cleanup list
      testFilesets.push(response.data.id);
    }, 30000);

    it('should create a minimal fileset', async () => {
      if (!client) {
        console.warn('Skipping test: no client configured');
        return;
      }

      if (!testAssetId) {
        console.warn('Skipping test: no test asset available');
        return;
      }

      // Skip if we don't have the required test values
      if (!testStorageId || !testFormatId || !testBaseDir) {
        console.warn('Skipping test: missing required test values');
        return;
      }
      
      const createData: CreateFileSetRequest = {
        name: 'Test Fileset',
        storage_id: testStorageId,
        format_id: testFormatId,
        base_dir: testBaseDir,
        component_ids: testComponentIds.length > 0 ? [testComponentIds[0]] : [], // Use first component ID if available
        status: 'ACTIVE'
      };

      const response = await client.filesets.createAssetFileset(testAssetId, createData);
      
      expect(response.status).toBe(201);
      expect(response.data.id).toBeDefined();
      expect(response.data.asset_id).toBe(testAssetId);

      // Add to cleanup list
      testFilesets.push(response.data.id);
    }, 30000);

    it('should create a fileset with component IDs', async () => {
      if (!client) {
        console.warn('Skipping test: no client configured');
        return;
      }

      if (!testAssetId) {
        console.warn('Skipping test: no test asset available');
        return;
      }

      // Skip if we don't have the required test values
      if (!testStorageId || !testFormatId || !testBaseDir) {
        console.warn('Skipping test: missing required test values');
        return;
      }
      
      const createData: CreateFileSetRequest = {
        name: 'Test Fileset',
        storage_id: testStorageId,
        format_id: testFormatId,
        base_dir: testBaseDir,
        component_ids: testComponentIds.length > 0 ? [testComponentIds[0]] : [], // Use first component ID if available
        status: 'ACTIVE'
      };

      const response = await client.filesets.createAssetFileset(testAssetId, createData);
      
      expect(response.status).toBe(201);
      expect(response.data.id).toBeDefined();
      expect(response.data.asset_id).toBe(testAssetId);

      // Add to cleanup list
      testFilesets.push(response.data.id);
    }, 30000);

    it('should delete a fileset (soft delete)', async () => {
      if (!client) {
        console.warn('Skipping test: no client configured');
        return;
      }

      if (!testAssetId) {
        console.warn('Skipping test: no test asset available');
        return;
      }

      // First create a fileset to delete
      // Skip if we don't have the required test values
      if (!testStorageId || !testFormatId || !testBaseDir) {
        console.warn('Skipping test: missing required test values');
        return;
      }
      
      const createData: CreateFileSetRequest = {
        name: 'Test Fileset',
        storage_id: testStorageId,
        format_id: testFormatId,
        base_dir: testBaseDir,
        component_ids: testComponentIds.length > 0 ? [testComponentIds[0]] : [], // Use first component ID if available
        status: 'ACTIVE'
      };

      const createResponse = await client.filesets.createAssetFileset(testAssetId, createData);
      expect(createResponse.status).toBe(201);
      const filesetId = createResponse.data.id;

      // Now delete it (soft delete)
      const deleteResponse = await client.filesets.deleteAssetFileset(testAssetId, filesetId);
      
      expect(deleteResponse.status).toBe(200);
      expect(deleteResponse.data).toBeDefined();
      
      // Verify the response contains fileset data (soft delete)
      if (deleteResponse.data && typeof deleteResponse.data === 'object' && 'id' in deleteResponse.data) {
        expect(deleteResponse.data.id).toBe(filesetId);
        // Status might be DELETED for soft delete
        if ('status' in deleteResponse.data) {
          expect(deleteResponse.data.status).toBe('DELETED');
        }
      }

      // Remove from cleanup list since we deleted it
      const index = testFilesets.indexOf(filesetId);
      if (index > -1) {
        testFilesets.splice(index, 1);
      }
    }, 30000);

    it('should delete a fileset immediately', async () => {
      if (!client) {
        console.warn('Skipping test: no client configured');
        return;
      }

      if (!testAssetId) {
        console.warn('Skipping test: no test asset available');
        return;
      }

      // First create a fileset to delete immediately
      // Skip if we don't have the required test values
      if (!testStorageId || !testFormatId || !testBaseDir) {
        console.warn('Skipping test: missing required test values');
        return;
      }
      
      const createData: CreateFileSetRequest = {
        name: 'Test Fileset',
        storage_id: testStorageId,
        format_id: testFormatId,
        base_dir: testBaseDir,
        component_ids: testComponentIds.length > 0 ? [testComponentIds[0]] : [], // Use first component ID if available
        status: 'ACTIVE'
      };

      const createResponse = await client.filesets.createAssetFileset(testAssetId, createData);
      expect(createResponse.status).toBe(201);
      const filesetId = createResponse.data.id;

      // Now delete it immediately
      const options: DeleteFileSetOptions = {
        immediately: true
      };

      const deleteResponse = await client.filesets.deleteAssetFileset(testAssetId, filesetId, options);
      
      expect(deleteResponse.status).toBe(204);
      expect(deleteResponse.data).toBeNull();

      // Remove from cleanup list since we deleted it
      const index = testFilesets.indexOf(filesetId);
      if (index > -1) {
        testFilesets.splice(index, 1);
      }
    }, 30000);

    it('should delete a fileset with keep_source option', async () => {
      if (!client) {
        console.warn('Skipping test: no client configured');
        return;
      }

      if (!testAssetId) {
        console.warn('Skipping test: no test asset available');
        return;
      }

      // First create a fileset to delete with keep_source
      // Skip if we don't have the required test values
      if (!testStorageId || !testFormatId || !testBaseDir) {
        console.warn('Skipping test: missing required test values');
        return;
      }
      
      const createData: CreateFileSetRequest = {
        name: 'Test Fileset',
        storage_id: testStorageId,
        format_id: testFormatId,
        base_dir: testBaseDir,
        component_ids: testComponentIds.length > 0 ? [testComponentIds[0]] : [], // Use first component ID if available
        status: 'ACTIVE'
      };

      const createResponse = await client.filesets.createAssetFileset(testAssetId, createData);
      expect(createResponse.status).toBe(201);
      const filesetId = createResponse.data.id;

      // Now delete it with keep_source
      const options: DeleteFileSetOptions = {
        keep_source: true
      };

      const deleteResponse = await client.filesets.deleteAssetFileset(testAssetId, filesetId, options);
      
      expect(deleteResponse.status).toBe(200);
      expect(deleteResponse.data).toBeDefined();

      // Remove from cleanup list since we deleted it
      const index = testFilesets.indexOf(filesetId);
      if (index > -1) {
        testFilesets.splice(index, 1);
      }
    }, 30000);

    it('should handle creating fileset for non-existent asset', async () => {
      if (!client) {
        console.warn('Skipping test: no client configured');
        return;
      }

      const nonExistentAssetId = 'non-existent-asset-create';
      // Skip if we don't have the required test values
      if (!testStorageId || !testFormatId || !testBaseDir) {
        console.warn('Skipping test: missing required test values');
        return;
      }
      
      const createData: CreateFileSetRequest = {
        name: 'Test Fileset',
        storage_id: testStorageId,
        format_id: testFormatId,
        base_dir: testBaseDir,
        component_ids: testComponentIds.length > 0 ? [testComponentIds[0]] : [], // Use first component ID if available
        status: 'ACTIVE'
      };

      try {
        await client.filesets.createAssetFileset(nonExistentAssetId, createData);
        fail('Expected an error for non-existent asset');
      } catch (error: any) {
        // Should get a 404 error for non-existent asset
        expect(error.statusCode || error.response?.status || error.status).toBe(404);
      }
    }, 30000);

    it('should handle deleting non-existent fileset', async () => {
      if (!client) {
        console.warn('Skipping test: no client configured');
        return;
      }

      if (!testAssetId) {
        console.warn('Skipping test: no test asset available');
        return;
      }

      const nonExistentFilesetId = 'non-existent-fileset-delete';

      try {
        await client.filesets.deleteAssetFileset(testAssetId, nonExistentFilesetId);
        fail('Expected an error for non-existent fileset');
      } catch (error: any) {
        // Should get a 404 error for non-existent fileset
        expect(error.statusCode || error.response?.status || error.status).toBe(404);
      }
    }, 30000);

    it('should validate asset ID is required for createAssetFileset', async () => {
      if (!client) {
        console.warn('Skipping test: no client configured');
        return;
      }

      // Skip if we don't have the required test values
      if (!testStorageId || !testFormatId || !testBaseDir) {
        console.warn('Skipping test: missing required test values');
        return;
      }
      
      const createData: CreateFileSetRequest = {
        name: 'Test Fileset',
        storage_id: testStorageId,
        format_id: testFormatId,
        base_dir: testBaseDir,
        component_ids: testComponentIds.length > 0 ? [testComponentIds[0]] : [], // Use first component ID if available
        status: 'ACTIVE'
      };

      await expect(client.filesets.createAssetFileset('', createData))
        .rejects
        .toThrow('Asset ID is required');
    }, 30000);

    it('should validate asset ID is required for deleteAssetFileset', async () => {
      if (!client) {
        console.warn('Skipping test: no client configured');
        return;
      }

      await expect(client.filesets.deleteAssetFileset('', 'fileset-123'))
        .rejects
        .toThrow('Asset ID is required');
    }, 30000);

    it('should validate fileset ID is required for deleteAssetFileset', async () => {
      if (!client) {
        console.warn('Skipping test: no client configured');
        return;
      }

      await expect(client.filesets.deleteAssetFileset('asset-123', ''))
        .rejects
        .toThrow('File set ID is required');
    }, 30000);
  });

  describe('get fileset files', () => {
    let testFilesetId: string | null = null;

    // First find a fileset to use for file tests
    beforeAll(async () => {
      if (!client || !testAssetId) return;
      
      try {
        // Get a fileset ID to test with
        const response = await client.filesets.getAssetFilesets(testAssetId);
        if (response.data.objects && response.data.objects.length > 0) {
          testFilesetId = response.data.objects[0].id || null;
          console.log('Using test fileset ID:', testFilesetId);
        }
      } catch (error) {
        console.warn('Error getting test fileset ID:', error);
      }
    }, 30000);

    it('should get files from a fileset with default parameters', async () => {
      if (!client) {
        console.warn('Skipping test: no client configured');
        return;
      }

      if (!testAssetId || !testFilesetId) {
        console.warn('Skipping test: no test asset or fileset available');
        return;
      }

      const response = await client.filesets.getFileSetFiles(testAssetId, testFilesetId);
      
      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();
      expect(response.data.objects).toBeInstanceOf(Array);
      // We don't know if there are files, but the API should return a valid response
    }, 30000);

    it('should get files with pagination parameters', async () => {
      if (!client) {
        console.warn('Skipping test: no client configured');
        return;
      }

      if (!testAssetId || !testFilesetId) {
        console.warn('Skipping test: no test asset or fileset available');
        return;
      }

      const options: FileSetFilesListParams = {
        per_page: 5
      };

      const response = await client.filesets.getFileSetFiles(testAssetId, testFilesetId, options);
      
      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();
      expect(response.data.objects).toBeInstanceOf(Array);
      // per_page should be reflected in the response
      if (response.data.per_page !== undefined) {
        expect(response.data.per_page).toBe(5);
      }
    }, 30000);

    it('should get files with file_count enabled', async () => {
      if (!client) {
        console.warn('Skipping test: no client configured');
        return;
      }

      if (!testAssetId || !testFilesetId) {
        console.warn('Skipping test: no test asset or fileset available');
        return;
      }

      const options: FileSetFilesListParams = {
        file_count: true
      };

      const response = await client.filesets.getFileSetFiles(testAssetId, testFilesetId, options);
      
      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();
      expect(response.data.objects).toBeInstanceOf(Array);
      // total field should be present when file_count is true
      expect(typeof response.data.total).toBe('number');
    }, 30000);

    it('should handle getting files for non-existent fileset', async () => {
      if (!client) {
        console.warn('Skipping test: no client configured');
        return;
      }

      if (!testAssetId) {
        console.warn('Skipping test: no test asset available');
        return;
      }

      try {
        await client.filesets.getFileSetFiles(testAssetId, 'non-existent-fileset-id');
        fail('Expected to throw an error for non-existent fileset');
      } catch (error: any) {
        expect(error.response?.status).toBe(404);
      }
    }, 30000);

    it('should validate asset ID is required', async () => {
      if (!client) {
        console.warn('Skipping test: no client configured');
        return;
      }

      if (!testFilesetId) {
        console.warn('Skipping test: no test fileset available');
        return;
      }

      await expect(client.filesets.getFileSetFiles('', testFilesetId))
        .rejects
        .toThrow('Asset ID is required');
    }, 30000);

    it('should validate fileset ID is required', async () => {
      if (!client) {
        console.warn('Skipping test: no client configured');
        return;
      }

      if (!testAssetId) {
        console.warn('Skipping test: no test asset available');
        return;
      }

      await expect(client.filesets.getFileSetFiles(testAssetId, ''))
        .rejects
        .toThrow('File set ID is required');
    }, 30000);
  });

  afterAll(async () => {
    // Clean up test filesets
    if (client && testFilesets.length > 0) {
      for (const filesetId of testFilesets) {
        try {
          if (testAssetId) {
            await client.filesets.deleteAssetFileset(testAssetId, filesetId, { immediately: true });
            console.log(`Cleaned up test fileset: ${filesetId}`);
          }
        } catch (error) {
          console.warn(`Failed to clean up test fileset ${filesetId}:`, error);
        }
      }
    }
  });
});