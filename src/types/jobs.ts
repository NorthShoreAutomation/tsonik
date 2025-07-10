/**
 * Job-related type definitions for Iconik API
 */

export type JobStatus = 
  | 'READY'
  | 'STARTED' 
  | 'FINISHED'
  | 'FINISHED_WITH_WARNING'
  | 'FAILED'
  | 'WAITING'
  | 'ABORT_PENDING'
  | 'ABORTED'
  | 'SKIPPED'
  | 'PAUSED';

export type JobType = 
  | 'MEDIAINFO'
  | 'TRANSCODE'
  | 'KEYFRAMES'
  | 'EXPORT'
  | 'DELETE'
  | 'REINDEX'
  | 'MOVE'
  | 'TRANSFER'
  | 'ANALYZE'
  | 'METADATA'
  | 'CUSTOM'
  | 'SCAN'
  | 'ARCHIVE'
  | 'RESTORE'
  | 'RESTORE_FROM_GLACIER'
  | 'ACL'
  | 'COPY'
  | 'TRANSCRIPTION'
  | 'REQUEST_COLLECTION_MAP'
  | 'COLLECTION_CUSTOM_ORDER'
  | 'STORAGE_GATEWAY_FILE_INGEST'
  | 'MARK_MISSING'
  | 'FACE_RECOGNITION'
  | 'SET_APPROVAL'
  | 'REQUEST_APPROVAL'
  | 'CHANGE_PERSON'
  | 'CONFIRM_PERSON'
  | 'DELETE_PERSON'
  | 'AUTOMATION'
  | 'REVIEW_REQUEST'
  | 'CONVERT_SAVED_SEARCH_TO_COLLECTION'
  | 'DELETE_JOBS'
  | 'EDIT_JOBS';

export type JobStepStatus = 
  | 'IN_PROGRESS'
  | 'WAITING'
  | 'FAILED'
  | 'DONE'
  | 'SKIPPED';

export type JobAction = 
  | 'PAUSE'
  | 'RESUME'
  | 'ABORT'
  | 'RESTART';

export interface RelatedObject {
  object_id: string;
  object_type: string;
}

export interface ActionContextValue {
  bulk?: boolean;
  url?: string;
}

export interface ActionContext {
  ABORT?: ActionContextValue;
  CHANGE_PRIORITY?: ActionContextValue;
  PAUSE?: ActionContextValue;
  RESTART?: ActionContextValue;
  RESUME?: ActionContextValue;
}

export interface JobChildProgress {
  progress_processed?: number;
  progress_total?: number;
  status?: JobStatus;
}

export interface JobStep {
  id: string;
  label: string;
  status: JobStepStatus;
  message?: string;
  error_message?: string;
  date_updated?: string;
}

export interface Job {
  id: string;
  title: string;
  type: JobType;
  status: JobStatus;
  custom_type?: string;
  message?: string;
  error_message?: string;
  priority?: number;
  progress?: number;
  progress_processed?: number;
  progress_total?: number;
  object_id?: string;
  object_type?: string;
  parent_id?: string;
  created_by?: string;
  date_created?: string;
  date_modified?: string;
  started_at?: string;
  completed_at?: string;
  has_children?: boolean;
  children_progress?: Record<string, JobChildProgress>;
  job_context?: Record<string, any>;
  metadata?: Record<string, any>;
  action_context?: ActionContext;
  related_objects?: RelatedObject[];
  steps?: JobStep[];
}

export interface JobCreate {
  title: string;
  type: JobType;
  status: JobStatus;
  custom_type?: string;
  message?: string;
  error_message?: string;
  object_id?: string;
  object_type?: string;
  parent_id?: string;
  created_by?: string;
  started_at?: string;
  completed_at?: string;
  has_children?: boolean;
  job_context?: Record<string, any>;
  metadata?: Record<string, any>;
  action_context?: ActionContext;
  related_objects?: RelatedObject[];
  steps?: JobStep[];
  progress_processed?: number;
  progress_total?: number;
  id?: string;
}

export interface JobUpdate {
  title?: string;
  status?: JobStatus;
  message?: string;
  error_message?: string;
  job_context?: Record<string, any>;
  metadata?: Record<string, any>;
}

export interface JobsQuery {
  page?: number;
  per_page?: number;
  scroll?: boolean;
  scroll_id?: string;
  sort?: string;
  facets?: boolean;
  aggregations?: string;
  type?: JobType | JobType[];
  object_type?: string;
  parent_id?: string;
  object_id?: string;
  status?: JobStatus | JobStatus[];
  created_by?: string | string[];
  date_created?: string;
  date_modified?: string;
  query?: string;
  ids?: string[];
  'metadata.automation_id'?: string;
  _missing_?: string[];
  _exists_?: string[];
}

export interface JobsPriorityUpdate {
  job_ids: string[];
  priority: number;
}

export interface JobsStateUpdate {
  job_ids: string[];
  action: JobAction;
}

export interface JobStepsUpdate {
  steps: Array<{
    id: string;
    label: string;
    status: JobStepStatus;
    message?: string;
    error_message?: string;
  }>;
}

export interface BulkJobResult {
  job_id: string;
}
