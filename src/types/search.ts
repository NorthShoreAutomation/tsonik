/**
 * Search-related type definitions
 */

export interface SearchQuery {
  query?: string;
  filters?: Record<string, string | number | boolean | object>[];
  sort?: string;
  limit?: number;
  offset?: number;
  page_token?: string;
}
