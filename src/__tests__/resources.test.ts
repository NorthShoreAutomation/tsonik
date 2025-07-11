import axios from 'axios';
import { IconikClient } from '../index';
import {
  Asset,
  BulkJobResult,
  Collection,
  Job,
  JobAction,
  JobCreate,
  JobStep,
  JobStepStatus,
  JobsPriorityUpdate,
  JobsQuery,
  JobsStateUpdate,
  JobStepsUpdate,
  JobUpdate
} from '../types';
import { CollectionListParams, CreateCollectionRequest, DeleteCollectionResponse, UpdateCollectionRequest, UpdateCollectionOptions, ReplaceCollectionRequest, ReplaceCollectionOptions } from '../types/collections';
import { FileSet, AssetFileSetsListParams, CreateFileSetRequest, DeleteFileSetOptions } from '../types/filesets';
import { CreateFileRequest } from '../types/files';
import { Format, AssetFormatsListParams, CreateFormatRequest, UpdateFormatRequest, ReplaceFormatRequest } from '../types/formats';

// Create mock Axios instance with proper interceptors setup
const mockAxiosInstance = {
  request: jest.fn(),
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  patch: jest.fn(),
  delete: jest.fn(),
  interceptors: {
    request: { use: jest.fn() },
    response: { use: jest.fn() }
  },
  defaults: {}
};

// Mock axios with create returning our mock instance
jest.mock('axios', () => ({
  create: jest.fn(() => mockAxiosInstance),
}));

