/**
 * Configuration interface and default settings for the Iconik API client
 */

export interface IconikConfig {
  /** Your Iconik App ID */
  appId: string;
  /** Your Iconik Auth Token */
  authToken: string;
  /** Base URL for the Iconik API (defaults to production) */
  baseUrl?: string;
  /** Request timeout in milliseconds */
  timeout?: number;
  /** Additional headers to include with requests */
  headers?: Record<string, string>;
  /** Enable debug logging */
  debug?: boolean;
}

export const DEFAULT_CONFIG: Partial<IconikConfig> = {
  baseUrl: 'https://app.iconik.io',
  timeout: 30000,
  debug: false,
} as const;
