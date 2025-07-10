import { BaseResource } from './base';
import { Tsonik } from '../client';
import {
  ApiResponse,
  BulkJobResult,
  HttpMethod,
  HttpOptions,
  Job,
  JobAction,
  JobCreate,
  JobsPriorityUpdate,
  JobsQuery,
  JobsStateUpdate,
  JobStepsUpdate,
  JobUpdate,
  PaginatedResponse,
  QueryParams,
} from '../types';

/**
 * Job resource for interacting with Iconik Jobs API
 * Handles job management, state control, and monitoring
 */
export class JobResource extends BaseResource {
  constructor(client: Tsonik) {
    super(client, '/API/jobs/v1/jobs');
  }

  /**
   * Get a specific job by ID
   * @param jobId The job ID
   * @returns Promise resolving to the job data
   */
  async getJob(jobId: string): Promise<ApiResponse<Job>> {
    return this.client.get<Job>(`${this.basePath}/${jobId}`);
  }

  /**
   * Search and list jobs with optional filtering
   * @param query Query parameters for filtering and pagination
   * @returns Promise resolving to paginated job results
   */
  async listJobs(query: JobsQuery = {}): Promise<ApiResponse<PaginatedResponse<Job>>> {
    return super.list<Job>(query);
  }

  /**
   * Create a new job
   * @param jobData Job creation data
   * @returns Promise resolving to the created job
   */
  async createJob(jobData: JobCreate): Promise<ApiResponse<Job>> {
    return this.client.post<Job>(`${this.basePath}/`, jobData);
  }

  /**
   * Update an existing job
   * @param jobId The job ID to update
   * @param jobData Partial job data to update
   * @returns Promise resolving to the updated job
   */
  async updateJob(jobId: string, jobData: JobUpdate): Promise<ApiResponse<Job>> {
    return this.client.patch<Job>(`${this.basePath}/${jobId}`, jobData);
  }

  /**
   * Delete a job
   * @param jobId The job ID to delete
   * @returns Promise resolving to deletion confirmation
   */
  async deleteJob(jobId: string): Promise<ApiResponse<void>> {
    return this.client.delete<void>(`${this.basePath}/${jobId}`);
  }

  /**
   * Get children jobs of a parent job
   * @param jobId The parent job ID
   * @param query Optional query parameters
   * @returns Promise resolving to paginated child job results
   */
  async getJobChildren(jobId: string, query: JobsQuery = {}): Promise<ApiResponse<PaginatedResponse<Job>>> {
    return this.client.get(`${this.basePath}/${jobId}/children/`, { params: query });
  }

  /**
   * Perform state management actions on a job (pause, resume, abort, restart)
   * @param jobId The job ID
   * @param action The action to perform
   * @returns Promise resolving to the updated job
   */
  async performAction(jobId: string, action: JobAction): Promise<ApiResponse<Job>> {
    return this.client.post(`${this.basePath}/${jobId}/actions/${action.toLowerCase()}/`, {});
  }

  /**
   * Pause a job
   * @param jobId The job ID to pause
   * @returns Promise resolving to updated job data
   */
  async pause(jobId: string): Promise<ApiResponse<Job>> {
    return this.client.post<Job>(`${this.basePath}/${jobId}/actions/pause/`, {});
  }

  /**
   * Resume a paused job
   * @param jobId The job ID to resume
   * @returns Promise resolving to updated job data
   */
  async resume(jobId: string): Promise<ApiResponse<Job>> {
    return this.client.post<Job>(`${this.basePath}/${jobId}/actions/resume/`, {});
  }

  /**
   * Abort a job
   * @param jobId The job ID to abort
   * @returns Promise resolving to updated job data
   */
  async abort(jobId: string): Promise<ApiResponse<Job>> {
    return this.client.post<Job>(`${this.basePath}/${jobId}/actions/abort/`, {});
  }

