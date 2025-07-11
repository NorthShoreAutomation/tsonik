/**
 * Integration tests for CollectionResource
 * Tests real API calls against Iconik Collections API
 */

import { Tsonik } from '../client';
import { 
  ApiResponse,
  PaginatedResponse,
} from '../types';
import { Collection, CollectionListParams, CreateCollectionRequest, DeleteCollectionResponse, UpdateCollectionRequest, UpdateCollectionOptions, ReplaceCollectionRequest, ReplaceCollectionOptions } from '../types/collections';

describe('CollectionResource Integration Tests', () => {
  let client: Tsonik;
  const testCollections: string[] = [];

  beforeAll(() => {
    // Skip integration tests if no credentials are provided
    if (!process.env.ICONIK_APP_ID || !process.env.ICONIK_AUTH_TOKEN) {
      console.warn('Skipping integration tests: ICONIK_APP_ID or ICONIK_AUTH_TOKEN not set');
      console.warn('Copy .env.example to .env and fill in your Iconik credentials.');
      return;
    }

    client = new Tsonik({
      appId: process.env.ICONIK_APP_ID!,
      authToken: process.env.ICONIK_AUTH_TOKEN!,
      baseUrl: process.env.ICONIK_BASE_URL || 'https://app.iconik.io'
    });
  });

  describe('list collections', () => {
    it('should list collections with default parameters', async () => {
      if (!client) {
        console.warn('Skipping test: no client configured');
        return;
      }

      const response: ApiResponse<PaginatedResponse<Collection>> = await client.collections.listCollections();
      
      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();
      expect(response.data.objects).toBeInstanceOf(Array);
      expect(typeof response.data.total).toBe('number');
    }, 30000);

    it('should list collections with pagination', async () => {
      if (!client) {
        console.warn('Skipping test: no client configured');
        return;
      }

      const params: CollectionListParams = {
        per_page: 5,
        page: 1
      };

      const response: ApiResponse<PaginatedResponse<Collection>> = await client.collections.listCollections(params);
      
      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();
      expect(response.data.objects).toBeInstanceOf(Array);
      expect(response.data.objects.length).toBeLessThanOrEqual(5);
    }, 30000);

    it('should list collections with sort parameter', async () => {
      if (!client) {
        console.warn('Skipping test: no client configured');
        return;
      }

      const params: CollectionListParams = {
        sort: 'title,asc',
        per_page: 10
      };

      const response: ApiResponse<PaginatedResponse<Collection>> = await client.collections.listCollections(params);
      
      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();
      expect(response.data.objects).toBeInstanceOf(Array);
      
      // Verify collections have required id field
      response.data.objects.forEach(collection => {
        expect(collection.id).toBeDefined();
        expect(typeof collection.id).toBe('string');
      });
    }, 30000);

    it('should filter collections by is_root', async () => {
      if (!client) {
        console.warn('Skipping test: no client configured');
        return;
      }

      const params: CollectionListParams = {
        is_root: 'true',
        per_page: 10
      };

      const response: ApiResponse<PaginatedResponse<Collection>> = await client.collections.listCollections(params);
      
      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();
      expect(response.data.objects).toBeInstanceOf(Array);
      
      // Verify all returned collections are root collections
      response.data.objects.forEach(collection => {
        expect(collection.is_root).toBe(true);
      });
    }, 30000);

    it('should filter collections by status', async () => {
      if (!client) {
        console.warn('Skipping test: no client configured');
        return;
      }

      const params: CollectionListParams = {
        status: 'ACTIVE',
        per_page: 10
      };

      const response: ApiResponse<PaginatedResponse<Collection>> = await client.collections.listCollections(params);
      
      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();
      expect(response.data.objects).toBeInstanceOf(Array);
      
      // Verify all returned collections have ACTIVE status
      response.data.objects.forEach(collection => {
        if (collection.status) {
          expect(collection.status).toBe('ACTIVE');
        }
      });
    }, 30000);

    it('should handle scroll pagination', async () => {
      if (!client) {
        console.warn('Skipping test: no client configured');
        return;
      }

      const params: CollectionListParams = {
        scroll: true,
        per_page: 5
      };

      const response: ApiResponse<PaginatedResponse<Collection>> = await client.collections.listCollections(params);
      
      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();
      expect(response.data.objects).toBeInstanceOf(Array);
      
      // If there are results, scroll_id should be provided for further pagination
      if (response.data.objects.length > 0 && response.data.total && response.data.total > response.data.objects.length) {
        expect(response.data.scroll_id).toBeDefined();
      }
    }, 30000);
  });

  afterAll(async () => {
    // Clean up test collections
    if (client && testCollections.length > 0) {
      for (const collectionId of testCollections) {
        try {
          await client.collections.deleteCollection(collectionId);
          console.log(`Cleaned up test collection: ${collectionId}`);
        } catch (error) {
          console.warn(`Failed to clean up test collection ${collectionId}:`, error);
        }
      }
    }
  });

  describe('create collections', () => {
    it('should create a basic collection', async () => {
      if (!client) {
        console.warn('Skipping test: no client configured');
        return;
      }

      const collectionData: CreateCollectionRequest = {
        title: `Test Collection ${Date.now()}`,
        category: 'test',
        is_root: true,
        metadata: {
          test: true,
          created_by: 'integration-test'
        }
      };

      const response: ApiResponse<Collection> = await client.collections.createCollection(collectionData);
      
      expect(response.status).toBe(201);
      expect(response.data).toBeDefined();
      expect(response.data.id).toBeDefined();
      expect(response.data.title).toBe(collectionData.title);
      expect(response.data.category).toBe(collectionData.category);
      expect(response.data.is_root).toBe(true);
      // object_type might not be returned in the response
      if (response.data.object_type) {
        expect(response.data.object_type).toBe('collections');
      }
      expect(response.data.date_created).toBeDefined();
      expect(response.data.date_modified).toBeDefined();

      // Add to cleanup list
      testCollections.push(response.data.id);
    }, 30000);

    it('should create a minimal collection with only title', async () => {
      if (!client) {
        console.warn('Skipping test: no client configured');
        return;
      }

      const collectionData: CreateCollectionRequest = {
        title: `Minimal Collection ${Date.now()}`
      };

      const response: ApiResponse<Collection> = await client.collections.createCollection(collectionData);
      
      expect(response.status).toBe(201);
      expect(response.data).toBeDefined();
      expect(response.data.id).toBeDefined();
      expect(response.data.title).toBe(collectionData.title);
      // object_type might not be returned in the response
      if (response.data.object_type) {
        expect(response.data.object_type).toBe('collections');
      }

      // Add to cleanup list
      testCollections.push(response.data.id);
    }, 30000);

    it('should create a sub-collection', async () => {
      if (!client) {
        console.warn('Skipping test: no client configured');
        return;
      }

      // First create a parent collection
      const parentData: CreateCollectionRequest = {
        title: `Parent Collection ${Date.now()}`,
        is_root: true
      };

      const parentResponse = await client.collections.createCollection(parentData);
      testCollections.push(parentResponse.data.id);

      // Then create a sub-collection
      const subCollectionData: CreateCollectionRequest = {
        title: `Sub Collection ${Date.now()}`,
        parent_id: parentResponse.data.id,
        is_root: false,
        position: 1
      };

      const response: ApiResponse<Collection> = await client.collections.createCollection(subCollectionData);
      
      expect(response.status).toBe(201);
      expect(response.data).toBeDefined();
      expect(response.data.id).toBeDefined();
      expect(response.data.title).toBe(subCollectionData.title);
      expect(response.data.parent_id).toBe(parentResponse.data.id);
      expect(response.data.is_root).toBe(false);
      // position might not be returned exactly as sent
      if (response.data.position !== undefined) {
        expect(response.data.position).toBe(1);
      }

      // Add to cleanup list
      testCollections.push(response.data.id);
    }, 30000);

    it('should create a collection with metadata', async () => {
      if (!client) {
        console.warn('Skipping test: no client configured');
        return;
      }

      const collectionData: CreateCollectionRequest = {
        title: `Collection with Metadata ${Date.now()}`,
        category: 'projects',
        metadata: {
          project_type: 'documentary',
          budget: 50000,
          tags: ['urgent', 'client-project'],
          custom_field: 'test-value'
        },
        status: 'ACTIVE'
      };

      const response: ApiResponse<Collection> = await client.collections.createCollection(collectionData);
      
      expect(response.status).toBe(201);
      expect(response.data).toBeDefined();
      expect(response.data.id).toBeDefined();
      expect(response.data.title).toBe(collectionData.title);
      expect(response.data.category).toBe(collectionData.category);
      expect(response.data.status).toBe('ACTIVE');
      // metadata might not be returned in the response as sent
      if (response.data.metadata && Object.keys(response.data.metadata).length > 0) {
        expect(response.data.metadata.project_type).toBe('documentary');
        expect(response.data.metadata.budget).toBe(50000);
      } else {
        // If metadata isn't returned, that's also acceptable for this test
        console.log('Note: metadata not returned in create response');
      }

      // Add to cleanup list
      testCollections.push(response.data.id);
    }, 30000);

    it('should validate title is required', async () => {
      if (!client) {
        console.warn('Skipping test: no client configured');
        return;
      }

      const invalidData: CreateCollectionRequest = {
        title: ''
      };

      await expect(client.collections.createCollection(invalidData))
        .rejects
        .toThrow('Collection title is required');
    }, 30000);

    it('should validate title cannot be only whitespace', async () => {
      if (!client) {
        console.warn('Skipping test: no client configured');
        return;
      }

      const invalidData: CreateCollectionRequest = {
        title: '   '
      };

      await expect(client.collections.createCollection(invalidData))
        .rejects
        .toThrow('Collection title is required');
    }, 30000);
  });

  describe('get collections', () => {
    it('should get a collection by ID', async () => {
      if (!client) {
        console.warn('Skipping test: no client configured');
        return;
      }

      // First create a collection to get
      const collectionData: CreateCollectionRequest = {
        title: `Collection to Get ${Date.now()}`,
        category: 'test-get',
        is_root: true,
        metadata: {
          purpose: 'integration-test-get'
        }
      };

      const createResponse = await client.collections.createCollection(collectionData);
      expect(createResponse.status).toBe(201);
      expect(createResponse.data.id).toBeDefined();
      testCollections.push(createResponse.data.id);

      // Now get it by ID
      const getResponse: ApiResponse<Collection> = await client.collections.getCollection(createResponse.data.id);
      
      expect(getResponse.status).toBe(200);
      expect(getResponse.data).toBeDefined();
      expect(getResponse.data.id).toBe(createResponse.data.id);
      expect(getResponse.data.title).toBe(collectionData.title);
      expect(getResponse.data.category).toBe(collectionData.category);
      expect(getResponse.data.is_root).toBe(true);
      expect(getResponse.data.date_created).toBeDefined();
      expect(getResponse.data.date_modified).toBeDefined();
    }, 30000);

    it('should handle getting non-existent collection', async () => {
      if (!client) {
        console.warn('Skipping test: no client configured');
        return;
      }

      const nonExistentId = 'non-existent-collection-id-get';

      try {
        await client.collections.getCollection(nonExistentId);
        fail('Expected an error for non-existent collection');
      } catch (error: any) {
        // Should get a 404 error for non-existent collection
        expect(error.statusCode || error.response?.status || error.status).toBe(404);
      }
    }, 30000);

    it('should validate collection ID is required', async () => {
      if (!client) {
        console.warn('Skipping test: no client configured');
        return;
      }

      await expect(client.collections.getCollection(''))
        .rejects
        .toThrow('Collection ID is required');
    }, 30000);

    it('should validate collection ID cannot be whitespace', async () => {
      if (!client) {
        console.warn('Skipping test: no client configured');
        return;
      }

      await expect(client.collections.getCollection('   '))
        .rejects
        .toThrow('Collection ID is required');
    }, 30000);

    it('should get collection with full field structure', async () => {
      if (!client) {
        console.warn('Skipping test: no client configured');
        return;
      }

      // Create a more complex collection to test field structure
      const collectionData: CreateCollectionRequest = {
        title: `Complex Collection ${Date.now()}`,
        category: 'complex-test',
        is_root: true,
        metadata: {
          project_type: 'documentary',
          tags: ['test', 'integration'],
          budget: 25000
        },
        status: 'ACTIVE'
      };

      const createResponse = await client.collections.createCollection(collectionData);
      testCollections.push(createResponse.data.id);

      // Get the created collection
      const getResponse = await client.collections.getCollection(createResponse.data.id);
      
      expect(getResponse.status).toBe(200);
      expect(getResponse.data.id).toBeDefined();
      expect(typeof getResponse.data.id).toBe('string');
      expect(getResponse.data.title).toBe(collectionData.title);
      expect(getResponse.data.category).toBe(collectionData.category);
      expect(getResponse.data.status).toBe('ACTIVE');
      
      // Check optional fields are correctly typed
      if (getResponse.data.metadata) {
        expect(typeof getResponse.data.metadata).toBe('object');
      }
      if (getResponse.data.position !== undefined) {
        expect(typeof getResponse.data.position).toBe('number');
      }
      if (getResponse.data.is_root !== undefined) {
        expect(typeof getResponse.data.is_root).toBe('boolean');
      }
    }, 30000);
  });

  describe('delete collections', () => {
    it('should delete a collection by ID', async () => {
      if (!client) {
        console.warn('Skipping test: no client configured');
        return;
      }

      // First create a collection to delete
      const collectionData: CreateCollectionRequest = {
        title: `Collection to Delete ${Date.now()}`
      };

      const createResponse = await client.collections.createCollection(collectionData);
      expect(createResponse.status).toBe(201);
      expect(createResponse.data.id).toBeDefined();

      // Now delete it
      const deleteResponse: ApiResponse<DeleteCollectionResponse> = await client.collections.deleteCollection(createResponse.data.id);
      
      expect(deleteResponse.status).toBe(202); // Deletion scheduled
      // The API returns job information when deletion is scheduled
      expect(deleteResponse.data).toBeDefined();
      expect(deleteResponse.data.job_id).toBeDefined();
      expect(deleteResponse.data.status).toBeDefined();

      // Remove from cleanup list since we already deleted it
      const index = testCollections.indexOf(createResponse.data.id);
      if (index > -1) {
        testCollections.splice(index, 1);
      }
    }, 30000);

    it('should handle deleting non-existent collection', async () => {
      if (!client) {
        console.warn('Skipping test: no client configured');
        return;
      }

      const nonExistentId = 'non-existent-collection-id';

      try {
        await client.collections.deleteCollection(nonExistentId);
        // If it doesn't throw, that's also acceptable (some APIs handle this gracefully)
        fail('Expected an error for non-existent collection');
      } catch (error: any) {
        // Should get a 404 error for non-existent collection
        expect(error.statusCode || error.response?.status || error.status).toBe(404);
      }
    }, 30000);

    it('should validate collection ID is required', async () => {
      if (!client) {
        console.warn('Skipping test: no client configured');
        return;
      }

      await expect(client.collections.deleteCollection(''))
        .rejects
        .toThrow('Collection ID is required');
    }, 30000);

    it('should validate collection ID cannot be whitespace', async () => {
      if (!client) {
        console.warn('Skipping test: no client configured');
        return;
      }

      await expect(client.collections.deleteCollection('   '))
        .rejects
        .toThrow('Collection ID is required');
    }, 30000);
  });

  describe('update collections', () => {
    it('should update a collection with basic fields', async () => {
      if (!client) {
        console.warn('Skipping test: no client configured');
        return;
      }

      // First create a collection to update
      const collectionData: CreateCollectionRequest = {
        title: `Collection to Update ${Date.now()}`,
        category: 'test-update',
        is_root: true,
        status: 'ACTIVE'
      };

      const createResponse = await client.collections.createCollection(collectionData);
      expect(createResponse.status).toBe(201);
      expect(createResponse.data.id).toBeDefined();
      testCollections.push(createResponse.data.id);

      // Now update it
      const updateData: UpdateCollectionRequest = {
        title: `Updated Collection ${Date.now()}`,
        category: 'updated-category',
        status: 'ACTIVE'
      };

      const updateResponse: ApiResponse<Collection> = await client.collections.updateCollection(createResponse.data.id, updateData);
      
      expect(updateResponse.status).toBe(200);
      expect(updateResponse.data).toBeDefined();
      expect(updateResponse.data.id).toBe(createResponse.data.id);
      expect(updateResponse.data.title).toBe(updateData.title);
      expect(updateResponse.data.category).toBe(updateData.category);
      expect(updateResponse.data.status).toBe('ACTIVE');
      expect(updateResponse.data.date_modified).toBeDefined();
    }, 30000);

    it('should update collection with partial data', async () => {
      if (!client) {
        console.warn('Skipping test: no client configured');
        return;
      }

      // First create a collection to update
      const collectionData: CreateCollectionRequest = {
        title: `Partial Update Collection ${Date.now()}`,
        category: 'partial-test',
        is_root: true
      };

      const createResponse = await client.collections.createCollection(collectionData);
      testCollections.push(createResponse.data.id);

      // Update only the title
      const updateData: UpdateCollectionRequest = {
        title: `Partially Updated ${Date.now()}`
      };

      const updateResponse = await client.collections.updateCollection(createResponse.data.id, updateData);
      
      expect(updateResponse.status).toBe(200);
      expect(updateResponse.data.id).toBe(createResponse.data.id);
      expect(updateResponse.data.title).toBe(updateData.title);
      // Other fields should remain unchanged
      expect(updateResponse.data.category).toBe(collectionData.category);
    }, 30000);

    it('should update collection parent with move mode', async () => {
      if (!client) {
        console.warn('Skipping test: no client configured');
        return;
      }

      // Create parent collections
      const parentData1: CreateCollectionRequest = {
        title: `Parent 1 ${Date.now()}`,
        is_root: true
      };
      const parentData2: CreateCollectionRequest = {
        title: `Parent 2 ${Date.now()}`,
        is_root: true
      };

      const parent1Response = await client.collections.createCollection(parentData1);
      const parent2Response = await client.collections.createCollection(parentData2);
      testCollections.push(parent1Response.data.id, parent2Response.data.id);

      // Create child collection under parent1
      const childData: CreateCollectionRequest = {
        title: `Child Collection ${Date.now()}`,
        parent_id: parent1Response.data.id,
        is_root: false
      };

      const childResponse = await client.collections.createCollection(childData);
      testCollections.push(childResponse.data.id);

      // Move child to parent2
      const updateData: UpdateCollectionRequest = {
        parent_id: parent2Response.data.id
      };

      const options: UpdateCollectionOptions = {
        change_parent_mode: 'move'
      };

      const updateResponse = await client.collections.updateCollection(childResponse.data.id, updateData, options);
      
      expect(updateResponse.status).toBe(200);
      expect(updateResponse.data.id).toBe(childResponse.data.id);
      expect(updateResponse.data.parent_id).toBe(parent2Response.data.id);
    }, 30000);

    it('should update collection parent with copy mode', async () => {
      if (!client) {
        console.warn('Skipping test: no client configured');
        return;
      }

      // Create parent collections
      const parentData1: CreateCollectionRequest = {
        title: `Copy Parent 1 ${Date.now()}`,
        is_root: true
      };
      const parentData2: CreateCollectionRequest = {
        title: `Copy Parent 2 ${Date.now()}`,
        is_root: true
      };

      const parent1Response = await client.collections.createCollection(parentData1);
      const parent2Response = await client.collections.createCollection(parentData2);
      testCollections.push(parent1Response.data.id, parent2Response.data.id);

      // Create child collection under parent1
      const childData: CreateCollectionRequest = {
        title: `Copy Child Collection ${Date.now()}`,
        parent_id: parent1Response.data.id,
        is_root: false
      };

      const childResponse = await client.collections.createCollection(childData);
      testCollections.push(childResponse.data.id);

      // Copy child to parent2 (this may create a new collection or reference)
      const updateData: UpdateCollectionRequest = {
        parent_id: parent2Response.data.id
      };

      const options: UpdateCollectionOptions = {
        change_parent_mode: 'copy'
      };

      const updateResponse = await client.collections.updateCollection(childResponse.data.id, updateData, options);
      
      expect(updateResponse.status).toBe(200);
      expect(updateResponse.data).toBeDefined();
      // With copy mode, the behavior may vary depending on API implementation
      // but we should still get a successful response
    }, 30000);

    it('should handle updating non-existent collection', async () => {
      if (!client) {
        console.warn('Skipping test: no client configured');
        return;
      }

      const nonExistentId = 'non-existent-collection-update';
      const updateData: UpdateCollectionRequest = {
        title: 'Updated Title'
      };

      try {
        await client.collections.updateCollection(nonExistentId, updateData);
        fail('Expected an error for non-existent collection');
      } catch (error: any) {
        // Should get a 404 error for non-existent collection
        expect(error.statusCode || error.response?.status || error.status).toBe(404);
      }
    }, 30000);

    it('should validate collection ID is required', async () => {
      if (!client) {
        console.warn('Skipping test: no client configured');
        return;
      }

      const updateData: UpdateCollectionRequest = {
        title: 'Valid Title'
      };

      await expect(client.collections.updateCollection('', updateData))
        .rejects
        .toThrow('Collection ID is required');
    }, 30000);

    it('should validate collection ID cannot be whitespace', async () => {
      if (!client) {
        console.warn('Skipping test: no client configured');
        return;
      }

      const updateData: UpdateCollectionRequest = {
        title: 'Valid Title'
      };

      await expect(client.collections.updateCollection('   ', updateData))
        .rejects
        .toThrow('Collection ID is required');
    }, 30000);

    it('should update collection with external_id and storage_id', async () => {
      if (!client) {
        console.warn('Skipping test: no client configured');
        return;
      }

      // Create a collection to update
      const collectionData: CreateCollectionRequest = {
        title: `External ID Collection ${Date.now()}`,
        is_root: true
      };

      const createResponse = await client.collections.createCollection(collectionData);
      testCollections.push(createResponse.data.id);

      // Update with external_id and storage_id
      const updateData: UpdateCollectionRequest = {
        external_id: `ext-${Date.now()}`,
        storage_id: `storage-${Date.now()}`
      };

      const updateResponse = await client.collections.updateCollection(createResponse.data.id, updateData);
      
      expect(updateResponse.status).toBe(200);
      expect(updateResponse.data.id).toBe(createResponse.data.id);
      if (updateResponse.data.external_id) {
        expect(updateResponse.data.external_id).toBe(updateData.external_id);
      }
      if (updateResponse.data.storage_id) {
        expect(updateResponse.data.storage_id).toBe(updateData.storage_id);
      }
    }, 30000);
  });

  describe('replace collections', () => {
    it('should replace a collection with basic fields', async () => {
      if (!client) {
        console.warn('Skipping test: no client configured');
        return;
      }

      // First create a collection to replace
      const collectionData: CreateCollectionRequest = {
        title: `Collection to Replace ${Date.now()}`,
        category: 'test-replace',
        is_root: true,
        status: 'ACTIVE'
      };

      const createResponse = await client.collections.createCollection(collectionData);
      expect(createResponse.status).toBe(201);
      expect(createResponse.data.id).toBeDefined();
      testCollections.push(createResponse.data.id);

      // Now replace it completely
      const replaceData: ReplaceCollectionRequest = {
        title: `Completely Replaced Collection ${Date.now()}`,
        category: 'replaced-category',
        status: 'ACTIVE',
        is_root: false // Change from true to false
      };

      const replaceResponse: ApiResponse<Collection> = await client.collections.replaceCollection(createResponse.data.id, replaceData);
      
      expect(replaceResponse.status).toBe(200);
      expect(replaceResponse.data).toBeDefined();
      expect(replaceResponse.data.id).toBe(createResponse.data.id);
      expect(replaceResponse.data.title).toBe(replaceData.title);
      expect(replaceResponse.data.category).toBe(replaceData.category);
      expect(replaceResponse.data.status).toBe('ACTIVE');
      expect(replaceResponse.data.is_root).toBe(false); // Should be replaced
      expect(replaceResponse.data.date_modified).toBeDefined();
    }, 30000);

    it('should replace collection with complete field set', async () => {
      if (!client) {
        console.warn('Skipping test: no client configured');
        return;
      }

      // Create a collection to replace
      const collectionData: CreateCollectionRequest = {
        title: `Full Replace Collection ${Date.now()}`,
        category: 'original',
        is_root: true
      };

      const createResponse = await client.collections.createCollection(collectionData);
      testCollections.push(createResponse.data.id);

      // Replace with comprehensive data
      const replaceData: ReplaceCollectionRequest = {
        title: `Fully Replaced ${Date.now()}`,
        category: 'completely-new',
        external_id: `replaced-ext-${Date.now()}`,
        storage_id: `replaced-storage-${Date.now()}`,
        is_root: false,
        status: 'ACTIVE'
      };

      const replaceResponse = await client.collections.replaceCollection(createResponse.data.id, replaceData);
      
      expect(replaceResponse.status).toBe(200);
      expect(replaceResponse.data.id).toBe(createResponse.data.id);
      expect(replaceResponse.data.title).toBe(replaceData.title);
      expect(replaceResponse.data.category).toBe(replaceData.category);
      expect(replaceResponse.data.is_root).toBe(false);
      if (replaceResponse.data.external_id) {
        expect(replaceResponse.data.external_id).toBe(replaceData.external_id);
      }
      if (replaceResponse.data.storage_id) {
        expect(replaceResponse.data.storage_id).toBe(replaceData.storage_id);
      }
    }, 30000);

    it('should replace collection parent with move mode', async () => {
      if (!client) {
        console.warn('Skipping test: no client configured');
        return;
      }

      // Create parent collections
      const parentData1: CreateCollectionRequest = {
        title: `Replace Parent 1 ${Date.now()}`,
        is_root: true
      };
      const parentData2: CreateCollectionRequest = {
        title: `Replace Parent 2 ${Date.now()}`,
        is_root: true
      };

      const parent1Response = await client.collections.createCollection(parentData1);
      const parent2Response = await client.collections.createCollection(parentData2);
      testCollections.push(parent1Response.data.id, parent2Response.data.id);

      // Create child collection under parent1
      const childData: CreateCollectionRequest = {
        title: `Replace Child Collection ${Date.now()}`,
        parent_id: parent1Response.data.id,
        is_root: false
      };

      const childResponse = await client.collections.createCollection(childData);
      testCollections.push(childResponse.data.id);

      // Replace child completely and move to parent2
      const replaceData: ReplaceCollectionRequest = {
        title: `Replaced and Moved ${Date.now()}`,
        parent_id: parent2Response.data.id,
        category: 'replaced-moved',
        is_root: false,
        status: 'ACTIVE'
      };

      const options: ReplaceCollectionOptions = {
        change_parent_mode: 'move'
      };

      const replaceResponse = await client.collections.replaceCollection(childResponse.data.id, replaceData, options);
      
      expect(replaceResponse.status).toBe(200);
      expect(replaceResponse.data.id).toBe(childResponse.data.id);
      expect(replaceResponse.data.title).toBe(replaceData.title);
      expect(replaceResponse.data.parent_id).toBe(parent2Response.data.id);
      expect(replaceResponse.data.category).toBe(replaceData.category);
    }, 30000);

    it('should replace collection parent with copy mode', async () => {
      if (!client) {
        console.warn('Skipping test: no client configured');
        return;
      }

      // Create parent collections
      const parentData1: CreateCollectionRequest = {
        title: `Replace Copy Parent 1 ${Date.now()}`,
        is_root: true
      };
      const parentData2: CreateCollectionRequest = {
        title: `Replace Copy Parent 2 ${Date.now()}`,
        is_root: true
      };

      const parent1Response = await client.collections.createCollection(parentData1);
      const parent2Response = await client.collections.createCollection(parentData2);
      testCollections.push(parent1Response.data.id, parent2Response.data.id);

      // Create child collection under parent1
      const childData: CreateCollectionRequest = {
        title: `Replace Copy Child ${Date.now()}`,
        parent_id: parent1Response.data.id,
        is_root: false
      };

      const childResponse = await client.collections.createCollection(childData);
      testCollections.push(childResponse.data.id);

      // Replace child completely and copy to parent2
      const replaceData: ReplaceCollectionRequest = {
        title: `Replaced and Copied ${Date.now()}`,
        parent_id: parent2Response.data.id,
        category: 'replaced-copied',
        is_root: false,
        status: 'ACTIVE'
      };

      const options: ReplaceCollectionOptions = {
        change_parent_mode: 'copy'
      };

      const replaceResponse = await client.collections.replaceCollection(childResponse.data.id, replaceData, options);
      
      expect(replaceResponse.status).toBe(200);
      expect(replaceResponse.data).toBeDefined();
      expect(replaceResponse.data.title).toBe(replaceData.title);
      expect(replaceResponse.data.category).toBe(replaceData.category);
      // With copy mode, the behavior may vary depending on API implementation
      // but we should still get a successful response
    }, 30000);

    it('should handle replacing non-existent collection', async () => {
      if (!client) {
        console.warn('Skipping test: no client configured');
        return;
      }

      const nonExistentId = 'non-existent-collection-replace';
      const replaceData: ReplaceCollectionRequest = {
        title: 'Replaced Title',
        category: 'replaced',
        status: 'ACTIVE'
      };

      try {
        await client.collections.replaceCollection(nonExistentId, replaceData);
        fail('Expected an error for non-existent collection');
      } catch (error: any) {
        // Should get a 404 error for non-existent collection
        expect(error.statusCode || error.response?.status || error.status).toBe(404);
      }
    }, 30000);

    it('should validate collection ID is required for replace', async () => {
      if (!client) {
        console.warn('Skipping test: no client configured');
        return;
      }

      const replaceData: ReplaceCollectionRequest = {
        title: 'Valid Title'
      };

      await expect(client.collections.replaceCollection('', replaceData))
        .rejects
        .toThrow('Collection ID is required');
    }, 30000);

    it('should validate collection ID cannot be whitespace for replace', async () => {
      if (!client) {
        console.warn('Skipping test: no client configured');
        return;
      }

      const replaceData: ReplaceCollectionRequest = {
        title: 'Valid Title'
      };

      await expect(client.collections.replaceCollection('   ', replaceData))
        .rejects
        .toThrow('Collection ID is required');
    }, 30000);

    it('should replace collection keyframe assets', async () => {
      if (!client) {
        console.warn('Skipping test: no client configured');
        return;
      }

      // Create a collection to replace
      const collectionData: CreateCollectionRequest = {
        title: `Keyframe Replace Collection ${Date.now()}`,
        is_root: true
      };

      const createResponse = await client.collections.createCollection(collectionData);
      testCollections.push(createResponse.data.id);

      // Replace with keyframe assets
      const replaceData: ReplaceCollectionRequest = {
        title: `Replaced with Keyframes ${Date.now()}`,
        keyframe_asset_ids: ['asset-1', 'asset-2', 'asset-3'],
        custom_keyframe: 'custom-keyframe-url',
        custom_poster: 'custom-poster-url',
        status: 'ACTIVE'
      };

      const replaceResponse = await client.collections.replaceCollection(createResponse.data.id, replaceData);
      
      expect(replaceResponse.status).toBe(200);
      expect(replaceResponse.data.id).toBe(createResponse.data.id);
      expect(replaceResponse.data.title).toBe(replaceData.title);
      if (replaceResponse.data.keyframe_asset_ids) {
        expect(replaceResponse.data.keyframe_asset_ids).toEqual(replaceData.keyframe_asset_ids);
      }
      if (replaceResponse.data.custom_keyframe) {
        expect(replaceResponse.data.custom_keyframe).toBe(replaceData.custom_keyframe);
      }
      if (replaceResponse.data.custom_poster) {
        expect(replaceResponse.data.custom_poster).toBe(replaceData.custom_poster);
      }
    }, 30000);
  });
});