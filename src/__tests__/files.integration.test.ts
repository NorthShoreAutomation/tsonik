/**
 * Integration tests for FileResource
 * Tests real API calls using actual data from the environment
 */

import { 
  ApiResponse,
  PaginatedResponse,
  Asset
} from '../types';
import { AssetFile, AssetFilesListParams, AssetFileParams, CreateFileRequest } from '../types/files';
import { FileSet } from '../types/filesets';
import { setupTestData, cleanupTestData, trackCreatedFile, TestData } from './test-utils';

describe('FileResource Integration Tests', () => {
  let testData: TestData;
  let realFilesetData: {
    filesetId: string;
    formatId: string;
    storageId: string;
    baseDir: string;
  } | null = null;

  // Setup test environment with real test data
  beforeAll(async () => {
    testData = await setupTestData('Files Integration Test Asset');
    
    // Get real fileset data from the test asset to use for file creation
    try {
      const filesetsResponse = await testData.client.filesets.getAssetFilesets(testData.testAssetId);
      if (filesetsResponse.data.objects && filesetsResponse.data.objects.length > 0) {
        const fileset = filesetsResponse.data.objects[0];
        realFilesetData = {
          filesetId: fileset.id,
          formatId: fileset.format_id || '',
          storageId: fileset.storage_id || '',
          baseDir: fileset.base_dir || ''
        };
        console.log('Using real fileset data for tests:', realFilesetData);
      }
    } catch (error) {
      console.warn('Could not fetch fileset data for file creation tests:', error);
    }
  }, 30000);

  afterAll(async () => {
    await cleanupTestData(testData);
  });

  describe('get asset files', () => {
    it('should get files for an asset with default parameters', async () => {
      const response = await testData.client.files.getAssetFiles(testData.testAssetId);
      
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('objects');
      expect(Array.isArray(response.data.objects)).toBe(true);
      
      // If files exist, verify their structure
      if (response.data.objects.length > 0) {
        const file = response.data.objects[0];
        expect(file).toHaveProperty('id');
        expect(file).toHaveProperty('asset_id');
        expect(file).toHaveProperty('name');
        expect(file).toHaveProperty('type');
        expect(file.asset_id).toBe(testData.testAssetId);
      }
    }, 30000);

    it('should get files with pagination parameters', async () => {
      const params: AssetFilesListParams = {
        per_page: 5,
        generate_signed_url: true
      };

      const response = await testData.client.files.getAssetFiles(testData.testAssetId, params);
      
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('objects');
      expect(Array.isArray(response.data.objects)).toBe(true);
      
      // Verify files have URLs when requested
      if (response.data.objects.length > 0) {
        const fileWithUrl = response.data.objects.find(file => file.url);
        if (fileWithUrl) {
          expect(typeof fileWithUrl.url).toBe('string');
        }
      }
    }, 30000);

    it('should handle non-existent asset gracefully', async () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000';
      
      try {
        await testData.client.files.getAssetFiles(nonExistentId);
        fail('Expected error was not thrown');
      } catch (error: any) {
        const statusCode = error.statusCode || error.response?.status || error.status;
        expect(statusCode).toBeGreaterThanOrEqual(400);
      }
    }, 30000);

    it('should validate asset ID is required', async () => {
      try {
        // @ts-ignore - testing validation
        await testData.client.files.getAssetFiles('');
        fail('Expected error was not thrown');
      } catch (error: any) {
        expect(error.message).toMatch(/asset id/i);
      }
    }, 30000);
  });

  describe('get specific asset file', () => {
    let existingFileId: string | null = null;

    beforeAll(async () => {
      // Get an existing file from the asset to test with
      try {
        const filesResponse = await testData.client.files.getAssetFiles(testData.testAssetId);
        if (filesResponse.data.objects && filesResponse.data.objects.length > 0) {
          existingFileId = filesResponse.data.objects[0].id;
          console.log('Using existing file for get tests:', existingFileId);
        }
      } catch (error) {
        console.warn('Could not fetch existing files for get tests:', error);
      }
    }, 30000);

    it('should get a specific file by ID', async () => {
      if (!existingFileId) {
        console.warn('No existing file found - skipping specific file test');
        return;
      }

      const response = await testData.client.files.getAssetFile(testData.testAssetId, existingFileId);
      
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('id');
      expect(response.data).toHaveProperty('asset_id');
      expect(response.data).toHaveProperty('name');
      expect(response.data.id).toBe(existingFileId);
      expect(response.data.asset_id).toBe(testData.testAssetId);
    }, 30000);

    it('should get file with query parameters', async () => {
      if (!existingFileId) {
        console.warn('No existing file found - skipping file with params test');
        return;
      }

      const params: AssetFileParams = {
        generate_signed_post_url: true,
        content_disposition: 'attachment'
      };

      const response = await testData.client.files.getAssetFile(testData.testAssetId, existingFileId, params);
      
      expect(response.status).toBe(200);
      expect(response.data.id).toBe(existingFileId);
    }, 30000);

    it('should handle non-existent file ID', async () => {
      const nonExistentFileId = '00000000-0000-0000-0000-000000000000';
      
      try {
        await testData.client.files.getAssetFile(testData.testAssetId, nonExistentFileId);
        fail('Expected error was not thrown');
      } catch (error: any) {
        const statusCode = error.statusCode || error.response?.status || error.status;
        expect(statusCode).toBeGreaterThanOrEqual(400);
      }
    }, 30000);

    it('should validate required parameters', async () => {
      try {
        // @ts-ignore - testing validation
        await testData.client.files.getAssetFile('', 'file-id');
        fail('Expected error was not thrown');
      } catch (error: any) {
        expect(error.message).toMatch(/asset id/i);
      }

      try {
        // @ts-ignore - testing validation
        await testData.client.files.getAssetFile(testData.testAssetId, '');
        fail('Expected error was not thrown');
      } catch (error: any) {
        expect(error.message).toMatch(/file id/i);
      }
    }, 30000);
  });

  describe('create asset file', () => {
    it('should create a basic file when real fileset data is available', async () => {
      if (!realFilesetData || !realFilesetData.filesetId) {
        console.warn('No real fileset data available - skipping file creation test');
        return;
      }

      const fileData: CreateFileRequest = {
        name: `Test File ${Date.now()}`,
        original_name: `test_file_${Date.now()}.txt`,
        type: 'FILE',
        file_set_id: realFilesetData.filesetId,
        format_id: realFilesetData.formatId,
        storage_id: realFilesetData.storageId,
        size: 1024
      };
      
      try {
        const response = await testData.client.files.createAssetFile(testData.testAssetId, fileData);
        
        expect(response.status).toBe(201);
        expect(response.data).toHaveProperty('id');
        expect(response.data).toHaveProperty('asset_id');
        expect(response.data.asset_id).toBe(testData.testAssetId);
        expect(response.data.name).toBe(fileData.name);
        expect(response.data.type).toBe('FILE');
        
        // Track for cleanup
        if (response.data.id) {
          trackCreatedFile(testData, response.data.id);
        }
      } catch (error: any) {
        // Log error details for debugging
        console.error('File creation failed:', {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
          fileData
        });
        throw error;
      }
    }, 30000);

    it('should create a directory type file when real fileset data is available', async () => {
      if (!realFilesetData || !realFilesetData.filesetId) {
        console.warn('No real fileset data available - skipping directory creation test');
        return;
      }

      const fileData: CreateFileRequest = {
        name: `Test Directory ${Date.now()}`,
        original_name: `test_directory_${Date.now()}`,
        type: 'DIRECTORY',
        file_set_id: realFilesetData.filesetId,
        format_id: realFilesetData.formatId,
        storage_id: realFilesetData.storageId,
        directory_path: `test/path/${Date.now()}`
      };
      
      try {
        const response = await testData.client.files.createAssetFile(testData.testAssetId, fileData);
        
        expect(response.status).toBe(201);
        expect(response.data).toHaveProperty('id');
        expect(response.data.asset_id).toBe(testData.testAssetId);
        expect(response.data.name).toBe(fileData.name);
        expect(response.data.type).toBe('DIRECTORY');
        
        // Track for cleanup
        if (response.data.id) {
          trackCreatedFile(testData, response.data.id);
        }
      } catch (error: any) {
        console.error('Directory creation failed:', {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
          fileData
        });
        throw error;
      }
    }, 30000);

    it('should handle validation errors gracefully', async () => {
      // Test with invalid data to ensure proper error handling
      const invalidFileData: CreateFileRequest = {
        name: `Invalid File ${Date.now()}`,
        type: 'FILE',
        file_set_id: '00000000-0000-0000-0000-000000000000' // Invalid fileset ID
      };
      
      try {
        await testData.client.files.createAssetFile(testData.testAssetId, invalidFileData);
        fail('Expected validation error was not thrown');
      } catch (error: any) {
        const statusCode = error.statusCode || error.response?.status || error.status;
        expect(statusCode).toBeGreaterThanOrEqual(400);
        
        // Should have validation error details
        if (error.response?.data?.errors) {
          expect(typeof error.response.data.errors).toBe('object');
        }
      }
    }, 30000);

    it('should validate asset ID is required for creation', async () => {
      const fileData: CreateFileRequest = {
        name: 'Test File',
        type: 'FILE'
      };
      
      try {
        // @ts-ignore - testing validation
        await testData.client.files.createAssetFile('', fileData);
        fail('Expected error was not thrown');
      } catch (error: any) {
        expect(error.message).toMatch(/asset id/i);
      }
    }, 30000);

    it('should handle non-existent asset for creation', async () => {
      const nonExistentAssetId = '00000000-0000-0000-0000-000000000000';
      const fileData: CreateFileRequest = {
        name: 'Test File',
        type: 'FILE'
      };
      
      try {
        await testData.client.files.createAssetFile(nonExistentAssetId, fileData);
        fail('Expected error was not thrown');
      } catch (error: any) {
        const statusCode = error.statusCode || error.response?.status || error.status;
        expect(statusCode).toBeGreaterThanOrEqual(400);
      }
    }, 30000);
  });

  describe('files resource methods', () => {
    it('should have all required methods available', () => {
      expect(typeof testData.client.files.getAssetFiles).toBe('function');
      expect(typeof testData.client.files.getAssetFile).toBe('function');
      expect(typeof testData.client.files.createAssetFile).toBe('function');
    });
  });
});
