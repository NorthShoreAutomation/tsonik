import { BaseResource } from './base';
import { Tsonik } from '../client';
import { ApiResponse, PaginatedResponse, Asset, ListParams } from '../types';
import { CreateAssetRequest, UpdateAssetRequest } from '../types/assets';

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



}
