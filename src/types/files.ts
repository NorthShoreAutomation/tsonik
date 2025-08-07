/**
 * File-related type definitions
 */

export type FileType = 'FILE' | 'DIRECTORY';
export type FileStatus = 'OPEN' | 'UPLOADED' | 'DELETED';

export interface AssetFile {
  asset_id: string;
  checksum?: string;
  date_created?: string;
  date_modified?: string;
  directory_path?: string;
  file_date_created?: string;
  file_date_modified?: string;
  file_set_id?: string;
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

export interface AssetFilesListParams {
  per_page?: number;
  generate_signed_url?: boolean;
  content_disposition?: string;
  last_id?: string;
}

/**
 * Parameters for retrieving a single file from an asset
 */
export interface AssetFileParams {
  generate_signed_post_url?: boolean;
  content_disposition?: string;
  bypass_url_cache?: boolean;
}

/**
 * Request body for creating a new file for an asset
 */
export interface CreateFileRequest {
  directory_path: string;
  file_set_id: string;
  original_name: string;
  type: FileType;
  asset_id?: string;
  checksum?: string;
  file_date_created?: string;
  file_date_modified?: string;
  format_id?: string;
  name?: string;
  parent_id?: string;
  size?: number;
  status?: FileStatus;
  storage_id?: string;
  user_id?: string;
  version_id?: string;
}
