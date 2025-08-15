import { SearchResource } from '../resources/search';
import { Tsonik } from '../client';
import { SearchCriteria } from '../types';

// Mock the client
jest.mock('../client');

describe('SearchResource.search() Unit Tests', () => {
  let mockClient: jest.Mocked<Tsonik>;
  let searchResource: SearchResource;

  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    mockClient = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      patch: jest.fn(),
      delete: jest.fn()
    } as any;

    searchResource = new SearchResource(mockClient);
  });

  describe('Constructor', () => {
    it('should initialize with correct base path', () => {
      expect(searchResource).toBeInstanceOf(SearchResource);
      // Base path is protected, but we can verify through method calls
    });
  });

  describe('search method', () => {
    it('should make POST request to correct endpoint with search criteria', async () => {
      const searchCriteria: SearchCriteria = {
        doc_types: ['assets'],
        query: 'test',
        sort: [{ name: 'date_created', order: 'desc' }]
      };

      const mockResponse = {
        status: 200,
        data: {
          objects: [],
          facets: {},
          total: 0
        },
        headers: {}
      };

      mockClient.post.mockResolvedValue(mockResponse);

      const result = await searchResource.search(searchCriteria);

      expect(mockClient.post).toHaveBeenCalledWith(
        '/API/search/v1/search/',
        searchCriteria,
        { params: {} }
      );
      expect(result).toBe(mockResponse);
    });

    it('should pass query parameters correctly', async () => {
      const searchCriteria: SearchCriteria = {
        doc_types: ['assets']
      };

      const params = {
        per_page: 10,
        page: 1,
        generate_signed_url: true,
        save_search_history: false
      };

      mockClient.post.mockResolvedValue({ status: 200, data: {}, headers: {} });

      await searchResource.search(searchCriteria, params);

      expect(mockClient.post).toHaveBeenCalledWith(
        '/API/search/v1/search/',
        searchCriteria,
        { params: params }
      );
    });

    it('should handle your real API request body structure', async () => {
      const realApiCriteria: SearchCriteria = {
        doc_types: ['assets', 'collections'],
        sort: [{ name: 'custom_order', order: 'asc' }],
        query: '',
        filter: {
          operator: 'AND',
          terms: [
            {
              name: 'ancestor_collections',
              value_in: ['81bc8d96-7482-11f0-8d3f-d692e7d457b6']
            },
            { 
              name: 'status', 
              value_in: ['ACTIVE'] 
            },
            {
              name: 'files.storage_id',
              value_in: ['25067552-72fd-11f0-b51c-eef8eb365029']
            }
          ]
        },
        facets_filters: [
          { 
            name: 'archive_status', 
            value_in: ['NOT_ARCHIVED'] 
          }
        ]
      };

      mockClient.post.mockResolvedValue({ status: 200, data: {}, headers: {} });

      await searchResource.search(realApiCriteria);

      expect(mockClient.post).toHaveBeenCalledWith(
        '/API/search/v1/search/',
        realApiCriteria,
        {
          params: {}
        }
      );
    });
  });

  describe('error handling', () => {
    it('should propagate errors from HTTP client', async () => {
      const searchCriteria: SearchCriteria = {
        doc_types: ['assets']
      };

      const error = new Error('Network error');
      mockClient.post.mockRejectedValue(error);

      await expect(searchResource.search(searchCriteria)).rejects.toThrow('Network error');
    });
  });
});
