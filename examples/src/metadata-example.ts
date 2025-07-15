import { Tsonik } from 'tsonik';

/**
 * Example demonstrating metadata operations
 */
async function metadataExamples() {
  const client = new Tsonik({
    appId: 'your-app-id',
    authToken: 'your-auth-token'
  });

  try {
    // First create an asset to work with
    const asset = await client.assets.createAsset({
      title: 'Metadata Test Asset',
      type: 'ASSET',
      description: 'Asset for testing metadata operations'
    });

    // Get metadata for an asset
    const metadata = await client.metadata.getMetadata(
      'assets',  // object type
      asset.data.id, // object ID
      {
        check_if_subclip: false,
        include_values_for_deleted_fields: false
      }
    );

    console.log('Metadata:', metadata.data.metadata_values);
    console.log('Object ID:', metadata.data.object_id);
    console.log('Object Type:', metadata.data.object_type);

    // Update metadata
    await client.metadata.putMetadata(
      'assets',  // object type
      asset.data.id, // object ID
      {
        metadata_values: {
          'title': {
            field_values: [{ value: 'New Title via Metadata API' }],
            mode: 'overwrite'
          },
          'description': {
            field_values: [{ value: 'Updated description via metadata' }],
            mode: 'overwrite'
          },
          'custom.project': {
            field_values: [{ value: 'My Project' }],
            mode: 'overwrite'
          }
        }
      },
      {
        ignore_unchanged: true
      }
    );

    console.log('Metadata updated successfully');

    // Get updated metadata
    const updatedMetadata = await client.metadata.getMetadata(
      'assets',
      asset.data.id
    );
    console.log('Updated metadata:', updatedMetadata.data.metadata_values);

  } catch (error) {
    console.error('Error in metadata examples:', error);
  }
}

export { metadataExamples };