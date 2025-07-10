/**
 * Collection-related type definitions
 */

export interface Collection {
  id: string;
  title: string;
  description?: string;
  created_date: string;
  modified_date: string;
  type: string;
}
