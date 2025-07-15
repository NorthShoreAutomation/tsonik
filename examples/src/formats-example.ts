import { Tsonik } from 'tsonik';

/**
 * Example demonstrating format operations
 */
async function formatExamples() {
  const client = new Tsonik({
    appId: 'your-app-id',
    authToken: 'your-auth-token'
  });

  try {
    // List formats for an asset
    const formats = await client.formats.getAssetFormats('asset-id', {
      per_page: 20,
      include_all_versions: false
    });
    console.log(`Found ${formats.data.objects.length} formats`);

    // Get a specific format
    const format = await client.formats.getAssetFormat('asset-id', 'format-id');
    console.log(`Format: ${format.data.name}`);
    console.log(`Status: ${format.data.status}`);
    console.log(`Archive Status: ${format.data.archive_status}`);

    // Create a new format
    const newFormat = await client.formats.createAssetFormat('asset-id', {
      name: 'HD Version',
      status: 'ACTIVE',
      components: [{
        name: 'video-component',
        type: 'VIDEO'
      }]
    });
    console.log(`Created format: ${newFormat.data.id}`);

    // Update a format
    await client.formats.updateAssetFormat('asset-id', 'format-id', {
      name: 'Updated Format Name',
      status: 'ACTIVE'
    });
    console.log('Format updated successfully');

    // Replace a format (PUT operation)
    await client.formats.replaceAssetFormat('asset-id', 'format-id', {
      name: 'Completely New Format',
      status: 'ACTIVE',
      components: [{
        name: 'new-component',
        type: 'VIDEO'
      }]
    });
    console.log('Format replaced successfully');

  } catch (error) {
    console.error('Error in format examples:', error);
  }
}

export { formatExamples };