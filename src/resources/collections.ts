import { BaseResource } from './base';
import { Tsonik } from '../client';
import { ApiResponse, PaginatedResponse, Collection, SearchQuery } from '../types';

/**
 * Collection resource class for managing Iconik collections
 */
export class CollectionResource extends BaseResource {
  constructor(client: Tsonik) {
    super(client, '/API/collections/v1/collections');
  }

  /**
   * Get a single collection by ID
   */
  async getCollection(id: string): Promise<ApiResponse<Collection>> {
    return super.get<Collection>(id);
  }

  /**
   * List collections with optional filters
   */
  async listCollections(params?: {
    limit?: number;
    offset?: number;
    sort?: string;
    filter?: Record<string, any>;
    page_token?: string;
  }): Promise<ApiResponse<PaginatedResponse<Collection>>> {
    return super.list<Collection>(params);
  }

  /**
   * Create a new collection
   */
  async createCollection(collectionData: Partial<Collection>): Promise<ApiResponse<Collection>> {
    return super.create<Collection>(collectionData);
  }

  /**
   * Update a collection
   */
  async updateCollection(id: string, collectionData: Partial<Collection>): Promise<ApiResponse<Collection>> {
    return super.update<Collection>(id, collectionData);
  }

  /**
   * Search collections using query parameters
   */
  async search(query: SearchQuery): Promise<ApiResponse<PaginatedResponse<Collection>>> {
    return this.client.post<PaginatedResponse<Collection>>('/search/collections', query);
  }

  /**
   * Get collection assets
   */
  async getAssets(id: string, params?: {
    limit?: number;
    offset?: number;
    sort?: string;
  }): Promise<ApiResponse<PaginatedResponse<any>>> {
    let queryParams = '';
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      queryParams = searchParams.toString();
    }
    const url = queryParams ? `${this.basePath}/${id}/assets?${queryParams}` : `${this.basePath}/${id}/assets`;
    return this.client.get(url);
  }

  /**
   * Add assets to a collection
   */
  async addAssets(id: string, assetIds: string[]): Promise<ApiResponse<any>> {
    return this.client.post(`${this.basePath}/${id}/assets`, { asset_ids: assetIds });
  }

  /**
   * Remove assets from a collection
   */
  async removeAssets(id: string, assetIds: string[]): Promise<ApiResponse<any>> {
    return this.client.delete(`${this.basePath}/${id}/assets`, { data: { asset_ids: assetIds } });
  }

  /**
   * Get collection metadata
   */
  async getMetadata(id: string): Promise<ApiResponse<Record<string, any>>> {
    return this.client.get(`${this.basePath}/${id}/metadata`);
  }

  /**
   * Update collection metadata
   */
  async updateMetadata(id: string, metadata: Record<string, any>): Promise<ApiResponse<Record<string, any>>> {
    return this.client.put(`${this.basePath}/${id}/metadata`, metadata);
  }

  /**
   * Delete a collection
   */
  async deleteCollection(id: string): Promise<ApiResponse<void>> {
    return super.delete(id);
  }

  /**
   * Share a collection with users or groups
   */
  async shareCollection(id: string, shares: {
    user_ids?: string[];
    group_ids?: string[];
    permissions?: string[];
  }): Promise<ApiResponse<any>> {
    return this.client.post(`${this.basePath}/${id}/shares`, shares);
  }

  /**
   * Get collection shares
   */
  async getShares(id: string): Promise<ApiResponse<any[]>> {
    return this.client.get(`${this.basePath}/${id}/shares`);
  }

  /**
   * Remove shares from a collection
   */
  async removeShares(id: string, shares: {
    user_ids?: string[];
    group_ids?: string[];
  }): Promise<ApiResponse<any>> {
    return this.client.delete(`${this.basePath}/${id}/shares`, { data: shares });
  }

  /**
   * Get collection permissions
   */
  async getPermissions(id: string): Promise<ApiResponse<any>> {
    return this.client.get(`${this.basePath}/${id}/permissions`);
  }

  /**
   * Update collection permissions
   */
  async updatePermissions(id: string, permissions: any): Promise<ApiResponse<any>> {
    return this.client.put(`${this.basePath}/${id}/permissions`, permissions);
  }

  /**
   * Copy a collection (creates a new collection with the same assets)
   */
  async copyCollection(id: string, options?: {
    title?: string;
    description?: string;
  }): Promise<ApiResponse<Collection>> {
    return this.client.post(`${this.basePath}/${id}/copy`, options);
  }

  /**
   * Add a comment to a collection
   */
  async addComment(id: string, comment: { text: string }): Promise<ApiResponse<any>> {
    return this.client.post(`${this.basePath}/${id}/comments`, comment);
  }

  /**
   * List comments for a collection
   */
  async getComments(id: string): Promise<ApiResponse<any[]>> {
    return this.client.get(`${this.basePath}/${id}/comments`);
  }
}
