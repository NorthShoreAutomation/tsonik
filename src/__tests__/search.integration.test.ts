import { Tsonik } from '../client';
import { IconikConfig } from '../config';
import { SearchCriteria, SearchDocument, SearchDocuments, ApiResponse } from '../types';

/**
 * Integration tests for SearchResource.search() method
 * These tests run against a real Iconik API instance
 * 
 * Prerequisites:
 * - Copy .env.example to .env and fill in your credentials
 * - Set ICONIK_APP_ID and ICONIK_AUTH_TOKEN in .env file
 * - Set ICONIK_BASE_URL (optional, defaults to https://app.iconik.io)
 * - Ensure test environment has proper permissions
 */

describe('SearchResource.search() Integration Tests', () => {
  let client: Tsonik;

  beforeAll(() => {
    // Skip integration tests if no credentials are provided
    if (!process.env.ICONIK_APP_ID || !process.env.ICONIK_AUTH_TOKEN) {
      console.warn('Skipping integration tests: ICONIK_APP_ID or ICONIK_AUTH_TOKEN not set');
      console.warn('Copy .env.example to .env and fill in your Iconik credentials.');
      return;
    }

    const config: IconikConfig = {
      appId: process.env.ICONIK_APP_ID,
      authToken: process.env.ICONIK_AUTH_TOKEN,
      baseUrl: process.env.ICONIK_BASE_URL ?? 'https://app.iconik.io',
      timeout: 15000,
      debug: true
    };

    client = new Tsonik(config);
  });

  // Skip all tests if no App ID or Auth Token is provided
  beforeEach(() => {
    if (!process.env.ICONIK_APP_ID || !process.env.ICONIK_AUTH_TOKEN) {
      throw new Error('ICONIK_APP_ID and ICONIK_AUTH_TOKEN environment variables must be set. Skipping integration tests.');
    }
  });

  describe('Basic Search Operations', () => {
    it('should perform a basic search for assets and collections', async () => {
      const searchCriteria: SearchCriteria = {
        doc_types: ['assets', 'collections'],
        query: '',
        sort: [
          {
            name: 'date_created',
            order: 'desc'
          }
        ]
      };

      const response = await client.search.search(searchCriteria, {
        per_page: 5,
        save_search_history: false
      });

      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();
      expect(response.data.objects).toBeDefined();
      expect(Array.isArray(response.data.objects)).toBe(true);
      if (response.data.objects) {
        expect(response.data.objects.length).toBeLessThanOrEqual(5);
      }
    }, 15000);

    it('should perform a search using real API request body', async () => {
      // Based on your real API call
      const searchCriteria: SearchCriteria = {
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

      const response = await client.search.search(searchCriteria);

      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();
      expect(response.data.objects).toBeDefined();
      expect(Array.isArray(response.data.objects)).toBe(true);
      
      // If results exist, verify they contain basic fields
      if (response.data.objects && response.data.objects.length > 0) {
        const firstResult = response.data.objects[0];
        expect(firstResult.id).toBeDefined();
        expect(firstResult.title).toBeDefined();
        expect(firstResult.object_type).toBeDefined();
      }
    }, 20000);

    it('should search with text query', async () => {
      const searchCriteria: SearchCriteria = {
        doc_types: ['assets'],
        query: 'test',
        search_fields: ['title', 'description'],
        sort: [
          {
            name: 'date_created',
            order: 'desc'
          }
        ]
      };

      const response = await client.search.search(searchCriteria, {
        per_page: 5
      });

      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();
      expect(response.data.objects).toBeDefined();
      expect(Array.isArray(response.data.objects)).toBe(true);
    }, 15000);

    it('should search with filters for active assets', async () => {
      const searchCriteria: SearchCriteria = {
        doc_types: ['assets'],
        filter: {
          operator: 'AND',
          terms: [
            {
              name: 'status',
              value_in: ['ACTIVE']
            }
          ]
        },
        sort: [
          {
            name: 'date_created',
            order: 'desc'
          }
        ]
      };

      const response = await client.search.search(searchCriteria, {
        per_page: 5,
        save_search_history: false
      });

      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();
      expect(response.data.objects).toBeDefined();
    }, 15000);

    it('should search with date range filter', async () => {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

      const searchCriteria: SearchCriteria = {
        doc_types: ['assets'],
        filter: {
          operator: 'AND',
          terms: [
            {
              name: 'date_created',
              range: {
                min: oneMonthAgo.toISOString(),
                timezone: '+00:00'
              }
            }
          ]
        },
        sort: [
          {
            name: 'date_created',
            order: 'desc'
          }
        ]
      };

      const response = await client.search.search(searchCriteria, {
        per_page: 5,
        save_search_history: false
      });

      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();
    }, 15000);
  });

  describe('Search with URL Generation Options', () => {
    it('should search with signed URL generation', async () => {
      const searchCriteria: SearchCriteria = {
        doc_types: ['assets'],
        sort: [
          {
            name: 'date_created',
            order: 'desc'
          }
        ]
      };

      const response = await client.search.search(searchCriteria, {
        per_page: 3,
        generate_signed_url: true,
        generate_signed_download_url: true,
        generate_signed_proxy_url: true,
        save_search_history: true
      });

      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();
      expect(response.data.objects).toBeDefined();
    }, 15000);
  });

  describe('Error Handling', () => {
    it('should handle invalid search criteria', async () => {
      const invalidCriteria = {
        doc_types: ['invalid_doc_type'],
        query: 'test'
      };

      // Using type assertion to test error handling with invalid data
      await expect(
        client.search.search(invalidCriteria as SearchCriteria)
      ).rejects.toThrow();
    }, 10000);
  });

  describe('Performance Tests', () => {
    it('should handle concurrent search requests', async () => {
      const searchCriteria: SearchCriteria = {
        doc_types: ['assets'],
        sort: [{ name: 'date_created', order: 'desc' }]
      };

      const promises: Promise<ApiResponse<SearchDocuments>>[] = [];
      const concurrency = 3;

      for (let i = 0; i < concurrency; i++) {
        promises.push(
          client.search.search(searchCriteria, {
            per_page: 2,
            save_search_history: false
          })
        );
      }

      const results = await Promise.all(promises);

      results.forEach(result => {
        expect(result.status).toBe(200);
        expect(result.data).toBeDefined();
      });
    }, 20000);

    it('should handle complex search with large result set', async () => {
      const startTime = Date.now();

      const searchCriteria: SearchCriteria = {
        doc_types: ['assets', 'collections'],
        include_fields: [
          'id', 'title', 'date_created', 'date_modified', 'object_type',
          'metadata', 'files', 'formats', 'permissions'
        ],
        facets: [
          'object_type', 'type', 'media_type', 'archive_status'
        ],
        sort: [{ name: 'date_created', order: 'desc' }]
      };

      const response = await client.search.search(searchCriteria, {
        per_page: 50,
        save_search_history: false
      });

      const endTime = Date.now();
      const duration = endTime - startTime;

      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();
      expect(duration).toBeLessThan(15000); // Should complete within 15 seconds
    }, 20000);
  });

  describe('Pagination Tests', () => {
    it('should handle pagination with page and per_page', async () => {
      const searchCriteria: SearchCriteria = {
        doc_types: ['assets'],
        sort: [{ name: 'date_created', order: 'desc' }]
      };

      // Get first page
      const firstPageResponse = await client.search.search(searchCriteria, {
        page: 1,
        per_page: 5,
        save_search_history: false
      });

      expect(firstPageResponse.status).toBe(200);
      expect(firstPageResponse.data.objects).toBeDefined();
      if (firstPageResponse.data.objects) {
        expect(firstPageResponse.data.objects.length).toBeLessThanOrEqual(5);
      }

      // Get second page if there are enough results
      if (firstPageResponse.data.total && firstPageResponse.data.total > 5) {
        const secondPageResponse = await client.search.search(searchCriteria, {
          page: 2,
          per_page: 5,
          save_search_history: false
        });

        expect(secondPageResponse.status).toBe(200);
        expect(secondPageResponse.data.objects).toBeDefined();
      }
    }, 20000);

    it('should handle search_after pagination', async () => {
      const searchCriteria: SearchCriteria = {
        doc_types: ['assets'],
        sort: [{ name: 'date_created', order: 'desc' }]
      };

      // Get first batch
      const firstResponse = await client.search.search(searchCriteria, {
        per_page: 5,
        save_search_history: false
      });

      expect(firstResponse.status).toBe(200);
      expect(firstResponse.data.objects).toBeDefined();

      // If we have results and sort keys, test search_after
      if (firstResponse.data.objects && firstResponse.data.objects.length > 0) {
        const lastObject = firstResponse.data.objects[firstResponse.data.objects.length - 1];
        
        // Note: The actual _sort key structure depends on the API response
        // This test verifies the parameter can be passed, even if no _sort is available
        const sortValue = (lastObject as SearchDocument & { _sort?: (string | number | boolean | null)[] })._sort ?? [lastObject.id || ''];
        const searchAfterCriteria: SearchCriteria = {
          ...searchCriteria,
          search_after: sortValue
        };

        const secondResponse = await client.search.search(searchAfterCriteria, {
          per_page: 5,
          save_search_history: false
        });

        expect(secondResponse.status).toBe(200);
        expect(secondResponse.data.objects).toBeDefined();
      }
    }, 15000);
  });
});
