import { BaseResource } from './base';
import { Tsonik } from '../client';
import { ApiResponse, PaginatedResponse } from '../types';
import { 
  FileSet, 
  AssetFileSetsListParams, 
  CreateFileSetRequest, 
  DeleteFileSetOptions,
  FileSetFilesListParams,
  FileSetFile
} from '../types/filesets';
import { cleanParams } from '../utils';

/**
 * FileSet resource for managing file sets in Iconik
 */
export class FileSetResource extends BaseResource {
  constructor(client: Tsonik) {
    super(client, '/API/files/v1');
  }

  /**
   * Get all file sets for a specific asset
   */
  async getAssetFilesets(assetId: string, params?: AssetFileSetsListParams): Promise<ApiResponse<PaginatedResponse<FileSet>>> {
    if (!assetId || assetId.trim() === '') {
      throw new Error('Asset ID is required');
    }
    
    const config = Object.keys(cleanParams(params)).length > 0 ? { params: cleanParams(params) } : undefined;
    return this.client.get<PaginatedResponse<FileSet>>(`${this.basePath}/assets/${assetId}/file_sets/`, config);
  }

  /**
   * Get a specific file set for an asset by ID
   */
  async getAssetFileset(assetId: string, fileSetId: string): Promise<ApiResponse<FileSet>> {
    if (!assetId || assetId.trim() === '') {
      throw new Error('Asset ID is required');
    }
    if (!fileSetId || fileSetId.trim() === '') {
      throw new Error('FileSet ID is required');
    }
    
    return this.client.get<FileSet>(`${this.basePath}/assets/${assetId}/file_sets/${fileSetId}/`);
  }

  /**
   * Create a new file set for an asset
   */
  async createAssetFileset(assetId: string, filesetData: CreateFileSetRequest): Promise<ApiResponse<FileSet>> {
    if (!assetId || assetId.trim() === '') {
      throw new Error('Asset ID is required');
    }
    
    return this.client.post<FileSet>(`${this.basePath}/assets/${assetId}/file_sets/`, filesetData);
  }

  /**
   * Delete a file set for an asset
   */
  async deleteAssetFileset(assetId: string, fileSetId: string, options?: DeleteFileSetOptions): Promise<ApiResponse<FileSet | void>> {
    if (!assetId || assetId.trim() === '') {
      throw new Error('Asset ID is required');
    }
    if (!fileSetId || fileSetId.trim() === '') {
      throw new Error('FileSet ID is required');
    }
    
    const config = Object.keys(cleanParams(options)).length > 0 ? { params: cleanParams(options) } : undefined;
    
    // Return type depends on options - if immediately=true, returns void (204), otherwise returns FileSet (200)
    return this.client.delete<FileSet | void>(`${this.basePath}/assets/${assetId}/file_sets/${fileSetId}/`, config);
  }

  /**
   * Get files from a file set
   *
   * @param assetId - The ID of the asset
   * @param fileSetId - The ID of the file set
   * @param options - Optional parameters for the request
   * @returns Promise with the response containing file set files
   */
  async getFileSetFiles(assetId: string, fileSetId: string, options?: FileSetFilesListParams): Promise<ApiResponse<PaginatedResponse<FileSetFile>>> {
    if (!assetId || assetId.trim() === '') {
      throw new Error('Asset ID is required');
    }
    if (!fileSetId || fileSetId.trim() === '') {
      throw new Error('FileSet ID is required');
    }
    
    const config = Object.keys(cleanParams(options)).length > 0 ? { params: cleanParams(options) } : undefined;
    
    return this.client.get<PaginatedResponse<FileSetFile>>(
      `${this.basePath}/assets/${assetId}/file_sets/${fileSetId}/files/`,
      config
    );
  }
}