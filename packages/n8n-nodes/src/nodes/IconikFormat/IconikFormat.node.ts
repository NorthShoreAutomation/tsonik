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

export class IconikFormat implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Iconik Format',
    name: 'format',
    icon: 'file:iconik.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"]}}',
    description: 'Manage Iconik format',
    defaults: {
      name: 'Iconik Format',
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
            name: 'Get Asset Formats',
            value: 'getAssetFormats',
            description: 'Get all formats for a specific asset',
            action: 'Get all formats for a specific asset',
          },
        {
            name: 'Get Asset Format',
            value: 'getAssetFormat',
            description: 'Get a specific format for an asset',
            action: 'Get a specific format for an asset',
          },
        {
            name: 'Update Asset Format',
            value: 'updateAssetFormat',
            description: 'Update an existing format for an asset',
            action: 'Update an existing format for an asset',
          },
        {
            name: 'Replace Asset Format',
            value: 'replaceAssetFormat',
            description: 'Replace an existing format for an asset (complete replacement)',
            action: 'Replace an existing format for an asset (complete replacement)',
          },
        {
            name: 'Create Asset Format',
            value: 'createAssetFormat',
            description: 'Create a new format and associate it to an asset',
            action: 'Create a new format and associate it to an asset',
          }
        ],
        default: 'getAssetFormats',
      },
      {
        displayName: 'Asset Id',
        name: 'assetId',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            operation: ['getAssetFormats'],
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
            operation: ['getAssetFormats'],
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
            operation: ['getAssetFormat'],
          },
        },
        default: '',
        description: 'Asset Id',
      },
      {
        displayName: 'Format Id',
        name: 'formatId',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            operation: ['getAssetFormat'],
          },
        },
        default: '',
        description: 'Format Id',
      },
      {
        displayName: 'Asset Id',
        name: 'assetId',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            operation: ['updateAssetFormat'],
          },
        },
        default: '',
        description: 'Asset Id',
      },
      {
        displayName: 'Format Id',
        name: 'formatId',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            operation: ['updateAssetFormat'],
          },
        },
        default: '',
        description: 'Format Id',
      },
      {
        displayName: 'Format Data',
        name: 'formatData',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            operation: ['updateAssetFormat'],
          },
        },
        default: '',
        description: 'Format Data',
      },
      {
        displayName: 'Asset Id',
        name: 'assetId',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            operation: ['replaceAssetFormat'],
          },
        },
        default: '',
        description: 'Asset Id',
      },
      {
        displayName: 'Format Id',
        name: 'formatId',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            operation: ['replaceAssetFormat'],
          },
        },
        default: '',
        description: 'Format Id',
      },
      {
        displayName: 'Format Data',
        name: 'formatData',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            operation: ['replaceAssetFormat'],
          },
        },
        default: '',
        description: 'Format Data',
      },
      {
        displayName: 'Asset Id',
        name: 'assetId',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            operation: ['createAssetFormat'],
          },
        },
        default: '',
        description: 'Asset Id',
      },
      {
        displayName: 'Format Data',
        name: 'formatData',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            operation: ['createAssetFormat'],
          },
        },
        default: '',
        description: 'Format Data',
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
          case 'getAssetFormats':
            const assetId_getAssetFormats_0 = this.getNodeParameter('assetId', i) as string;
            const params_getAssetFormats_1 = this.getNodeParameter('params', i) as any;
            result = await client.formats.getAssetFormats(assetId_getAssetFormats_0, params_getAssetFormats_1);
            break;

          case 'getAssetFormat':
            const assetId_getAssetFormat_0 = this.getNodeParameter('assetId', i) as string;
            const formatId_getAssetFormat_1 = this.getNodeParameter('formatId', i) as string;
            result = await client.formats.getAssetFormat(assetId_getAssetFormat_0, formatId_getAssetFormat_1);
            break;

          case 'updateAssetFormat':
            const assetId_updateAssetFormat_0 = this.getNodeParameter('assetId', i) as string;
            const formatId_updateAssetFormat_1 = this.getNodeParameter('formatId', i) as string;
            const formatData_updateAssetFormat_2 = this.getNodeParameter('formatData', i) as any;
            result = await client.formats.updateAssetFormat(assetId_updateAssetFormat_0, formatId_updateAssetFormat_1, formatData_updateAssetFormat_2);
            break;

          case 'replaceAssetFormat':
            const assetId_replaceAssetFormat_0 = this.getNodeParameter('assetId', i) as string;
            const formatId_replaceAssetFormat_1 = this.getNodeParameter('formatId', i) as string;
            const formatData_replaceAssetFormat_2 = this.getNodeParameter('formatData', i) as any;
            result = await client.formats.replaceAssetFormat(assetId_replaceAssetFormat_0, formatId_replaceAssetFormat_1, formatData_replaceAssetFormat_2);
            break;

          case 'createAssetFormat':
            const assetId_createAssetFormat_0 = this.getNodeParameter('assetId', i) as string;
            const formatData_createAssetFormat_1 = this.getNodeParameter('formatData', i) as any;
            result = await client.formats.createAssetFormat(assetId_createAssetFormat_0, formatData_createAssetFormat_1);
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