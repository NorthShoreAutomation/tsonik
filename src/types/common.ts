/**
 * Common API response types
 */

// Define consistent types to replace 'any'
export type FilterValue = string | number | boolean | object | null;
export type FilterRecord = Record<string, FilterValue>;
export type HttpHeaders = Record<string, string | string[] | undefined>;

export interface ApiResponse<T = unknown> {
  data: T;
  status: number;
  headers: HttpHeaders;
}

export interface PaginatedResponse<T = unknown> {
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
  filter?: FilterRecord;
  page_token?: string;
  scroll?: string;
}