  /**
   * Restart a job
   * @param jobId The job ID to restart
   * @returns Promise resolving to updated job data
   */
  async restart(jobId: string): Promise<ApiResponse<Job>> {
    return this.client.post<Job>(`${this.basePath}/${jobId}/actions/restart/`, {});
  }

  /**
   * Update job priority
   * @param jobId The job ID
   * @param priority New priority value (1-10)
   * @returns Promise resolving to updated job data
   */
  async updatePriority(jobId: string, priority: number): Promise<ApiResponse<Job>> {
    return this.client.patch<Job>(`${this.basePath}/${jobId}/`, { priority });
  }

  /**
   * Update job steps
   * @param jobId The job ID
   * @param stepsData The steps update data
   * @returns Promise resolving to the updated job
   */
  async updateSteps(jobId: string, stepsData: JobStepsUpdate): Promise<ApiResponse<Job>> {
    return this.client.patch(`${this.basePath}/${jobId}/steps/`, stepsData);
  }

  /**
   * Bulk update job priorities
   * @param priorityData Bulk priority update data
   * @returns Promise resolving to bulk operation results
   */
  async bulkUpdatePriority(priorityData: JobsPriorityUpdate): Promise<ApiResponse<BulkJobResult[]>> {
    return this.client.patch(`/jobs/v1/jobs/bulk/change_priority/`, priorityData);
  }

  /**
   * Bulk update job states (pause, resume, abort, restart)
   * @param stateData Bulk state update data
   * @returns Promise resolving to bulk operation results
   */
  async bulkUpdateState(stateData: JobsStateUpdate): Promise<ApiResponse<BulkJobResult[]>> {
    return this.client.post(`/jobs/v1/jobs/bulk/actions/${stateData.action.toLowerCase()}/`, {
      job_ids: stateData.job_ids
    });
  }

  /**
   * Bulk pause multiple jobs
   * @param jobIds Array of job IDs to pause
   * @returns Promise resolving to bulk operation results
   */
  async bulkPause(jobIds: string[]): Promise<ApiResponse<BulkJobResult[]>> {
    return this.client.post<BulkJobResult[]>(`${this.basePath}/bulk/actions/pause/`, { job_ids: jobIds });
  }

  /**
   * Bulk resume jobs
   * @param jobIds Array of job IDs to resume
   * @returns Promise resolving to bulk operation results
   */
  async bulkResume(jobIds: string[]): Promise<ApiResponse<BulkJobResult[]>> {
    return this.bulkUpdateState({ job_ids: jobIds, action: 'RESUME' });
  }

  /**
   * Bulk abort jobs
   * @param jobIds Array of job IDs to abort
   * @returns Promise resolving to bulk operation results
   */
  async bulkAbort(jobIds: string[]): Promise<ApiResponse<BulkJobResult[]>> {
    return this.bulkUpdateState({ job_ids: jobIds, action: 'ABORT' });
  }

  /**
   * Bulk restart jobs
   * @param jobIds Array of job IDs to restart
   * @returns Promise resolving to bulk operation results
   */
  async bulkRestart(jobIds: string[]): Promise<ApiResponse<BulkJobResult[]>> {
    return this.bulkUpdateState({ job_ids: jobIds, action: 'RESTART' });
  }

  /**
   * Bulk delete jobs
   * @param jobIds Array of job IDs to delete
   * @returns Promise resolving to bulk operation results
   */
  async bulkDelete(jobIds: string[]): Promise<ApiResponse<BulkJobResult[]>> {
    return this.client.delete<BulkJobResult[]>(`${this.basePath}/bulk/`, {
      data: { job_ids: jobIds }
    });
  }

  /**
   * Get job statistics/aggregations
   * @param query Query parameters for statistics
   * @returns Promise resolving to job statistics
   */
  async getStats(query: Pick<JobsQuery, 'aggregations' | 'facets' | 'type' | 'status' | 'object_type'>): Promise<ApiResponse<any>> {
    return this.client.get<any>(`${this.basePath}/`, { 
      params: query
    });
  }
}
