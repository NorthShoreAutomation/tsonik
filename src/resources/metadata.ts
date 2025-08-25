import { BaseResource } from './base';
import { Tsonik } from '../client';
import { ApiResponse } from '../types';
import {
  MetadataResponse,
  GetMetadataParams,
  UpdateMetadataRequest,
  PutMetadataParams,
  MetadataFieldDefinition,
  CreateMetadataFieldRequest,
  PatchMetadataFieldRequest,
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

  /**
   * Get metadata field definition by field name
   * 
   * @param fieldName - The name of the metadata field to retrieve
   * @returns Promise with the response containing the metadata field definition
   */
  async getMetadataField(
    fieldName: string
  ): Promise<ApiResponse<MetadataFieldDefinition>> {
    if (!fieldName || fieldName.trim() === '') {
      throw new Error('Field name is required');
    }

    return this.client.get<MetadataFieldDefinition>(
      `${this.basePath}/fields/${fieldName}/`
    );
  }

  /**
   * Create a new metadata field
   * 
   * @param fieldData - The metadata field data to create
   * @returns Promise with the response containing the created metadata field
   */
  async createMetadataField(
    fieldData: CreateMetadataFieldRequest
  ): Promise<ApiResponse<MetadataFieldDefinition>> {
    if (!fieldData) {
      throw new Error('Field data is required');
    }

    if (!fieldData.name || fieldData.name.trim() === '') {
      throw new Error('Field name is required');
    }

    if (!fieldData.label || fieldData.label.trim() === '') {
      throw new Error('Field label is required');
    }

    if (!fieldData.field_type) {
      throw new Error('Field type is required');
    }

    return this.client.post<MetadataFieldDefinition>(
      `${this.basePath}/fields/`,
      fieldData
    );
  }

  /**
   * Patch a metadata field by field name
   * 
   * @param fieldName - The name of the metadata field to patch
   * @param patchData - The metadata field data to patch
   * @returns Promise with the response containing the patched metadata field
   */
  async patchMetadataField(
    fieldName: string,
    patchData: PatchMetadataFieldRequest
  ): Promise<ApiResponse<MetadataFieldDefinition>> {
    if (!fieldName || fieldName.trim() === '') {
      throw new Error('Field name is required');
    }

    if (!patchData) {
      throw new Error('Patch data is required');
    }

    return this.client.patch<MetadataFieldDefinition>(
      `${this.basePath}/fields/${fieldName}/`,
      patchData
    );
  }
}
