import axios from 'axios';
import { IconikClient } from '../index';
import {
  Asset,
  BulkJobResult,
  Collection,
  Job,
  JobAction,
  JobCreate,
  JobsPriorityUpdate,
  JobsQuery,
  JobsStateUpdate,
  JobStepsUpdate,
  JobUpdate,
} from '../types';

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
      baseUrl: 'https://api.iconik.io/v1'
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
        status: 'active',
        type: 'asset',
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
        status: 'active',
        type: 'asset',
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

    it('should search assets', async () => {
      // Setup mock search response
      const searchResults = {
        objects: [
          { id: 'asset-3', title: 'Video Asset' },
          { id: 'asset-4', title: 'Another Video' }
        ],
        page_token: null,
        total_count: 2
      };

      mockAxiosInstance.post.mockResolvedValueOnce({
        status: 200,
        statusText: 'OK',
        headers: {},
        data: searchResults
      });

      // Call the search method
      const result = await client.assets.search({
        query: 'video',
        limit: 20
      });

      // Assertions
      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        '/search/assets',
        { query: 'video', limit: 20 },
        undefined
      );
      expect(result.data).toEqual(searchResults);
      expect(result.status).toBe(200);
      expect(result.data.objects).toHaveLength(2);
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

    it('should get asset permissions', async () => {
      const mockPermissions = {
        read: ['user-1', 'group-1'],
        write: ['user-1']
      };

      mockAxiosInstance.get.mockResolvedValueOnce({
        status: 200,
        statusText: 'OK',
        headers: {},
        data: mockPermissions
      });

      const result = await client.assets.getPermissions('asset-123');
      
      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        '/API/assets/v1/assets/asset-123/permissions',
        undefined
      );
      expect(result.status).toBe(200);
      expect(result.data).toEqual(mockPermissions);
    });

    it('should add a comment to an asset', async () => {
      const mockComment = { text: 'Test comment' };
      const mockResponse = {
        id: 'comment-1',
        text: 'Test comment',
        user_id: 'user-1',
        created_date: '2025-07-02T08:32:14-05:00'
      };

      mockAxiosInstance.post.mockResolvedValueOnce({
        status: 201,
        statusText: 'Created',
        headers: {},
        data: mockResponse
      });

      const result = await client.assets.addComment('asset-123', mockComment);
      
      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        '/API/assets/v1/assets/asset-123/comments',
        mockComment,
        undefined
      );
      expect(result.status).toBe(201);
      expect(result.data).toEqual(mockResponse);
    });
  });

  describe('CollectionResource', () => {
    it('should get a collection by ID', async () => {
      // Setup mock response
      const mockCollection: Collection = {
        id: 'collection-123',
        title: 'Test Collection',
        description: 'Test Collection Description',
        created_date: '2025-06-30T13:51:20-05:00',
        modified_date: '2025-06-30T13:51:20-05:00',
        type: 'collection',
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
        '/API/collections/v1/collections/collection-123',
        undefined
      );
      expect(result.data).toEqual(mockCollection);
      expect(result.status).toBe(200);
    });

    it('should list collections', async () => {
      // Setup mock paginated response
      const mockCollectionList = {
        objects: [
          { id: 'collection-1', title: 'Collection 1' },
          { id: 'collection-2', title: 'Collection 2' },
        ],
        page_token: null,
        total_count: 2
      };

      mockAxiosInstance.get.mockResolvedValueOnce({
        status: 200,
        statusText: 'OK',
        headers: {},
        data: mockCollectionList
      });

      // Call the method
      const result = await client.collections.listCollections({ limit: 5 });

      // Assertions
      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        '/API/collections/v1/collections/',
        { params: { limit: 5 } }
      );
      expect(result.data).toEqual(mockCollectionList);
      expect(result.status).toBe(200);
      expect(result.data.objects).toHaveLength(2);
    });

    it('should add assets to a collection', async () => {
      // Setup mock response
      mockAxiosInstance.post.mockResolvedValueOnce({
        status: 200,
        statusText: 'OK',
        headers: {},
        data: { success: true }
      });

      // Asset IDs to add
      const assetIds = ['asset-1', 'asset-2'];

      // Call the method
      const result = await client.collections.addAssets('collection-123', assetIds);

      // Assertions
      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        '/API/collections/v1/collections/collection-123/assets',
        { asset_ids: assetIds },
        undefined
      );
      expect(result.data).toEqual({ success: true });
      expect(result.status).toBe(200);
    });

    it('should get assets from a collection', async () => {
      // Setup mock response
      const collectionAssets = {
        objects: [
          { id: 'asset-1', title: 'Asset 1' },
          { id: 'asset-2', title: 'Asset 2' },
        ],
        page_token: null,
        total_count: 2
      };

      mockAxiosInstance.get.mockResolvedValueOnce({
        status: 200,
        statusText: 'OK',
        headers: {},
        data: collectionAssets
      });

      // Call the method
      const result = await client.collections.getAssets('collection-123', {
        limit: 10,
        sort: 'title'
      });

      // Assertions
      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        expect.stringContaining('/collections/collection-123/assets'),
        undefined
      );
      
      // Check params are included
      const url = mockAxiosInstance.get.mock.calls[0][0];
      // url is the first parameter to the get method
      expect(url).toBe('/API/collections/v1/collections/collection-123/assets?limit=10&sort=title');
      
      expect(result.data).toEqual(collectionAssets);
      expect(result.data.objects).toHaveLength(2);
    });

    it('should delete a collection', async () => {
      mockAxiosInstance.delete.mockResolvedValueOnce({
        status: 204,
        statusText: 'No Content',
        headers: {},
        data: undefined
      });

      const result = await client.collections.deleteCollection('collection-123');
      
      expect(mockAxiosInstance.delete).toHaveBeenCalledWith(
        '/API/collections/v1/collections/collection-123',
        undefined
      );
      expect(result.status).toBe(204);
    });

    it('should share a collection', async () => {
      const shareRequest = {
        user_ids: ['user-1', 'user-2'],
        permissions: ['read', 'write']
      };

      mockAxiosInstance.post.mockResolvedValueOnce({
        status: 200,
        statusText: 'OK',
        headers: {},
        data: { success: true }
      });

      const result = await client.collections.shareCollection('collection-123', shareRequest);
      
      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        '/API/collections/v1/collections/collection-123/shares',
        shareRequest,
        undefined
      );
      expect(result.status).toBe(200);
      expect(result.data).toEqual({ success: true });
    });

    it('should copy a collection', async () => {
      const copyOptions = {
        title: 'Copied Collection',
        description: 'A copy of the original collection'
      };

      const newCollection = {
        id: 'collection-copy-123',
        title: 'Copied Collection',
        description: 'A copy of the original collection',
        created_date: '2025-06-30T13:51:20-05:00',
        modified_date: '2025-06-30T13:51:20-05:00',
        type: 'collection'
      };

      mockAxiosInstance.post.mockResolvedValueOnce({
        status: 201,
        statusText: 'Created',
        headers: {},
        data: newCollection
      });

      const result = await client.collections.copyCollection('collection-123', copyOptions);
      
      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        '/API/collections/v1/collections/collection-123/copy',
        copyOptions,
        undefined
      );
      expect(result.status).toBe(201);
      expect(result.data).toEqual(newCollection);
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

    it('should get job children', async () => {
      // Setup mock response
      const mockChildren = {
        objects: [
          {
            id: 'child-job-1',
            title: 'Child Job 1',
            type: 'KEYFRAMES',
            status: 'FINISHED',
            parent_id: 'job-123'
          }
        ],
        total_count: 1
      };

      mockAxiosInstance.get.mockResolvedValue({
        status: 200,
        statusText: 'OK',
        headers: {},
        data: mockChildren
      });

      // Execute test
      const result = await client.jobs.getJobChildren('job-123');

      // Verify call and response
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/API/jobs/v1/jobs/job-123/children/', { params: {} });
      expect(result.data).toEqual(mockChildren);
      expect(result.status).toBe(200);
    });

    it('should pause a job', async () => {
      // Setup mock response
      const mockPausedJob: Job = {
        id: 'job-123',
        title: 'Test Job',
        type: 'TRANSCODE',
        status: 'PAUSED',
        date_created: '2023-01-01T00:00:00Z'
      };

      mockAxiosInstance.post.mockResolvedValue({
        status: 200,
        statusText: 'OK',
        headers: {},
        data: mockPausedJob
      });

      // Execute test
      const result = await client.jobs.pause('job-123');

      // Verify call and response
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/API/jobs/v1/jobs/job-123/actions/pause/', {}, undefined);
      expect(result.data).toEqual(mockPausedJob);
      expect(result.status).toBe(200);
    });

    it('should resume a job', async () => {
      // Setup mock response
      const mockResumedJob: Job = {
        id: 'job-123',
        title: 'Test Job',
        type: 'TRANSCODE',
        status: 'STARTED',
        date_created: '2023-01-01T00:00:00Z'
      };

      mockAxiosInstance.post.mockResolvedValue({
        status: 200,
        statusText: 'OK',
        headers: {},
        data: mockResumedJob
      });

      // Execute test
      const result = await client.jobs.resume('job-123');

      // Verify call and response
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/API/jobs/v1/jobs/job-123/actions/resume/', {}, undefined);
      expect(result.data).toEqual(mockResumedJob);
      expect(result.status).toBe(200);
    });

    it('should abort a job', async () => {
      // Setup mock response
      const mockAbortedJob: Job = {
        id: 'job-123',
        title: 'Test Job',
        type: 'TRANSCODE',
        status: 'ABORTED',
        date_created: '2023-01-01T00:00:00Z'
      };

      mockAxiosInstance.post.mockResolvedValue({
        status: 200,
        statusText: 'OK',
        headers: {},
        data: mockAbortedJob
      });

      // Execute test
      const result = await client.jobs.abort('job-123');

      // Verify call and response
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/API/jobs/v1/jobs/job-123/actions/abort/', {}, undefined);
      expect(result.data).toEqual(mockAbortedJob);
      expect(result.status).toBe(200);
    });

    it('should restart a job', async () => {
      // Setup mock response
      const mockRestartedJob: Job = {
        id: 'job-123',
        title: 'Test Job',
        type: 'TRANSCODE',
        status: 'READY',
        date_created: '2023-01-01T00:00:00Z'
      };

      mockAxiosInstance.post.mockResolvedValue({
        status: 200,
        statusText: 'OK',
        headers: {},
        data: mockRestartedJob
      });

      // Execute test
      const result = await client.jobs.restart('job-123');

      // Verify call and response
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/API/jobs/v1/jobs/job-123/actions/restart/', {}, undefined);
      expect(result.data).toEqual(mockRestartedJob);
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

    it('should bulk pause jobs', async () => {
      // Setup mock response
      const mockBulkResult = [
        { job_id: 'job-1' },
        { job_id: 'job-2' }
      ];

      mockAxiosInstance.post.mockResolvedValue({
        status: 200,
        statusText: 'OK',
        headers: {},
        data: mockBulkResult
      });

      // Execute test
      const result = await client.jobs.bulkPause(['job-1', 'job-2']);

      // Verify call and response
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/API/jobs/v1/jobs/bulk/actions/pause/', {
        job_ids: ['job-1', 'job-2']
      }, undefined);
      expect(result.data).toEqual(mockBulkResult);
      expect(result.status).toBe(200);
    });

    it('should bulk delete jobs', async () => {
      // Setup mock response
      const mockBulkResult = [
        { job_id: 'job-1' },
        { job_id: 'job-2' }
      ];

      mockAxiosInstance.delete.mockResolvedValue({
        status: 200,
        statusText: 'OK',
        headers: {},
        data: mockBulkResult
      });

      // Execute test
      const result = await client.jobs.bulkDelete(['job-1', 'job-2']);

      // Verify call and response
      expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/API/jobs/v1/jobs/bulk/', {
        data: { job_ids: ['job-1', 'job-2'] }
      });
      expect(result.data).toEqual(mockBulkResult);
      expect(result.status).toBe(200);
    });

    it('should get job statistics', async () => {
      // Setup mock response
      const mockStats = {
        facets: {
          status: {
            'FINISHED': 50,
            'STARTED': 10,
            'FAILED': 5
          },
          type: {
            'TRANSCODE': 30,
            'MEDIAINFO': 20,
            'KEYFRAMES': 15
          }
        }
      };

      mockAxiosInstance.get.mockResolvedValue({
        status: 200,
        statusText: 'OK',
        headers: {},
        data: mockStats
      });

      // Execute test
      const result = await client.jobs.getStats({ 
        facets: true, 
        type: 'TRANSCODE',
        status: 'FINISHED',
        aggregations: 'status,type',
        object_type: 'assets'
      });

      // Verify call and response
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/API/jobs/v1/jobs/', {
        params: { 
          facets: true, 
          type: 'TRANSCODE',
          status: 'FINISHED',
          object_type: 'assets',
          aggregations: 'status,type'
        }
      });
      expect(result.data).toEqual(mockStats);
      expect(result.status).toBe(200);
    });
  });
});
