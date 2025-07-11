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
});
