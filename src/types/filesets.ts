/**
 * FileSet-related type definitions
 */

export type FileSetStatus = 
  | 'ACTIVE'
  | 'DELETED'
  | 'ARCHIVED';

export interface FileSet {
  archive_file_set_id?: string;
  asset_id?: string;
  base_dir?: string;
  component_ids?: string[];
  date_created?: string;
  date_deleted?: string;
  date_modified?: string;
  deleted_by_user?: string;
  file_count?: number;
  format_id?: string;
  id: string;
  is_archive?: boolean;
  metadata?: Record<string, string | number | boolean | object>[];
  name?: string;
  original_storage_id?: string;
  status?: FileSetStatus;
  storage_id?: string;
  version_id?: string;
}

export interface AssetFileSetsListParams {
  per_page?: number;
  last_id?: string;
  file_count?: boolean;
}

export interface CreateFileSetRequest {
  archive_file_set_id?: string;
  base_dir?: string;
  component_ids?: string[];
  date_deleted?: string;
  file_dir?: string;
  format_id?: string;
  is_archive?: boolean;
  metadata?: Record<string, string | number | boolean | object>[];
  name?: string;
  original_storage_id?: string;
  status?: FileSetStatus;
  storage_id?: string;
  version_id?: string;
}

export interface DeleteFileSetOptions {
  keep_source?: boolean;
  immediately?: boolean;
}

export type FileType = 'FILE' | 'DIRECTORY';
export type FileStatus = 'OPEN' | 'UPLOADED' | 'DELETED';

export interface FileSetFile {
  asset_id: string;
  checksum?: string;
  date_created?: string;
  date_modified?: string;
  directory_path?: string;
  file_date_created?: string;
  file_date_modified?: string;
  file_set_id: string;
  file_set_status?: string;
  format_id?: string;
  format_status?: string;
  id: string;
  multipart_upload_url?: string;
  name: string;
  original_name?: string;
  parent_id?: string;
  size?: number;
  status: FileStatus;
  storage_id?: string;
  storage_method?: string;
  system_domain_id?: string;
  type: FileType;
  upload_credentials?: Record<string, string | number | boolean | object>;
  upload_filename?: string;
  upload_method?: string;
  upload_url?: string;
  url?: string;
  user_id?: string;
  version_id?: string;
}

export interface FileSetFilesListParams {
  per_page?: number;
  last_id?: string;
  generate_signed_url?: boolean;
  file_count?: boolean;
}