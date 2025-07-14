import { IconikClient } from '../index';
import { MetadataResponse, GetMetadataParams, UpdateMetadataRequest, PutMetadataParams } from '../types/metadata';

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

describe('MetadataResource', () => {
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
      data: {},
      status: 200,
      headers: {},
      config: {},
      statusText: 'OK'
    };
    
    mockAxiosInstance.get.mockResolvedValue(defaultResponse);
    mockAxiosInstance.post.mockResolvedValue(defaultResponse);
    mockAxiosInstance.put.mockResolvedValue(defaultResponse);
    mockAxiosInstance.patch.mockResolvedValue(defaultResponse);
    mockAxiosInstance.delete.mockResolvedValue(defaultResponse);

    client = new IconikClient({
      appId: 'test-app-id',
      authToken: 'test-auth-token'
    });
  });

  describe('getMetadata', () => {
    it('should get metadata for an object', async () => {
      const mockMetadata: MetadataResponse = {
        date_created: '2025-07-14T13:55:00.269Z',
        date_modified: '2025-07-14T13:55:00.269Z',
        job_id: 'job-123',
        metadata_values: {
          title: {
            date_created: '2025-07-14T13:55:00.269Z',
            field_values: [{ value: 'Test Asset' }]
          },
          description: {
            date_created: '2025-07-14T13:55:00.269Z',
            field_values: [{ value: 'Test Description' }]
          }
        },
        object_id: 'asset-123',
        object_type: 'assets',
        version_id: 'version-123'
      };

      mockAxiosInstance.get.mockResolvedValue({
        data: mockMetadata,
        status: 200,
        headers: {},
        config: {},
        statusText: 'OK'
      });

      const result = await client.metadata.getMetadata('assets', 'asset-123');

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/API/metadata/v1/assets/asset-123', { params: {} });
      expect(result.data).toEqual(mockMetadata);
      expect(result.status).toBe(200);
    });

    it('should get metadata with query parameters', async () => {
      const mockMetadata: MetadataResponse = {
        date_created: '2025-07-14T13:55:00.269Z',
        date_modified: '2025-07-14T13:55:00.269Z',
        job_id: 'job-123',
        metadata_values: {
          title: {
            date_created: '2025-07-14T13:55:00.269Z',
            field_values: [{ value: 'Test Asset' }]
          }
        },
        object_id: 'asset-123',
        object_type: 'assets',
        version_id: 'version-123'
      };

      mockAxiosInstance.get.mockResolvedValue({
        data: mockMetadata,
        status: 200,
        headers: {},
        config: {},
        statusText: 'OK'
      });

      const params: GetMetadataParams = {
        check_if_subclip: true,
        include_values_for_deleted_fields: false
      };

      const result = await client.metadata.getMetadata('assets', 'asset-123', params);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/API/metadata/v1/assets/asset-123', { 
        params: { 
          check_if_subclip: true,
          include_values_for_deleted_fields: false
        } 
      });
      expect(result.data).toEqual(mockMetadata);
      expect(result.status).toBe(200);
    });

    it('should filter out undefined parameters', async () => {
      const mockMetadata: MetadataResponse = {
        date_created: '2025-07-14T13:55:00.269Z',
        date_modified: '2025-07-14T13:55:00.269Z',
        job_id: 'job-123',
        metadata_values: {},
        object_id: 'asset-123',
        object_type: 'assets',
        version_id: 'version-123'
      };

      mockAxiosInstance.get.mockResolvedValue({
        data: mockMetadata,
        status: 200,
        headers: {},
        config: {},
        statusText: 'OK'
      });

      const params: GetMetadataParams = {
        check_if_subclip: undefined,
        include_values_for_deleted_fields: true
      };

      const result = await client.metadata.getMetadata('assets', 'asset-123', params);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/API/metadata/v1/assets/asset-123', { 
        params: { 
          include_values_for_deleted_fields: true
        } 
      });
      expect(result.data).toEqual(mockMetadata);
    });

    it('should handle different object types', async () => {
      const mockMetadata: MetadataResponse = {
        date_created: '2025-07-14T13:55:00.269Z',
        date_modified: '2025-07-14T13:55:00.269Z',
        job_id: 'job-123',
        metadata_values: {},
        object_id: 'collection-123',
        object_type: 'collections',
        version_id: 'version-123'
      };

      mockAxiosInstance.get.mockResolvedValue({
        data: mockMetadata,
        status: 200,
        headers: {},
        config: {},
        statusText: 'OK'
      });

      const result = await client.metadata.getMetadata('collections', 'collection-123');

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/API/metadata/v1/collections/collection-123', { params: {} });
      expect(result.data.object_type).toBe('collections');
      expect(result.data.object_id).toBe('collection-123');
    });

    it('should handle empty metadata values', async () => {
      const mockMetadata: MetadataResponse = {
        date_created: '2025-07-14T13:55:00.269Z',
        date_modified: '2025-07-14T13:55:00.269Z',
        job_id: 'job-123',
        metadata_values: {},
        object_id: 'asset-123',
        object_type: 'assets',
        version_id: 'version-123'
      };

      mockAxiosInstance.get.mockResolvedValue({
        data: mockMetadata,
        status: 200,
        headers: {},
        config: {},
        statusText: 'OK'
      });

      const result = await client.metadata.getMetadata('assets', 'asset-123');

      expect(result.data.metadata_values).toEqual({});
    });
  });

  describe('putMetadata', () => {
    it('should update metadata for an object', async () => {
      const mockUpdatedMetadata: MetadataResponse = {
        date_created: '2025-07-14T14:07:34.309Z',
        date_modified: '2025-07-14T14:07:34.309Z',
        job_id: 'job-456',
        metadata_values: {
          title: {
            date_created: '2025-07-14T14:07:34.309Z',
            field_values: [{ value: 'Updated Asset Title' }]
          },
          description: {
            date_created: '2025-07-14T14:07:34.309Z',
            field_values: [{ value: 'Updated Description' }]
          }
        },
        object_id: 'asset-123',
        object_type: 'assets',
        version_id: 'version-456'
      };

      const updateRequest: UpdateMetadataRequest = {
        metadata_values: {
          title: {
            field_values: [{ value: 'Updated Asset Title' }],
            mode: 'overwrite'
          },
          description: {
            field_values: [{ value: 'Updated Description' }],
            mode: 'overwrite'
          }
        },
        object_id: 'asset-123',
        object_type: 'assets'
      };

      mockAxiosInstance.put.mockResolvedValue({
        data: mockUpdatedMetadata,
        status: 200,
        headers: {},
        config: {},
        statusText: 'OK'
      });

      const result = await client.metadata.putMetadata('assets', 'asset-123', updateRequest);

      expect(mockAxiosInstance.put).toHaveBeenCalledWith('/API/metadata/v1/assets/asset-123', updateRequest, { params: {} });
      expect(result.data).toEqual(mockUpdatedMetadata);
      expect(result.status).toBe(200);
    });

    it('should update metadata with query parameters', async () => {
      const mockUpdatedMetadata: MetadataResponse = {
        date_created: '2025-07-14T14:07:34.309Z',
        date_modified: '2025-07-14T14:07:34.309Z',
        job_id: 'job-456',
        metadata_values: {
          title: {
            date_created: '2025-07-14T14:07:34.309Z',
            field_values: [{ value: 'Updated Asset Title' }]
          }
        },
        object_id: 'asset-123',
        object_type: 'assets',
        version_id: 'version-456'
      };

      const updateRequest: UpdateMetadataRequest = {
        metadata_values: {
          title: {
            field_values: [{ value: 'Updated Asset Title' }],
            mode: 'overwrite'
          }
        }
      };

      mockAxiosInstance.put.mockResolvedValue({
        data: mockUpdatedMetadata,
        status: 200,
        headers: {},
        config: {},
        statusText: 'OK'
      });

      const params: PutMetadataParams = {
        check_if_subclip: true,
        ignore_unchanged: false
      };

      const result = await client.metadata.putMetadata('assets', 'asset-123', updateRequest, params);

      expect(mockAxiosInstance.put).toHaveBeenCalledWith('/API/metadata/v1/assets/asset-123', updateRequest, { 
        params: { 
          check_if_subclip: true,
          ignore_unchanged: false
        } 
      });
      expect(result.data).toEqual(mockUpdatedMetadata);
      expect(result.status).toBe(200);
    });

    it('should filter out undefined parameters', async () => {
      const mockUpdatedMetadata: MetadataResponse = {
        date_created: '2025-07-14T14:07:34.309Z',
        date_modified: '2025-07-14T14:07:34.309Z',
        job_id: 'job-456',
        metadata_values: {},
        object_id: 'asset-123',
        object_type: 'assets',
        version_id: 'version-456'
      };

      const updateRequest: UpdateMetadataRequest = {
        metadata_values: {}
      };

      mockAxiosInstance.put.mockResolvedValue({
        data: mockUpdatedMetadata,
        status: 200,
        headers: {},
        config: {},
        statusText: 'OK'
      });

      const params: PutMetadataParams = {
        check_if_subclip: undefined,
        ignore_unchanged: true
      };

      const result = await client.metadata.putMetadata('assets', 'asset-123', updateRequest, params);

      expect(mockAxiosInstance.put).toHaveBeenCalledWith('/API/metadata/v1/assets/asset-123', updateRequest, { 
        params: { 
          ignore_unchanged: true
        } 
      });
      expect(result.data).toEqual(mockUpdatedMetadata);
    });

    it('should handle different object types', async () => {
      const mockUpdatedMetadata: MetadataResponse = {
        date_created: '2025-07-14T14:07:34.309Z',
        date_modified: '2025-07-14T14:07:34.309Z',
        job_id: 'job-456',
        metadata_values: {},
        object_id: 'collection-123',
        object_type: 'collections',
        version_id: 'version-456'
      };

      const updateRequest: UpdateMetadataRequest = {
        metadata_values: {
          name: {
            field_values: [{ value: 'Updated Collection Name' }],
            mode: 'overwrite'
          }
        }
      };

      mockAxiosInstance.put.mockResolvedValue({
        data: mockUpdatedMetadata,
        status: 200,
        headers: {},
        config: {},
        statusText: 'OK'
      });

      const result = await client.metadata.putMetadata('collections', 'collection-123', updateRequest);

      expect(mockAxiosInstance.put).toHaveBeenCalledWith('/API/metadata/v1/collections/collection-123', updateRequest, { params: {} });
      expect(result.data.object_type).toBe('collections');
      expect(result.data.object_id).toBe('collection-123');
    });

    it('should handle append mode', async () => {
      const mockUpdatedMetadata: MetadataResponse = {
        date_created: '2025-07-14T14:07:34.309Z',
        date_modified: '2025-07-14T14:07:34.309Z',
        job_id: 'job-456',
        metadata_values: {
          tags: {
            date_created: '2025-07-14T14:07:34.309Z',
            field_values: [{ value: 'tag1' }, { value: 'tag2' }]
          }
        },
        object_id: 'asset-123',
        object_type: 'assets',
        version_id: 'version-456'
      };

      const updateRequest: UpdateMetadataRequest = {
        metadata_values: {
          tags: {
            field_values: [{ value: 'tag2' }],
            mode: 'append'
          }
        }
      };

      mockAxiosInstance.put.mockResolvedValue({
        data: mockUpdatedMetadata,
        status: 200,
        headers: {},
        config: {},
        statusText: 'OK'
      });

      const result = await client.metadata.putMetadata('assets', 'asset-123', updateRequest);

      expect(mockAxiosInstance.put).toHaveBeenCalledWith('/API/metadata/v1/assets/asset-123', updateRequest, { params: {} });
      expect(result.data).toEqual(mockUpdatedMetadata);
    });
  });
});