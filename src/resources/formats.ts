import { BaseResource } from './base';
import { Tsonik } from '../client';
import { ApiResponse, PaginatedResponse } from '../types';
import { Format, AssetFormatsListParams, CreateFormatRequest, UpdateFormatRequest, ReplaceFormatRequest } from '../types/formats';
import { cleanParams } from '../utils';

/**
 * Format resource for managing formats in Iconik
 */
export class FormatResource extends BaseResource {
  constructor(client: Tsonik) {
    super(client, '/v1');
  }

  /**
   * Get all formats for a specific asset
   * 
   * @param assetId - The ID of the asset
   * @param params - Optional parameters for the request
   * @returns Promise with the response containing asset formats
   */
  async getAssetFormats(assetId: string, params?: AssetFormatsListParams): Promise<ApiResponse<PaginatedResponse<Format>>> {
    if (!assetId || assetId.trim() === '') {
      throw new Error('Asset ID is required');
    }
    
    const config = Object.keys(cleanParams(params)).length > 0 ? { params: cleanParams(params) } : undefined;
    
    return this.client.get<PaginatedResponse<Format>>(
      `${this.basePath}/assets/${assetId}/formats/`,
      config
    );
  }

  /**
   * Get a specific format for an asset
   * 
   * @param assetId - The ID of the asset
   * @param formatId - The ID of the format to retrieve
   * @returns Promise with the response containing the format
   */
  async getAssetFormat(assetId: string, formatId: string): Promise<ApiResponse<Format>> {
    if (!assetId || assetId.trim() === '') {
      throw new Error('Asset ID is required');
    }
    
    if (!formatId || formatId.trim() === '') {
      throw new Error('Format ID is required');
    }
    
    return this.client.get<Format>(`${this.basePath}/assets/${assetId}/formats/${formatId}/`);
  }

  /**
   * Update an existing format for an asset
   * 
   * @param assetId - The ID of the asset
   * @param formatId - The ID of the format to update
   * @param formatData - The format data to update
   * @returns Promise with the response containing the updated format
   */
  async updateAssetFormat(assetId: string, formatId: string, formatData: UpdateFormatRequest): Promise<ApiResponse<Format>> {
    if (!assetId || assetId.trim() === '') {
      throw new Error('Asset ID is required');
    }
    
    if (!formatId || formatId.trim() === '') {
      throw new Error('Format ID is required');
    }
    
    return this.client.patch<Format>(`${this.basePath}/assets/${assetId}/formats/${formatId}/`, formatData);
  }

  /**
   * Replace an existing format for an asset (complete replacement)
   * 
   * @param assetId - The ID of the asset
   * @param formatId - The ID of the format to replace
   * @param formatData - The format data to replace with
   * @returns Promise with the response containing the replaced format
   */
  async replaceAssetFormat(assetId: string, formatId: string, formatData: ReplaceFormatRequest): Promise<ApiResponse<Format>> {
    if (!assetId || assetId.trim() === '') {
      throw new Error('Asset ID is required');
    }
    
    if (!formatId || formatId.trim() === '') {
      throw new Error('Format ID is required');
    }
    
    return this.client.put<Format>(`${this.basePath}/assets/${assetId}/formats/${formatId}/`, formatData);
  }

  /**
   * Create a new format and associate it to an asset
   * 
   * @param assetId - The ID of the asset to associate the format with
   * @param formatData - The format data to create
   * @returns Promise with the response containing the created format
   */
  async createAssetFormat(assetId: string, formatData: CreateFormatRequest): Promise<ApiResponse<Format>> {
    if (!assetId || assetId.trim() === '') {
      throw new Error('Asset ID is required');
    }
    
    return this.client.post<Format>(`${this.basePath}/assets/${assetId}/formats/`, formatData);
  }
}