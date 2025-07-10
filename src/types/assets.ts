/**
 * Asset-related type definitions
 */

export interface Asset {
  id: string;
  title: string;
  description?: string;
  created_date: string;
  modified_date: string;
  status: string;
  type: string;
  metadata?: Record<string, any>;
}
