/**
 * Collection-related type definitions
 */

export type CollectionCustomOrderStatus = 
  | 'DISABLED'
  | 'ENABLING'
  | 'ENABLED';

export type CollectionStatus = 
  | 'ACTIVE'
  | 'HIDDEN'
  | 'DELETED';

export interface Collection {
  category?: string;
  created_by_user?: string;
  custom_keyframe?: string;
  custom_order_status?: CollectionCustomOrderStatus;
  custom_poster?: string;
  date_created?: string;
  date_deleted?: string;
  date_modified?: string;
  deleted_by_user?: string;
  external_id?: string;
  favoured?: boolean;
  id: string;
  in_collections?: string[];
  is_root?: boolean;
  keyframe_asset_ids?: string[];
  keyframes?: any[];
  metadata?: Record<string, any>;
  object_type?: string;
  parent_id?: string;
  parents?: string[];
  permissions?: string[];
  position?: number;
  project_id?: string;
  status?: CollectionStatus;
  storage_id?: string;
  title?: string;
}

export interface CollectionListParams {
  per_page?: number;
  page?: number;
  scroll?: boolean;
  scroll_id?: string;
  sort?: string;
  is_root?: string;
  status?: string;
}

export interface CreateCollectionRequest {
  title: string;
  category?: string;
  custom_keyframe?: string;
  custom_order_status?: CollectionCustomOrderStatus;
  custom_poster?: string;
  external_id?: string;
  favoured?: boolean;
  in_collections?: string[];
  is_root?: boolean;
  keyframe_asset_ids?: string[];
  metadata?: Record<string, any>;
  object_type?: string;
  parent_id?: string;
  parents?: string[];
  permissions?: string[];
  position?: number;
  project_id?: string;
  status?: CollectionStatus;
  storage_id?: string;
}

export interface DeleteCollectionResponse {
  job_id: string;
  status: string;
}

export interface UpdateCollectionRequest {
  category?: string;
  custom_keyframe?: string;
  custom_poster?: string;
  date_created?: string;
  external_id?: string;
  is_root?: boolean;
  keyframe_asset_ids?: string[];
  parent_id?: string;
  status?: CollectionStatus;
  storage_id?: string;
  title?: string;
}

export interface UpdateCollectionOptions {
  change_parent_mode?: 'move' | 'copy';
}

export interface ReplaceCollectionRequest {
  category?: string;
  custom_keyframe?: string;
  custom_poster?: string;
  date_created?: string;
  external_id?: string;
  is_root?: boolean;
  keyframe_asset_ids?: string[];
  parent_id?: string | null;
  status?: CollectionStatus;
  storage_id?: string;
  title?: string;
}

export interface ReplaceCollectionOptions {
  change_parent_mode?: 'move' | 'copy';
}
