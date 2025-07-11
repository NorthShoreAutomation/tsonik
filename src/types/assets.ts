/**
 * Asset-related type definitions
 */

export type AssetType = 
  | 'ASSET'
  | 'SEQUENCE'
  | 'NLE_PROJECT'
  | 'PLACEHOLDER'
  | 'CUSTOM'
  | 'LINK'
  | 'SUBCLIP';

export type AssetStatus = 
  | 'ACTIVE'
  | 'DELETED';

export type AnalyzeStatus = 
  | 'N/A'
  | 'REQUESTED'
  | 'IN_PROGRESS'
  | 'FAILED'
  | 'DONE';

export type ArchiveStatus = 
  | 'NOT_ARCHIVED'
  | 'ARCHIVING'
  | 'FAILED_TO_ARCHIVE'
  | 'ARCHIVED';

export type ApprovalStatus = 
  | 'N/A'
  | 'REQUESTED'
  | 'APPROVED'
  | 'NOT_APPROVED'
  | 'MIXED';

export type FaceRecognitionStatus = 
  | 'N/A'
  | 'REQUESTED'
  | 'IN_PROGRESS'
  | 'FAILED'
  | 'DONE';

export type TranscriptionStatus = 
  | 'N/A'
  | 'REQUESTED'
  | 'IN_PROGRESS'
  | 'FAILED'
  | 'DONE';

export type AssetVersionStatus = 
  | 'ACTIVE'
  | 'IN_PROGRESS'
  | 'FAILED'
  | 'DELETING'
  | 'DELETED';

export type MediaType = 
  | 'video'
  | 'audio'
  | 'image'
  | 'document'
  | 'unknown';

export interface Asset {
  id: string;
  title: string;
  description?: string;
  created_date: string;
  modified_date: string;
  status: AssetStatus;
  type: AssetType;
  category?: string;
  external_id?: string;
  date_created?: string;
  date_modified?: string;
  is_online?: boolean;
  is_archived?: boolean;
  is_proxy?: boolean;
  is_original?: boolean;
  analyze_status?: AnalyzeStatus;
  archive_status?: ArchiveStatus;
  metadata?: Record<string, any>;
  tags?: string[];
  collection_ids?: string[];
  custom_metadata?: Record<string, any>;
  creator_id?: string;
  creator_name?: string;
  duration?: number;
  file_size?: number;
  media_type?: MediaType;
  format?: string;
  resolution?: {
    width?: number;
    height?: number;
  };
}

export interface CreateAssetRequest {
  title: string;
  category?: string;
  external_id?: string;
  type?: AssetType;
  description?: string;
  metadata?: Record<string, any>;
  tags?: string[];
  collection_ids?: string[];
  custom_metadata?: Record<string, any>;
}

export interface UpdateAssetRequest {
  title?: string;
  category?: string;
  status?: AssetStatus;
  description?: string;
  metadata?: Record<string, any>;
  tags?: string[];
  collection_ids?: string[];
  custom_metadata?: Record<string, any>;
}


export interface BulkDeleteRequest {
  asset_ids: string[];
}
