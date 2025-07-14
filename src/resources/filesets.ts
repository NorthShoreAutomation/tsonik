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
    
    const queryParams: Record<string, string | number | boolean> = {};
    if (params?.per_page) {
      queryParams.per_page = params.per_page;
    }
    if (params?.last_id) {
      queryParams.last_id = params.last_id;
    }
    if (params?.file_count !== undefined) {
      queryParams.file_count = params.file_count;
    }
    
    const config = Object.keys(queryParams).length > 0 ? { params: queryParams } : undefined;
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
    
    // Build query parameters if options are provided
    const queryParams: Record<string, string | number | boolean> = {};
    if (options?.keep_source !== undefined) {
      queryParams.keep_source = options.keep_source;
    }
    if (options?.immediately !== undefined) {
      queryParams.immediately = options.immediately;
    }
    
    const config = Object.keys(queryParams).length > 0 ? { params: queryParams } : undefined;
    
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
    
    // Build query parameters if options are provided
    const queryParams: Record<string, string | number | boolean> = {};
    if (options?.per_page !== undefined) {
      queryParams.per_page = options.per_page;
    }
    if (options?.last_id !== undefined) {
      queryParams.last_id = options.last_id;
    }
    if (options?.generate_signed_url !== undefined) {
      queryParams.generate_signed_url = options.generate_signed_url;
    }
    if (options?.file_count !== undefined) {
      queryParams.file_count = options.file_count;
    }
    
    const config = Object.keys(queryParams).length > 0 ? { params: queryParams } : undefined;
    
    return this.client.get<PaginatedResponse<FileSetFile>>(
      `${this.basePath}/assets/${assetId}/file_sets/${fileSetId}/files/`,
      config
    );
  }
}