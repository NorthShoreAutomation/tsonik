import { BaseResource } from './base';
import { Tsonik } from '../client';
import { ApiResponse, PaginatedResponse } from '../types';
import { Collection, CollectionListParams, CreateCollectionRequest, DeleteCollectionResponse, UpdateCollectionRequest, UpdateCollectionOptions, ReplaceCollectionRequest, ReplaceCollectionOptions } from '../types/collections';

/**
 * Collection resource for managing collections in Iconik
 */
export class CollectionResource extends BaseResource {
  constructor(client: Tsonik) {
    super(client, '/API/assets/v1/collections');
  }

  /**
   * Get a list of collections
   */
  async listCollections(params?: CollectionListParams): Promise<ApiResponse<PaginatedResponse<Collection>>> {
    return super.list<Collection>(params as Record<string, string | number | boolean | undefined>);
  }

  /**
   * Get a single collection by ID
   */
  async getCollection(id: string): Promise<ApiResponse<Collection>> {
    if (!id || id.trim() === '') {
      throw new Error('Collection ID is required');
    }
    return super.get<Collection>(id);
  }

  /**
   * Create a new collection
   */
  async createCollection(collectionData: CreateCollectionRequest): Promise<ApiResponse<Collection>> {
    if (!collectionData.title || collectionData.title.trim() === '') {
      throw new Error('Collection title is required');
    }
    return super.create<Collection>(collectionData);
  }

  /**
   * Update a collection by ID
   */
  async updateCollection(id: string, updateData: UpdateCollectionRequest, options?: UpdateCollectionOptions): Promise<ApiResponse<Collection>> {
    if (!id || id.trim() === '') {
      throw new Error('Collection ID is required');
    }
    
    // Build query parameters if options are provided
    const queryParams: Record<string, string> = {};
    if (options?.change_parent_mode) {
      queryParams.change_parent_mode = options.change_parent_mode;
    }
    
    // Use the existing patch method with query parameters
    const config = Object.keys(queryParams).length > 0 ? { params: queryParams } : undefined;
    return this.client.patch<Collection>(`${this.basePath}/${id}`, updateData, config);
  }

  /**
   * Replace a collection by ID (PUT operation)
   */
  async replaceCollection(id: string, replaceData: ReplaceCollectionRequest, options?: ReplaceCollectionOptions): Promise<ApiResponse<Collection>> {
    if (!id || id.trim() === '') {
      throw new Error('Collection ID is required');
    }
    
    // Build query parameters if options are provided
    const queryParams: Record<string, string> = {};
    if (options?.change_parent_mode) {
      queryParams.change_parent_mode = options.change_parent_mode;
    }
    
    // Use the existing put method with query parameters
    const config = Object.keys(queryParams).length > 0 ? { params: queryParams } : undefined;
    return this.client.put<Collection>(`${this.basePath}/${id}`, replaceData, config);
  }

  /**
   * Delete a collection by ID
   */
  async deleteCollection(id: string): Promise<ApiResponse<DeleteCollectionResponse>> {
    if (!id || id.trim() === '') {
      throw new Error('Collection ID is required');
    }
    return super.delete<DeleteCollectionResponse>(id);
  }
}