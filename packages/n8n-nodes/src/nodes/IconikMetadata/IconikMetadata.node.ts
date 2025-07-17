import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
  NodeConnectionType,
} from 'n8n-workflow';

import { Tsonik, IconikAuthError, IconikAPIError } from 'tsonik';

export class IconikMetadata implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Iconik Metadata',
    name: 'metadata',
    icon: 'file:iconik.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"]}}',
    description: 'Manage Iconik metadata',
    defaults: {
      name: 'Iconik Metadata',
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
            name: 'Get Metadata',
            value: 'getMetadata',
            description: 'Get metadata for a specific object',
            action: 'Get metadata for a specific object',
          },
        {
            name: 'Put Metadata',
            value: 'putMetadata',
            description: 'Update metadata for a specific object',
            action: 'Update metadata for a specific object',
          }
        ],
        default: 'getMetadata',
      },
      {
        displayName: 'Object Type',
        name: 'objectType',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            operation: ['getMetadata'],
          },
        },
        default: '',
        description: 'Object Type',
      },
      {
        displayName: 'Object Id',
        name: 'objectId',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            operation: ['getMetadata'],
          },
        },
        default: '',
        description: 'Object Id',
      },
      {
        displayName: 'Params',
        name: 'params',
        type: 'string',
        required: false,
        displayOptions: {
          show: {
            operation: ['getMetadata'],
          },
        },
        default: '',
        description: 'Params',
      },
      {
        displayName: 'Object Type',
        name: 'objectType',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            operation: ['putMetadata'],
          },
        },
        default: '',
        description: 'Object Type',
      },
      {
        displayName: 'Object Id',
        name: 'objectId',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            operation: ['putMetadata'],
          },
        },
        default: '',
        description: 'Object Id',
      },
      {
        displayName: 'Metadata Data',
        name: 'metadataData',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            operation: ['putMetadata'],
          },
        },
        default: '',
        description: 'Metadata Data',
      },
      {
        displayName: 'Params',
        name: 'params',
        type: 'string',
        required: false,
        displayOptions: {
          show: {
            operation: ['putMetadata'],
          },
        },
        default: '',
        description: 'Params',
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
          case 'getMetadata':
            const objectType_getMetadata_0 = this.getNodeParameter('objectType', i) as string;
            const objectId_getMetadata_1 = this.getNodeParameter('objectId', i) as string;
            const params_getMetadata_2 = this.getNodeParameter('params', i) as any;
            result = await client.metadata.getMetadata(objectType_getMetadata_0, objectId_getMetadata_1, params_getMetadata_2);
            break;

          case 'putMetadata':
            const objectType_putMetadata_0 = this.getNodeParameter('objectType', i) as string;
            const objectId_putMetadata_1 = this.getNodeParameter('objectId', i) as string;
            const metadataData_putMetadata_2 = this.getNodeParameter('metadataData', i) as any;
            const params_putMetadata_3 = this.getNodeParameter('params', i) as any;
            result = await client.metadata.putMetadata(objectType_putMetadata_0, objectId_putMetadata_1, metadataData_putMetadata_2, params_putMetadata_3);
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