import { BaseResource } from './base';
import { ApiResponse, PaginatedResponse } from '../types';
import { AssetFile, AssetFilesListParams, AssetFileParams, CreateFileRequest } from '../types/files';

/**
 * File resource for managing files in Iconik
 */
export class FileResource extends BaseResource {
  constructor(client: import('../client').Tsonik) {
    super(client, '/API/files/v1');
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

  /**
   * Get a specific file for an asset by file ID
   * 
   * @param assetId - The ID of the asset
   * @param fileId - The ID of the file to retrieve
   * @param options - Optional parameters for the request
   * @returns Promise with the response containing the file
   */
  async getAssetFile(assetId: string, fileId: string, options?: AssetFileParams): Promise<ApiResponse<AssetFile>> {
    if (!assetId || assetId.trim() === '') {
      throw new Error('Asset ID is required');
    }
    
    if (!fileId || fileId.trim() === '') {
      throw new Error('File ID is required');
    }
    
    // Build query parameters if options are provided
    const queryParams: Record<string, any> = {};
    if (options?.generate_signed_post_url !== undefined) {
      queryParams.generate_signed_post_url = options.generate_signed_post_url;
    }
    if (options?.content_disposition !== undefined) {
      queryParams.content_disposition = options.content_disposition;
    }
    if (options?.bypass_url_cache !== undefined) {
      queryParams.bypass_url_cache = options.bypass_url_cache;
    }
    
    const config = Object.keys(queryParams).length > 0 ? { params: queryParams } : undefined;
    
    return this.client.get<AssetFile>(
      `${this.basePath}/assets/${assetId}/files/${fileId}/`,
      config
    );
  }

  /**
   * Create a new file and associate it to an asset
   * 
   * @param assetId - The ID of the asset to associate the file with
   * @param fileData - The file data to create
   * @returns Promise with the response containing the created file
   */
  async createAssetFile(assetId: string, fileData: CreateFileRequest): Promise<ApiResponse<AssetFile>> {
    if (!assetId || assetId.trim() === '') {
      throw new Error('Asset ID is required');
    }
    
    return this.client.post<AssetFile>(`${this.basePath}/assets/${assetId}/files/`, fileData);
  }
}
