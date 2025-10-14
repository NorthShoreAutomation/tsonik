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

export class IconikCollection implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Iconik Collection',
    name: 'collection',
    icon: 'file:iconik.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"]}}',
    description: 'Manage Iconik collection',
    defaults: {
      name: 'Iconik Collection',
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
            name: 'List Collections',
            value: 'listCollections',
            description: 'Get a list of collections',
            action: 'Get a list of collections',
          },
        {
            name: 'Get Collection',
            value: 'getCollection',
            description: 'Get a single collection by ID',
            action: 'Get a single collection by ID',
          },
        {
            name: 'Create Collection',
            value: 'createCollection',
            description: 'Create a new collection',
            action: 'Create a new collection',
          },
        {
            name: 'Update Collection',
            value: 'updateCollection',
            description: 'Update a collection by ID',
            action: 'Update a collection by ID',
          },
        {
            name: 'Replace Collection',
            value: 'replaceCollection',
            description: 'Replace a collection by ID (PUT operation)',
            action: 'Replace a collection by ID (PUT operation)',
          },
        {
            name: 'Delete Collection',
            value: 'deleteCollection',
            description: 'Delete a collection by ID',
            action: 'Delete a collection by ID',
          }
        ],
        default: 'listCollections',
      },
      {
        displayName: 'Params',
        name: 'params',
        type: 'string',
        required: false,
        displayOptions: {
          show: {
            operation: ['listCollections'],
          },
        },
        default: '',
        description: 'Params',
      },
      {
        displayName: 'Id',
        name: 'id',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            operation: ['getCollection'],
          },
        },
        default: '',
        description: 'Id',
      },
      {
        displayName: 'Collection Data',
        name: 'collectionData',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            operation: ['createCollection'],
          },
        },
        default: '',
        description: 'Collection Data',
      },
      {
        displayName: 'Id',
        name: 'id',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            operation: ['updateCollection'],
          },
        },
        default: '',
        description: 'Id',
      },
      {
        displayName: 'Update Data',
        name: 'updateData',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            operation: ['updateCollection'],
          },
        },
        default: '',
        description: 'Update Data',
      },
      {
        displayName: 'Options',
        name: 'options',
        type: 'string',
        required: false,
        displayOptions: {
          show: {
            operation: ['updateCollection'],
          },
        },
        default: '',
        description: 'Options',
      },
      {
        displayName: 'Id',
        name: 'id',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            operation: ['replaceCollection'],
          },
        },
        default: '',
        description: 'Id',
      },
      {
        displayName: 'Replace Data',
        name: 'replaceData',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            operation: ['replaceCollection'],
          },
        },
        default: '',
        description: 'Replace Data',
      },
      {
        displayName: 'Options',
        name: 'options',
        type: 'string',
        required: false,
        displayOptions: {
          show: {
            operation: ['replaceCollection'],
          },
        },
        default: '',
        description: 'Options',
      },
      {
        displayName: 'Id',
        name: 'id',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            operation: ['deleteCollection'],
          },
        },
        default: '',
        description: 'Id',
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
          case 'listCollections':
            const params_listCollections_0 = this.getNodeParameter('params', i) as any;
            result = await client.collections.listCollections(params_listCollections_0);
            break;

          case 'getCollection':
            const id_getCollection_0 = this.getNodeParameter('id', i) as string;
            result = await client.collections.getCollection(id_getCollection_0);
            break;

          case 'createCollection':
            const collectionData_createCollection_0 = this.getNodeParameter('collectionData', i) as any;
            result = await client.collections.createCollection(collectionData_createCollection_0);
            break;

          case 'updateCollection':
            const id_updateCollection_0 = this.getNodeParameter('id', i) as string;
            const updateData_updateCollection_1 = this.getNodeParameter('updateData', i) as any;
            const options_updateCollection_2 = this.getNodeParameter('options', i) as any;
            result = await client.collections.updateCollection(id_updateCollection_0, updateData_updateCollection_1, options_updateCollection_2);
            break;

          case 'replaceCollection':
            const id_replaceCollection_0 = this.getNodeParameter('id', i) as string;
            const replaceData_replaceCollection_1 = this.getNodeParameter('replaceData', i) as any;
            const options_replaceCollection_2 = this.getNodeParameter('options', i) as any;
            result = await client.collections.replaceCollection(id_replaceCollection_0, replaceData_replaceCollection_1, options_replaceCollection_2);
            break;

          case 'deleteCollection':
            const id_deleteCollection_0 = this.getNodeParameter('id', i) as string;
            result = await client.collections.deleteCollection(id_deleteCollection_0);
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