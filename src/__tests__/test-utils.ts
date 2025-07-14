/**
 * Shared utilities for integration tests
 * Provides reliable test data setup and cleanup
 */

import { Tsonik } from '../client';
import { Asset } from '../types';

/**
 * Test environment configuration
 */
export interface TestConfig {
  baseUrl: string;
  appId: string;
  authToken: string;
}

/**
 * Test data that gets created and cleaned up
 */
export interface TestData {
  client: Tsonik;
  testAsset: Asset;
  testAssetId: string;
  createdAssetIds: string[];
  createdFormatIds: string[];
  createdFilesetIds: string[];
  createdFileIds: string[];
  createdCollectionIds: string[];
}

/**
 * Get test configuration from environment variables
 * Throws error if not properly configured
 */
export function getTestConfig(): TestConfig {
  const baseUrl = process.env.ICONIK_BASE_URL;
  const appId = process.env.ICONIK_APP_ID;
  const authToken = process.env.ICONIK_AUTH_TOKEN;

  if (!baseUrl || !appId || !authToken) {
    throw new Error(
      'Integration test environment not configured. Required environment variables: ' +
      'ICONIK_BASE_URL, ICONIK_APP_ID, ICONIK_AUTH_TOKEN'
    );
  }

  return { baseUrl, appId, authToken };
}

/**
 * Create a test client
 */
export function createTestClient(config: TestConfig): Tsonik {
  return new Tsonik({
    baseUrl: config.baseUrl,
    appId: config.appId,
    authToken: config.authToken
  });
}

/**
 * Create a test asset for use in integration tests
 */
export async function createTestAsset(client: Tsonik, title: string = 'Integration Test Asset'): Promise<Asset> {
  const assetData = {
    title,
    description: `Test asset created by integration tests at ${new Date().toISOString()}`,
    type: 'ASSET' as const,
    status: 'ACTIVE' as const
  };

  const response = await client.assets.createAsset(assetData);
  if (response.status !== 201) {
    throw new Error(`Failed to create test asset: ${response.status}`);
  }

  return response.data;
}

/**
 * Setup test data for integration tests
 * Creates necessary test assets and returns TestData object
 */
export async function setupTestData(customTitle?: string): Promise<TestData> {
  const config = getTestConfig();
  const client = createTestClient(config);
  
  // Create a test asset
  const testAsset = await createTestAsset(client, customTitle);
  
  return {
    client,
    testAsset,
    testAssetId: testAsset.id,
    createdAssetIds: [testAsset.id],
    createdFormatIds: [],
    createdFilesetIds: [],
    createdFileIds: [],
    createdCollectionIds: []
  };
}

/**
 * Cleanup test data
 * Attempts to delete all created resources
 */
export async function cleanupTestData(testData: TestData): Promise<void> {
  const { client } = testData;

  // Note: The order matters - delete dependent resources first
  
  // Clean up formats (if delete endpoint exists)
  // Formats are typically cleaned up automatically when assets are deleted
  
  // Clean up filesets (if delete endpoint exists)
  // Filesets are typically cleaned up automatically when assets are deleted
  
  // Clean up files (if delete endpoint exists)
  // Files are typically cleaned up automatically when assets are deleted
  
  // Clean up collections
  for (const collectionId of testData.createdCollectionIds) {
    try {
      await client.collections.deleteCollection(collectionId);
      console.log(`Cleaned up test collection: ${collectionId}`);
    } catch (error) {
      console.warn(`Failed to cleanup collection ${collectionId}:`, error);
    }
  }
  
  // Clean up assets last
  for (const assetId of testData.createdAssetIds) {
    try {
      await client.assets.deleteAsset(assetId);
      console.log(`Cleaned up test asset: ${assetId}`);
    } catch (error) {
      console.warn(`Failed to cleanup asset ${assetId}:`, error);
    }
  }
}

/**
 * Ensure test environment is ready
 * Validates that we can connect and perform basic operations
 */
export async function validateTestEnvironment(client: Tsonik): Promise<void> {
  try {
    // Try to list assets to validate connection
    const response = await client.assets.listAssets({ per_page: 1 });
    if (response.status !== 200) {
      throw new Error(`API connection failed with status: ${response.status}`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to validate test environment: ${errorMessage}`);
  }
}

/**
 * Wrapper for integration tests that handles setup and cleanup
 */
export async function withTestData<T>(
  testFn: (testData: TestData) => Promise<T>,
  customTitle?: string
): Promise<T> {
  const testData = await setupTestData(customTitle);
  
  try {
    await validateTestEnvironment(testData.client);
    return await testFn(testData);
  } finally {
    await cleanupTestData(testData);
  }
}

/**
 * Add tracking for created resources
 */
export function trackCreatedFormat(testData: TestData, formatId: string): void {
  testData.createdFormatIds.push(formatId);
}

export function trackCreatedFileset(testData: TestData, filesetId: string): void {
  testData.createdFilesetIds.push(filesetId);
}

export function trackCreatedFile(testData: TestData, fileId: string): void {
  testData.createdFileIds.push(fileId);
}

export function trackCreatedCollection(testData: TestData, collectionId: string): void {
  testData.createdCollectionIds.push(collectionId);
}

export function trackCreatedAsset(testData: TestData, assetId: string): void {
  testData.createdAssetIds.push(assetId);
}