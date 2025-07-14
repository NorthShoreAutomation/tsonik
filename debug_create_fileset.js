const Tsonik = require('./dist/index.js').default;

// Create client
const client = new Tsonik({
  baseURL: process.env.ICONIK_BASE_URL || 'https://tsonvideo.iconik.io',
  appId: process.env.ICONIK_APP_ID,
  authToken: process.env.ICONIK_AUTH_TOKEN
});

async function debugCreateFileset() {
  try {
    // Use an existing asset ID from the tests
    const testAssetId = 'b8e55c56-05e5-11ef-b457-121feac62859';
    
    console.log('Attempting to create fileset with minimal data...');
    
    // Try with just a name
    const minimalData = {
      name: 'Debug Test Fileset'
    };
    
    const response = await client.filesets.createAssetFileset(testAssetId, minimalData);
    console.log('Success:', response);
    
  } catch (error) {
    console.log('\n=== DETAILED ERROR INFORMATION ===');
    console.log('Error Type:', error.constructor.name);
    console.log('Message:', error.message);
    console.log('Status:', error.status);
    
    if (error.details) {
      console.log('API Response Details:', JSON.stringify(error.details, null, 2));
    }
    
    // Try to get more info from the original axios error
    if (error.originalError) {
      console.log('Original Error Response Data:', error.originalError.response?.data);
    }
  }
}

debugCreateFileset();
