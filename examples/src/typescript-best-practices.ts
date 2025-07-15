import { Tsonik } from 'tsonik';
import type { 
  CreateAssetRequest,
  UpdateAssetRequest,
  CreateCollectionRequest,
  JobCreate,
  CreateFormatRequest,
  UpdateMetadataRequest,
  ListParams
} from 'tsonik';

/**
 * Example demonstrating TypeScript best practices with interfaces
 * Shows both inline objects and properly typed interfaces
 */
async function typescriptBestPractices() {
  const client = new Tsonik({
    appId: 'your-app-id',
    authToken: 'your-auth-token'
  });

  try {
    // ✅ GOOD: Using typed interfaces for complex objects
    const assetData: CreateAssetRequest = {
      title: 'Professional Video Asset',
      type: 'ASSET',
      description: 'High-quality marketing video',
      category: 'marketing',
      tags: ['campaign', 'q4', 'video']
    };

    const newAsset = await client.assets.createAsset(assetData);
    console.log(`Created asset: ${newAsset.data.id}`);

    // ✅ GOOD: Using interface for list parameters
    const listParams: ListParams = {
      limit: 100,
      offset: 0,
      sort: 'date_created',
      filter: {
        category: 'marketing',
        status: 'ACTIVE'
      }
    };

    const assets = await client.assets.listAssets(listParams);
    console.log(`Found ${assets.data.objects.length} marketing assets`);

    // ✅ GOOD: Partial updates with interface
    const updateData: UpdateAssetRequest = {
      title: 'Updated Professional Video',
      category: 'updated-marketing'
    };

    await client.assets.updateAsset(newAsset.data.id, updateData);

    // ✅ GOOD: Complex job creation with interface
    const jobData: JobCreate = {
      title: 'Transcode Marketing Video',
      type: 'TRANSCODE',
      status: 'READY',
      custom_type: 'marketing_workflow',
      object_id: newAsset.data.id,
      object_type: 'assets',
      metadata: {
        'encoding.preset': 'high_quality',
        'workflow.priority': 'high'
      }
    };

    const job = await client.jobs.createJob(jobData);
    console.log(`Created job: ${job.data.id}`);

    // ✅ GOOD: Collection with typed interface
    const collectionData: CreateCollectionRequest = {
      title: 'Q4 Marketing Campaign',
      category: 'campaign',
      metadata: {
        'campaign.quarter': 'Q4',
        'campaign.year': '2024'
      }
    };

    const collection = await client.collections.createCollection(collectionData);
    console.log(`Created collection: ${collection.data.id}`);

    // ✅ GOOD: Format creation with components
    const formatData: CreateFormatRequest = {
      name: 'HD Marketing Version',
      status: 'ACTIVE',
      components: [
        {
          name: 'video-track',
          type: 'VIDEO',
          metadata: {
            'video.resolution': '1920x1080',
            'video.codec': 'H.264'
          }
        },
        {
          name: 'audio-track',
          type: 'AUDIO',
          metadata: {
            'audio.codec': 'AAC',
            'audio.bitrate': '192kbps'
          }
        }
      ]
    };

    const format = await client.formats.createAssetFormat(newAsset.data.id, formatData);
    console.log(`Created format: ${format.data.id}`);

    // ✅ GOOD: Complex metadata update with interface
    const metadataUpdate: UpdateMetadataRequest = {
      metadata_values: {
        'dc.title': {
          field_values: [{ value: 'Professional Marketing Video' }],
          mode: 'overwrite'
        },
        'dc.description': {
          field_values: [{ value: 'High-quality video for Q4 campaign' }],
          mode: 'overwrite'
        },
        'custom.campaign': {
          field_values: [{ value: 'Q4-2024' }],
          mode: 'overwrite'
        },
        'custom.budget': {
          field_values: [{ value: '50000' }],
          mode: 'overwrite'
        }
      }
    };

    await client.metadata.putMetadata(
      'assets',
      newAsset.data.id,
      metadataUpdate,
      {
        ignore_unchanged: true
      }
    );

    console.log('Metadata updated with structured approach');

    // ❌ AVOID: Inline objects for complex data (harder to maintain)
    // await client.assets.createAsset({
    //   title: 'Some Asset',
    //   type: 'ASSET',
    //   description: 'Some description',
    //   category: 'some-category',
    //   tags: ['tag1', 'tag2'],
    //   metadata: { ... } // Complex inline object
    // });

  } catch (error) {
    console.error('Error in TypeScript best practices example:', error);
  }
}

// ✅ GOOD: Custom interfaces for business logic
interface MarketingAssetConfig {
  campaignName: string;
  quarter: string;
  targetAudience: string[];
  budget: number;
}

async function createMarketingAsset(
  client: Tsonik, 
  config: MarketingAssetConfig
): Promise<string> {
  const assetData: CreateAssetRequest = {
    title: `${config.campaignName} Asset`,
    type: 'ASSET',
    category: 'marketing',
    description: `Marketing asset for ${config.quarter} campaign`,
    metadata: {
      'campaign.name': config.campaignName,
      'campaign.quarter': config.quarter,
      'campaign.budget': config.budget.toString(),
      'campaign.audience': config.targetAudience.join(',')
    }
  };

  const result = await client.assets.createAsset(assetData);
  return result.data.id;
}

export { 
  typescriptBestPractices, 
  createMarketingAsset,
  type MarketingAssetConfig 
};