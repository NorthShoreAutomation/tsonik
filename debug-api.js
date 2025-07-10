/**
 * Debug script to test API endpoint construction and authentication
 */
require('dotenv').config();
const { IconikClient } = require('./dist/client');
const { DEFAULT_CONFIG } = require('./dist/config');

async function debugAPI() {
  console.log('🔍 Debug API Configuration');
  console.log('Environment variables:');
  console.log('- ICONIK_APP_ID:', process.env.ICONIK_APP_ID ? '✅ Set' : '❌ Not set');
  console.log('- ICONIK_AUTH_TOKEN:', process.env.ICONIK_AUTH_TOKEN ? '✅ Set' : '❌ Not set');
  console.log('- ICONIK_BASE_URL:', process.env.ICONIK_BASE_URL || 'Using default');
  console.log('');

  console.log('📋 Default Config:', DEFAULT_CONFIG);
  console.log('');

  const config = {
    appId: process.env.ICONIK_APP_ID,
    authToken: process.env.ICONIK_AUTH_TOKEN,
    baseUrl: process.env.ICONIK_BASE_URL || DEFAULT_CONFIG.baseUrl
  };

  console.log('📋 Client Configuration:');
  console.log('- Base URL:', config.baseUrl);
  console.log('- App ID:', config.appId?.substring(0, 8) + '...');
  console.log('- Auth Token:', config.authToken ? 'Set (' + config.authToken.length + ' chars)' : 'Not set');
  console.log('');

  try {
    const client = new IconikClient(config);
    console.log('✅ Client created successfully');
    
    // Try to list assets (should be a simple GET request)
    console.log('🚀 Testing simple asset list API call...');
    console.log('Expected URL: ' + config.baseUrl + '/API/assets/v1/assets');
    
    const result = await client.assets.listAssets();
    console.log('✅ API call successful!');
    console.log('Result:', result);
    
  } catch (error) {
    console.error('❌ API call failed');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    if (error.status) {
      console.error('HTTP Status:', error.status);
    }
    if (error.data) {
      console.error('Response data:', JSON.stringify(error.data, null, 2));
    }
  }
}

debugAPI().catch(console.error);
