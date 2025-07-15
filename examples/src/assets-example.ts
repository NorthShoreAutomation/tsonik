import { Tsonik } from 'tsonik';

/**
 * Example demonstrating asset operations
 */
async function assetExamples() {
  // Initialize the client
  const client = new Tsonik({
    appId: 'your-app-id',
    authToken: 'your-auth-token'
  });

  try {
    // Get all assets with pagination
    const assets = await client.assets.listAssets({
      limit: 50,
      offset: 0
    });
    console.log(`Found ${assets.data.objects.length} assets`);

    // List assets with filters
    const filteredAssets = await client.assets.listAssets({
      limit: 20,
      offset: 0,
      sort: 'date_created',
      filter: { status: 'ACTIVE' }
    });
    console.log(`Filtered assets: ${filteredAssets.data.objects.length}`);

    // Create a new asset
    const newAsset = await client.assets.createAsset({
      title: 'My Video File',
      type: 'ASSET',
      description: 'A sample video file',
      category: 'video'
    });
    console.log(`Created asset: ${newAsset.data.id}`);

    // Get a single asset
    const asset = await client.assets.getAsset(newAsset.data.id);
    console.log(`Asset title: ${asset.data.title}`);
    console.log(`Asset type: ${asset.data.type}`);
    console.log(`Created: ${asset.data.created_date}`);

    // Update an asset
    await client.assets.updateAsset(asset.data.id, {
      title: 'Updated Title',
      description: 'Updated description',
      category: 'updated-category',
      tags: ['tag1', 'tag2']
    });
    console.log('Asset updated successfully');

    // Delete an asset (commented out to avoid deleting during testing)
    // await client.assets.deleteAsset(asset.data.id);
    // console.log('Asset deleted successfully');

  } catch (error) {
    console.error('Error in asset examples:', error);
  }
}

// Export for potential use
export { assetExamples };