/**
 * Jest setup for integration tests.
 * This file runs before all integration tests.
 */

// Load environment variables from .env file
require('dotenv').config();

// Set a longer timeout for integration tests that may make real API calls
jest.setTimeout(30000);

// Check for required environment variables and warn if missing
if (!process.env.ICONIK_APP_ID || !process.env.ICONIK_AUTH_TOKEN) {
  console.warn('⚠️  Integration tests may be skipped due to missing environment variables.');
  console.warn('   Copy .env.example to .env and fill in your Iconik credentials.');
  console.warn('   Required: ICONIK_APP_ID and ICONIK_AUTH_TOKEN');
  console.warn('');
}

// Log integration test configuration
if (process.env.ICONIK_APP_ID && process.env.ICONIK_AUTH_TOKEN) {
  console.log('✅ Integration test environment configured');
  console.log(`   Base URL: ${process.env.ICONIK_BASE_URL || 'https://api.iconik.io'}`);
  console.log(`   App ID: ${process.env.ICONIK_APP_ID?.substring(0, 8)}...`);
  console.log('');
}

// Global test helpers can be added here
global.testHelpers = {
  // Add any shared test utilities here
};

// Global error handler for unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
