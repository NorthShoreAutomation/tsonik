import { BaseResource } from './base';
import { ApiResponse, PaginatedResponse } from '../types';
import { AssetFile, AssetFilesListParams, AssetFileParams, CreateFileRequest } from '../types/files';
import { cleanParams } from '../utils';

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
    
    const config = Object.keys(cleanParams(options)).length > 0 ? { params: cleanParams(options) } : undefined;
    
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
    
    const config = Object.keys(cleanParams(options)).length > 0 ? { params: cleanParams(options) } : undefined;
    
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
