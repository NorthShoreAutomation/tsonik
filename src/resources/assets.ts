import { BaseResource } from './base';
import { Tsonik } from '../client';
import { ApiResponse, PaginatedResponse, Asset, SearchQuery } from '../types';

/**
 * Asset resource class for managing Iconik assets
 */
export class AssetResource extends BaseResource {
  constructor(client: Tsonik) {
    super(client, '/API/assets/v1/assets');
  }

  /**
   * Get a single asset by ID
   */
  async getAsset(id: string): Promise<ApiResponse<Asset>> {
    return super.get<Asset>(id);
  }

  /**
   * List assets with optional filters
   */
  async listAssets(params?: {
    limit?: number;
    offset?: number;
    sort?: string;
    filter?: Record<string, any>;
    page_token?: string;
  }): Promise<ApiResponse<PaginatedResponse<Asset>>> {
    return super.list<Asset>(params);
  }

  /**
   * Create a new asset
   */
  async createAsset(assetData: Partial<Asset>): Promise<ApiResponse<Asset>> {
    return super.create<Asset>(assetData);
  }

  /**
   * Update an asset
   */
  async updateAsset(id: string, assetData: Partial<Asset>): Promise<ApiResponse<Asset>> {
    return super.update<Asset>(id, assetData);
  }

  /**
   * Get asset files/formats
   */
  async getFiles(id: string): Promise<ApiResponse<any[]>> {
    return this.client.get(`/API/files/v1/assets/${id}/files/`);
  }

  /**
   * Get asset thumbnails
   */
  async getThumbnails(id: string): Promise<ApiResponse<any[]>> {
    return this.client.get(`/API/files/v1/assets/${id}/keyframes/`);
  }

  /**
   * Get asset proxies
   */
  async getProxies(id: string): Promise<ApiResponse<any[]>> {
    return this.client.get(`/API/files/v1/assets/${id}/proxies/`);
  }

  /**
   * Delete an asset
   */
  async deleteAsset(id: string): Promise<ApiResponse<void>> {
    return super.delete(id);
  }

  /**
   * Search assets
   */
  async search(params: SearchQuery): Promise<ApiResponse<PaginatedResponse<Asset>>> {
    return this.client.post(`/search/assets`, params);
  }

  /**
   * Get asset permissions
   */
  async getPermissions(id: string): Promise<ApiResponse<any>> {
    return this.client.get(`/API/assets/v1/assets/${id}/permissions`);
  }

  /**
   * Add comment to asset
   */
  async addComment(id: string, comment: any): Promise<ApiResponse<any>> {
    return this.client.post(`/API/assets/v1/assets/${id}/comments`, comment);
  }

}