describe('IconikClient Resources', () => {
  let client: IconikClient;

  beforeEach(() => {
    // Reset mocks between tests
    mockAxiosInstance.request.mockReset();
    mockAxiosInstance.get.mockReset();
    mockAxiosInstance.post.mockReset();
    mockAxiosInstance.put.mockReset();
    mockAxiosInstance.patch.mockReset();
    mockAxiosInstance.delete.mockReset();
    
    // Default response for all methods
    const defaultResponse = {
      status: 200,
      statusText: 'OK',
      headers: {},
      data: {}
    };
    
    mockAxiosInstance.request.mockResolvedValue(defaultResponse);
    mockAxiosInstance.get.mockResolvedValue(defaultResponse);
    mockAxiosInstance.post.mockResolvedValue(defaultResponse);
    mockAxiosInstance.put.mockResolvedValue(defaultResponse);
    mockAxiosInstance.patch.mockResolvedValue(defaultResponse);
    mockAxiosInstance.delete.mockResolvedValue(defaultResponse);
    
    // Create a fresh client before each test
    client = new IconikClient({
      appId: 'test-app-id',
      authToken: 'test-auth-token',
      baseUrl: 'https://app.iconik.io/v1'
    });
  });

  describe('AssetResource', () => {
    it('should get an asset by ID', async () => {
      // Setup mock response
      const mockAsset: Asset = {
        id: 'asset-123',
        title: 'Test Asset',
        description: 'Test Description',
        created_date: '2025-06-30T13:51:20-05:00',
        modified_date: '2025-06-30T13:51:20-05:00',
        status: 'ACTIVE',
        type: 'ASSET',
      };

      mockAxiosInstance.get.mockResolvedValueOnce({
        status: 200,
        statusText: 'OK',
        headers: {},
        data: mockAsset
      });

      // Call the method
      const result = await client.assets.getAsset('asset-123');

      // Assertions
      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        '/API/assets/v1/assets/asset-123',
        undefined
      );
      expect(result.data).toEqual(mockAsset);
      expect(result.status).toBe(200);
    });

    it('should list assets with filters', async () => {
      // Setup mock paginated response
      const mockAssetList = {
        objects: [
          { id: 'asset-1', title: 'Asset 1' },
          { id: 'asset-2', title: 'Asset 2' },
        ],
        page_token: 'next-page-token',
        total_count: 2
      };

      mockAxiosInstance.get.mockResolvedValueOnce({
        status: 200,
        statusText: 'OK',
        headers: {},
        data: mockAssetList
      });

      // Call the method with filters
      const listAssetsParams = { limit: 10, sort: 'created_date', filter: { status: 'active' } };
      const result = await client.assets.listAssets(listAssetsParams);

      // Assertions
      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        '/API/assets/v1/assets/',
        { params: { limit: 10, sort: 'created_date', filter: { status: 'active' } } }
      );
      
      // Check that URL contains our parameters
      const url = mockAxiosInstance.get.mock.calls[0][0];
      // url is the first parameter to the get method
      expect(url).toBe('/API/assets/v1/assets/');
      
      expect(result.data).toEqual(mockAssetList);
      expect(result.status).toBe(200);
      expect(result.data.objects).toHaveLength(2);
    });

    it('should create an asset', async () => {
      // Setup mock response for asset creation
      const newAsset = {
        title: 'New Asset',
        description: 'Created through API'
      };
      
      const createdAsset = {
        id: 'new-asset-id',
        title: 'New Asset',
        description: 'Created through API',
        created_date: '2025-06-30T13:51:20-05:00',
        modified_date: '2025-06-30T13:51:20-05:00',
        status: 'ACTIVE',
        type: 'ASSET',
      };

      mockAxiosInstance.post.mockResolvedValueOnce({
        status: 201,
        statusText: 'Created',
        headers: {},
        data: createdAsset
      });

      // Call the method
      const result = await client.assets.createAsset(newAsset);

      // Assertions
      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        '/API/assets/v1/assets',
        newAsset,
        undefined
      );
      expect(result.data).toEqual(createdAsset);
      expect(result.status).toBe(201);
    });


    it('should delete an asset', async () => {
      mockAxiosInstance.delete.mockResolvedValueOnce({
        status: 204,
        statusText: 'No Content',
        headers: {},
        data: undefined
      });

      const result = await client.assets.deleteAsset('asset-123');
      
      expect(mockAxiosInstance.delete).toHaveBeenCalledWith(
        '/API/assets/v1/assets/asset-123',
        undefined
      );
      expect(result.status).toBe(204);
    });

    it('should bulk delete assets', async () => {
      const assetIds = ['asset-1', 'asset-2', 'asset-3'];
      
      mockAxiosInstance.post.mockResolvedValueOnce({
        status: 200,
        statusText: 'OK',
        headers: {},
        data: undefined
      });

      const result = await client.assets.bulkDeleteAssets(assetIds);
      
      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        '/API/assets/v1/assets/bulk_delete',
        { asset_ids: assetIds },
        undefined
      );
      expect(result.status).toBe(200);
    });

    it('should validate bulk delete - empty array', async () => {
      await expect(client.assets.bulkDeleteAssets([]))
        .rejects
        .toThrow('Asset IDs array cannot be empty');
    });

    it('should validate bulk delete - too many assets', async () => {
      const tooManyAssets = Array.from({ length: 501 }, (_, i) => `asset-${i}`);
      
      await expect(client.assets.bulkDeleteAssets(tooManyAssets))
        .rejects
        .toThrow('Cannot delete more than 500 assets at once');
    });

  });

  describe('JobResource', () => {
    it('should get a job by ID', async () => {
      // Setup mock response
      const mockJob: Job = {
        id: 'job-123',
        title: 'Test Transcoding Job',
        type: 'TRANSCODE',
        status: 'STARTED',
        priority: 5,
        progress: 75,
        object_id: 'asset-456',
        object_type: 'assets',
        date_created: '2023-01-01T00:00:00Z'
      };

      mockAxiosInstance.get.mockResolvedValue({
        status: 200,
        statusText: 'OK',
        headers: {},
        data: mockJob
      });

      // Execute test
      const result = await client.jobs.getJob('job-123');

      // Verify call and response
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/API/jobs/v1/jobs/job-123', undefined);
      expect(result.data).toEqual(mockJob);
      expect(result.status).toBe(200);
    });

    it('should list jobs with query parameters', async () => {
      // Setup mock response
      const mockJobs = {
        objects: [
          {
            id: 'job-1',
            title: 'Job 1',
            type: 'TRANSCODE',
            status: 'FINISHED'
          },
          {
            id: 'job-2',
            title: 'Job 2',
            type: 'MEDIAINFO',
            status: 'STARTED'
          }
        ],
        total_count: 2
      };

      mockAxiosInstance.get.mockResolvedValue({
        status: 200,
        statusText: 'OK',
        headers: {},
        data: mockJobs
      });

      const query: JobsQuery = {
        page: 1,
        per_page: 10,
        status: 'STARTED',
        type: 'TRANSCODE'
      };

      // Execute test
      const result = await client.jobs.listJobs(query);

      // Verify call and response
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/API/jobs/v1/jobs/', { params: query });
      expect(result.data).toEqual(mockJobs);
      expect(result.status).toBe(200);
    });

    it('should create a job', async () => {
      // Setup mock response
      const jobCreateData: JobCreate = {
        title: 'New Transcode Job',
        type: 'TRANSCODE',
        status: 'READY',
        object_id: 'asset-789',
        object_type: 'assets',
        job_context: {
          profile_id: 'profile-123'
        }
      };

      const mockCreatedJob: Job = {
        id: 'job-new-123',
        ...jobCreateData,
        date_created: '2023-01-01T00:00:00Z'
      };

      mockAxiosInstance.post.mockResolvedValue({
        status: 201,
        statusText: 'Created',
        headers: {},
        data: mockCreatedJob
      });

      // Execute test
      const result = await client.jobs.createJob(jobCreateData);

      // Verify call and response
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/API/jobs/v1/jobs/', jobCreateData, undefined);
      expect(result.data).toEqual(mockCreatedJob);
      expect(result.status).toBe(201);
    });

    it('should update a job', async () => {
      // Setup mock response
      const jobUpdate: JobUpdate = {
        title: 'Updated Job Title',
        status: 'PAUSED',
        metadata: {
          custom_field: 'updated_value'
        }
      };

      const mockUpdatedJob: Job = {
        id: 'job-123',
        title: 'Updated Job Title',
        type: 'TRANSCODE',
        status: 'PAUSED',
        date_created: '2023-01-01T00:00:00Z',
        date_modified: '2023-01-02T00:00:00Z'
      };

      mockAxiosInstance.patch.mockResolvedValue({
        status: 200,
        statusText: 'OK',
        headers: {},
        data: mockUpdatedJob
      });

      // Execute test
      const result = await client.jobs.updateJob('job-123', jobUpdate);

      // Verify call and response
      expect(mockAxiosInstance.patch).toHaveBeenCalledWith('/API/jobs/v1/jobs/job-123', jobUpdate, undefined);
      expect(result.data).toEqual(mockUpdatedJob);
      expect(result.status).toBe(200);
    });

    it('should update a job with comprehensive fields', async () => {
      // Setup comprehensive job update with new fields
      const comprehensiveJobUpdate: JobUpdate = {
        title: 'Comprehensive Update Test',
        status: 'STARTED',
        type: 'CUSTOM',
        custom_type: 'test_job',
        message: 'Testing comprehensive update',
        object_id: 'asset-456',
        object_type: 'assets',
        parent_id: 'parent-job-123',
        started_at: '2023-01-01T10:00:00Z',
        has_children: false,
        progress_processed: 25,
        progress_total: 100,
        job_context: {
          workflow_id: 'workflow-123',
          step: 'processing'
        },
        metadata: {
          priority: 'high',
          department: 'video'
        },
        action_context: {
          PAUSE: {
            bulk: true,
            url: '/jobs/bulk/pause'
          }
        },
        related_objects: [
          {
            object_id: 'asset-456',
            object_type: 'assets'
          }
        ]
      };

      const mockUpdatedJob: Job = {
        id: 'job-123',
        title: 'Comprehensive Update Test',
        type: 'CUSTOM',
        status: 'STARTED',
        date_created: '2023-01-01T00:00:00Z',
        custom_type: 'test_job',
        message: 'Testing comprehensive update',
        object_id: 'asset-456',
        object_type: 'assets',
        progress_processed: 25,
        progress_total: 100
      };

      mockAxiosInstance.patch.mockResolvedValue({
        status: 200,
        statusText: 'OK',
        headers: {},
        data: mockUpdatedJob
      });

      // Execute test
      const result = await client.jobs.updateJob('job-123', comprehensiveJobUpdate);

      // Verify call and response
      expect(mockAxiosInstance.patch).toHaveBeenCalledWith('/API/jobs/v1/jobs/job-123', comprehensiveJobUpdate, undefined);
      expect(result.data).toEqual(mockUpdatedJob);
      expect(result.status).toBe(200);
    });

    it('should delete a job', async () => {
      mockAxiosInstance.delete.mockResolvedValue({
        status: 204,
        statusText: 'No Content',
        headers: {},
        data: null
      });

      // Execute test
      const result = await client.jobs.deleteJob('job-123');

      // Verify call and response
      expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/API/jobs/v1/jobs/job-123', undefined);
      expect(result.status).toBe(204);
    });

    it('should replace a job (full update)', async () => {
      // Setup job data for full replacement
      const jobReplacement: JobUpdate = {
        title: 'Fully Replaced Job',
        type: 'MEDIAINFO',
        status: 'READY',
        custom_type: 'full_replace_test',
        metadata: {
          test_key: 'test_value'
        },
        progress_processed: 0,
        progress_total: 100
      };

      // Setup mock response
      const mockReplacedJob: Job = {
        id: 'job-123',
        title: 'Fully Replaced Job',
        type: 'MEDIAINFO',
        status: 'READY',
        custom_type: 'full_replace_test',
        metadata: {
          test_key: 'test_value'
        },
        progress_processed: 0,
        progress_total: 100,
        date_created: '2023-01-01T00:00:00Z',
        date_modified: '2023-01-01T00:01:00Z'
      };

      mockAxiosInstance.put.mockResolvedValue({
        status: 200,
        statusText: 'OK',
        headers: {},
        data: mockReplacedJob
      });

      // Execute test with merge_metadata option
      const result = await client.jobs.replaceJob('job-123', jobReplacement, { merge_metadata: 'true' });

      // Verify call and response
      expect(mockAxiosInstance.put).toHaveBeenCalledWith(
        '/API/jobs/v1/jobs/job-123', 
        jobReplacement, 
        { params: { merge_metadata: 'true' } }
      );
      expect(result.data).toEqual(mockReplacedJob);
      expect(result.status).toBe(200);
    });

    it('should update job priority', async () => {
      // Setup mock response
      const mockUpdatedJob: Job = {
        id: 'job-123',
        title: 'Test Job',
        type: 'TRANSCODE',
        status: 'STARTED',
        priority: 10,
        date_created: '2023-01-01T00:00:00Z'
      };

      mockAxiosInstance.patch.mockResolvedValue({
        status: 200,
        statusText: 'OK',
        headers: {},
        data: mockUpdatedJob
      });

      // Execute test
      const result = await client.jobs.updatePriority('job-123', 10);

      // Verify call and response
      expect(mockAxiosInstance.patch).toHaveBeenCalledWith('/API/jobs/v1/jobs/job-123/', { priority: 10 }, undefined);
      expect(result.data).toEqual(mockUpdatedJob);
      expect(result.status).toBe(200);
    });

    it('should bulk delete jobs', async () => {
      mockAxiosInstance.delete.mockResolvedValue({
        status: 204,
        statusText: 'No Content',
        headers: {},
        data: undefined
      });

      // Execute test
      const result = await client.jobs.bulkDelete(['job-1', 'job-2']);

      // Verify call and response match API spec
      expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/API/jobs/v1/jobs/', {
        data: { job_ids: ['job-1', 'job-2'] }
      });
      expect(result.status).toBe(204);
    });
    
    it('should reindex a job', async () => {
      mockAxiosInstance.post.mockResolvedValue({
        status: 202,
        statusText: 'Accepted',
        headers: {},
        data: null
      });

      // Execute test with sync option
      const result = await client.jobs.reindexJob('job-123', { sync_to_another_dc: true });

      // Verify call and response
      expect(mockAxiosInstance.post.mock.calls[0][0]).toBe('/API/jobs/v1/jobs/job-123/reindex');
      expect(mockAxiosInstance.post.mock.calls[0][1]).toEqual({ sync_to_another_dc: true });
      expect(result.status).toBe(202);
    });
    
    it('should update job steps', async () => {
      // Mock job with updated steps
      const mockUpdatedJob: Job = {
        id: 'job-123',
        title: 'Test Job',
        type: 'TRANSCODE',
        status: 'STARTED',
        steps: [
          {
            id: 'step-1',
            label: 'Preprocessing',
            status: 'DONE',
            message: 'Preprocessing completed',
            date_updated: '2025-07-10T18:24:22.811Z'
          },
          {
            id: 'step-2',
            label: 'Transcoding',
            status: 'IN_PROGRESS',
            message: 'Transcoding in progress',
            date_updated: '2025-07-10T18:24:22.811Z'
          }
        ]
      };
      
      // Setup request body
      const stepsUpdateData: JobStepsUpdate = {
        steps: [
          {
            id: 'step-1',
            label: 'Preprocessing',
            status: 'DONE',
            message: 'Preprocessing completed'
          },
          {
            id: 'step-2',
            label: 'Transcoding',
            status: 'IN_PROGRESS',
            message: 'Transcoding in progress'
          }
        ]
      };
      
      mockAxiosInstance.patch.mockResolvedValue({
        status: 200,
        statusText: 'OK',
        headers: {},
        data: mockUpdatedJob
      });

      // Execute test
      const result = await client.jobs.updateJobSteps('job-123', stepsUpdateData);

      // Verify call and response
      expect(mockAxiosInstance.patch.mock.calls[0][0]).toBe('/API/jobs/v1/jobs/job-123/steps/');
      expect(mockAxiosInstance.patch.mock.calls[0][1]).toEqual(stepsUpdateData);
      expect(result.data).toEqual(mockUpdatedJob);
      expect(result.status).toBe(200);
    });
    
    it('should replace job steps using PUT', async () => {
      // Mock job with replaced steps
      const mockUpdatedJob: Job = {
        id: 'job-123',
        title: 'Test Job',
        type: 'TRANSCODE',
        status: 'STARTED',
        steps: [
          {
            id: 'step-1',
            label: 'New Step 1',
            status: 'DONE',
            message: 'Step replaced',
            date_updated: '2025-07-10T18:31:34.099Z'
          },
          {
            id: 'step-2',
            label: 'New Step 2',
            status: 'WAITING',
            message: 'Waiting to start',
            date_updated: '2025-07-10T18:31:34.099Z'
          }
        ]
      };
      
      // Setup request body
      const stepsReplaceData: JobStepsUpdate = {
        steps: [
          {
            id: 'step-1',
            label: 'New Step 1',
            status: 'DONE',
            message: 'Step replaced'
          },
          {
            id: 'step-2',
            label: 'New Step 2',
            status: 'WAITING',
            message: 'Waiting to start'
          }
        ]
      };
      
      mockAxiosInstance.put.mockResolvedValue({
        status: 200,
        statusText: 'OK',
        headers: {},
        data: mockUpdatedJob
      });

      // Execute test
      const result = await client.jobs.replaceJobSteps('job-123', stepsReplaceData);

      // Verify call and response
      expect(mockAxiosInstance.put).toHaveBeenCalledWith(
        '/API/jobs/v1/jobs/job-123/steps/', 
        stepsReplaceData,
        undefined // Include the undefined options parameter that axios client is passing
      );
      expect(result.data).toEqual(mockUpdatedJob);
      expect(result.status).toBe(200);
    });
    
    it('should update a single job step', async () => {
      // Mock job with updated single step
      const mockUpdatedJob: Job = {
        id: 'job-123',
        title: 'Test Job',
        type: 'TRANSCODE',
        status: 'STARTED',
        steps: [
          {
            id: 'step-1',
            label: 'Processing',
            status: 'IN_PROGRESS',
            message: 'Processing at 75%',
            date_updated: '2025-07-10T18:42:25.668Z'
          },
          {
            id: 'step-2',
            label: 'Finalization',
            status: 'WAITING',
            date_updated: '2025-07-10T18:31:34.099Z'
          }
        ]
      };
      
      // Setup request body for single step update
      const stepUpdateData = {
        status: 'IN_PROGRESS' as JobStepStatus,
        message: 'Processing at 75%'
      };
      
      mockAxiosInstance.patch.mockResolvedValue({
        status: 200,
        statusText: 'OK',
        headers: {},
        data: mockUpdatedJob
      });

      // Execute test
      const result = await client.jobs.updateJobStep('job-123', 'step-1', stepUpdateData);

      // Verify call and response
      expect(mockAxiosInstance.patch).toHaveBeenCalledWith(
        '/API/jobs/v1/jobs/job-123/steps/step-1/', 
        stepUpdateData,
        undefined
      );
      expect(result.data).toEqual(mockUpdatedJob);
      expect(result.status).toBe(200);
    });

    it('should replace a single job step using PUT', async () => {
      // Mock job with replaced single step
      const mockUpdatedJob: Job = {
        id: 'job-123',
        title: 'Test Job',
        type: 'TRANSCODE',
        status: 'STARTED',
        steps: [
          {
            id: 'step-1',
            label: 'Completely Replaced Step',
            status: 'DONE',
            message: 'Step fully replaced',
            error_message: '',
            date_updated: '2025-07-11T13:15:22.123Z'
          },
          {
            id: 'step-2',
            label: 'Finalization',
            status: 'WAITING',
            date_updated: '2025-07-10T18:31:34.099Z'
          }
        ]
      };
      
      // Setup request body for single step replacement
      const stepReplaceData: JobStep = {
        id: 'step-1',
        label: 'Completely Replaced Step',
        status: 'DONE' as JobStepStatus,
        message: 'Step fully replaced',
        error_message: ''
      };
      
      mockAxiosInstance.put.mockResolvedValue({
        status: 200,
        statusText: 'OK',
        headers: {},
        data: mockUpdatedJob
      });

      // Execute test
      const result = await client.jobs.replaceJobStep('job-123', 'step-1', stepReplaceData);

      // Verify call and response
      expect(mockAxiosInstance.put).toHaveBeenCalledWith(
        '/API/jobs/v1/jobs/job-123/steps/step-1/', 
        stepReplaceData,
        undefined
      );
      expect(result.data).toEqual(mockUpdatedJob);
      expect(result.status).toBe(200);
    });


  });

  describe('CollectionResource', () => {
    it('should list collections with no parameters', async () => {
      // Setup mock paginated response matching API spec
      const mockCollections = {
        objects: [
          {
            id: 'collection-1',
            title: 'Test Collection 1',
            status: 'ACTIVE',
            is_root: true,
            date_created: '2023-01-01T00:00:00Z'
          },
          {
            id: 'collection-2',
            title: 'Test Collection 2',
            status: 'ACTIVE',
            is_root: false,
            parent_id: 'collection-1',
            date_created: '2023-01-02T00:00:00Z'
          }
        ],
        total: 2,
        page: 1,
        pages: 1,
        per_page: 50
      };

      mockAxiosInstance.get.mockResolvedValueOnce({
        status: 200,
        statusText: 'OK',
        headers: {},
        data: mockCollections
      });

      // Call the method
      const result = await client.collections.listCollections();

      // Assertions
      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        '/API/assets/v1/collections/',
        { params: {} }
      );
      expect(result.data).toEqual(mockCollections);
      expect(result.status).toBe(200);
      expect(result.data.objects).toHaveLength(2);
    });

    it('should list collections with pagination parameters', async () => {
      // Setup mock response with pagination
      const mockCollections = {
        objects: [
          {
            id: 'collection-3',
            title: 'Test Collection 3',
            status: 'ACTIVE',
            is_root: false,
            category: 'media',
            date_created: '2023-01-03T00:00:00Z'
          }
        ],
        total: 10,
        page: 2,
        pages: 2,
        per_page: 5,
        next_url: '/v1/collections/?page=3&per_page=5',
        prev_url: '/v1/collections/?page=1&per_page=5'
      };

      mockAxiosInstance.get.mockResolvedValueOnce({
        status: 200,
        statusText: 'OK',
        headers: {},
        data: mockCollections
      });

      const params: CollectionListParams = {
        page: 2,
        per_page: 5,
        sort: 'title,asc'
      };

      // Call the method
      const result = await client.collections.listCollections(params);

      // Assertions
      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        '/API/assets/v1/collections/',
        { params: { page: 2, per_page: 5, sort: 'title,asc' } }
      );
      expect(result.data).toEqual(mockCollections);
      expect(result.status).toBe(200);
    });

    it('should list collections with filters', async () => {
      // Setup mock response with filtered results
      const mockCollections = {
        objects: [
          {
            id: 'root-collection',
            title: 'Root Collection',
            status: 'ACTIVE',
            is_root: true,
            date_created: '2023-01-01T00:00:00Z'
          }
        ],
        total: 1,
        page: 1,
        pages: 1,
        per_page: 50
      };

      mockAxiosInstance.get.mockResolvedValueOnce({
        status: 200,
        statusText: 'OK',
        headers: {},
        data: mockCollections
      });

      const params: CollectionListParams = {
        is_root: 'true',
        status: 'ACTIVE'
      };

      // Call the method
      const result = await client.collections.listCollections(params);

      // Assertions
      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        '/API/assets/v1/collections/',
        { params: { is_root: 'true', status: 'ACTIVE' } }
      );
      expect(result.data).toEqual(mockCollections);
      expect(result.status).toBe(200);
    });

    it('should list collections with scroll pagination', async () => {
      // Setup mock response with scroll
      const mockCollections = {
        objects: [
          {
            id: 'collection-scroll-1',
            title: 'Scroll Collection 1',
            status: 'ACTIVE',
            metadata: { category: 'videos' },
            date_created: '2023-01-01T00:00:00Z'
          }
        ],
        scroll_id: 'scroll-token-123',
        total: 100
      };

      mockAxiosInstance.get.mockResolvedValueOnce({
        status: 200,
        statusText: 'OK',
        headers: {},
        data: mockCollections
      });

      const params: CollectionListParams = {
        scroll: true,
        scroll_id: 'existing-scroll-token'
      };

      // Call the method
      const result = await client.collections.listCollections(params);

      // Assertions
      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        '/API/assets/v1/collections/',
        { params: { scroll: true, scroll_id: 'existing-scroll-token' } }
      );
      expect(result.data).toEqual(mockCollections);
      expect(result.status).toBe(200);
    });

    it('should handle empty collection list', async () => {
      // Setup mock response for empty list
      const mockEmptyCollections = {
        objects: [],
        total: 0,
        page: 1,
        pages: 0,
        per_page: 50
      };

      mockAxiosInstance.get.mockResolvedValueOnce({
        status: 200,
        statusText: 'OK',
        headers: {},
        data: mockEmptyCollections
      });

      // Call the method
      const result = await client.collections.listCollections();

      // Assertions
      expect(result.data.objects).toEqual([]);
      expect(result.data.total).toBe(0);
      expect(result.status).toBe(200);
    });

    it('should get a collection by ID', async () => {
      // Setup mock response for getting a single collection
      const mockCollection: Collection = {
        id: 'collection-123',
        title: 'Test Collection',
        category: 'projects',
        is_root: true,
        status: 'ACTIVE',
        date_created: '2023-01-01T00:00:00Z',
        date_modified: '2023-01-01T00:00:00Z',
        object_type: 'collections',
        metadata: { test: 'value' },
        position: 0
      };

      mockAxiosInstance.get.mockResolvedValueOnce({
        status: 200,
        statusText: 'OK',
        headers: {},
        data: mockCollection
      });

      // Call the method
      const result = await client.collections.getCollection('collection-123');

      // Assertions
      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        '/API/assets/v1/collections/collection-123',
        undefined
      );
      expect(result.data).toEqual(mockCollection);
      expect(result.status).toBe(200);
      expect(result.data.id).toBe('collection-123');
      expect(result.data.title).toBe('Test Collection');
    });

    it('should validate collection ID is required for get', async () => {
      await expect(client.collections.getCollection(''))
        .rejects
        .toThrow('Collection ID is required');
    });

    it('should validate collection ID is not just whitespace for get', async () => {
      await expect(client.collections.getCollection('   '))
        .rejects
        .toThrow('Collection ID is required');
    });

    it('should create a new collection', async () => {
      // Setup mock response for collection creation
      const newCollectionData: CreateCollectionRequest = {
        title: 'New Test Collection',
        category: 'test',
        is_root: true,
        status: 'ACTIVE',
        metadata: { project: 'test-project' }
      };
      
      const createdCollection: Collection = {
        id: 'new-collection-id',
        title: 'New Test Collection',
        category: 'test',
        is_root: true,
        status: 'ACTIVE',
        metadata: { project: 'test-project' },
        date_created: '2023-01-01T00:00:00Z',
        date_modified: '2023-01-01T00:00:00Z',
        object_type: 'collections'
      };

      mockAxiosInstance.post.mockResolvedValueOnce({
        status: 201,
        statusText: 'Created',
        headers: {},
        data: createdCollection
      });

      // Call the method
      const result = await client.collections.createCollection(newCollectionData);

      // Assertions
      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        '/API/assets/v1/collections',
        newCollectionData,
        undefined
      );
      expect(result.data).toEqual(createdCollection);
      expect(result.status).toBe(201);
    });

    it('should create a collection with minimal data', async () => {
      // Setup mock response for minimal collection
      const minimalCollectionData: CreateCollectionRequest = {
        title: 'Minimal Collection'
      };
      
      const createdCollection: Collection = {
        id: 'minimal-collection-id',
        title: 'Minimal Collection',
        date_created: '2023-01-01T00:00:00Z',
        date_modified: '2023-01-01T00:00:00Z',
        object_type: 'collections'
      };

      mockAxiosInstance.post.mockResolvedValueOnce({
        status: 201,
        statusText: 'Created',
        headers: {},
        data: createdCollection
      });

      // Call the method
      const result = await client.collections.createCollection(minimalCollectionData);

      // Assertions
      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        '/API/assets/v1/collections',
        minimalCollectionData,
        undefined
      );
      expect(result.data).toEqual(createdCollection);
      expect(result.status).toBe(201);
    });

    it('should create a sub-collection with parent', async () => {
      // Setup mock response for sub-collection
      const subCollectionData: CreateCollectionRequest = {
        title: 'Sub Collection',
        parent_id: 'parent-collection-id',
        is_root: false,
        position: 1
      };
      
      const createdCollection: Collection = {
        id: 'sub-collection-id',
        title: 'Sub Collection',
        parent_id: 'parent-collection-id',
        is_root: false,
        position: 1,
        parents: ['parent-collection-id'],
        date_created: '2023-01-01T00:00:00Z',
        date_modified: '2023-01-01T00:00:00Z',
        object_type: 'collections'
      };

      mockAxiosInstance.post.mockResolvedValueOnce({
        status: 201,
        statusText: 'Created',
        headers: {},
        data: createdCollection
      });

      // Call the method
      const result = await client.collections.createCollection(subCollectionData);

      // Assertions
      expect(result.data).toEqual(createdCollection);
      expect(result.data.parent_id).toBe('parent-collection-id');
      expect(result.data.is_root).toBe(false);
      expect(result.status).toBe(201);
    });

    it('should validate collection title is required', async () => {
      // Test empty title
      const invalidCollectionData: CreateCollectionRequest = {
        title: ''
      };

      await expect(client.collections.createCollection(invalidCollectionData))
        .rejects
        .toThrow('Collection title is required');
    });

    it('should validate collection title is not just whitespace', async () => {
      // Test whitespace-only title
      const invalidCollectionData: CreateCollectionRequest = {
        title: '   '
      };

      await expect(client.collections.createCollection(invalidCollectionData))
        .rejects
        .toThrow('Collection title is required');
    });

    it('should delete a collection by ID', async () => {
      const mockDeleteResponse: DeleteCollectionResponse = {
        job_id: 'job-123',
        status: 'PENDING'
      };

      mockAxiosInstance.delete.mockResolvedValueOnce({
        status: 202,
        statusText: 'Accepted',
        headers: {},
        data: mockDeleteResponse
      });

      const result = await client.collections.deleteCollection('collection-123');
      
      expect(mockAxiosInstance.delete).toHaveBeenCalledWith(
        '/API/assets/v1/collections/collection-123',
        undefined
      );
      expect(result.status).toBe(202);
      expect(result.data).toEqual(mockDeleteResponse);
      expect(result.data.job_id).toBe('job-123');
      expect(result.data.status).toBe('PENDING');
    });

    it('should validate collection ID is required for deletion', async () => {
      await expect(client.collections.deleteCollection(''))
        .rejects
        .toThrow('Collection ID is required');
    });

    it('should validate collection ID is not just whitespace for deletion', async () => {
      await expect(client.collections.deleteCollection('   '))
        .rejects
        .toThrow('Collection ID is required');
    });

    it('should update a collection by ID', async () => {
      const updateData: UpdateCollectionRequest = {
        title: 'Updated Collection Title',
        category: 'updated-category',
        status: 'ACTIVE'
      };

      const updatedCollection: Collection = {
        id: 'collection-123',
        title: 'Updated Collection Title',
        category: 'updated-category',
        status: 'ACTIVE',
        date_created: '2023-01-01T00:00:00Z',
        date_modified: '2023-01-02T00:00:00Z',
        object_type: 'collections'
      };

      mockAxiosInstance.patch.mockResolvedValueOnce({
        status: 200,
        statusText: 'OK',
        headers: {},
        data: updatedCollection
      });

      const result = await client.collections.updateCollection('collection-123', updateData);

      expect(mockAxiosInstance.patch).toHaveBeenCalledWith(
        '/API/assets/v1/collections/collection-123',
        updateData,
        undefined
      );
      expect(result.data).toEqual(updatedCollection);
      expect(result.status).toBe(200);
    });

    it('should update a collection with options', async () => {
      const updateData: UpdateCollectionRequest = {
        parent_id: 'new-parent-id',
        title: 'Moved Collection'
      };

      const options: UpdateCollectionOptions = {
        change_parent_mode: 'move'
      };

      const updatedCollection: Collection = {
        id: 'collection-123',
        title: 'Moved Collection',
        parent_id: 'new-parent-id',
        date_created: '2023-01-01T00:00:00Z',
        date_modified: '2023-01-02T00:00:00Z',
        object_type: 'collections'
      };

      mockAxiosInstance.patch.mockResolvedValueOnce({
        status: 200,
        statusText: 'OK',
        headers: {},
        data: updatedCollection
      });

      const result = await client.collections.updateCollection('collection-123', updateData, options);

      expect(mockAxiosInstance.patch).toHaveBeenCalledWith(
        '/API/assets/v1/collections/collection-123',
        updateData,
        { params: { change_parent_mode: 'move' } }
      );
      expect(result.data).toEqual(updatedCollection);
      expect(result.status).toBe(200);
    });

    it('should update a collection with partial data', async () => {
      const updateData: UpdateCollectionRequest = {
        title: 'Just Title Update'
      };

      const updatedCollection: Collection = {
        id: 'collection-123',
        title: 'Just Title Update',
        category: 'original-category',
        date_created: '2023-01-01T00:00:00Z',
        date_modified: '2023-01-02T00:00:00Z',
        object_type: 'collections'
      };

      mockAxiosInstance.patch.mockResolvedValueOnce({
        status: 200,
        statusText: 'OK',
        headers: {},
        data: updatedCollection
      });

      const result = await client.collections.updateCollection('collection-123', updateData);

      expect(mockAxiosInstance.patch).toHaveBeenCalledWith(
        '/API/assets/v1/collections/collection-123',
        updateData,
        undefined
      );
      expect(result.data.title).toBe('Just Title Update');
      expect(result.status).toBe(200);
    });

    it('should validate collection ID is required for update', async () => {
      const updateData: UpdateCollectionRequest = {
        title: 'Updated Title'
      };

      await expect(client.collections.updateCollection('', updateData))
        .rejects
        .toThrow('Collection ID is required');
    });

    it('should validate collection ID is not just whitespace for update', async () => {
      const updateData: UpdateCollectionRequest = {
        title: 'Updated Title'
      };

      await expect(client.collections.updateCollection('   ', updateData))
        .rejects
        .toThrow('Collection ID is required');
    });

    it('should replace a collection with basic data', async () => {
      const replaceData: ReplaceCollectionRequest = {
        title: 'Completely Replaced Collection',
        category: 'new-category',
        status: 'ACTIVE',
        is_root: false,
        parent_id: 'new-parent-123'
      };

      const mockReplacedCollection: Collection = {
        id: 'collection-123',
        title: 'Completely Replaced Collection',
        category: 'new-category',
        status: 'ACTIVE',
        is_root: false,
        parent_id: 'new-parent-123',
        date_created: '2023-01-01T00:00:00Z',
        date_modified: '2023-01-01T12:00:00Z'
      };

      mockAxiosInstance.put.mockResolvedValueOnce({
        status: 200,
        statusText: 'OK',
        headers: {},
        data: mockReplacedCollection
      });

      const result = await client.collections.replaceCollection('collection-123', replaceData);

      expect(mockAxiosInstance.put).toHaveBeenCalledWith(
        '/API/assets/v1/collections/collection-123',
        replaceData,
        undefined
      );
      expect(result.data).toEqual(mockReplacedCollection);
      expect(result.status).toBe(200);
    });

    it('should replace a collection with options', async () => {
      const replaceData: ReplaceCollectionRequest = {
        title: 'Collection with New Parent',
        parent_id: 'new-parent-456',
        category: 'moved-category'
      };

      const options: ReplaceCollectionOptions = {
        change_parent_mode: 'move'
      };

      const mockReplacedCollection: Collection = {
        id: 'collection-123',
        title: 'Collection with New Parent',
        parent_id: 'new-parent-456',
        category: 'moved-category',
        date_created: '2023-01-01T00:00:00Z',
        date_modified: '2023-01-01T12:00:00Z'
      };

      mockAxiosInstance.put.mockResolvedValueOnce({
        status: 200,
        statusText: 'OK',
        headers: {},
        data: mockReplacedCollection
      });

      const result = await client.collections.replaceCollection('collection-123', replaceData, options);

      expect(mockAxiosInstance.put).toHaveBeenCalledWith(
        '/API/assets/v1/collections/collection-123',
        replaceData,
        { params: { change_parent_mode: 'move' } }
      );
      expect(result.data).toEqual(mockReplacedCollection);
      expect(result.status).toBe(200);
    });

    it('should replace a collection with all fields', async () => {
      const replaceData: ReplaceCollectionRequest = {
        title: 'Comprehensive Replace',
        category: 'comprehensive',
        custom_keyframe: 'keyframe-url',
        custom_poster: 'poster-url',
        date_created: '2023-01-01T00:00:00Z',
        external_id: 'ext-123',
        is_root: true,
        keyframe_asset_ids: ['asset-1', 'asset-2'],
        parent_id: null,
        status: 'ACTIVE',
        storage_id: 'storage-123'
      };

      const mockReplacedCollection: Collection = {
        id: 'collection-123',
        title: 'Comprehensive Replace',
        category: 'comprehensive',
        custom_keyframe: 'keyframe-url',
        custom_poster: 'poster-url',
        date_created: '2023-01-01T00:00:00Z',
        external_id: 'ext-123',
        is_root: true,
        keyframe_asset_ids: ['asset-1', 'asset-2'],
        status: 'ACTIVE',
        storage_id: 'storage-123',
        date_modified: '2023-01-01T12:00:00Z'
      };

      mockAxiosInstance.put.mockResolvedValueOnce({
        status: 200,
        statusText: 'OK',
        headers: {},
        data: mockReplacedCollection
      });

      const result = await client.collections.replaceCollection('collection-123', replaceData);

      expect(mockAxiosInstance.put).toHaveBeenCalledWith(
        '/API/assets/v1/collections/collection-123',
        replaceData,
        undefined
      );
      expect(result.data).toEqual(mockReplacedCollection);
      expect(result.status).toBe(200);
    });

    it('should validate collection ID is required for replace', async () => {
      const replaceData: ReplaceCollectionRequest = {
        title: 'Valid Title'
      };

      await expect(client.collections.replaceCollection('', replaceData))
        .rejects
        .toThrow('Collection ID is required');
    });

    it('should validate collection ID is not just whitespace for replace', async () => {
      const replaceData: ReplaceCollectionRequest = {
        title: 'Valid Title'
      };

      await expect(client.collections.replaceCollection('   ', replaceData))
        .rejects
        .toThrow('Collection ID is required');
    });
  });

  describe('FileSetResource', () => {
    it('should get asset filesets with no parameters', async () => {
      // Setup mock paginated response matching API spec
      const mockFilesets = {
        objects: [
          {
            id: 'fileset-1',
            asset_id: 'asset-123',
            name: 'Original',
            status: 'ACTIVE',
            storage_id: 'storage-1',
            format_id: 'format-1',
            file_count: 5,
            date_created: '2023-01-01T00:00:00Z'
          },
          {
            id: 'fileset-2',
            asset_id: 'asset-123',
            name: 'Proxy',
            status: 'ACTIVE',
            storage_id: 'storage-2',
            format_id: 'format-2',
            is_archive: false,
            file_count: 3,
            date_created: '2023-01-02T00:00:00Z'
          }
        ],
        total: 2,
        page: 1,
        pages: 1,
        per_page: 50,
        first_url: '/API/files/v1/assets/asset-123/file_sets/?page=1',
        last_url: '/API/files/v1/assets/asset-123/file_sets/?page=1'
      };

      mockAxiosInstance.get.mockResolvedValueOnce({
        status: 200,
        statusText: 'OK',
        headers: {},
        data: mockFilesets
      });

      // Call the method
      const result = await client.filesets.getAssetFilesets('asset-123');

      // Assertions
      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        '/API/files/v1/assets/asset-123/file_sets/',
        undefined
      );
      expect(result.data).toEqual(mockFilesets);
      expect(result.status).toBe(200);
      expect(result.data.objects).toHaveLength(2);
    });

    it('should get asset filesets with pagination parameters', async () => {
      // Setup mock response with pagination
      const mockFilesets = {
        objects: [
          {
            id: 'fileset-3',
            asset_id: 'asset-456',
            name: 'Transcoded',
            status: 'ACTIVE',
            storage_id: 'storage-3',
            format_id: 'format-3',
            file_count: 10,
            date_created: '2023-01-03T00:00:00Z'
          }
        ],
        total: 5,
        page: 2,
        pages: 3,
        per_page: 2,
        next_url: '/API/files/v1/assets/asset-456/file_sets/?per_page=2&last_id=fileset-4',
        prev_url: '/API/files/v1/assets/asset-456/file_sets/?per_page=2&last_id=fileset-1'
      };

      mockAxiosInstance.get.mockResolvedValueOnce({
        status: 200,
        statusText: 'OK',
        headers: {},
        data: mockFilesets
      });

      const params: AssetFileSetsListParams = {
        per_page: 2,
        last_id: 'fileset-2'
      };

      // Call the method
      const result = await client.filesets.getAssetFilesets('asset-456', params);

      // Assertions
      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        '/API/files/v1/assets/asset-456/file_sets/',
        { params: { per_page: 2, last_id: 'fileset-2' } }
      );
      expect(result.data).toEqual(mockFilesets);
      expect(result.status).toBe(200);
    });

    it('should get asset filesets with file_count parameter', async () => {
      // Setup mock response with file count enabled
      const mockFilesets = {
        objects: [
          {
            id: 'fileset-4',
            asset_id: 'asset-789',
            name: 'Archive',
            status: 'ACTIVE',
            storage_id: 'storage-4',
            format_id: 'format-4',
            is_archive: true,
            file_count: 25,
            date_created: '2023-01-04T00:00:00Z'
          }
        ],
        total: 1,
        page: 1,
        pages: 1,
        per_page: 50
      };

      mockAxiosInstance.get.mockResolvedValueOnce({
        status: 200,
        statusText: 'OK',
        headers: {},
        data: mockFilesets
      });

      const params: AssetFileSetsListParams = {
        file_count: true
      };

      // Call the method
      const result = await client.filesets.getAssetFilesets('asset-789', params);

      // Assertions
      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        '/API/files/v1/assets/asset-789/file_sets/',
        { params: { file_count: true } }
      );
      expect(result.data).toEqual(mockFilesets);
      expect(result.status).toBe(200);
      expect(result.data.objects[0].file_count).toBe(25);
    });

    it('should get asset filesets with all parameters', async () => {
      // Setup mock response
      const mockFilesets = {
        objects: [
          {
            id: 'fileset-5',
            asset_id: 'asset-100',
            name: 'Optimized',
            status: 'ACTIVE',
            storage_id: 'storage-5',
            base_dir: '/media/assets/asset-100',
            component_ids: ['comp-1', 'comp-2'],
            version_id: 'version-1',
            file_count: 8,
            date_created: '2023-01-05T00:00:00Z',
            date_modified: '2023-01-05T12:00:00Z'
          }
        ],
        total: 3,
        page: 1,
        pages: 2,
        per_page: 1
      };

      mockAxiosInstance.get.mockResolvedValueOnce({
        status: 200,
        statusText: 'OK',
        headers: {},
        data: mockFilesets
      });

      const params: AssetFileSetsListParams = {
        per_page: 1,
        last_id: 'fileset-4',
        file_count: true
      };

      // Call the method
      const result = await client.filesets.getAssetFilesets('asset-100', params);

      // Assertions
      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        '/API/files/v1/assets/asset-100/file_sets/',
        { params: { per_page: 1, last_id: 'fileset-4', file_count: true } }
      );
      expect(result.data).toEqual(mockFilesets);
      expect(result.status).toBe(200);
    });

    it('should handle empty filesets list', async () => {
      // Setup mock response for empty list
      const mockEmptyFilesets = {
        objects: [],
        total: 0,
        page: 1,
        pages: 0,
        per_page: 50
      };

      mockAxiosInstance.get.mockResolvedValueOnce({
        status: 200,
        statusText: 'OK',
        headers: {},
        data: mockEmptyFilesets
      });

      // Call the method
      const result = await client.filesets.getAssetFilesets('asset-empty');

      // Assertions
      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        '/API/files/v1/assets/asset-empty/file_sets/',
        undefined
      );
      expect(result.data).toEqual(mockEmptyFilesets);
      expect(result.status).toBe(200);
      expect(result.data.objects).toHaveLength(0);
    });

    it('should validate asset ID is required', async () => {
      await expect(client.filesets.getAssetFilesets(''))
        .rejects
        .toThrow('Asset ID is required');
    });

    it('should validate asset ID is not just whitespace', async () => {
      await expect(client.filesets.getAssetFilesets('   '))
        .rejects
        .toThrow('Asset ID is required');
    });

    it('should handle filesets with archive information', async () => {
      // Setup mock response with archive filesets
      const mockArchiveFilesets = {
        objects: [
          {
            id: 'fileset-archive-1',
            asset_id: 'asset-archive',
            name: 'Archived Original',
            status: 'ARCHIVED',
            storage_id: 'archive-storage',
            archive_file_set_id: 'archive-ref-1',
            original_storage_id: 'original-storage-1',
            is_archive: true,
            file_count: 15,
            date_created: '2023-01-01T00:00:00Z',
            date_deleted: '2023-01-15T00:00:00Z',
            deleted_by_user: 'user-123'
          }
        ],
        total: 1,
        page: 1,
        pages: 1,
        per_page: 50
      };

      mockAxiosInstance.get.mockResolvedValueOnce({
        status: 200,
        statusText: 'OK',
        headers: {},
        data: mockArchiveFilesets
      });

      // Call the method
      const result = await client.filesets.getAssetFilesets('asset-archive');

      // Assertions
      expect(result.data.objects[0].is_archive).toBe(true);
      expect(result.data.objects[0].status).toBe('ARCHIVED');
      expect(result.data.objects[0].archive_file_set_id).toBe('archive-ref-1');
      expect(result.data.objects[0].original_storage_id).toBe('original-storage-1');
    });

    it('should get a specific fileset by ID', async () => {
      // Setup mock response for single fileset
      const mockFileset: FileSet = {
        id: 'fileset-123',
        asset_id: 'asset-456',
        name: 'High Resolution',
        status: 'ACTIVE',
        storage_id: 'storage-789',
        format_id: 'format-456',
        base_dir: '/media/assets/asset-456/fileset-123',
        component_ids: ['comp-1', 'comp-2', 'comp-3'],
        version_id: 'version-1',
        file_count: 12,
        is_archive: false,
        date_created: '2023-01-01T00:00:00Z',
        date_modified: '2023-01-01T12:00:00Z'
      };

      mockAxiosInstance.get.mockResolvedValueOnce({
        status: 200,
        statusText: 'OK',
        headers: {},
        data: mockFileset
      });

      // Call the method
      const result = await client.filesets.getAssetFileset('asset-456', 'fileset-123');

      // Assertions
      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        '/API/files/v1/assets/asset-456/file_sets/fileset-123/',
        undefined
      );
      expect(result.data).toEqual(mockFileset);
      expect(result.status).toBe(200);
      expect(result.data.id).toBe('fileset-123');
      expect(result.data.asset_id).toBe('asset-456');
      expect(result.data.name).toBe('High Resolution');
      expect(result.data.file_count).toBe(12);
    });

    it('should get fileset with minimal data', async () => {
      // Setup mock response for minimal fileset
      const mockMinimalFileset: FileSet = {
        id: 'fileset-minimal',
        asset_id: 'asset-minimal',
        storage_id: 'storage-minimal'
      };

      mockAxiosInstance.get.mockResolvedValueOnce({
        status: 200,
        statusText: 'OK',
        headers: {},
        data: mockMinimalFileset
      });

      // Call the method
      const result = await client.filesets.getAssetFileset('asset-minimal', 'fileset-minimal');

      // Assertions
      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        '/API/files/v1/assets/asset-minimal/file_sets/fileset-minimal/',
        undefined
      );
      expect(result.data).toEqual(mockMinimalFileset);
      expect(result.status).toBe(200);
      expect(result.data.id).toBe('fileset-minimal');
    });

    it('should get archived fileset with archive information', async () => {
      // Setup mock response for archived fileset
      const mockArchivedFileset: FileSet = {
        id: 'fileset-archived',
        asset_id: 'asset-archived',
        name: 'Archived Version',
        status: 'ARCHIVED',
        storage_id: 'archive-storage',
        archive_file_set_id: 'archive-original',
        original_storage_id: 'original-storage',
        is_archive: true,
        file_count: 25,
        date_created: '2023-01-01T00:00:00Z',
        date_deleted: '2023-02-01T00:00:00Z',
        deleted_by_user: 'admin-user'
      };

      mockAxiosInstance.get.mockResolvedValueOnce({
        status: 200,
        statusText: 'OK',
        headers: {},
        data: mockArchivedFileset
      });

      // Call the method
      const result = await client.filesets.getAssetFileset('asset-archived', 'fileset-archived');

      // Assertions
      expect(result.data.status).toBe('ARCHIVED');
      expect(result.data.is_archive).toBe(true);
      expect(result.data.archive_file_set_id).toBe('archive-original');
      expect(result.data.original_storage_id).toBe('original-storage');
      expect(result.data.deleted_by_user).toBe('admin-user');
    });

    it('should validate asset ID is required for getAssetFileset', async () => {
      await expect(client.filesets.getAssetFileset('', 'fileset-123'))
        .rejects
        .toThrow('Asset ID is required');
    });

    it('should validate asset ID is not just whitespace for getAssetFileset', async () => {
      await expect(client.filesets.getAssetFileset('   ', 'fileset-123'))
        .rejects
        .toThrow('Asset ID is required');
    });

    it('should validate file set ID is required for getAssetFileset', async () => {
      await expect(client.filesets.getAssetFileset('asset-123', ''))
        .rejects
        .toThrow('FileSet ID is required');
    });

    it('should validate file set ID is not just whitespace for getAssetFileset', async () => {
      await expect(client.filesets.getAssetFileset('asset-123', '   '))
        .rejects
        .toThrow('FileSet ID is required');
    });

    it('should create a new fileset for an asset', async () => {
      // Setup mock response for created fileset
      const createData: CreateFileSetRequest = {
        name: 'New Fileset',
        storage_id: 'storage-new',
        format_id: 'format-new',
        status: 'ACTIVE',
        is_archive: false,
        base_dir: '/media/new',
        component_ids: ['comp-new-1', 'comp-new-2']
      };

      const mockCreatedFileset: FileSet = {
        id: 'fileset-new-123',
        asset_id: 'asset-new',
        name: 'New Fileset',
        storage_id: 'storage-new',
        format_id: 'format-new',
        status: 'ACTIVE',
        is_archive: false,
        base_dir: '/media/new',
        component_ids: ['comp-new-1', 'comp-new-2'],
        file_count: 0,
        date_created: '2023-01-01T00:00:00Z',
        date_modified: '2023-01-01T00:00:00Z'
      };

      mockAxiosInstance.post.mockResolvedValueOnce({
        status: 201,
        statusText: 'Created',
        headers: {},
        data: mockCreatedFileset
      });

      // Call the method
      const result = await client.filesets.createAssetFileset('asset-new', createData);

      // Assertions
      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        '/API/files/v1/assets/asset-new/file_sets/',
        createData,
        undefined
      );
      expect(result.data).toEqual(mockCreatedFileset);
      expect(result.status).toBe(201);
      expect(result.data.id).toBe('fileset-new-123');
      expect(result.data.asset_id).toBe('asset-new');
      expect(result.data.name).toBe('New Fileset');
    });

    it('should create a minimal fileset', async () => {
      // Setup mock response for minimal fileset creation
      const createData: CreateFileSetRequest = {
        storage_id: 'storage-minimal'
      };

      const mockMinimalFileset: FileSet = {
        id: 'fileset-minimal-456',
        asset_id: 'asset-minimal',
        storage_id: 'storage-minimal',
        date_created: '2023-01-01T00:00:00Z'
      };

      mockAxiosInstance.post.mockResolvedValueOnce({
        status: 201,
        statusText: 'Created',
        headers: {},
        data: mockMinimalFileset
      });

      // Call the method
      const result = await client.filesets.createAssetFileset('asset-minimal', createData);

      // Assertions
      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        '/API/files/v1/assets/asset-minimal/file_sets/',
        createData,
        undefined
      );
      expect(result.data).toEqual(mockMinimalFileset);
      expect(result.status).toBe(201);
      expect(result.data.id).toBe('fileset-minimal-456');
    });

    it('should create an archive fileset', async () => {
      // Setup mock response for archive fileset creation
      const createData: CreateFileSetRequest = {
        name: 'Archive Fileset',
        storage_id: 'archive-storage',
        is_archive: true,
        archive_file_set_id: 'original-fileset-123',
        original_storage_id: 'original-storage'
      };

      const mockArchiveFileset: FileSet = {
        id: 'fileset-archive-789',
        asset_id: 'asset-archive',
        name: 'Archive Fileset',
        storage_id: 'archive-storage',
        is_archive: true,
        archive_file_set_id: 'original-fileset-123',
        original_storage_id: 'original-storage',
        status: 'ACTIVE',
        date_created: '2023-01-01T00:00:00Z'
      };

      mockAxiosInstance.post.mockResolvedValueOnce({
        status: 201,
        statusText: 'Created',
        headers: {},
        data: mockArchiveFileset
      });

      // Call the method
      const result = await client.filesets.createAssetFileset('asset-archive', createData);

      // Assertions
      expect(result.data.is_archive).toBe(true);
      expect(result.data.archive_file_set_id).toBe('original-fileset-123');
      expect(result.data.original_storage_id).toBe('original-storage');
    });

    it('should validate asset ID is required for createAssetFileset', async () => {
      const createData: CreateFileSetRequest = {
        storage_id: 'storage-test'
      };

      await expect(client.filesets.createAssetFileset('', createData))
        .rejects
        .toThrow('Asset ID is required');
    });

    it('should validate asset ID is not just whitespace for createAssetFileset', async () => {
      const createData: CreateFileSetRequest = {
        storage_id: 'storage-test'
      };

      await expect(client.filesets.createAssetFileset('   ', createData))
        .rejects
        .toThrow('Asset ID is required');
    });

    it('should delete a fileset with default options', async () => {
      // Setup mock response for deleted fileset (soft delete - returns 200 with fileset data)
      const mockDeletedFileset: FileSet = {
        id: 'fileset-delete-123',
        asset_id: 'asset-delete',
        name: 'Deleted Fileset',
        storage_id: 'storage-delete',
        status: 'DELETED',
        date_created: '2023-01-01T00:00:00Z',
        date_deleted: '2023-01-01T12:00:00Z',
        deleted_by_user: 'test-user'
      };

      mockAxiosInstance.delete.mockResolvedValueOnce({
        status: 200,
        statusText: 'OK',
        headers: {},
        data: mockDeletedFileset
      });

      // Call the method
      const result = await client.filesets.deleteAssetFileset('asset-delete', 'fileset-delete-123');

      // Assertions
      expect(mockAxiosInstance.delete).toHaveBeenCalledWith(
        '/API/files/v1/assets/asset-delete/file_sets/fileset-delete-123/',
        undefined
      );
      expect(result.data).toEqual(mockDeletedFileset);
      expect(result.status).toBe(200);
      if (result.data && typeof result.data === 'object' && 'status' in result.data) {
        expect(result.data.status).toBe('DELETED');
      }
    });

    it('should delete a fileset immediately', async () => {
      // Setup mock response for immediate deletion (returns 204 with no body)
      mockAxiosInstance.delete.mockResolvedValueOnce({
        status: 204,
        statusText: 'No Content',
        headers: {},
        data: null
      });

      const options: DeleteFileSetOptions = {
        immediately: true
      };

      // Call the method
      const result = await client.filesets.deleteAssetFileset('asset-immediate', 'fileset-immediate-123', options);

      // Assertions
      expect(mockAxiosInstance.delete).toHaveBeenCalledWith(
        '/API/files/v1/assets/asset-immediate/file_sets/fileset-immediate-123/',
        { params: { immediately: true } }
      );
      expect(result.status).toBe(204);
      expect(result.data).toBeNull();
    });

    it('should delete a fileset with keep_source option', async () => {
      // Setup mock response for delete with keep_source
      const mockDeletedFileset: FileSet = {
        id: 'fileset-keep-source',
        asset_id: 'asset-keep-source',
        status: 'DELETED',
        date_deleted: '2023-01-01T12:00:00Z'
      };

      mockAxiosInstance.delete.mockResolvedValueOnce({
        status: 200,
        statusText: 'OK',
        headers: {},
        data: mockDeletedFileset
      });

      const options: DeleteFileSetOptions = {
        keep_source: true
      };

      // Call the method
      const result = await client.filesets.deleteAssetFileset('asset-keep-source', 'fileset-keep-source', options);

      // Assertions
      expect(mockAxiosInstance.delete).toHaveBeenCalledWith(
        '/API/files/v1/assets/asset-keep-source/file_sets/fileset-keep-source/',
        { params: { keep_source: true } }
      );
      expect(result.status).toBe(200);
    });

    it('should delete a fileset with both options', async () => {
      // Setup mock response for immediate delete with keep_source
      mockAxiosInstance.delete.mockResolvedValueOnce({
        status: 204,
        statusText: 'No Content',
        headers: {},
        data: null
      });

      const options: DeleteFileSetOptions = {
        keep_source: true,
        immediately: true
      };

      // Call the method
      const result = await client.filesets.deleteAssetFileset('asset-both-options', 'fileset-both-options', options);

      // Assertions
      expect(mockAxiosInstance.delete).toHaveBeenCalledWith(
        '/API/files/v1/assets/asset-both-options/file_sets/fileset-both-options/',
        { params: { keep_source: true, immediately: true } }
      );
      expect(result.status).toBe(204);
    });

    it('should validate asset ID is required for deleteAssetFileset', async () => {
      await expect(client.filesets.deleteAssetFileset('', 'fileset-123'))
        .rejects
        .toThrow('Asset ID is required');
    });

    it('should validate asset ID is not just whitespace for deleteAssetFileset', async () => {
      await expect(client.filesets.deleteAssetFileset('   ', 'fileset-123'))
        .rejects
        .toThrow('Asset ID is required');
    });

    it('should validate file set ID is required for deleteAssetFileset', async () => {
      await expect(client.filesets.deleteAssetFileset('asset-123', ''))
        .rejects
        .toThrow('FileSet ID is required');
    });

    it('should validate file set ID is not just whitespace for deleteAssetFileset', async () => {
      await expect(client.filesets.deleteAssetFileset('asset-123', '   '))
        .rejects
        .toThrow('FileSet ID is required');
    });

    // Tests for getFileSetFiles
    it('should get files from a file set with default parameters', async () => {
      // Setup mock paginated response matching API spec
      const mockFiles = {
        objects: [
          {
            id: 'file-123',
            asset_id: 'asset-456',
            file_set_id: 'fileset-789',
            name: 'test_file.mp4',
            status: 'UPLOADED',
            type: 'FILE',
            size: 1024000
          },
          {
            id: 'file-456',
            asset_id: 'asset-456',
            file_set_id: 'fileset-789',
            name: 'test_file2.jpg',
            status: 'UPLOADED',
            type: 'FILE',
            size: 102400
          }
        ],
        total: 2,
        page: 1,
        per_page: 100
      };

      // Mock Axios to return expected response
      mockAxiosInstance.get.mockResolvedValueOnce({
        status: 200,
        statusText: 'OK',
        headers: {},
        data: mockFiles
      });

      // Call the method
      const result = await client.filesets.getFileSetFiles('asset-456', 'fileset-789');

      // Assertions
      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        '/API/files/v1/assets/asset-456/file_sets/fileset-789/files/',
        undefined
      );
      expect(result.data).toEqual(mockFiles);
      expect(result.status).toBe(200);
      expect(result.data.objects.length).toBe(2);
      expect(result.data.objects[0].id).toBe('file-123');
      expect(result.data.objects[0].file_set_id).toBe('fileset-789');
      expect(result.data.objects[0].type).toBe('FILE');
    });

    it('should get files from a file set with all parameters', async () => {
      // Setup options
      const options = {
        per_page: 10,
        last_id: 'file-last-id',
        generate_signed_url: true,
        file_count: true
      };

      // Setup mock response
      const mockFiles = {
        objects: [
          {
            id: 'file-123',
            asset_id: 'asset-456',
            file_set_id: 'fileset-789',
            name: 'test_file.mp4',
            status: 'UPLOADED',
            type: 'FILE',
            size: 1024000,
            url: 'https://example.com/signed-url/test_file.mp4'
          }
        ],
        total: 1,
        page: 1,
        per_page: 10,
        next_url: null,
        prev_url: null
      };

      // Mock Axios to return expected response
      mockAxiosInstance.get.mockResolvedValueOnce({
        status: 200,
        statusText: 'OK',
        headers: {},
        data: mockFiles
      });

      // Call the method
      const result = await client.filesets.getFileSetFiles('asset-456', 'fileset-789', options);

      // Assertions
      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        '/API/files/v1/assets/asset-456/file_sets/fileset-789/files/',
        {
          params: {
            per_page: 10,
            last_id: 'file-last-id',
            generate_signed_url: true,
            file_count: true
          }
        }
      );
      expect(result.data).toEqual(mockFiles);
      expect(result.status).toBe(200);
      expect(result.data.objects[0].url).toBe('https://example.com/signed-url/test_file.mp4');
    });

    it('should handle empty file list', async () => {
      // Setup mock response for empty list
      const mockEmptyFiles = {
        objects: [],
        total: 0,
        page: 1,
        per_page: 100
      };

      // Mock Axios to return expected response
      mockAxiosInstance.get.mockResolvedValueOnce({
        status: 200,
        statusText: 'OK',
        headers: {},
        data: mockEmptyFiles
      });

      // Call the method
      const result = await client.filesets.getFileSetFiles('asset-456', 'fileset-789');

      // Assertions
      expect(result.data).toEqual(mockEmptyFiles);
      expect(result.status).toBe(200);
      expect(result.data.objects.length).toBe(0);
    });

    it('should validate asset ID is required for getFileSetFiles', async () => {
      await expect(client.filesets.getFileSetFiles('', 'fileset-123'))
        .rejects
        .toThrow('Asset ID is required');
    });

    it('should validate asset ID cannot be whitespace for getFileSetFiles', async () => {
      await expect(client.filesets.getFileSetFiles('   ', 'fileset-123'))
        .rejects
        .toThrow('Asset ID is required');
    });

    it('should validate file set ID is required for getFileSetFiles', async () => {
      await expect(client.filesets.getFileSetFiles('asset-123', ''))
        .rejects
        .toThrow('FileSet ID is required');
    });

    it('should validate file set ID cannot be whitespace for getFileSetFiles', async () => {
      await expect(client.filesets.getFileSetFiles('asset-123', '   '))
        .rejects
        .toThrow('FileSet ID is required');
    });
  });

  describe('FileResource', () => {
    it('should get asset files with default parameters', async () => {
      // Setup mock paginated response matching API spec
      const mockFiles = {
        objects: [
          {
            id: 'file-123',
            asset_id: 'asset-456',
            name: 'example.mp4',
            type: 'FILE',
            status: 'UPLOADED',
            size: 1024000
          },
          {
            id: 'file-456',
            asset_id: 'asset-456',
            name: 'thumbnail.jpg',
            type: 'FILE',
            status: 'UPLOADED',
            size: 52000
          }
        ],
        total: 2,
        page: 1,
        pages: 1,
        per_page: 100
      };

      // Mock the axios get method
      mockAxiosInstance.get.mockResolvedValue({
        data: mockFiles,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {}
      });

      // Call the method
      const result = await client.files.getAssetFiles('asset-456');

      // Assert correct URL was called
      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        '/API/files/v1/assets/asset-456/files/',
        undefined
      );

      // Assert response is correct
      expect(result.data).toEqual(mockFiles);
      expect(result.status).toEqual(200);
    });

    it('should get asset files with all parameters', async () => {
      // Setup mock response
      const mockFiles = {
        objects: [
          {
            id: 'file-123',
            asset_id: 'asset-456',
            name: 'example.mp4',
            type: 'FILE',
            status: 'UPLOADED',
            size: 1024000,
            url: 'https://example.com/signed-url'
          }
        ],
        total: 1,
        page: 1,
        pages: 1,
        per_page: 10
      };

      mockAxiosInstance.get.mockResolvedValue({
        data: mockFiles,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {}
      });

      // Call with all parameters
      const result = await client.files.getAssetFiles('asset-456', {
        per_page: 10,
        generate_signed_url: true,
        content_disposition: 'attachment',
        last_id: 'prev-file-id'
      });

      // Assert correct URL was called with query parameters
      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        '/API/files/v1/assets/asset-456/files/',
        {
          params: {
            per_page: 10,
            generate_signed_url: true,
            content_disposition: 'attachment',
            last_id: 'prev-file-id'
          }
        }
      );

      // Assert response
      expect(result.data).toEqual(mockFiles);
      expect(result.status).toEqual(200);
    });

    it('should handle empty file list', async () => {
      // Setup mock response for empty list
      const mockEmptyFiles = {
        objects: [],
        total: 0,
        page: 1,
        pages: 0,
        per_page: 100
      };

      mockAxiosInstance.get.mockResolvedValue({
        data: mockEmptyFiles,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {}
      });

      // Call the method
      const result = await client.files.getAssetFiles('asset-no-files');

      // Assert
      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        '/API/files/v1/assets/asset-no-files/files/',
        undefined
      );
      expect(result.data.objects).toEqual([]);
      expect(result.data.total).toEqual(0);
    });

    it('should validate asset ID is required', async () => {
      await expect(client.files.getAssetFiles(''))
        .rejects
        .toThrow('Asset ID is required');
    });

    it('should validate asset ID cannot be whitespace', async () => {
      await expect(client.files.getAssetFiles('   '))
        .rejects
        .toThrow('Asset ID is required');
    });

    it('should get a specific file by ID', async () => {
      // Setup mock response for single file
      const mockFile = {
        id: 'file-123',
        asset_id: 'asset-456',
        name: 'example.mp4',
        type: 'FILE',
        status: 'UPLOADED',
        size: 1024000
      };

      // Mock the axios get method
      mockAxiosInstance.get.mockResolvedValue({
        data: mockFile,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {}
      });

      // Call the method
      const result = await client.files.getAssetFile('asset-456', 'file-123');

      // Assert correct URL was called
      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        '/API/files/v1/assets/asset-456/files/file-123/',
        undefined
      );

      // Assert response is correct
      expect(result.data).toEqual(mockFile);
      expect(result.status).toEqual(200);
    });

    it('should get a file with all parameters', async () => {
      // Setup mock response
      const mockFile = {
        id: 'file-123',
        asset_id: 'asset-456',
        name: 'example.mp4',
        type: 'FILE',
        status: 'UPLOADED',
        size: 1024000,
        url: 'https://example.com/signed-url'
      };

      mockAxiosInstance.get.mockResolvedValue({
        data: mockFile,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {}
      });

      // Call with all parameters
      const result = await client.files.getAssetFile('asset-456', 'file-123', {
        generate_signed_post_url: true,
        content_disposition: 'attachment',
        bypass_url_cache: true
      });

      // Assert correct URL was called with query parameters
      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        '/API/files/v1/assets/asset-456/files/file-123/',
        {
          params: {
            generate_signed_post_url: true,
            content_disposition: 'attachment',
            bypass_url_cache: true
          }
        }
      );

      // Assert response
      expect(result.data).toEqual(mockFile);
      expect(result.status).toEqual(200);
    });

    it('should validate asset ID is required for getAssetFile', async () => {
      await expect(client.files.getAssetFile('', 'file-123'))
        .rejects
        .toThrow('Asset ID is required');
    });

    it('should validate asset ID cannot be whitespace for getAssetFile', async () => {
      await expect(client.files.getAssetFile('   ', 'file-123'))
        .rejects
        .toThrow('Asset ID is required');
    });

    it('should validate file ID is required', async () => {
      await expect(client.files.getAssetFile('asset-123', ''))
        .rejects
        .toThrow('File ID is required');
    });

    it('should validate file ID cannot be whitespace', async () => {
      await expect(client.files.getAssetFile('asset-123', '   '))
        .rejects
        .toThrow('File ID is required');
    });

    it('should create a new file for an asset', async () => {
      // Setup mock response for created file
      const createData: CreateFileRequest = {
        name: 'new_video.mp4',
        original_name: 'original_video.mp4',
        size: 1024000,
        type: 'FILE',
        status: 'OPEN',
        storage_id: 'storage-123',
        format_id: 'format-456',
        file_set_id: 'fileset-789',
        directory_path: '/uploads',
        checksum: 'abc123def456'
      };

      const mockCreatedFile = {
        id: 'file-new-123',
        asset_id: 'asset-create',
        name: 'new_video.mp4',
        original_name: 'original_video.mp4',
        size: 1024000,
        type: 'FILE',
        status: 'OPEN',
        storage_id: 'storage-123',
        format_id: 'format-456',
        file_set_id: 'fileset-789',
        directory_path: '/uploads',
        checksum: 'abc123def456',
        date_created: '2023-01-01T00:00:00Z',
        upload_url: 'https://upload.example.com/signed-url',
        upload_method: 'PUT'
      };

      mockAxiosInstance.post.mockResolvedValueOnce({
        status: 201,
        statusText: 'Created',
        headers: {},
        data: mockCreatedFile
      });

      // Call the method
      const result = await client.files.createAssetFile('asset-create', createData);

      // Assertions
      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        '/API/files/v1/assets/asset-create/files/',
        createData,
        undefined
      );
      expect(result.data).toEqual(mockCreatedFile);
      expect(result.status).toBe(201);
      expect(result.data.id).toBe('file-new-123');
      expect(result.data.asset_id).toBe('asset-create');
      expect(result.data.name).toBe('new_video.mp4');
      expect(result.data.upload_url).toBe('https://upload.example.com/signed-url');
    });

    it('should create a minimal file', async () => {
      // Setup mock response for minimal file creation
      const createData: CreateFileRequest = {
        name: 'minimal.txt',
        type: 'FILE',
        status: 'OPEN'
      };

      const mockMinimalFile = {
        id: 'file-minimal-456',
        asset_id: 'asset-minimal',
        name: 'minimal.txt',
        type: 'FILE',
        status: 'OPEN',
        date_created: '2023-01-01T00:00:00Z'
      };

      mockAxiosInstance.post.mockResolvedValueOnce({
        status: 201,
        statusText: 'Created',
        headers: {},
        data: mockMinimalFile
      });

      // Call the method
      const result = await client.files.createAssetFile('asset-minimal', createData);

      // Assertions
      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        '/API/files/v1/assets/asset-minimal/files/',
        createData,
        undefined
      );
      expect(result.data).toEqual(mockMinimalFile);
      expect(result.status).toBe(201);
      expect(result.data.id).toBe('file-minimal-456');
    });

    it('should create a file with upload credentials', async () => {
      // Setup mock response for file with upload credentials
      const createData: CreateFileRequest = {
        name: 'upload_file.mp4',
        size: 2048000,
        type: 'FILE',
        status: 'OPEN',
        storage_id: 'storage-456'
      };

      const mockFileWithCredentials = {
        id: 'file-upload-789',
        asset_id: 'asset-upload',
        name: 'upload_file.mp4',
        size: 2048000,
        type: 'FILE',
        status: 'OPEN',
        storage_id: 'storage-456',
        upload_url: 'https://s3.amazonaws.com/bucket/upload',
        upload_method: 'POST',
        multipart_upload_url: 'https://s3.amazonaws.com/bucket/multipart',
        upload_credentials: {
          access_key: 'AKIAIOSFODNN7EXAMPLE',
          secret_key: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
          session_token: 'temporary-token'
        },
        date_created: '2023-01-01T00:00:00Z'
      };

      mockAxiosInstance.post.mockResolvedValueOnce({
        status: 201,
        statusText: 'Created',
        headers: {},
        data: mockFileWithCredentials
      });

      // Call the method
      const result = await client.files.createAssetFile('asset-upload', createData);

      // Assertions
      expect(result.data.upload_url).toBe('https://s3.amazonaws.com/bucket/upload');
      expect(result.data.upload_method).toBe('POST');
      expect(result.data.multipart_upload_url).toBe('https://s3.amazonaws.com/bucket/multipart');
      expect(result.data.upload_credentials).toBeDefined();
      expect(result.data.upload_credentials?.access_key).toBe('AKIAIOSFODNN7EXAMPLE');
    });

    it('should create a directory type file', async () => {
      // Setup mock response for directory creation
      const createData: CreateFileRequest = {
        name: 'uploads',
        type: 'DIRECTORY',
        status: 'OPEN',
        directory_path: '/media'
      };

      const mockDirectory = {
        id: 'file-dir-101',
        asset_id: 'asset-dir',
        name: 'uploads',
        type: 'DIRECTORY',
        status: 'OPEN',
        directory_path: '/media',
        date_created: '2023-01-01T00:00:00Z'
      };

      mockAxiosInstance.post.mockResolvedValueOnce({
        status: 201,
        statusText: 'Created',
        headers: {},
        data: mockDirectory
      });

      // Call the method
      const result = await client.files.createAssetFile('asset-dir', createData);

      // Assertions
      expect(result.data.type).toBe('DIRECTORY');
      expect(result.data.name).toBe('uploads');
      expect(result.data.directory_path).toBe('/media');
    });

    it('should validate asset ID is required for createAssetFile', async () => {
      const createData: CreateFileRequest = {
        name: 'test.txt',
        type: 'FILE',
        status: 'OPEN'
      };

      await expect(client.files.createAssetFile('', createData))
        .rejects
        .toThrow('Asset ID is required');
    });

    it('should validate asset ID is not just whitespace for createAssetFile', async () => {
      const createData: CreateFileRequest = {
        name: 'test.txt',
        type: 'FILE',
        status: 'OPEN'
      };

      await expect(client.files.createAssetFile('   ', createData))
        .rejects
        .toThrow('Asset ID is required');
    });
  });

  describe('FormatResource', () => {
    it('should get asset formats with default parameters', async () => {
      // Setup mock paginated response matching API spec
      const mockFormats = {
        objects: [
          {
            id: 'format-123',
            asset_id: 'asset-456',
            name: 'Original',
            status: 'ACTIVE',
            archive_status: 'NOT_ARCHIVED',
            is_online: true,
            components: [
              {
                id: 'comp-1',
                name: 'Video Track',
                type: 'VIDEO',
                metadata: { bitrate: '1000000' }
              },
              {
                id: 'comp-2',
                name: 'Audio Track',
                type: 'AUDIO',
                metadata: { sample_rate: '48000' }
              }
            ],
            storage_methods: ['LOCAL', 'CLOUD'],
            date_created: '2023-01-01T00:00:00Z'
          },
          {
            id: 'format-456',
            asset_id: 'asset-456',
            name: 'Proxy',
            status: 'ACTIVE',
            archive_status: 'NOT_ARCHIVED',
            is_online: true,
            components: [
              {
                id: 'comp-3',
                name: 'Proxy Video',
                type: 'VIDEO',
                metadata: { bitrate: '500000' }
              }
            ],
            storage_methods: ['LOCAL'],
            date_created: '2023-01-02T00:00:00Z'
          }
        ],
        total: 2,
        page: 1,
        pages: 1,
        per_page: 50,
        first_url: '/v1/assets/asset-456/formats/?page=1',
        last_url: '/v1/assets/asset-456/formats/?page=1'
      };

      mockAxiosInstance.get.mockResolvedValueOnce({
        status: 200,
        statusText: 'OK',
        headers: {},
        data: mockFormats
      });

      // Call the method
      const result = await client.formats.getAssetFormats('asset-456');

      // Assertions
      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        '/v1/assets/asset-456/formats/',
        undefined
      );
      expect(result.data).toEqual(mockFormats);
      expect(result.status).toBe(200);
      expect(result.data.objects).toHaveLength(2);
    });

    it('should get asset formats with pagination parameters', async () => {
      // Setup mock response with pagination
      const mockFormats = {
        objects: [
          {
            id: 'format-789',
            asset_id: 'asset-789',
            name: 'Transcoded',
            status: 'ACTIVE',
            archive_status: 'NOT_ARCHIVED',
            is_online: true,
            components: [
              {
                id: 'comp-4',
                name: 'Transcoded Video',
                type: 'VIDEO'
              }
            ],
            date_created: '2023-01-03T00:00:00Z'
          }
        ],
        total: 5,
        page: 2,
        pages: 3,
        per_page: 2,
        next_url: '/v1/assets/asset-789/formats/?per_page=2&last_id=format-890',
        prev_url: '/v1/assets/asset-789/formats/?per_page=2&last_id=format-678'
      };

      mockAxiosInstance.get.mockResolvedValueOnce({
        status: 200,
        statusText: 'OK',
        headers: {},
        data: mockFormats
      });

      const params: AssetFormatsListParams = {
        per_page: 2,
        last_id: 'format-678'
      };

      // Call the method
      const result = await client.formats.getAssetFormats('asset-789', params);

      // Assertions
      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        '/v1/assets/asset-789/formats/',
        { params: { per_page: 2, last_id: 'format-678' } }
      );
      expect(result.data).toEqual(mockFormats);
      expect(result.status).toBe(200);
    });

    it('should get asset formats with include_all_versions parameter', async () => {
      // Setup mock response with all versions
      const mockFormats = {
        objects: [
          {
            id: 'format-100',
            asset_id: 'asset-100',
            name: 'Original v1',
            status: 'ACTIVE',
            version_id: 'version-1',
            archive_status: 'NOT_ARCHIVED',
            is_online: true,
            date_created: '2023-01-01T00:00:00Z'
          },
          {
            id: 'format-101',
            asset_id: 'asset-100',
            name: 'Original v2',
            status: 'ACTIVE',
            version_id: 'version-2',
            archive_status: 'NOT_ARCHIVED',
            is_online: true,
            date_created: '2023-01-02T00:00:00Z'
          }
        ],
        total: 2,
        page: 1,
        pages: 1,
        per_page: 50
      };

      mockAxiosInstance.get.mockResolvedValueOnce({
        status: 200,
        statusText: 'OK',
        headers: {},
        data: mockFormats
      });

      const params: AssetFormatsListParams = {
        include_all_versions: true
      };

      // Call the method
      const result = await client.formats.getAssetFormats('asset-100', params);

      // Assertions
      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        '/v1/assets/asset-100/formats/',
        { params: { include_all_versions: true } }
      );
      expect(result.data).toEqual(mockFormats);
      expect(result.status).toBe(200);
      expect(result.data.objects).toHaveLength(2);
    });

    it('should get asset formats with all parameters', async () => {
      // Setup mock response
      const mockFormats = {
        objects: [
          {
            id: 'format-200',
            asset_id: 'asset-200',
            name: 'Complex Format',
            status: 'ACTIVE',
            archive_status: 'ARCHIVED',
            is_online: false,
            version_id: 'version-3',
            user_id: 'user-123',
            components: [
              {
                id: 'comp-5',
                name: 'Video Component',
                type: 'VIDEO',
                metadata: {
                  codec: 'h264',
                  bitrate: '2000000',
                  resolution: '1920x1080'
                }
              },
              {
                id: 'comp-6',
                name: 'Audio Component',
                type: 'AUDIO',
                metadata: {
                  codec: 'aac',
                  bitrate: '128000',
                  channels: '2'
                }
              }
            ],
            metadata: [
              {
                duration: '3600',
                file_size: '1073741824'
              }
            ],
            storage_methods: ['S3', 'GLACIER'],
            warnings: ['low_quality', 'incomplete_metadata'],
            date_created: '2023-01-05T00:00:00Z',
            date_modified: '2023-01-05T12:00:00Z'
          }
        ],
        total: 3,
        page: 1,
        pages: 2,
        per_page: 1
      };

      mockAxiosInstance.get.mockResolvedValueOnce({
        status: 200,
        statusText: 'OK',
        headers: {},
        data: mockFormats
      });

      const params: AssetFormatsListParams = {
        per_page: 1,
        last_id: 'format-199',
        include_all_versions: true
      };

      // Call the method
      const result = await client.formats.getAssetFormats('asset-200', params);

      // Assertions
      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        '/v1/assets/asset-200/formats/',
        { params: { per_page: 1, last_id: 'format-199', include_all_versions: true } }
      );
      expect(result.data).toEqual(mockFormats);
      expect(result.status).toBe(200);
    });

    it('should handle empty formats list', async () => {
      // Setup mock response for empty list
      const mockEmptyFormats = {
        objects: [],
        total: 0,
        page: 1,
        pages: 0,
        per_page: 50
      };

      mockAxiosInstance.get.mockResolvedValueOnce({
        status: 200,
        statusText: 'OK',
        headers: {},
        data: mockEmptyFormats
      });

      // Call the method
      const result = await client.formats.getAssetFormats('asset-empty');

      // Assertions
      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        '/v1/assets/asset-empty/formats/',
        undefined
      );
      expect(result.data).toEqual(mockEmptyFormats);
      expect(result.status).toBe(200);
      expect(result.data.objects).toHaveLength(0);
    });

    it('should validate asset ID is required', async () => {
      await expect(client.formats.getAssetFormats(''))
        .rejects
        .toThrow('Asset ID is required');
    });

    it('should validate asset ID is not just whitespace', async () => {
      await expect(client.formats.getAssetFormats('   '))
        .rejects
        .toThrow('Asset ID is required');
    });

    it('should handle formats with complex component structures', async () => {
      // Setup mock response with complex components
      const mockComplexFormats = {
        objects: [
          {
            id: 'format-complex',
            asset_id: 'asset-complex',
            name: 'Multi-component Format',
            status: 'ACTIVE',
            archive_status: 'NOT_ARCHIVED',
            is_online: true,
            components: [
              {
                id: 'comp-video-1',
                name: 'Primary Video',
                type: 'VIDEO',
                metadata: {
                  codec: 'h265',
                  bitrate: '5000000',
                  resolution: '3840x2160',
                  frame_rate: '29.97'
                }
              },
              {
                id: 'comp-audio-1',
                name: 'English Audio',
                type: 'AUDIO',
                metadata: {
                  codec: 'ac3',
                  bitrate: '320000',
                  channels: '5.1',
                  language: 'en'
                }
              },
              {
                id: 'comp-audio-2',
                name: 'Spanish Audio',
                type: 'AUDIO',
                metadata: {
                  codec: 'ac3',
                  bitrate: '320000',
                  channels: '5.1',
                  language: 'es'
                }
              },
              {
                id: 'comp-subtitle-1',
                name: 'English Subtitles',
                type: 'SUBTITLE',
                metadata: {
                  format: 'srt',
                  language: 'en'
                }
              }
            ],
            storage_methods: ['LOCAL', 'S3', 'AZURE'],
            date_created: '2023-01-06T00:00:00Z'
          }
        ],
        total: 1,
        page: 1,
        pages: 1,
        per_page: 50
      };

      mockAxiosInstance.get.mockResolvedValueOnce({
        status: 200,
        statusText: 'OK',
        headers: {},
        data: mockComplexFormats
      });

      // Call the method
      const result = await client.formats.getAssetFormats('asset-complex');

      // Assertions
      expect(result.data.objects[0].components).toHaveLength(4);
      expect(result.data.objects[0].components![0].type).toBe('VIDEO');
      expect(result.data.objects[0].components![1].type).toBe('AUDIO');
      expect(result.data.objects[0].components![2].type).toBe('AUDIO');
      expect(result.data.objects[0].components![3].type).toBe('SUBTITLE');
      expect(result.data.objects[0].storage_methods).toContain('LOCAL');
      expect(result.data.objects[0].storage_methods).toContain('S3');
      expect(result.data.objects[0].storage_methods).toContain('AZURE');
    });

    it('should handle archived formats', async () => {
      // Setup mock response with archived formats
      const mockArchivedFormats = {
        objects: [
          {
            id: 'format-archived',
            asset_id: 'asset-archived',
            name: 'Archived Format',
            status: 'ARCHIVED',
            archive_status: 'ARCHIVED',
            is_online: false,
            date_created: '2023-01-01T00:00:00Z',
            date_deleted: '2023-02-01T00:00:00Z',
            deleted_by_user: 'admin-user'
          }
        ],
        total: 1,
        page: 1,
        pages: 1,
        per_page: 50
      };

      mockAxiosInstance.get.mockResolvedValueOnce({
        status: 200,
        statusText: 'OK',
        headers: {},
        data: mockArchivedFormats
      });

      // Call the method
      const result = await client.formats.getAssetFormats('asset-archived');

      // Assertions
      expect(result.data.objects[0].status).toBe('ARCHIVED');
      expect(result.data.objects[0].archive_status).toBe('ARCHIVED');
      expect(result.data.objects[0].is_online).toBe(false);
      expect(result.data.objects[0].deleted_by_user).toBe('admin-user');
    });

    it('should create a new format for an asset', async () => {
      // Setup mock response for created format
      const createData: CreateFormatRequest = {
        name: 'New Format',
        status: 'ACTIVE',
        archive_status: 'NOT_ARCHIVED',
        is_online: true,
        components: [
          {
            name: 'Video Component',
            type: 'VIDEO',
            metadata: {
              codec: 'h264',
              bitrate: '2000000',
              resolution: '1920x1080'
            }
          },
          {
            name: 'Audio Component',
            type: 'AUDIO',
            metadata: {
              codec: 'aac',
              bitrate: '128000',
              channels: '2'
            }
          }
        ],
        storage_methods: ['LOCAL', 'CLOUD'],
        version_id: 'version-1'
      };

      const mockCreatedFormat: Format = {
        id: 'format-new-123',
        asset_id: 'asset-create',
        name: 'New Format',
        status: 'ACTIVE',
        archive_status: 'NOT_ARCHIVED',
        is_online: true,
        components: [
          {
            id: 'comp-new-1',
            name: 'Video Component',
            type: 'VIDEO',
            metadata: {
              codec: 'h264',
              bitrate: '2000000',
              resolution: '1920x1080'
            }
          },
          {
            id: 'comp-new-2',
            name: 'Audio Component',
            type: 'AUDIO',
            metadata: {
              codec: 'aac',
              bitrate: '128000',
              channels: '2'
            }
          }
        ],
        storage_methods: ['LOCAL', 'CLOUD'],
        version_id: 'version-1',
        date_created: '2023-01-01T00:00:00Z',
        date_modified: '2023-01-01T00:00:00Z'
      };

      mockAxiosInstance.post.mockResolvedValueOnce({
        status: 201,
        statusText: 'Created',
        headers: {},
        data: mockCreatedFormat
      });

      // Call the method
      const result = await client.formats.createAssetFormat('asset-create', createData);

      // Assertions
      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        '/v1/assets/asset-create/formats/',
        createData,
        undefined
      );
      expect(result.data).toEqual(mockCreatedFormat);
      expect(result.status).toBe(201);
      expect(result.data.id).toBe('format-new-123');
      expect(result.data.asset_id).toBe('asset-create');
      expect(result.data.name).toBe('New Format');
      expect(result.data.components).toHaveLength(2);
    });

    it('should create a minimal format', async () => {
      // Setup mock response for minimal format creation
      const createData: CreateFormatRequest = {
        name: 'Minimal Format',
        status: 'ACTIVE'
      };

      const mockMinimalFormat: Format = {
        id: 'format-minimal-456',
        asset_id: 'asset-minimal',
        name: 'Minimal Format',
        status: 'ACTIVE',
        date_created: '2023-01-01T00:00:00Z'
      };

      mockAxiosInstance.post.mockResolvedValueOnce({
        status: 201,
        statusText: 'Created',
        headers: {},
        data: mockMinimalFormat
      });

      // Call the method
      const result = await client.formats.createAssetFormat('asset-minimal', createData);

      // Assertions
      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        '/v1/assets/asset-minimal/formats/',
        createData,
        undefined
      );
      expect(result.data).toEqual(mockMinimalFormat);
      expect(result.status).toBe(201);
      expect(result.data.id).toBe('format-minimal-456');
    });

    it('should create a format with complex components', async () => {
      // Setup mock response for format with complex components
      const createData: CreateFormatRequest = {
        name: 'Multi-component Format',
        status: 'ACTIVE',
        archive_status: 'NOT_ARCHIVED',
        is_online: true,
        components: [
          {
            name: 'Primary Video',
            type: 'VIDEO',
            metadata: {
              codec: 'h265',
              bitrate: '5000000',
              resolution: '3840x2160',
              frame_rate: '29.97'
            }
          },
          {
            name: 'English Audio',
            type: 'AUDIO',
            metadata: {
              codec: 'ac3',
              bitrate: '320000',
              channels: '5.1',
              language: 'en'
            }
          },
          {
            name: 'Spanish Audio',
            type: 'AUDIO',
            metadata: {
              codec: 'ac3',
              bitrate: '320000',
              channels: '5.1',
              language: 'es'
            }
          },
          {
            name: 'English Subtitles',
            type: 'SUBTITLE',
            metadata: {
              format: 'srt',
              language: 'en'
            }
          }
        ],
        storage_methods: ['LOCAL', 'S3', 'AZURE'],
        metadata: [
          {
            duration: '7200',
            file_size: '2147483648'
          }
        ]
      };

      const mockComplexFormat: Format = {
        id: 'format-complex-789',
        asset_id: 'asset-complex',
        name: 'Multi-component Format',
        status: 'ACTIVE',
        archive_status: 'NOT_ARCHIVED',
        is_online: true,
        components: [
          {
            id: 'comp-video-1',
            name: 'Primary Video',
            type: 'VIDEO',
            metadata: {
              codec: 'h265',
              bitrate: '5000000',
              resolution: '3840x2160',
              frame_rate: '29.97'
            }
          },
          {
            id: 'comp-audio-1',
            name: 'English Audio',
            type: 'AUDIO',
            metadata: {
              codec: 'ac3',
              bitrate: '320000',
              channels: '5.1',
              language: 'en'
            }
          },
          {
            id: 'comp-audio-2',
            name: 'Spanish Audio',
            type: 'AUDIO',
            metadata: {
              codec: 'ac3',
              bitrate: '320000',
              channels: '5.1',
              language: 'es'
            }
          },
          {
            id: 'comp-subtitle-1',
            name: 'English Subtitles',
            type: 'SUBTITLE',
            metadata: {
              format: 'srt',
              language: 'en'
            }
          }
        ],
        storage_methods: ['LOCAL', 'S3', 'AZURE'],
        metadata: [
          {
            duration: '7200',
            file_size: '2147483648'
          }
        ],
        date_created: '2023-01-01T00:00:00Z'
      };

      mockAxiosInstance.post.mockResolvedValueOnce({
        status: 201,
        statusText: 'Created',
        headers: {},
        data: mockComplexFormat
      });

      // Call the method
      const result = await client.formats.createAssetFormat('asset-complex', createData);

      // Assertions
      expect(result.data.components).toHaveLength(4);
      expect(result.data.components![0].type).toBe('VIDEO');
      expect(result.data.components![1].type).toBe('AUDIO');
      expect(result.data.components![2].type).toBe('AUDIO');
      expect(result.data.components![3].type).toBe('SUBTITLE');
      expect(result.data.storage_methods).toEqual(['LOCAL', 'S3', 'AZURE']);
      expect(result.data.metadata).toHaveLength(1);
    });

    it('should create an archived format', async () => {
      // Setup mock response for archived format creation
      const createData: CreateFormatRequest = {
        name: 'Archived Format',
        status: 'ARCHIVED',
        archive_status: 'ARCHIVED',
        is_online: false,
        date_deleted: '2023-02-01T00:00:00Z',
        user_id: 'admin-user'
      };

      const mockArchivedFormat: Format = {
        id: 'format-archived-101',
        asset_id: 'asset-archived',
        name: 'Archived Format',
        status: 'ARCHIVED',
        archive_status: 'ARCHIVED',
        is_online: false,
        date_created: '2023-01-01T00:00:00Z',
        date_deleted: '2023-02-01T00:00:00Z',
        user_id: 'admin-user'
      };

      mockAxiosInstance.post.mockResolvedValueOnce({
        status: 201,
        statusText: 'Created',
        headers: {},
        data: mockArchivedFormat
      });

      // Call the method
      const result = await client.formats.createAssetFormat('asset-archived', createData);

      // Assertions
      expect(result.data.status).toBe('ARCHIVED');
      expect(result.data.archive_status).toBe('ARCHIVED');
      expect(result.data.is_online).toBe(false);
      expect(result.data.date_deleted).toBe('2023-02-01T00:00:00Z');
    });

    it('should validate asset ID is required for createAssetFormat', async () => {
      const createData: CreateFormatRequest = {
        name: 'Test Format',
        status: 'ACTIVE'
      };

      await expect(client.formats.createAssetFormat('', createData))
        .rejects
        .toThrow('Asset ID is required');
    });

    it('should validate asset ID is not just whitespace for createAssetFormat', async () => {
      const createData: CreateFormatRequest = {
        name: 'Test Format',
        status: 'ACTIVE'
      };

      await expect(client.formats.createAssetFormat('   ', createData))
        .rejects
        .toThrow('Asset ID is required');
    });

    it('should get a specific format for an asset', async () => {
      // Setup mock response for getting a specific format
      const mockFormat: Format = {
        id: 'format-specific-123',
        asset_id: 'asset-specific',
        name: 'Specific Format',
        status: 'ACTIVE',
        archive_status: 'NOT_ARCHIVED',
        is_online: true,
        components: [
          {
            id: 'comp-spec-1',
            name: 'Main Video Component',
            type: 'VIDEO',
            metadata: {
              codec: 'h264',
              bitrate: '2000000',
              resolution: '1920x1080'
            }
          }
        ],
        storage_methods: ['LOCAL'],
        version_id: 'v1.2.3',
        date_created: '2023-01-01T00:00:00Z',
        date_modified: '2023-01-01T12:00:00Z'
      };

      mockAxiosInstance.get.mockResolvedValueOnce({
        status: 200,
        statusText: 'OK',
        headers: {},
        data: mockFormat
      });

      // Call the method
      const result = await client.formats.getAssetFormat('asset-specific', 'format-specific-123');

      // Assertions
      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        '/v1/assets/asset-specific/formats/format-specific-123/',
        undefined
      );
      expect(result.data).toEqual(mockFormat);
      expect(result.status).toBe(200);
      expect(result.data.id).toBe('format-specific-123');
      expect(result.data.asset_id).toBe('asset-specific');
      expect(result.data.name).toBe('Specific Format');
      expect(result.data.components).toHaveLength(1);
    });

    it('should get a format with complex metadata', async () => {
      // Setup mock response for format with complex metadata
      const mockComplexFormat: Format = {
        id: 'format-complex-meta-456',
        asset_id: 'asset-complex-meta',
        name: 'Complex Metadata Format',
        status: 'ACTIVE',
        archive_status: 'NOT_ARCHIVED',
        is_online: true,
        components: [
          {
            id: 'comp-meta-1',
            name: 'High Quality Video',
            type: 'VIDEO',
            metadata: {
              codec: 'h265',
              bitrate: '10000000',
              resolution: '3840x2160',
              color_space: 'bt2020',
              hdr: true
            }
          },
          {
            id: 'comp-meta-2',
            name: 'Audio Track',
            type: 'AUDIO',
            metadata: {
              codec: 'flac',
              sample_rate: '96000',
              bit_depth: '24',
              channels: '7.1'
            }
          }
        ],
        storage_methods: ['S3', 'AZURE_BLOB'],
        metadata: [
          {
            technical: {
              duration: '5400',
              file_size: '4294967296',
              checksum: 'sha256:abc123...'
            },
            workflow: {
              transcode_job_id: 'job-789',
              transcode_profile: 'uhd_hdr'
            }
          }
        ],
        version_id: 'v2.0.0',
        user_id: 'user-creator-123',
        date_created: '2023-01-01T00:00:00Z',
        date_modified: '2023-01-01T18:30:00Z'
      };

      mockAxiosInstance.get.mockResolvedValueOnce({
        status: 200,
        statusText: 'OK',
        headers: {},
        data: mockComplexFormat
      });

      // Call the method
      const result = await client.formats.getAssetFormat('asset-complex-meta', 'format-complex-meta-456');

      // Assertions
      expect(result.data).toEqual(mockComplexFormat);
      expect(result.data.components).toHaveLength(2);
      expect(result.data.metadata).toHaveLength(1);
      expect(result.data.storage_methods).toEqual(['S3', 'AZURE_BLOB']);
    });

    it('should get an archived format', async () => {
      // Setup mock response for archived format
      const mockArchivedFormat: Format = {
        id: 'format-archived-789',
        asset_id: 'asset-archived',
        name: 'Archived Format',
        status: 'ARCHIVED',
        archive_status: 'ARCHIVED',
        is_online: false,
        storage_methods: ['TAPE'],
        date_created: '2022-01-01T00:00:00Z',
        date_deleted: '2023-06-15T10:30:00Z',
        deleted_by_user: 'archive-user-456',
        metadata: [
          {
            archive_info: {
              archive_date: '2023-06-15T10:30:00Z',
              archive_reason: 'Long term storage',
              retrieval_time_estimate: '24h'
            }
          }
        ]
      };

      mockAxiosInstance.get.mockResolvedValueOnce({
        status: 200,
        statusText: 'OK',
        headers: {},
        data: mockArchivedFormat
      });

      // Call the method
      const result = await client.formats.getAssetFormat('asset-archived', 'format-archived-789');

      // Assertions
      expect(result.data.status).toBe('ARCHIVED');
      expect(result.data.archive_status).toBe('ARCHIVED');
      expect(result.data.is_online).toBe(false);
      expect(result.data.date_deleted).toBe('2023-06-15T10:30:00Z');
      expect(result.data.deleted_by_user).toBe('archive-user-456');
    });

    it('should validate asset ID is required for getAssetFormat', async () => {
      await expect(client.formats.getAssetFormat('', 'format-123'))
        .rejects
        .toThrow('Asset ID is required');
    });

    it('should validate asset ID is not just whitespace for getAssetFormat', async () => {
      await expect(client.formats.getAssetFormat('   ', 'format-123'))
        .rejects
        .toThrow('Asset ID is required');
    });

    it('should validate format ID is required for getAssetFormat', async () => {
      await expect(client.formats.getAssetFormat('asset-123', ''))
        .rejects
        .toThrow('Format ID is required');
    });

    it('should validate format ID is not just whitespace for getAssetFormat', async () => {
      await expect(client.formats.getAssetFormat('asset-123', '   '))
        .rejects
        .toThrow('Format ID is required');
    });

    it('should update a format for an asset', async () => {
      // Setup mock response for updating a format
      const updateData: UpdateFormatRequest = {
        name: 'Updated Format Name',
        status: 'ACTIVE',
        archive_status: 'NOT_ARCHIVED',
        is_online: true,
        components: [
          {
            name: 'Updated Video Component',
            type: 'VIDEO',
            metadata: {
              codec: 'h265',
              bitrate: '8000000',
              resolution: '3840x2160'
            }
          }
        ],
        storage_methods: ['S3', 'LOCAL'],
        version_id: 'v2.0.0'
      };

      const mockUpdatedFormat: Format = {
        id: 'format-update-123',
        asset_id: 'asset-update',
        name: 'Updated Format Name',
        status: 'ACTIVE',
        archive_status: 'NOT_ARCHIVED',
        is_online: true,
        components: [
          {
            id: 'comp-updated-1',
            name: 'Updated Video Component',
            type: 'VIDEO',
            metadata: {
              codec: 'h265',
              bitrate: '8000000',
              resolution: '3840x2160'
            }
          }
        ],
        storage_methods: ['S3', 'LOCAL'],
        version_id: 'v2.0.0',
        date_created: '2023-01-01T00:00:00Z',
        date_modified: '2023-01-01T15:30:00Z'
      };

      mockAxiosInstance.patch.mockResolvedValueOnce({
        status: 200,
        statusText: 'OK',
        headers: {},
        data: mockUpdatedFormat
      });

      // Call the method
      const result = await client.formats.updateAssetFormat('asset-update', 'format-update-123', updateData);

      // Assertions
      expect(mockAxiosInstance.patch).toHaveBeenCalledWith(
        '/v1/assets/asset-update/formats/format-update-123/',
        updateData,
        undefined
      );
      expect(result.data).toEqual(mockUpdatedFormat);
      expect(result.status).toBe(200);
      expect(result.data.id).toBe('format-update-123');
      expect(result.data.name).toBe('Updated Format Name');
      expect(result.data.version_id).toBe('v2.0.0');
      expect(result.data.components).toHaveLength(1);
    });

    it('should update format status to archived', async () => {
      // Setup mock response for archiving a format
      const updateData: UpdateFormatRequest = {
        status: 'ARCHIVED',
        archive_status: 'ARCHIVED',
        is_online: false,
        date_deleted: '2023-06-15T10:30:00Z',
        metadata: [
          {
            archive_reason: 'Moved to long-term storage',
            archived_by: 'system-auto-archive'
          }
        ]
      };

      const mockArchivedFormat: Format = {
        id: 'format-archive-456',
        asset_id: 'asset-archive',
        name: 'Archived Format',
        status: 'ARCHIVED',
        archive_status: 'ARCHIVED',
        is_online: false,
        date_created: '2023-01-01T00:00:00Z',
        date_deleted: '2023-06-15T10:30:00Z',
        date_modified: '2023-06-15T10:30:00Z',
        metadata: [
          {
            archive_reason: 'Moved to long-term storage',
            archived_by: 'system-auto-archive'
          }
        ]
      };

      mockAxiosInstance.patch.mockResolvedValueOnce({
        status: 200,
        statusText: 'OK',
        headers: {},
        data: mockArchivedFormat
      });

      // Call the method
      const result = await client.formats.updateAssetFormat('asset-archive', 'format-archive-456', updateData);

      // Assertions
      expect(result.data.status).toBe('ARCHIVED');
      expect(result.data.archive_status).toBe('ARCHIVED');
      expect(result.data.is_online).toBe(false);
      expect(result.data.date_deleted).toBe('2023-06-15T10:30:00Z');
    });

    it('should update format components', async () => {
      // Setup mock response for updating format components
      const updateData: UpdateFormatRequest = {
        components: [
          {
            name: 'High Quality Video',
            type: 'VIDEO',
            metadata: {
              codec: 'av1',
              bitrate: '15000000',
              resolution: '7680x4320',
              hdr: true
            }
          },
          {
            name: 'Lossless Audio',
            type: 'AUDIO',
            metadata: {
              codec: 'flac',
              sample_rate: '192000',
              bit_depth: '32',
              channels: '7.1'
            }
          },
          {
            name: 'Multiple Language Subtitles',
            type: 'SUBTITLE',
            metadata: {
              languages: ['en', 'es', 'fr', 'de'],
              format: 'webvtt'
            }
          }
        ]
      };

      const mockUpdatedFormat: Format = {
        id: 'format-components-789',
        asset_id: 'asset-components',
        name: 'Multi-component Format',
        status: 'ACTIVE',
        components: [
          {
            id: 'comp-video-updated',
            name: 'High Quality Video',
            type: 'VIDEO',
            metadata: {
              codec: 'av1',
              bitrate: '15000000',
              resolution: '7680x4320',
              hdr: true
            }
          },
          {
            id: 'comp-audio-updated',
            name: 'Lossless Audio',
            type: 'AUDIO',
            metadata: {
              codec: 'flac',
              sample_rate: '192000',
              bit_depth: '32',
              channels: '7.1'
            }
          },
          {
            id: 'comp-subtitle-updated',
            name: 'Multiple Language Subtitles',
            type: 'SUBTITLE',
            metadata: {
              languages: ['en', 'es', 'fr', 'de'],
              format: 'webvtt'
            }
          }
        ],
        date_created: '2023-01-01T00:00:00Z',
        date_modified: '2023-01-01T16:45:00Z'
      };

      mockAxiosInstance.patch.mockResolvedValueOnce({
        status: 200,
        statusText: 'OK',
        headers: {},
        data: mockUpdatedFormat
      });

      // Call the method
      const result = await client.formats.updateAssetFormat('asset-components', 'format-components-789', updateData);

      // Assertions
      expect(result.data.components).toHaveLength(3);
      expect(result.data.components![0].type).toBe('VIDEO');
      expect(result.data.components![1].type).toBe('AUDIO');
      expect(result.data.components![2].type).toBe('SUBTITLE');
    });

    it('should update format with minimal data', async () => {
      // Setup mock response for minimal update
      const updateData: UpdateFormatRequest = {
        name: 'Renamed Format'
      };

      const mockMinimalUpdate: Format = {
        id: 'format-minimal-update-123',
        asset_id: 'asset-minimal-update',
        name: 'Renamed Format',
        status: 'ACTIVE',
        date_created: '2023-01-01T00:00:00Z',
        date_modified: '2023-01-01T12:15:00Z'
      };

      mockAxiosInstance.patch.mockResolvedValueOnce({
        status: 200,
        statusText: 'OK',
        headers: {},
        data: mockMinimalUpdate
      });

      // Call the method
      const result = await client.formats.updateAssetFormat('asset-minimal-update', 'format-minimal-update-123', updateData);

      // Assertions
      expect(result.data.name).toBe('Renamed Format');
      expect(result.data.id).toBe('format-minimal-update-123');
    });

    it('should validate asset ID is required for updateAssetFormat', async () => {
      const updateData: UpdateFormatRequest = {
        name: 'Test Update'
      };

      await expect(client.formats.updateAssetFormat('', 'format-123', updateData))
        .rejects
        .toThrow('Asset ID is required');
    });

    it('should validate asset ID is not just whitespace for updateAssetFormat', async () => {
      const updateData: UpdateFormatRequest = {
        name: 'Test Update'
      };

      await expect(client.formats.updateAssetFormat('   ', 'format-123', updateData))
        .rejects
        .toThrow('Asset ID is required');
    });

    it('should validate format ID is required for updateAssetFormat', async () => {
      const updateData: UpdateFormatRequest = {
        name: 'Test Update'
      };

      await expect(client.formats.updateAssetFormat('asset-123', '', updateData))
        .rejects
        .toThrow('Format ID is required');
    });

    it('should validate format ID is not just whitespace for updateAssetFormat', async () => {
      const updateData: UpdateFormatRequest = {
        name: 'Test Update'
      };

      await expect(client.formats.updateAssetFormat('asset-123', '   ', updateData))
        .rejects
        .toThrow('Format ID is required');
    });

    it('should replace a format for an asset', async () => {
      // Setup mock response for replacing a format
      const replaceData: ReplaceFormatRequest = {
        name: 'Completely Replaced Format',
        status: 'ACTIVE',
        archive_status: 'NOT_ARCHIVED',
        is_online: true,
        components: [
          {
            name: 'New Primary Video',
            type: 'VIDEO',
            metadata: {
              codec: 'av1',
              bitrate: '12000000',
              resolution: '7680x4320',
              hdr: true
            }
          },
          {
            name: 'New Primary Audio',
            type: 'AUDIO',
            metadata: {
              codec: 'opus',
              bitrate: '512000',
              channels: '7.1',
              sample_rate: '192000'
            }
          }
        ],
        storage_methods: ['CLOUD', 'S3'],
        version_id: 'v3.0.0',
        metadata: [
          {
            replacement_info: {
              replaced_at: '2023-01-01T20:00:00Z',
              replaced_by: 'unit-test'
            }
          }
        ]
      };

      const mockReplacedFormat: Format = {
        id: 'format-replace-123',
        asset_id: 'asset-replace',
        name: 'Completely Replaced Format',
        status: 'ACTIVE',
        archive_status: 'NOT_ARCHIVED',
        is_online: true,
        components: [
          {
            id: 'comp-replaced-1',
            name: 'New Primary Video',
            type: 'VIDEO',
            metadata: {
              codec: 'av1',
              bitrate: '12000000',
              resolution: '7680x4320',
              hdr: true
            }
          },
          {
            id: 'comp-replaced-2',
            name: 'New Primary Audio',
            type: 'AUDIO',
            metadata: {
              codec: 'opus',
              bitrate: '512000',
              channels: '7.1',
              sample_rate: '192000'
            }
          }
        ],
        storage_methods: ['CLOUD', 'S3'],
        version_id: 'v3.0.0',
        metadata: [
          {
            replacement_info: {
              replaced_at: '2023-01-01T20:00:00Z',
              replaced_by: 'unit-test'
            }
          }
        ],
        date_created: '2023-01-01T00:00:00Z',
        date_modified: '2023-01-01T20:00:00Z'
      };

      mockAxiosInstance.put.mockResolvedValueOnce({
        status: 200,
        statusText: 'OK',
        headers: {},
        data: mockReplacedFormat
      });

      // Call the method
      const result = await client.formats.replaceAssetFormat('asset-replace', 'format-replace-123', replaceData);

      // Assertions
      expect(mockAxiosInstance.put).toHaveBeenCalledWith(
        '/v1/assets/asset-replace/formats/format-replace-123/',
        replaceData,
        undefined
      );
      expect(result.data).toEqual(mockReplacedFormat);
      expect(result.status).toBe(200);
      expect(result.data.id).toBe('format-replace-123');
      expect(result.data.name).toBe('Completely Replaced Format');
      expect(result.data.version_id).toBe('v3.0.0');
      expect(result.data.components).toHaveLength(2);
    });

    it('should replace format with minimal data', async () => {
      // Setup mock response for minimal replacement
      const replaceData: ReplaceFormatRequest = {
        name: 'Minimal Replacement',
        status: 'ACTIVE'
      };

      const mockMinimalReplace: Format = {
        id: 'format-minimal-replace-456',
        asset_id: 'asset-minimal-replace',
        name: 'Minimal Replacement',
        status: 'ACTIVE',
        date_created: '2023-01-01T00:00:00Z',
        date_modified: '2023-01-01T14:30:00Z'
      };

      mockAxiosInstance.put.mockResolvedValueOnce({
        status: 200,
        statusText: 'OK',
        headers: {},
        data: mockMinimalReplace
      });

      // Call the method
      const result = await client.formats.replaceAssetFormat('asset-minimal-replace', 'format-minimal-replace-456', replaceData);

      // Assertions
      expect(result.data.name).toBe('Minimal Replacement');
      expect(result.data.status).toBe('ACTIVE');
      expect(result.data.id).toBe('format-minimal-replace-456');
    });

    it('should replace format with complete component overhaul', async () => {
      // Setup mock response for complete component replacement
      const replaceData: ReplaceFormatRequest = {
        name: 'Multi-Language Complete Format',
        status: 'ACTIVE',
        archive_status: 'NOT_ARCHIVED',
        is_online: true,
        components: [
          {
            name: '8K Video Stream',
            type: 'VIDEO',
            metadata: {
              codec: 'vvc',
              bitrate: '50000000',
              resolution: '7680x4320',
              frame_rate: '60',
              color_depth: '12bit'
            }
          },
          {
            name: 'English Audio',
            type: 'AUDIO',
            metadata: {
              codec: 'flac',
              channels: '7.1',
              language: 'en'
            }
          },
          {
            name: 'Spanish Audio',
            type: 'AUDIO',
            metadata: {
              codec: 'flac',
              channels: '7.1',
              language: 'es'
            }
          },
          {
            name: 'French Audio',
            type: 'AUDIO',
            metadata: {
              codec: 'flac',
              channels: '7.1',
              language: 'fr'
            }
          },
          {
            name: 'English Subtitles',
            type: 'SUBTITLE',
            metadata: {
              format: 'webvtt',
              language: 'en'
            }
          },
          {
            name: 'Spanish Subtitles',
            type: 'SUBTITLE',
            metadata: {
              format: 'webvtt',
              language: 'es'
            }
          }
        ],
        storage_methods: ['DISTRIBUTED', 'EDGE_CACHE'],
        version_id: 'v4.0.0'
      };

      const mockCompleteFormat: Format = {
        id: 'format-complete-789',
        asset_id: 'asset-complete',
        name: 'Multi-Language Complete Format',
        status: 'ACTIVE',
        archive_status: 'NOT_ARCHIVED',
        is_online: true,
        components: [
          {
            id: 'comp-8k-video',
            name: '8K Video Stream',
            type: 'VIDEO',
            metadata: {
              codec: 'vvc',
              bitrate: '50000000',
              resolution: '7680x4320',
              frame_rate: '60',
              color_depth: '12bit'
            }
          },
          {
            id: 'comp-audio-en',
            name: 'English Audio',
            type: 'AUDIO',
            metadata: {
              codec: 'flac',
              channels: '7.1',
              language: 'en'
            }
          },
          {
            id: 'comp-audio-es',
            name: 'Spanish Audio',
            type: 'AUDIO',
            metadata: {
              codec: 'flac',
              channels: '7.1',
              language: 'es'
            }
          },
          {
            id: 'comp-audio-fr',
            name: 'French Audio',
            type: 'AUDIO',
            metadata: {
              codec: 'flac',
              channels: '7.1',
              language: 'fr'
            }
          },
          {
            id: 'comp-sub-en',
            name: 'English Subtitles',
            type: 'SUBTITLE',
            metadata: {
              format: 'webvtt',
              language: 'en'
            }
          },
          {
            id: 'comp-sub-es',
            name: 'Spanish Subtitles',
            type: 'SUBTITLE',
            metadata: {
              format: 'webvtt',
              language: 'es'
            }
          }
        ],
        storage_methods: ['DISTRIBUTED', 'EDGE_CACHE'],
        version_id: 'v4.0.0',
        date_created: '2023-01-01T00:00:00Z',
        date_modified: '2023-01-01T22:15:00Z'
      };

      mockAxiosInstance.put.mockResolvedValueOnce({
        status: 200,
        statusText: 'OK',
        headers: {},
        data: mockCompleteFormat
      });

      // Call the method
      const result = await client.formats.replaceAssetFormat('asset-complete', 'format-complete-789', replaceData);

      // Assertions
      expect(result.data.components).toHaveLength(6);
      expect(result.data.components!.filter(c => c.type === 'VIDEO')).toHaveLength(1);
      expect(result.data.components!.filter(c => c.type === 'AUDIO')).toHaveLength(3);
      expect(result.data.components!.filter(c => c.type === 'SUBTITLE')).toHaveLength(2);
      expect(result.data.storage_methods).toEqual(['DISTRIBUTED', 'EDGE_CACHE']);
      expect(result.data.version_id).toBe('v4.0.0');
    });

    it('should replace format with archive status', async () => {
      // Setup mock response for replacing to archived status
      const replaceData: ReplaceFormatRequest = {
        name: 'Archived Replacement Format',
        status: 'ARCHIVED',
        archive_status: 'ARCHIVED',
        is_online: false,
        date_deleted: '2023-07-01T00:00:00Z',
        storage_methods: ['TAPE_ARCHIVE'],
        metadata: [
          {
            archive_info: {
              archive_policy: 'long_term_retention',
              retention_years: 25,
              archive_location: 'offsite_facility_a'
            }
          }
        ]
      };

      const mockArchivedReplace: Format = {
        id: 'format-archived-replace-101',
        asset_id: 'asset-archived-replace',
        name: 'Archived Replacement Format',
        status: 'ARCHIVED',
        archive_status: 'ARCHIVED',
        is_online: false,
        date_created: '2023-01-01T00:00:00Z',
        date_deleted: '2023-07-01T00:00:00Z',
        date_modified: '2023-07-01T00:00:00Z',
        storage_methods: ['TAPE_ARCHIVE'],
        metadata: [
          {
            archive_info: {
              archive_policy: 'long_term_retention',
              retention_years: 25,
              archive_location: 'offsite_facility_a'
            }
          }
        ]
      };

      mockAxiosInstance.put.mockResolvedValueOnce({
        status: 200,
        statusText: 'OK',
        headers: {},
        data: mockArchivedReplace
      });

      // Call the method
      const result = await client.formats.replaceAssetFormat('asset-archived-replace', 'format-archived-replace-101', replaceData);

      // Assertions
      expect(result.data.status).toBe('ARCHIVED');
      expect(result.data.archive_status).toBe('ARCHIVED');
      expect(result.data.is_online).toBe(false);
      expect(result.data.storage_methods).toEqual(['TAPE_ARCHIVE']);
    });

    it('should validate asset ID is required for replaceAssetFormat', async () => {
      const replaceData: ReplaceFormatRequest = {
        name: 'Test Replace'
      };

      await expect(client.formats.replaceAssetFormat('', 'format-123', replaceData))
        .rejects
        .toThrow('Asset ID is required');
    });

    it('should validate asset ID is not just whitespace for replaceAssetFormat', async () => {
      const replaceData: ReplaceFormatRequest = {
        name: 'Test Replace'
      };

      await expect(client.formats.replaceAssetFormat('   ', 'format-123', replaceData))
        .rejects
        .toThrow('Asset ID is required');
    });

    it('should validate format ID is required for replaceAssetFormat', async () => {
      const replaceData: ReplaceFormatRequest = {
        name: 'Test Replace'
      };

      await expect(client.formats.replaceAssetFormat('asset-123', '', replaceData))
        .rejects
        .toThrow('Format ID is required');
    });

    it('should validate format ID is not just whitespace for replaceAssetFormat', async () => {
      const replaceData: ReplaceFormatRequest = {
        name: 'Test Replace'
      };

      await expect(client.formats.replaceAssetFormat('asset-123', '   ', replaceData))
        .rejects
        .toThrow('Format ID is required');
    });
  });
});
