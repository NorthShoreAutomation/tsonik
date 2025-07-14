import { Tsonik } from '../client';
import { ApiResponse, PaginatedResponse } from '../types';
import { cleanParams } from '../utils';

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
  async get<T = unknown>(id: string): Promise<ApiResponse<T>> {
    return this.client.get<T>(`${this.basePath}/${id}`);
  }

  /**
   * List resources with optional query parameters
   */
  // Using unknown here instead of strict Record type to allow interfaces without index signatures
  async list<T = unknown>(params?: unknown): Promise<ApiResponse<PaginatedResponse<T>>> {
    return this.client.get<PaginatedResponse<T>>(`${this.basePath}/`, { params: cleanParams(params) });
  }

  /**
   * Create a new resource
   */
  // Using unknown here instead of strict Record type to allow interfaces without index signatures
  async create<T = unknown>(data: unknown): Promise<ApiResponse<T>> {
    return this.client.post<T>(this.basePath, data);
  }

  /**
   * Update a resource by ID
   */
  // Using unknown here instead of strict Record type to allow interfaces without index signatures
  async update<T = unknown>(id: string, data: unknown): Promise<ApiResponse<T>> {
    return this.client.put<T>(`${this.basePath}/${id}`, data);
  }

  /**
   * Partially update a resource by ID
   */
  // Using unknown here instead of strict Record type to allow interfaces without index signatures
  async patch<T = unknown>(id: string, data: unknown): Promise<ApiResponse<T>> {
    return this.client.patch<T>(`${this.basePath}/${id}`, data);
  }

  /**
   * Delete a resource by ID
   */
  async delete<T = void>(id: string): Promise<ApiResponse<T>> {
    return this.client.delete<T>(`${this.basePath}/${id}`);
  }
}
