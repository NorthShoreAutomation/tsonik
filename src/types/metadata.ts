/**
 * Metadata-related type definitions
 */

/**
 * Metadata field types supported by Iconik
 */
export type MetadataFieldType = 
  | 'tag_cloud'
  | 'text'
  | 'textarea'
  | 'number'
  | 'date'
  | 'boolean'
  | 'select'
  | 'multi_select'
  | 'user'
  | 'asset';

/**
 * Metadata field definition response
 */
export interface MetadataFieldDefinition {
  auto_set: boolean;
  date_created: string;
  date_modified: string;
  description: string | null;
  external_id: string | null;
  field_type: MetadataFieldType;
  hide_if_not_set: boolean;
  is_block_field: boolean;
  is_warning_field: boolean;
  label: string;
  mapped_field_name: string | null;
  max_value: number | null;
  min_value: number | null;
  multi: boolean;
  name: string;
  options: unknown[];
  read_only: boolean;
  representative: boolean;
  required: boolean;
  sortable: boolean;
  source_url: string | null;
  use_as_facet: boolean;
  system_domain_id?: string;
  user_id?: string;
}

/**
 * Request body for creating a new metadata field
 */
export interface CreateMetadataFieldRequest {
  field_type: MetadataFieldType;
  label: string;
  name: string;
  read_only: boolean;
  use_as_facet: boolean;
  description?: string;
  is_required?: boolean;
}

/**
 * Request body for patching a metadata field (PATCH)
 */
export interface PatchMetadataFieldRequest {
  field_type?: MetadataFieldType;
  label?: string;
  read_only?: boolean;
  use_as_facet?: boolean;
  description?: string;
  is_required?: boolean;
}

export interface MetadataFieldValue {
  [key: string]: unknown;
}

export interface MetadataField {
  date_created: string;
  field_values: MetadataFieldValue[];
}

export interface MetadataValues {
  [fieldName: string]: MetadataField;
}

export interface MetadataResponse {
  date_created: string;
  date_modified: string;
  job_id: string;
  metadata_values: MetadataValues;
  object_id: string;
  object_type: string;
  version_id: string;
}

export interface GetMetadataParams {
  check_if_subclip?: boolean;
  include_values_for_deleted_fields?: boolean;
}

export interface PutMetadataParams {
  check_if_subclip?: boolean;
  ignore_unchanged?: boolean;
}

export interface MetadataFieldForUpdate {
  date_created?: string;
  field_values: MetadataFieldValue[];
  mode?: 'overwrite' | 'append';
}

export interface MetadataValuesForUpdate {
  [fieldName: string]: MetadataFieldForUpdate;
}

export interface UpdateMetadataRequest {
  date_created?: string;
  date_modified?: string;
  job_id?: string;
  metadata_values: MetadataValuesForUpdate;
  object_id?: string;
  object_type?: string;
  version_id?: string;
}