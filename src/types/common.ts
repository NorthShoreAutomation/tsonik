/**
 * Common API response types
 */

export interface ApiResponse<T = any> {
  data: T;
  status: number;
  headers: any;
}

export interface PaginatedResponse<T = any> {
  objects: T[];
  total?: number;
  total_count?: number;
  page?: number;
  pages?: number;
  per_page?: number;
  first_url?: string;
  last_url?: string;
  next_url?: string;
  prev_url?: string;
  scroll_id?: string;
  next_page_token?: string;
  previous_page_token?: string;
}

export interface ListParams {
  limit?: number;
  offset?: number;
  page?: number;
  per_page?: number;
  sort?: string;
  filter?: Record<string, any>;
  page_token?: string;
  scroll?: string;
}
