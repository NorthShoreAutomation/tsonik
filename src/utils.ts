/**
 * Utility functions for the Tsonik client
 */

/**
 * Cleans parameters by removing undefined and null values
 * @param params - The parameters object to clean
 * @returns A new object with undefined and null values filtered out
 */
export function cleanParams(params?: unknown): Record<string, unknown> {
  if (!params || typeof params !== 'object') {
    return {};
  }
  
  return Object.fromEntries(
    Object.entries(params as Record<string, unknown>).filter(
      ([_, value]: [string, unknown]) => value !== undefined && value !== null
    )
  );
}