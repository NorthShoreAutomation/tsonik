import { BaseResource } from './base';
import { Tsonik } from '../client';
import { ApiResponse, PaginatedResponse, Asset, SearchQuery, ListParams } from '../types';
import { CreateAssetRequest, UpdateAssetRequest, BulkDeleteRequest } from '../types/assets';

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
  async listAssets(params?: ListParams): Promise<ApiResponse<PaginatedResponse<Asset>>> {
    return super.list<Asset>(params);
  }

  /**
   * Create a new asset
   */
  async createAsset(assetData: CreateAssetRequest): Promise<ApiResponse<Asset>> {
    if (!assetData.title || assetData.title.trim() === '') {
      throw new Error('Asset title is required');
    }
    return super.create<Asset>(assetData);
  }

  /**
   * Update an asset
   */
  async updateAsset(id: string, assetData: UpdateAssetRequest): Promise<ApiResponse<Asset>> {
    return super.update<Asset>(id, assetData);
  }

  /**
   * Delete an asset
   */
  async deleteAsset(id: string): Promise<ApiResponse<void>> {
    return super.delete(id);
  }

  /**
   * Bulk delete assets (Note: This endpoint may not be available in all Iconik instances)
   * As an alternative, you can delete assets individually using deleteAsset()
   */
  async bulkDeleteAssets(assetIds: string[]): Promise<ApiResponse<void>> {
    if (!assetIds || assetIds.length === 0) {
      throw new Error('Asset IDs array cannot be empty');
    }
    if (assetIds.length > 500) {
      throw new Error('Cannot delete more than 500 assets at once');
    }
    
    // Try the bulk delete endpoint first
    try {
      const requestData: BulkDeleteRequest = { asset_ids: assetIds };
      return await this.client.post(`${this.basePath}/bulk_delete`, requestData);
    } catch (error: any) {
      // If bulk delete is not supported, fall back to individual deletes
      if (error.statusCode === 404 || error.status === 404) {
        console.warn('Bulk delete endpoint not available, falling back to individual deletes');
        const deletePromises = assetIds.map(id => this.deleteAsset(id));
        await Promise.all(deletePromises);
        return {
          data: undefined as any,
          status: 200,
          headers: {}
        };
      }
      throw error;
    }
  }


}
