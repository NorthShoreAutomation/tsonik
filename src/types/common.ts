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
  total_count: number;
  next_page_token?: string;
  previous_page_token?: string;
}
