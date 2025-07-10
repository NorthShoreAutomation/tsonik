/**
 * Debug script to test asset creation specifically
 */
require('dotenv').config();
const { IconikClient } = require('./dist/client');
const { DEFAULT_CONFIG } = require('./dist/config');

async function debugAssetCreation() {
  console.log('🎯 Debug Asset Creation API Call');
  
  const config = {
    appId: process.env.ICONIK_APP_ID,
    authToken: process.env.ICONIK_AUTH_TOKEN,
    baseUrl: process.env.ICONIK_BASE_URL || DEFAULT_CONFIG.baseUrl
  };

  console.log('📋 Using Base URL:', config.baseUrl);
  console.log('🔍 Expected POST URL:', config.baseUrl + '/API/assets/v1/assets');
  console.log('');

  try {
    const client = new IconikClient(config);
    
    // Test 1: Try 'ASSET' type (valid per API error message)
    console.log('🚀 Test 1: Creating asset with type "ASSET"...');
    const validAsset = {
      title: 'Debug Test Asset - Valid Type',
      type: 'ASSET'
    };
    
    console.log('📦 Payload:', JSON.stringify(validAsset, null, 2));
    
    const result = await client.assets.createAsset(validAsset);
    console.log('✅ Asset creation successful!');
    console.log('📊 Result:', result);
    
    // Clean up - delete the test asset
    if (result.data && result.data.id) {
      console.log('🧹 Cleaning up test asset...');
      await client.assets.deleteAsset(result.data.id);
      console.log('✅ Test asset deleted');
    }
    
  } catch (error) {
    console.error('❌ Asset creation failed');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    console.error('Error status:', error.status);
    
    // Log the complete error object structure
    console.error('\n🔍 Complete Error Analysis:');
    console.error('- Error keys:', Object.keys(error));
    console.error('- Error statusCode:', error.statusCode);
    
    // Access response data from IconikAPIError.response property
    if (error.response) {
      console.error('\n📋 Response Data (error.response):');
      console.error(JSON.stringify(error.response, null, 2));
      
      // Special handling for type errors
      if (error.response.errors && error.response.errors.type) {
        console.error('\n🎯 Type Validation Errors:');
        console.error('Type errors array:', error.response.errors.type);
        if (Array.isArray(error.response.errors.type)) {
          error.response.errors.type.forEach((typeError, index) => {
            console.error(`  ${index + 1}. ${typeError}`);
          });
        }
      }
    }
    
    // Try to get more detailed error info from the response
    if (error.response) {
      console.error('\n📡 HTTP Response Details:');
      console.error('- Status:', error.response.status);
      console.error('- Status Text:', error.response.statusText);
      console.error('- Response Data:');
      console.error(JSON.stringify(error.response.data, null, 2));
    }
    
    // Try to access the original axios error
    if (error.cause) {
      console.error('\n🔗 Original Cause:');
      console.error(error.cause);
    }
  }
}

debugAssetCreation().catch(console.error);
