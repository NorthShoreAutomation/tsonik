/**
 * Metadata-related type definitions
 */

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