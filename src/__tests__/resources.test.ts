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
        .toThrow('File set ID is required');
    });

    it('should validate file set ID is not just whitespace for getAssetFileset', async () => {
      await expect(client.filesets.getAssetFileset('asset-123', '   '))
        .rejects
        .toThrow('File set ID is required');
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
        .toThrow('File set ID is required');
    });

    it('should validate file set ID is not just whitespace for deleteAssetFileset', async () => {
      await expect(client.filesets.deleteAssetFileset('asset-123', '   '))
        .rejects
        .toThrow('File set ID is required');
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
        .toThrow('File set ID is required');
    });

    it('should validate file set ID cannot be whitespace for getFileSetFiles', async () => {
      await expect(client.filesets.getFileSetFiles('asset-123', '   '))
        .rejects
        .toThrow('File set ID is required');
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
        '/v1/assets/asset-456/files/',
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
        '/v1/assets/asset-456/files/',
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
        '/v1/assets/asset-no-files/files/',
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
  });
});
