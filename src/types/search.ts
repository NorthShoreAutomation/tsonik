/**
 * Search-related type definitions
 */

// Based on Swagger API: doc_types enum values
export type DocType = 'assets' | 'collections' | 'segments' | 'saved_searches' | 'saved_search_groups';

// Filter operators (string type in API but commonly AND/OR)
export type FilterOperator = string;

// Sort orders (string type in API but commonly asc/desc)
export type SortOrder = string;

/**
 * Range filter for date/numeric field searches
 * Format: +02:00. Results returned in UTC by default
 */
export interface CriteriaRangeFilter {
  max?: string;
  min?: string;
  /** Format: +02:00. Results returned in UTC by default */
  timezone?: string;
}

/**
 * Individual search term/condition
 */
export interface CriteriaTerm {
  exists?: boolean;
  missing?: boolean;
  name: string;
  range?: CriteriaRangeFilter;
  value?: string;
  value_in?: string[];
}

/**
 * Nested filter structure supporting logical operations
 */
export interface CriteriaFilter {
  filters?: CriteriaFilter[];
  operator: string; // Required in API
  terms?: CriteriaTerm[];
}

/**
 * Faceted search filter
 */
export interface FacetFilter {
  name: string;
  value_in?: string[]; // Optional in API
}

/**
 * Sort configuration
 */
export interface CriteriaSort {
  name: string;
  order?: string; // Optional in API
}

/**
 * Main search criteria interface matching Swagger SearchCriteriaSchema
 */
export interface SearchCriteria {
  doc_types?: DocType[];
  exclude_fields?: string[];
  facets?: string[];
  facets_filters?: FacetFilter[];
  filter?: CriteriaFilter;
  include_fields?: string[];
  metadata_view_id?: string;
  query?: string;
  /** 
   * Used for infinite scroll pagination instead of deprecated scroll API.
   * Accepts a list of sort keys for getting next page from `_sort` key of last object
   */
  search_after?: (string | number | boolean | null)[];
  search_fields?: string[];
  sort?: CriteriaSort[];
}

/**
 * Alias for backward compatibility with original naming
 */
export type SearchRequest = SearchCriteria;

/**
 * Search document result item
 */
export interface SearchDocument {
  date_created?: string; // format: date-time, readOnly
  date_modified?: string; // format: date-time, readOnly
  description?: string;
  id?: string; // format: uuid, readOnly
  metadata?: object;
  object_type: string; // required
  title: string; // required
}

/**
 * Search results response
 */
export interface SearchDocuments {
  facets?: object;
  first_url?: string; // readOnly
  last_url?: string; // readOnly
  next_url?: string; // readOnly
  objects?: SearchDocument[]; // readOnly
  page?: number; // readOnly
  pages?: number; // readOnly
  per_page?: number; // readOnly
  prev_url?: string; // readOnly
  scroll_id?: string; // readOnly
  total?: number; // readOnly
}

/**
 * Search suggestions request
 */
export interface SearchSuggest {
  doc_types?: DocType[];
  field_name: string; // required
  metadata_view_id?: string; // format: uuid
  query: string; // required
}

/**
 * Search suggestion response item
 */
export interface SearchSuggestResponse {
  value?: string;
}

/**
 * Search suggestions response
 */
export interface SearchSuggestsResponse {
  objects?: SearchSuggestResponse[]; // readOnly
}

/**
 * Query parameters for search endpoints
 */
export interface SearchQueryParams {
  page?: number; // default: 1, minimum: 1, maximum: 10000
  per_page?: number; // default: 10, minimum: 0, maximum: 1000
  scroll?: boolean; // deprecated
  scroll_id?: string; // deprecated, format: uuid
  sort?: string; // comma separated list of fieldnames with order (asc/desc)
}
