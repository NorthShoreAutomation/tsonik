import { BaseResource } from './base';
import { Tsonik } from '../client';
import { ApiResponse } from '../types';
import {
  MetadataResponse,
  GetMetadataParams,
  UpdateMetadataRequest,
  PutMetadataParams,
} from '../types/metadata';
import { cleanParams } from '../utils';

/**
 * Metadata resource class for managing Iconik metadata
 */
export class MetadataResource extends BaseResource {
  constructor(client: Tsonik) {
    super(client, '/API/metadata/v1');
  }

  /**
   * Get metadata for a specific object
   */
  async getMetadata(
    objectType: string,
    objectId: string,
    params?: GetMetadataParams
  ): Promise<ApiResponse<MetadataResponse>> {
    return this.client.get<MetadataResponse>(
      `${this.basePath}/${objectType}/${objectId}`,
      { params: cleanParams(params) }
    );
  }

  /**
   * Update metadata for a specific object
   */
  async putMetadata(
    objectType: string,
    objectId: string,
    metadataData: UpdateMetadataRequest,
    params?: PutMetadataParams
  ): Promise<ApiResponse<MetadataResponse>> {
    return this.client.put<MetadataResponse>(
      `${this.basePath}/${objectType}/${objectId}`,
      metadataData,
      { params: cleanParams(params) }
    );
  }
}
