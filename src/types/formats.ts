/**
 * Format-related type definitions
 */

export type FormatStatus = 'ACTIVE' | 'DELETED' | 'ARCHIVED';
export type ArchiveStatus = 'NOT_ARCHIVED' | 'ARCHIVED' | 'ARCHIVING' | 'RESTORING';
export type ComponentType = 'VIDEO' | 'AUDIO' | 'IMAGE' | 'SUBTITLE' | 'TEXT' | 'DATA';

export interface FormatComponent {
  id: string;
  metadata?: Record<string, any>;
  name?: string;
  type: ComponentType;
}

export interface Format {
  archive_status?: ArchiveStatus;
  asset_id: string;
  components?: FormatComponent[];
  date_created?: string;
  date_deleted?: string;
  date_modified?: string;
  deleted_by_user?: string;
  id: string;
  is_online?: boolean;
  metadata?: Record<string, any>[];
  name?: string;
  status?: FormatStatus;
  storage_methods?: string[];
  user_id?: string;
  version_id?: string;
  warnings?: string[];
}

export interface AssetFormatsListParams {
  per_page?: number;
  last_id?: string;
  include_all_versions?: boolean;
}

/**
 * Request body for creating a new format for an asset
 */
export interface CreateFormatRequest {
  archive_status?: ArchiveStatus;
  components?: Omit<FormatComponent, 'id'>[];
  date_deleted?: string;
  is_online?: boolean;
  metadata?: Record<string, any>[];
  name?: string;
  status?: FormatStatus;
  storage_methods?: string[];
  user_id?: string;
  version_id?: string;
}

/**
 * Request body for updating an existing format for an asset
 */
export interface UpdateFormatRequest {
  archive_status?: ArchiveStatus;
  components?: Omit<FormatComponent, 'id'>[];
  date_deleted?: string;
  is_online?: boolean;
  metadata?: Record<string, any>[];
  name?: string;
  status?: FormatStatus;
  storage_methods?: string[];
  user_id?: string;
  version_id?: string;
}

/**
 * Request body for replacing an existing format for an asset (PUT operation)
 */
export interface ReplaceFormatRequest {
  archive_status?: ArchiveStatus;
  components?: Omit<FormatComponent, 'id'>[];
  date_deleted?: string;
  is_online?: boolean;
  metadata?: Record<string, any>[];
  name?: string;
  status?: FormatStatus;
  storage_methods?: string[];
  user_id?: string;
  version_id?: string;
}