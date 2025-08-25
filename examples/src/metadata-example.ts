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

    // Get metadata field definition
    console.log('\n--- Getting Metadata Field Definition ---');
    const fieldDefinition = await client.metadata.getMetadataField('title');
    console.log('Field definition:', {
      name: fieldDefinition.data.name,
      type: fieldDefinition.data.field_type,
      label: fieldDefinition.data.label,
      readOnly: fieldDefinition.data.read_only,
      useAsFacet: fieldDefinition.data.use_as_facet
    });

    // Create a custom metadata field
    console.log('\n--- Creating Custom Metadata Field ---');
    const customField = await client.metadata.createMetadataField({
      name: 'ProjectCode',
      label: 'Project Code',
      field_type: 'text',
      read_only: false,
      use_as_facet: true,
      description: 'Unique identifier for the project'
    });
    console.log('Created custom field:', customField.data.name);

    // Get the created field to verify
    const createdFieldCheck = await client.metadata.getMetadataField('ProjectCode');
    console.log('Field verification:', {
      name: createdFieldCheck.data.name,
      label: createdFieldCheck.data.label,
      description: createdFieldCheck.data.description
    });

    // Update the custom field
    console.log('\n--- Updating Custom Metadata Field ---');
    const updatedFieldDef = await client.metadata.patchMetadataField('ProjectCode', {
      label: 'Updated Project Code',
      description: 'Updated description for project identifier',
      use_as_facet: false
    });
    console.log('Updated field:', {
      name: updatedFieldDef.data.name,
      label: updatedFieldDef.data.label,
      description: updatedFieldDef.data.description,
      useAsFacet: updatedFieldDef.data.use_as_facet
    });

    // Use the custom field to set metadata on the asset
    console.log('\n--- Using Custom Field in Metadata ---');
    await client.metadata.putMetadata(
      'assets',
      asset.data.id,
      {
        metadata_values: {
          'ProjectCode': {
            field_values: [{ value: 'PROJ-2024-001' }],
            mode: 'overwrite'
          }
        }
      }
    );
    console.log('Applied custom field metadata to asset');

    // Get final metadata to show the custom field in use
    const finalMetadata = await client.metadata.getMetadata(
      'assets',
      asset.data.id
    );
    console.log('Final metadata with custom field:', finalMetadata.data.metadata_values);

    // Create additional field types for demonstration
    console.log('\n--- Creating Different Field Types ---');
    
    // Tag cloud field
    const tagField = await client.metadata.createMetadataField({
      name: 'Keywords',
      label: 'Content Keywords',
      field_type: 'tag_cloud',
      read_only: false,
      use_as_facet: true,
      description: 'Keywords for content discovery'
    });
    console.log('Created tag field:', tagField.data.name);

    // Boolean field
    const boolField = await client.metadata.createMetadataField({
      name: 'IsApproved',
      label: 'Content Approved',
      field_type: 'boolean',
      read_only: false,
      use_as_facet: false,
      description: 'Whether content has been approved for publication'
    });
    console.log('Created boolean field:', boolField.data.name);

    // Number field  
    const numberField = await client.metadata.createMetadataField({
      name: 'VideoDuration',
      label: 'Video Duration (seconds)',
      field_type: 'number',
      read_only: true,
      use_as_facet: false,
      description: 'Video duration in seconds'
    });
    console.log('Created number field:', numberField.data.name);

  } catch (error) {
    console.error('Error in metadata examples:', error);
    
    // Handle specific field creation errors
    if (error instanceof Error && error.message.includes('already exists')) {
      console.log('Note: Some fields may already exist, which is expected.');
    }
  }
}

export { metadataExamples };