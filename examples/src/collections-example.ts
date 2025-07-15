import { Tsonik } from 'tsonik';

/**
 * Example demonstrating collection operations
 */
async function collectionExamples() {
  const client = new Tsonik({
    appId: 'your-app-id',
    authToken: 'your-auth-token'
  });

  try {
    // List collections
    const collections = await client.collections.listCollections({
      per_page: 20,
      page: 1
    });
    console.log(`Found ${collections.data.objects.length} collections`);

    // Create a new collection
    const collection = await client.collections.createCollection({
      title: 'Q4 Marketing Assets',
      category: 'marketing'
    });
    console.log(`Created collection: ${collection.data.id}`);

    // Get a specific collection
    const retrievedCollection = await client.collections.getCollection(collection.data.id);
    console.log(`Collection: ${retrievedCollection.data.title}`);

    // Update a collection
    await client.collections.updateCollection(collection.data.id, {
      title: 'Updated Collection Title',
      category: 'updated-marketing'
    });
    console.log('Collection updated successfully');

    // Replace a collection (PUT operation)
    await client.collections.replaceCollection(collection.data.id, {
      title: 'Completely New Collection',
      category: 'new-category'
    });
    console.log('Collection replaced successfully');

    // Delete a collection (commented out for safety)
    // const result = await client.collections.deleteCollection(collection.data.id);
    // console.log('Collection deleted:', result.data);

  } catch (error) {
    console.error('Error in collection examples:', error);
  }
}

export { collectionExamples };