import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
  NodeConnectionType,
} from "n8n-workflow";

import { Tsonik, IconikAuthError, IconikAPIError } from "tsonik";
import { validateNodeLicense } from "../../utils/licenseValidation";

export class IconikAsset implements INodeType {
  description: INodeTypeDescription = {
    displayName: "Iconik Asset",
    name: "asset",
    icon: "file:iconik.svg",
    group: ["transform"],
    version: 4,
    subtitle: '={{$parameter["operation"]}}',
    description: "Manage Iconik asset",
    defaults: {
      name: "Iconik Asset",
    },
    inputs: [NodeConnectionType.Main],
    outputs: [NodeConnectionType.Main],
    credentials: [
      {
        name: "iconikApi",
        required: true,
      },
    ],
    properties: [
      {
        displayName: "Operation",
        name: "operation",
        type: "options",
        noDataExpression: true,
        options: [
          {
            name: "Get Asset",
            value: "getAsset",
            description: "Get a single asset by ID",
            action: "Get a single asset by ID",
          },
          {
            name: "List Assets",
            value: "listAssets",
            description: "List assets with optional filters",
            action: "List assets with optional filters",
          },
          {
            name: "Create Asset",
            value: "createAsset",
            description: "Create a new asset",
            action: "Create a new asset",
          },
          {
            name: "Update Asset",
            value: "updateAsset",
            description: "Update an asset",
            action: "Update an asset",
          },
          {
            name: "Delete Asset",
            value: "deleteAsset",
            description: "Delete an asset",
            action: "Delete an asset",
          },
        ],
        default: "getAsset",
      },
      {
        displayName: "Id",
        name: "id",
        type: "string",
        required: true,
        displayOptions: {
          show: {
            operation: ["getAsset"],
          },
        },
        default: "",
        description: "Id",
      },
      {
        displayName: "Params",
        name: "params",
        type: "string",
        required: false,
        displayOptions: {
          show: {
            operation: ["listAssets"],
          },
        },
        default: "",
        description: "Params",
      },
      {
        displayName: "Asset Data",
        name: "assetData",
        type: "string",
        required: true,
        displayOptions: {
          show: {
            operation: ["createAsset"],
          },
        },
        default: "",
        description: "Asset Data",
      },
      {
        displayName: "Id",
        name: "id",
        type: "string",
        required: true,
        displayOptions: {
          show: {
            operation: ["updateAsset"],
          },
        },
        default: "",
        description: "Id",
      },
      {
        displayName: "Asset Data",
        name: "assetData",
        type: "string",
        required: true,
        displayOptions: {
          show: {
            operation: ["updateAsset"],
          },
        },
        default: "",
        description: "Asset Data",
      },
      {
        displayName: "Id",
        name: "id",
        type: "string",
        required: true,
        displayOptions: {
          show: {
            operation: ["deleteAsset"],
          },
        },
        default: "",
        description: "Id",
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    // Validate license and get credentials
    await validateNodeLicense(this);
    const credentials = await this.getCredentials("iconikApi")!;

    console.log(' ---- this is just a test -----')

    // Initialize Tsonik client
    const client = new Tsonik({
      appId: credentials.appId as string,
      authToken: credentials.authToken as string,
      baseUrl: credentials.baseURL as string,
    });

    // Process each input item
    for (let i = 0; i < items.length; i++) {
      const operation = this.getNodeParameter("operation", i) as string;

      try {
        let result: any;

        switch (operation) {
          case "getAsset":
            const id_getAsset_0 = this.getNodeParameter("id", i) as string;
            result = await client.assets.getAsset(id_getAsset_0);
            break;

          case "listAssets":
            const params_listAssets_0 = this.getNodeParameter(
              "params",
              i
            ) as any;
            result = await client.assets.listAssets(params_listAssets_0);
            break;

          case "createAsset":
            const assetData_createAsset_0 = this.getNodeParameter(
              "assetData",
              i
            ) as any;
            result = await client.assets.createAsset(assetData_createAsset_0);
            break;

          case "updateAsset":
            const id_updateAsset_0 = this.getNodeParameter("id", i) as string;
            const assetData_updateAsset_1 = this.getNodeParameter(
              "assetData",
              i
            ) as any;
            result = await client.assets.updateAsset(
              id_updateAsset_0,
              assetData_updateAsset_1
            );
            break;

          case "deleteAsset":
            const id_deleteAsset_0 = this.getNodeParameter("id", i) as string;
            result = await client.assets.deleteAsset(id_deleteAsset_0);
            break;

          default:
            throw new NodeOperationError(
              this.getNode(),
              `Unknown operation: ${operation}`
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
            "Authentication failed. Please check your App ID and Auth Token.",
            { itemIndex: i }
          );
        }

        if (error instanceof IconikAPIError) {
          throw new NodeOperationError(
            this.getNode(),
            `Iconik API Error: ${error.message}`,
            {
              itemIndex: i,
              description: "API request failed",
            }
          );
        }

        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        throw new NodeOperationError(
          this.getNode(),
          `Unexpected error: ${errorMessage}`,
          { itemIndex: i }
        );
      }
    }

    return [returnData];
  }
}
