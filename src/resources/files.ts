import { BaseResource } from './base';
import { ApiResponse, PaginatedResponse } from '../types';
import { AssetFile, AssetFilesListParams } from '../types/files';

/**
 * File resource for managing files in Iconik
 */
export class FileResource extends BaseResource {
  constructor(client: import('../client').Tsonik) {
    super(client, '/v1');
  }
  /**
   * Get all files for an asset
   * 
   * @param assetId - The ID of the asset
   * @param options - Optional parameters for the request
   * @returns Promise with the response containing asset files
   */
  async getAssetFiles(assetId: string, options?: AssetFilesListParams): Promise<ApiResponse<PaginatedResponse<AssetFile>>> {
    if (!assetId || assetId.trim() === '') {
      throw new Error('Asset ID is required');
    }
    
    // Build query parameters if options are provided
    const queryParams: Record<string, any> = {};
    if (options?.per_page !== undefined) {
      queryParams.per_page = options.per_page;
    }
    if (options?.generate_signed_url !== undefined) {
      queryParams.generate_signed_url = options.generate_signed_url;
    }
    if (options?.content_disposition !== undefined) {
      queryParams.content_disposition = options.content_disposition;
    }
    if (options?.last_id !== undefined) {
      queryParams.last_id = options.last_id;
    }
    
    const config = Object.keys(queryParams).length > 0 ? { params: queryParams } : undefined;
    
    return this.client.get<PaginatedResponse<AssetFile>>(
      `${this.basePath}/assets/${assetId}/files/`,
      config
    );
  }
}
