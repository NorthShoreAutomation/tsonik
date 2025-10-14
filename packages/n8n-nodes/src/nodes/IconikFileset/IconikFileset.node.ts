import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
  NodeConnectionType,
} from 'n8n-workflow';

import { Tsonik, IconikAuthError, IconikAPIError } from 'tsonik';
import { validateNodeLicense } from '../../utils/licenseValidation';

export class IconikFileset implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Iconik Fileset',
    name: 'fileset',
    icon: 'file:iconik.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"]}}',
    description: 'Manage Iconik fileset',
    defaults: {
      name: 'Iconik Fileset',
    },
    inputs: [NodeConnectionType.Main],
    outputs: [NodeConnectionType.Main],
    credentials: [
      {
        name: 'iconikApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Get Asset Filesets',
            value: 'getAssetFilesets',
            description: 'Get all file sets for a specific asset',
            action: 'Get all file sets for a specific asset',
          },
        {
            name: 'Get Asset Fileset',
            value: 'getAssetFileset',
            description: 'Get a specific file set for an asset by ID',
            action: 'Get a specific file set for an asset by ID',
          },
        {
            name: 'Create Asset Fileset',
            value: 'createAssetFileset',
            description: 'Create a new file set for an asset',
            action: 'Create a new file set for an asset',
          },
        {
            name: 'Delete Asset Fileset',
            value: 'deleteAssetFileset',
            description: 'Delete a file set for an asset',
            action: 'Delete a file set for an asset',
          },
        {
            name: 'Get File Set Files',
            value: 'getFileSetFiles',
            description: 'Get files from a file set',
            action: 'Get files from a file set',
          }
        ],
        default: 'getAssetFilesets',
      },
      {
        displayName: 'Asset Id',
        name: 'assetId',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            operation: ['getAssetFilesets'],
          },
        },
        default: '',
        description: 'Asset Id',
      },
      {
        displayName: 'Params',
        name: 'params',
        type: 'string',
        required: false,
        displayOptions: {
          show: {
            operation: ['getAssetFilesets'],
          },
        },
        default: '',
        description: 'Params',
      },
      {
        displayName: 'Asset Id',
        name: 'assetId',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            operation: ['getAssetFileset'],
          },
        },
        default: '',
        description: 'Asset Id',
      },
      {
        displayName: 'File Set Id',
        name: 'fileSetId',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            operation: ['getAssetFileset'],
          },
        },
        default: '',
        description: 'File Set Id',
      },
      {
        displayName: 'Asset Id',
        name: 'assetId',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            operation: ['createAssetFileset'],
          },
        },
        default: '',
        description: 'Asset Id',
      },
      {
        displayName: 'Fileset Data',
        name: 'filesetData',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            operation: ['createAssetFileset'],
          },
        },
        default: '',
        description: 'Fileset Data',
      },
      {
        displayName: 'Asset Id',
        name: 'assetId',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            operation: ['deleteAssetFileset'],
          },
        },
        default: '',
        description: 'Asset Id',
      },
      {
        displayName: 'File Set Id',
        name: 'fileSetId',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            operation: ['deleteAssetFileset'],
          },
        },
        default: '',
        description: 'File Set Id',
      },
      {
        displayName: 'Options',
        name: 'options',
        type: 'string',
        required: false,
        displayOptions: {
          show: {
            operation: ['deleteAssetFileset'],
          },
        },
        default: '',
        description: 'Options',
      },
      {
        displayName: 'Asset Id',
        name: 'assetId',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            operation: ['getFileSetFiles'],
          },
        },
        default: '',
        description: 'Asset Id',
      },
      {
        displayName: 'File Set Id',
        name: 'fileSetId',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            operation: ['getFileSetFiles'],
          },
        },
        default: '',
        description: 'File Set Id',
      },
      {
        displayName: 'Options',
        name: 'options',
        type: 'string',
        required: false,
        displayOptions: {
          show: {
            operation: ['getFileSetFiles'],
          },
        },
        default: '',
        description: 'Options',
      }
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    // Validate license and get credentials
    await validateNodeLicense(this);
    const credentials = await this.getCredentials('iconikApi')!;

    // Initialize Tsonik client
    const client = new Tsonik({
      appId: credentials.appId as string,
      authToken: credentials.authToken as string,
      baseUrl: credentials.baseURL as string,
    });

    // Process each input item
    for (let i = 0; i < items.length; i++) {
      const operation = this.getNodeParameter('operation', i) as string;

      try {
        let result: any;

        switch (operation) {
          case 'getAssetFilesets':
            const assetId_getAssetFilesets_0 = this.getNodeParameter('assetId', i) as string;
            const params_getAssetFilesets_1 = this.getNodeParameter('params', i) as any;
            result = await client.filesets.getAssetFilesets(assetId_getAssetFilesets_0, params_getAssetFilesets_1);
            break;

          case 'getAssetFileset':
            const assetId_getAssetFileset_0 = this.getNodeParameter('assetId', i) as string;
            const fileSetId_getAssetFileset_1 = this.getNodeParameter('fileSetId', i) as string;
            result = await client.filesets.getAssetFileset(assetId_getAssetFileset_0, fileSetId_getAssetFileset_1);
            break;

          case 'createAssetFileset':
            const assetId_createAssetFileset_0 = this.getNodeParameter('assetId', i) as string;
            const filesetData_createAssetFileset_1 = this.getNodeParameter('filesetData', i) as any;
            result = await client.filesets.createAssetFileset(assetId_createAssetFileset_0, filesetData_createAssetFileset_1);
            break;

          case 'deleteAssetFileset':
            const assetId_deleteAssetFileset_0 = this.getNodeParameter('assetId', i) as string;
            const fileSetId_deleteAssetFileset_1 = this.getNodeParameter('fileSetId', i) as string;
            const options_deleteAssetFileset_2 = this.getNodeParameter('options', i) as any;
            result = await client.filesets.deleteAssetFileset(assetId_deleteAssetFileset_0, fileSetId_deleteAssetFileset_1, options_deleteAssetFileset_2);
            break;

          case 'getFileSetFiles':
            const assetId_getFileSetFiles_0 = this.getNodeParameter('assetId', i) as string;
            const fileSetId_getFileSetFiles_1 = this.getNodeParameter('fileSetId', i) as string;
            const options_getFileSetFiles_2 = this.getNodeParameter('options', i) as any;
            result = await client.filesets.getFileSetFiles(assetId_getFileSetFiles_0, fileSetId_getFileSetFiles_1, options_getFileSetFiles_2);
            break;

          default:
            throw new NodeOperationError(
              this.getNode(),
              `Unknown operation: ${operation}`,
            );
        }

        // Add result to return data
        returnData.push({
          json: {
            operation,
            success: true,
            data: result.data,
            status: result.status,
            headers: result.headers,
          },
        });

      } catch (error) {
        if (error instanceof IconikAuthError) {
          throw new NodeOperationError(
            this.getNode(),
            'Authentication failed. Please check your App ID and Auth Token.',
            { itemIndex: i },
          );
        }

        if (error instanceof IconikAPIError) {
          throw new NodeOperationError(
            this.getNode(),
            `Iconik API Error: ${error.message}`,
            { 
              itemIndex: i,
              description: 'API request failed',
            },
          );
        }

        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        throw new NodeOperationError(
          this.getNode(),
          `Unexpected error: ${errorMessage}`,
          { itemIndex: i },
        );
      }
    }

    return [returnData];
  }
}