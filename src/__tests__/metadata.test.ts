import { Tsonik } from '../index';
import { MetadataResponse, GetMetadataParams, UpdateMetadataRequest, PutMetadataParams, MetadataFieldDefinition, PatchMetadataFieldRequest, CreateMetadataFieldRequest, MetadataFieldType } from '../types/metadata';

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
  let client: Tsonik;

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

    client = new Tsonik({
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

  describe('getMetadataField', () => {
    it('should get metadata field definition by field name', async () => {
      const mockFieldDefinition: MetadataFieldDefinition = {
        auto_set: false,
        date_created: '2025-08-22T19:19:05.182000+00:00',
        date_modified: '2025-08-22T19:23:20.159000+00:00',
        description: null,
        external_id: null,
        field_type: 'tag_cloud',
        hide_if_not_set: false,
        is_block_field: false,
        is_warning_field: false,
        label: 'XenData Tape ID',
        mapped_field_name: null,
        max_value: null,
        min_value: null,
        multi: false,
        name: 'XenDataTapeID',
        options: [],
        read_only: false,
        representative: false,
        required: false,
        sortable: false,
        source_url: null,
        use_as_facet: true
      };

      mockAxiosInstance.get.mockResolvedValue({
        data: mockFieldDefinition,
        status: 200,
        headers: {},
        config: {},
        statusText: 'OK'
      });

      const result = await client.metadata.getMetadataField('XenDataTapeID');

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/API/metadata/v1/fields/XenDataTapeID/', undefined);
      expect(result.data).toEqual(mockFieldDefinition);
      expect(result.status).toBe(200);
    });

    it('should throw error when field name is empty or missing', async () => {
      // Test with empty string
      await expect(client.metadata.getMetadataField('')).rejects.toThrow('Field name is required');
      
      // Test with whitespace only
      await expect(client.metadata.getMetadataField('   ')).rejects.toThrow('Field name is required');
      
      // Ensure no HTTP call was made when validation fails
      expect(mockAxiosInstance.get).not.toHaveBeenCalled();
    });

    it('should propagate errors from HTTP client', async () => {
      const error = new Error('Field not found');
      mockAxiosInstance.get.mockRejectedValue(error);

      await expect(client.metadata.getMetadataField('NonExistentField')).rejects.toThrow('Field not found');
      
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/API/metadata/v1/fields/NonExistentField/', undefined);
    });
  });

  describe('createMetadataField', () => {
    it('should create a new metadata field successfully', async () => {
      const fieldData = {
        name: 'TestField',
        label: 'Test Field Label',
        field_type: 'text' as const,
        read_only: false,
        use_as_facet: true,
        description: 'A test metadata field'
      };

      const mockCreatedField: MetadataFieldDefinition = {
        auto_set: false,
        date_created: '2025-08-25T16:02:53.000Z',
        date_modified: '2025-08-25T16:02:53.000Z',
        description: 'A test metadata field',
        external_id: null,
        field_type: 'text',
        hide_if_not_set: false,
        is_block_field: false,
        is_warning_field: false,
        label: 'Test Field Label',
        mapped_field_name: null,
        max_value: null,
        min_value: null,
        multi: false,
        name: 'TestField',
        options: [],
        read_only: false,
        representative: false,
        required: false,
        sortable: true,
        source_url: null,
        use_as_facet: true
      };

      mockAxiosInstance.post.mockResolvedValue({
        data: mockCreatedField,
        status: 201,
        headers: {},
        config: {},
        statusText: 'Created'
      });

      const result = await client.metadata.createMetadataField(fieldData);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/API/metadata/v1/fields/', fieldData, undefined);
      expect(result.data).toEqual(mockCreatedField);
      expect(result.status).toBe(201);
    });

    it('should validate required fields and throw appropriate errors', async () => {
      // Test with missing field data
      await expect(client.metadata.createMetadataField(null as unknown as CreateMetadataFieldRequest)).rejects.toThrow('Field data is required');
      
      // Test with empty name
      await expect(client.metadata.createMetadataField({
        name: '',
        label: 'Test Label',
        field_type: 'text',
        read_only: false,
        use_as_facet: true
      })).rejects.toThrow('Field name is required');
      
      // Test with whitespace-only name
      await expect(client.metadata.createMetadataField({
        name: '   ',
        label: 'Test Label',
        field_type: 'text',
        read_only: false,
        use_as_facet: true
      })).rejects.toThrow('Field name is required');
      
      // Test with empty label
      await expect(client.metadata.createMetadataField({
        name: 'TestField',
        label: '',
        field_type: 'text',
        read_only: false,
        use_as_facet: true
      })).rejects.toThrow('Field label is required');
      
      // Test with whitespace-only label
      await expect(client.metadata.createMetadataField({
        name: 'TestField',
        label: '   ',
        field_type: 'text',
        read_only: false,
        use_as_facet: true
      })).rejects.toThrow('Field label is required');
      
      // Test with missing field_type
      await expect(client.metadata.createMetadataField({
        name: 'TestField',
        label: 'Test Label',
        field_type: undefined as unknown as MetadataFieldType,
        read_only: false,
        use_as_facet: true
      })).rejects.toThrow('Field type is required');
      
      // Ensure no HTTP call was made when validation fails
      expect(mockAxiosInstance.post).not.toHaveBeenCalled();
    });

    it('should propagate errors from HTTP client', async () => {
      const fieldData = {
        name: 'TestField',
        label: 'Test Field Label',
        field_type: 'text' as const,
        read_only: false,
        use_as_facet: true
      };

      const error = new Error('Field name already exists');
      mockAxiosInstance.post.mockRejectedValue(error);

      await expect(client.metadata.createMetadataField(fieldData)).rejects.toThrow('Field name already exists');
      
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/API/metadata/v1/fields/', fieldData, undefined);
    });
  });

  describe('patchMetadataField', () => {
    it('should patch a metadata field successfully', async () => {
      const patchData: PatchMetadataFieldRequest = {
        label: 'Updated Field Label',
        description: 'Updated field description',
        read_only: true,
        use_as_facet: false
      };

      const mockPatchedField: MetadataFieldDefinition = {
        auto_set: false,
        date_created: '2025-08-22T19:19:05.182000+00:00',
        date_modified: '2025-08-25T16:16:33.000Z',
        description: 'Updated field description',
        external_id: null,
        field_type: 'tag_cloud',
        hide_if_not_set: false,
        is_block_field: false,
        is_warning_field: false,
        label: 'Updated Field Label',
        mapped_field_name: null,
        max_value: null,
        min_value: null,
        multi: false,
        name: 'XenDataTapeID',
        options: [],
        read_only: true,
        representative: false,
        required: false,
        sortable: false,
        source_url: null,
        use_as_facet: false
      };

      mockAxiosInstance.patch.mockResolvedValue({
        data: mockPatchedField,
        status: 200,
        headers: {},
        config: {},
        statusText: 'OK'
      });

      const result = await client.metadata.patchMetadataField('XenDataTapeID', patchData);

      expect(mockAxiosInstance.patch).toHaveBeenCalledWith('/API/metadata/v1/fields/XenDataTapeID/', patchData, undefined);
      expect(result.data).toEqual(mockPatchedField);
      expect(result.status).toBe(200);
    });

    it('should validate required parameters and throw appropriate errors', async () => {
      const patchData: PatchMetadataFieldRequest = {
        label: 'Updated Label'
      };

      // Test with empty field name
      await expect(client.metadata.patchMetadataField('', patchData)).rejects.toThrow('Field name is required');
      
      // Test with whitespace-only field name
      await expect(client.metadata.patchMetadataField('   ', patchData)).rejects.toThrow('Field name is required');
      
      // Test with missing patch data
      await expect(client.metadata.patchMetadataField('TestField', null as unknown as PatchMetadataFieldRequest)).rejects.toThrow('Patch data is required');
      
      // Ensure no HTTP call was made when validation fails
      expect(mockAxiosInstance.patch).not.toHaveBeenCalled();
    });

    it('should propagate errors from HTTP client', async () => {
      const patchData: PatchMetadataFieldRequest = {
        label: 'Updated Label',
        read_only: false
      };

      const error = new Error('Field not found');
      mockAxiosInstance.patch.mockRejectedValue(error);

      await expect(client.metadata.patchMetadataField('NonExistentField', patchData)).rejects.toThrow('Field not found');
      
      expect(mockAxiosInstance.patch).toHaveBeenCalledWith('/API/metadata/v1/fields/NonExistentField/', patchData, undefined);
    });
  });
});
