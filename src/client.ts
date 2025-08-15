import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { IconikConfig } from './config';
import { IconikError, IconikAuthError, IconikAPIError } from './errors';
import { ApiResponse } from './types';
import { AssetResource, JobResource, CollectionResource, FileSetResource, FileResource, FormatResource, MetadataResource, SearchResource } from './resources';
import { createRetryWrapper, mergeRetryConfig, RetryConfig, DEFAULT_RETRY_CONFIG } from './retry';

/**
 * Main client class for interacting with the Iconik API
 */
export class Tsonik {
  private httpClient: AxiosInstance;
  private config: IconikConfig;
  private retryConfig: Required<RetryConfig>;
  
  // ORM-like resource properties
  public readonly assets: AssetResource;
  public readonly jobs: JobResource;
  public readonly collections: CollectionResource;
  public readonly filesets: FileSetResource;
  public readonly files: FileResource;
  public readonly formats: FormatResource;
  public readonly metadata: MetadataResource;
  public readonly search: SearchResource;

  constructor(config: IconikConfig) {
    this.config = config;
    this.retryConfig = mergeRetryConfig(config.retry);
    
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
    this.files = new FileResource(this);
    this.formats = new FormatResource(this);
    this.metadata = new MetadataResource(this);
    this.search = new SearchResource(this);
  }

  /**
   * Make a GET request to the API
   */
  async get<T = any>(path: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response: AxiosResponse<T> = await createRetryWrapper(
      () => this.httpClient.get(path, config),
      this.retryConfig
    );
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
    const response: AxiosResponse<T> = await createRetryWrapper(
      () => this.httpClient.post(path, data, config),
      this.retryConfig
    );
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
    const response: AxiosResponse<T> = await createRetryWrapper(
      () => this.httpClient.put(path, data, config),
      this.retryConfig
    );
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
    const response: AxiosResponse<T> = await createRetryWrapper(
      () => this.httpClient.delete(path, config),
      this.retryConfig
    );
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
    const response: AxiosResponse<T> = await createRetryWrapper(
      () => this.httpClient.patch(path, data, config),
      this.retryConfig
    );
    return {
      data: response.data,
      status: response.status,
      headers: response.headers,
    };
  }

  /**
   * Get client information including version and configuration
   * Useful for debugging and support purposes
   */
  getClientInfo(): { 
    name: string; 
    version: string; 
    baseUrl: string; 
    userAgent: string;
  } {
    return {
      name: 'tsonik',
      version: '1.1.0', // This will be updated by semantic-release
      baseUrl: this.config.baseUrl || 'https://app.iconik.io',
      userAgent: this.httpClient.defaults.headers.common['User-Agent'] as string || 'tsonik-client'
    };
  }
}
