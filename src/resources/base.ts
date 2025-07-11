import { Tsonik } from '../client';
import { ApiResponse, PaginatedResponse } from '../types';

/**
 * Base class for all Iconik API resources
 */
export abstract class BaseResource {
  protected client: Tsonik;
  protected basePath: string;
  

  constructor(client: Tsonik, basePath: string) {
    this.client = client;
    this.basePath = basePath;
  }

  /**
   * Get a single resource by ID
   */
  async get<T = any>(id: string): Promise<ApiResponse<T>> {
    return this.client.get<T>(`${this.basePath}/${id}`);
  }

  /**
   * List resources with optional query parameters
   */
  async list<T = any>(params?: Record<string, any>): Promise<ApiResponse<PaginatedResponse<T>>> {
    // Filter out undefined/null values and let axios handle query parameter encoding
    const cleanParams = params ? Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value !== undefined && value !== null)
    ) : {};
    
    return this.client.get<PaginatedResponse<T>>(`${this.basePath}/`, { params: cleanParams });
  }

  /**
   * Create a new resource
   */
  async create<T = any>(data: any): Promise<ApiResponse<T>> {
    return this.client.post<T>(this.basePath, data);
  }

  /**
   * Update a resource by ID
   */
  async update<T = any>(id: string, data: any): Promise<ApiResponse<T>> {
    return this.client.put<T>(`${this.basePath}/${id}`, data);
  }

  /**
   * Partially update a resource by ID
   */
  async patch<T = any>(id: string, data: any): Promise<ApiResponse<T>> {
    return this.client.patch<T>(`${this.basePath}/${id}`, data);
  }

  /**
   * Delete a resource by ID
   */
  async delete<T = void>(id: string): Promise<ApiResponse<T>> {
    return this.client.delete<T>(`${this.basePath}/${id}`);
  }
}
