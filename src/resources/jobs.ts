import { BaseResource } from './base';
import { Tsonik } from '../client';
import {
  ApiResponse,
  BulkJobResult,
  Job,
  JobCreate,
  JobsBulkDeleteRequest,
  JobsBulkEditQuery,
  JobsBulkEditRequest,
  JobsBulkEditResponse,
  JobsPriorityUpdate,
  JobsQuery,
  JobsStateUpdate,
  JobStepsUpdate,
  JobUpdate,
  PaginatedResponse,
  JobStep
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
   * Replace an existing job (full update)
   * @param jobId The job ID to replace
   * @param jobData Complete job data to replace with
   * @param options Optional request options
   * @returns Promise resolving to the replaced job
   */
  async replaceJob(jobId: string, jobData: JobUpdate, options?: { merge_metadata?: string }): Promise<ApiResponse<Job>> {
    return this.client.put<Job>(`${this.basePath}/${jobId}`, jobData, {
      params: options
    });
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
   * Bulk edit jobs based on query filters
   * @param query Query parameters to filter which jobs to edit
   * @param editData Data to update on matching jobs
   * @returns Promise resolving to bulk edit result
   */
  async bulkEditJobs(query: JobsBulkEditQuery, editData: JobsBulkEditRequest): Promise<ApiResponse<JobsBulkEditResponse>> {
    return this.client.patch<JobsBulkEditResponse>(`${this.basePath}/`, editData, {
      params: query
    });
  }

  /**
   * Bulk update job priorities
   * @param priorityData Bulk priority update data
   * @returns Promise resolving to bulk operation results
   */
  async bulkUpdatePriority(priorityData: JobsPriorityUpdate): Promise<ApiResponse<BulkJobResult[]>> {
    return this.client.put(`${this.basePath}/priority/`, priorityData);
  }

  /**
   * Bulk update job states
   * @param stateData Bulk state update data
   * @returns Promise resolving to bulk operation results
   */
  async bulkUpdateState(stateData: JobsStateUpdate): Promise<ApiResponse<BulkJobResult[]>> {
    return this.client.put(`${this.basePath}/state/`, stateData);
  }

  /**
   * Bulk delete multiple jobs
   * @param jobIds Array of job IDs to delete
   * @returns Promise resolving to deletion confirmation (204 No Content)
   */
  async bulkDelete(jobIds: string[]): Promise<ApiResponse<void>> {
    const requestBody: JobsBulkDeleteRequest = { job_ids: jobIds };
    
    return this.client.delete<void>(`${this.basePath}/`, {
      data: requestBody
    });
  }

  /**
   * Reindex a job
   * @param jobId The job ID to reindex
   * @param options Options for reindexing
   * @returns Promise resolving to success confirmation
   */
  async reindexJob(jobId: string, options?: { sync_to_another_dc?: boolean }): Promise<ApiResponse<void>> {
    return this.client.post<void>(`${this.basePath}/${jobId}/reindex`, options ?? {});
  }

  /**
   * Update multiple steps for a job
   * @param jobId The job ID to update steps for
   * @param stepsData Job steps update data
   * @returns Promise resolving to the updated job
   */
  async updateJobSteps(jobId: string, stepsData: JobStepsUpdate): Promise<ApiResponse<Job>> {
    return this.client.patch<Job>(`${this.basePath}/${jobId}/steps/`, stepsData);
  }

  /**
   * Replace multiple steps for a job
   * @param jobId The job ID to replace steps for
   * @param stepsData Job steps update data
   * @returns Promise resolving to the updated job
   */
  async replaceJobSteps(jobId: string, stepsData: JobStepsUpdate): Promise<ApiResponse<Job>> {
    return this.client.put<Job>(`${this.basePath}/${jobId}/steps/`, stepsData);
  }

  /**
   * Update a single job step
   * @param jobId The job ID the step belongs to
   * @param stepId The ID of the step to update
   * @param stepData Step update data (status, message, etc.)
   * @returns Promise resolving to the updated job
   */
  async updateJobStep(jobId: string, stepId: string, stepData: Partial<JobStep>): Promise<ApiResponse<Job>> {
    return this.client.patch<Job>(`${this.basePath}/${jobId}/steps/${stepId}/`, stepData);
  }

  /**
   * Replace a single job step (complete replacement)
   * @param jobId The job ID the step belongs to
   * @param stepId The ID of the step to replace
   * @param stepData Full step data to replace with
   * @returns Promise resolving to the updated job
   */
  async replaceJobStep(jobId: string, stepId: string, stepData: JobStep): Promise<ApiResponse<Job>> {
    return this.client.put<Job>(`${this.basePath}/${jobId}/steps/${stepId}/`, stepData);
  }
}
