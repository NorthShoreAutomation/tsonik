import { BaseResource } from './base';
import { Tsonik } from '../client';
import {
  ApiResponse,
  SearchCriteria,
  SearchDocuments,
  SearchQueryParams
} from '../types';
import { cleanParams } from '../utils';

/**
 * Search resource for interacting with Iconik Search API
 * Handles search operations
 */
export class SearchResource extends BaseResource {
  constructor(client: Tsonik) {
    super(client, '/API/search/v1');
  }

  /**
   * Perform a search using search criteria
   * @param searchCriteria Search criteria and filters
   * @param params Optional query parameters for pagination and URL generation
   * @returns Promise resolving to search results
   */
  async search(
    searchCriteria: SearchCriteria, 
    params?: SearchQueryParams & {
      generate_signed_url?: boolean;
      generate_signed_download_url?: boolean;
      generate_signed_proxy_url?: boolean;
      save_search_history?: boolean;
    }
  ): Promise<ApiResponse<SearchDocuments>> {
    return this.client.post<SearchDocuments>(`${this.basePath}/search/`, searchCriteria, {
      params: cleanParams(params)
    });
  }
}
