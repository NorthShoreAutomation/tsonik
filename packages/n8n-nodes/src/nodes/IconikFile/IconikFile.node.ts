import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
  NodeConnectionType,
} from 'n8n-workflow';

import { Tsonik, IconikAuthError, IconikAPIError } from 'tsonik';

export class IconikFile implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Iconik File',
    name: 'file',
    icon: 'file:iconik.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"]}}',
    description: 'Manage Iconik file',
    defaults: {
      name: 'Iconik File',
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
            name: 'Get Asset Files',
            value: 'getAssetFiles',
            description: 'Get all files for an asset',
            action: 'Get all files for an asset',
          },
        {
            name: 'Get Asset File',
            value: 'getAssetFile',
            description: 'Get a specific file for an asset by file ID',
            action: 'Get a specific file for an asset by file ID',
          },
        {
            name: 'Create Asset File',
            value: 'createAssetFile',
            description: 'Create a new file and associate it to an asset',
            action: 'Create a new file and associate it to an asset',
          }
        ],
        default: 'getAssetFiles',
      },
      {
        displayName: 'Asset Id',
        name: 'assetId',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            operation: ['getAssetFiles'],
          },
        },
        default: '',
        description: 'Asset Id',
      },
      {
        displayName: 'Options',
        name: 'options',
        type: 'string',
        required: false,
        displayOptions: {
          show: {
            operation: ['getAssetFiles'],
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
            operation: ['getAssetFile'],
          },
        },
        default: '',
        description: 'Asset Id',
      },
      {
        displayName: 'File Id',
        name: 'fileId',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            operation: ['getAssetFile'],
          },
        },
        default: '',
        description: 'File Id',
      },
      {
        displayName: 'Options',
        name: 'options',
        type: 'string',
        required: false,
        displayOptions: {
          show: {
            operation: ['getAssetFile'],
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
            operation: ['createAssetFile'],
          },
        },
        default: '',
        description: 'Asset Id',
      },
      {
        displayName: 'File Data',
        name: 'fileData',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            operation: ['createAssetFile'],
          },
        },
        default: '',
        description: 'File Data',
      }
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    // Get credentials
    const credentials = await this.getCredentials('iconikApi');
    if (!credentials) {
      throw new NodeOperationError(this.getNode(), 'No credentials provided');
    }

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
          case 'getAssetFiles':
            const assetId_getAssetFiles_0 = this.getNodeParameter('assetId', i) as string;
            const options_getAssetFiles_1 = this.getNodeParameter('options', i) as any;
            result = await client.files.getAssetFiles(assetId_getAssetFiles_0, options_getAssetFiles_1);
            break;

          case 'getAssetFile':
            const assetId_getAssetFile_0 = this.getNodeParameter('assetId', i) as string;
            const fileId_getAssetFile_1 = this.getNodeParameter('fileId', i) as string;
            const options_getAssetFile_2 = this.getNodeParameter('options', i) as any;
            result = await client.files.getAssetFile(assetId_getAssetFile_0, fileId_getAssetFile_1, options_getAssetFile_2);
            break;

          case 'createAssetFile':
            const assetId_createAssetFile_0 = this.getNodeParameter('assetId', i) as string;
            const fileData_createAssetFile_1 = this.getNodeParameter('fileData', i) as any;
            result = await client.files.createAssetFile(assetId_createAssetFile_0, fileData_createAssetFile_1);
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