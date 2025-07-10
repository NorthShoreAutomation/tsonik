/**
 * Search-related type definitions
 */

export interface SearchQuery {
  query?: string;
  filters?: Record<string, any>;
  sort?: string;
  limit?: number;
  offset?: number;
  page_token?: string;
}
