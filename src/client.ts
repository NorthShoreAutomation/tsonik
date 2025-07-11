import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { IconikConfig } from './config';
import { IconikError, IconikAuthError, IconikAPIError } from './errors';
import { ApiResponse } from './types';
import { AssetResource, JobResource, CollectionResource, FileSetResource } from './resources';

/**
 * Main client class for interacting with the Iconik API
 */
export class Tsonik {
  private httpClient: AxiosInstance;
  private config: IconikConfig;
  
  // ORM-like resource properties
  public readonly assets: AssetResource;
  public readonly jobs: JobResource;
  public readonly collections: CollectionResource;
  public readonly filesets: FileSetResource;

  constructor(config: IconikConfig) {
    this.config = config;
    
    this.httpClient = axios.create({
      baseURL: config.baseUrl,
      timeout: config.timeout || 30000,
      headers: {
        'App-ID': config.appId,
        'Auth-Token': config.authToken,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...config.headers,
      },
    });

    // Add request interceptor for logging
    this.httpClient.interceptors.request.use(
      (config) => {
        if (this.config.debug) {
          console.log(`[Iconik API] ${config.method?.toUpperCase()} ${config.url}`);
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add response interceptor for error handling
    this.httpClient.interceptors.response.use(
      (response) => response,
      (error) => {
        // Log detailed error information for debugging
        console.error('Iconik API Error Details:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          url: error.config?.url,
          method: error.config?.method,
          requestData: error.config?.data,
          responseData: error.response?.data,
          message: error.message
        });
        
        // Log specific validation errors if available
        if (error.response?.data?.errors) {
          console.error('API Validation Errors:', error.response.data.errors);
        }
        if (error.response?.data?.error_description) {
          console.error('API Error Description:', error.response.data.error_description);
        }
        
        if (error.response?.status === 401) {
          throw new IconikAuthError('Invalid API key or unauthorized access');
        }
        
        if (error.response?.status >= 400) {
          const errorMessage = error.response.data?.message || 
                              error.response.data?.error_description ||
                              error.response.statusText ||
                              'API request failed';
          throw new IconikAPIError(
            errorMessage,
            error.response.status,
            error.response.data
          );
        }
        
        throw new IconikError(`Network error: ${error.message}`);
      }
    );
    
    // Initialize ORM-like resources
    this.assets = new AssetResource(this);
    this.jobs = new JobResource(this);
    this.collections = new CollectionResource(this);
    this.filesets = new FileSetResource(this);
  }

  /**
   * Make a GET request to the API
   */
  async get<T = any>(path: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response: AxiosResponse<T> = await this.httpClient.get(path, config);
    return {
      data: response.data,
      status: response.status,
      headers: response.headers,
    };
  }

  /**
   * Make a POST request to the API
   */
  async post<T = any>(path: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response: AxiosResponse<T> = await this.httpClient.post(path, data, config);
    return {
      data: response.data,
      status: response.status,
      headers: response.headers,
    };
  }

  /**
   * Make a PUT request to the API
   */
  async put<T = any>(path: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response: AxiosResponse<T> = await this.httpClient.put(path, data, config);
    return {
      data: response.data,
      status: response.status,
      headers: response.headers,
    };
  }

  /**
   * Make a DELETE request to the API
   */
  async delete<T = any>(path: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response: AxiosResponse<T> = await this.httpClient.delete(path, config);
    return {
      data: response.data,
      status: response.status,
      headers: response.headers,
    };
  }

  /**
   * Make a PATCH request to the API
   */
  async patch<T = any>(path: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response: AxiosResponse<T> = await this.httpClient.patch(path, data, config);
    return {
      data: response.data,
      status: response.status,
      headers: response.headers,
    };
  }
}
