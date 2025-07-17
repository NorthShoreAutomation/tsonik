import { ResourceMetadata, ResourceMethod, ResourceParameter } from '../extractors/resource-extractor';
import path from 'path';
import fs from 'fs/promises';

export interface GeneratedNode {
  fileName: string;
  content: string;
  path: string;
}

export interface GeneratedCredential {
  fileName: string;
  content: string;
  path: string;
}

export interface GeneratedPackage {
  fileName: string;
  content: string;
  path: string;
}

export class NodeGenerator {
  constructor(private outputDir: string = './generated-nodes') {}

  /**
   * Generate all nodes from resource metadata
   */
  async generateNodes(resources: ResourceMetadata[]): Promise<{
    nodes: GeneratedNode[];
    credentials: GeneratedCredential[];
    packageJson: GeneratedPackage;
  }> {
    const nodes: GeneratedNode[] = [];
    const credentials: GeneratedCredential[] = [];

    // Generate individual nodes for each resource
    for (const resource of resources) {
      const node = this.generateNodeFile(resource);
      nodes.push(node);
    }

    // Generate shared credential
    const credential = this.generateCredentialFile();
    credentials.push(credential);

    // Generate package.json
    const packageJson = this.generatePackageJson(resources);

    return { nodes, credentials, packageJson };
  }

  /**
   * Generate a single node file
   */
  private generateNodeFile(resource: ResourceMetadata): GeneratedNode {
    const className = `Iconik${resource.displayName.replace(/\s+/g, '')}`;
    const fileName = `${className}.node.ts`;
    const filePath = `src/nodes/${className}/${fileName}`;

    const content = this.generateNodeContent(resource, className);

    return {
      fileName,
      content,
      path: filePath
    };
  }

  /**
   * Generate node content
   */
  private generateNodeContent(resource: ResourceMetadata, className: string): string {
    const operations = resource.methods.map(method => this.generateOperation(method)).join(',\n        ');
    const properties = this.generateProperties(resource.methods);
    const executionCases = resource.methods.map(method => this.generateExecutionCase(method, resource.name)).join('\n\n          ');

    return `import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
  NodeConnectionType,
} from 'n8n-workflow';

import { Tsonik, IconikAuthError, IconikAPIError } from 'tsonik';

export class ${className} implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Iconik ${resource.displayName}',
    name: '${resource.name}',
    icon: 'file:iconik.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"]}}',
    description: '${resource.description}',
    defaults: {
      name: 'Iconik ${resource.displayName}',
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
          ${operations}
        ],
        default: '${resource.methods[0]?.name || 'get'}',
      },
      ${properties}
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
          ${executionCases}

          default:
            throw new NodeOperationError(
              this.getNode(),
              \`Unknown operation: \${operation}\`,
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
            \`Iconik API Error: \${error.message}\`,
            { 
              itemIndex: i,
              description: 'API request failed',
            },
          );
        }

        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        throw new NodeOperationError(
          this.getNode(),
          \`Unexpected error: \${errorMessage}\`,
          { itemIndex: i },
        );
      }
    }

    return [returnData];
  }
}`;
  }

  /**
   * Generate operation options
   */
  private generateOperation(method: ResourceMethod): string {
    return `{
            name: '${method.displayName}',
            value: '${method.name}',
            description: '${method.description}',
            action: '${method.description}',
          }`;
  }

  /**
   * Generate properties for all methods
   */
  private generateProperties(methods: ResourceMethod[]): string {
    const properties: string[] = [];

    for (const method of methods) {
      for (const param of method.parameters) {
        if (param.name === 'this') continue; // Skip 'this' parameter

        const property = this.generatePropertyForParameter(method, param);
        properties.push(property);
      }
    }

    return properties.join(',\n      ');
  }

  /**
   * Generate property for a method parameter
   */
  private generatePropertyForParameter(method: ResourceMethod, param: ResourceParameter): string {
    const displayName = this.toDisplayName(param.name);
    const required = param.required ? 'true' : 'false';
    const defaultValue = param.defaultValue !== undefined ? JSON.stringify(param.defaultValue) : "''";

    return `{
        displayName: '${displayName}',
        name: '${param.name}',
        type: '${this.mapTypeToN8NType(param.type)}',
        required: ${required},
        displayOptions: {
          show: {
            operation: ['${method.name}'],
          },
        },
        default: ${defaultValue},
        description: '${param.description || displayName}',
      }`;
  }

  /**
   * Generate execution case for a method
   */
  private generateExecutionCase(method: ResourceMethod, resourceName: string): string {
    const parameterAssignments = method.parameters
      .filter(param => param.name !== 'this')
      .map((param, index) => {
        const castType = this.getTypeCast(param.type);
        return `const ${param.name}_${method.name}_${index} = this.getNodeParameter('${param.name}', i)${castType};`;
      })
      .join('\n            ');

    const parameterList = method.parameters
      .filter(param => param.name !== 'this')
      .map((param, index) => `${param.name}_${method.name}_${index}`)
      .join(', ');

    // Map resource names to client properties
    const clientProperty = this.getClientProperty(resourceName);

    return `case '${method.name}':
            ${parameterAssignments}
            result = await client.${clientProperty}.${method.name}(${parameterList});
            break;`;
  }

  /**
   * Map resource name to client property
   */
  private getClientProperty(resourceName: string): string {
    const mapping: Record<string, string> = {
      'asset': 'assets',
      'assets': 'assets',
      'collection': 'collections',
      'collections': 'collections',
      'job': 'jobs',
      'jobs': 'jobs',
      'format': 'formats',
      'formats': 'formats',
      'file': 'files',
      'files': 'files',
      'fileset': 'filesets',
      'filesets': 'filesets',
      'metadata': 'metadata'
    };
    
    return mapping[resourceName.toLowerCase()] || resourceName.toLowerCase();
  }

  /**
   * Get type cast for parameter
   */
  private getTypeCast(tsType: string): string {
    // Handle simple primitive types
    if (tsType === 'string') return ' as string';
    if (tsType === 'number') return ' as number';
    if (tsType === 'boolean') return ' as boolean';
    
    // Handle arrays - for now treat as any since N8N might pass complex data
    if (tsType.includes('[]') || tsType.includes('Array<')) return ' as any';
    
    // Handle union types with undefined (optional parameters)
    if (tsType.includes('|') && tsType.includes('undefined')) {
      const baseType = tsType.split('|')[0].trim();
      if (baseType === 'string') return ' as string | undefined';
      if (baseType === 'number') return ' as number | undefined';
      if (baseType === 'boolean') return ' as boolean | undefined';
      return ' as any';
    }
    
    // Handle object types and complex types
    if (tsType.includes('{') || tsType.includes('interface') || tsType.includes('Record<')) {
      return ' as any';
    }
    
    // Default fallback
    return ' as any';
  }

  /**
   * Map TypeScript type to N8N parameter type
   */
  private mapTypeToN8NType(tsType: string): string {
    if (tsType.includes('string')) return 'string';
    if (tsType.includes('number')) return 'number';
    if (tsType.includes('boolean')) return 'boolean';
    if (tsType.includes('[]')) return 'string'; // Arrays as comma-separated strings
    return 'string';
  }

  /**
   * Generate credential file
   */
  private generateCredentialFile(): GeneratedCredential {
    const content = `import {
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class IconikApi implements ICredentialType {
  name = 'iconikApi';
  displayName = 'Iconik API';
  documentationUrl = 'https://app.iconik.io/docs';
  properties: INodeProperties[] = [
    {
      displayName: 'App ID',
      name: 'appId',
      type: 'string',
      required: true,
      default: '',
      description: 'Your Iconik App ID',
    },
    {
      displayName: 'Auth Token',
      name: 'authToken',
      type: 'string',
      typeOptions: {
        password: true,
      },
      required: true,
      default: '',
      description: 'Your Iconik Auth Token',
    },
    {
      displayName: 'Base URL',
      name: 'baseURL',
      type: 'string',
      required: false,
      default: 'https://app.iconik.io',
      description: 'Iconik Base URL (use default unless using custom instance)',
    },
  ];
}`;

    return {
      fileName: 'IconikApi.credentials.ts',
      content,
      path: 'src/credentials/IconikApi.credentials.ts'
    };
  }

  /**
   * Generate package.json
   */
  private generatePackageJson(resources: ResourceMetadata[]): GeneratedPackage {
    const nodeEntries = resources.map(resource => {
      const className = `Iconik${resource.displayName.replace(/\s+/g, '')}`;
      return `"dist/src/nodes/${className}/${className}.node.js"`;
    }).join(',\n      ');

    const packageJson = {
      name: 'tsonik-nodes',
      version: '1.0.0',
      description: 'N8N nodes for Iconik API',
      keywords: ['n8n-community-node-package'],
      main: 'index.js',
      scripts: {
        build: 'tsc',
        dev: 'tsc --watch',
        format: 'prettier --write src/**/*.ts',
        lint: 'eslint src/**/*.ts',
        lintfix: 'eslint src/**/*.ts --fix',
        test: 'jest'
      },
      files: ['dist'],
      n8n: {
        n8nNodesApiVersion: 1,
        credentials: ['dist/src/credentials/IconikApi.credentials.js'],
        nodes: resources.map(resource => {
          const className = `Iconik${resource.displayName.replace(/\s+/g, '')}`;
          return `dist/src/nodes/${className}/${className}.node.js`;
        })
      },
      dependencies: {
        'n8n-workflow': '^1.0.0',
        'tsonik': '^1.8.0'
      },
      devDependencies: {
        '@types/node': '^20.10.0',
        'typescript': '^5.2.0',
        'eslint': '^8.50.0',
        'prettier': '^3.0.3',
        'jest': '^29.0.0'
      }
    };

    return {
      fileName: 'package.json',
      content: JSON.stringify(packageJson, null, 2),
      path: 'package.json'
    };
  }

  /**
   * Convert camelCase to Display Name
   */
  private toDisplayName(text: string): string {
    return text.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim();
  }

  /**
   * Write generated files to disk
   */
  async writeFiles(files: (GeneratedNode | GeneratedCredential | GeneratedPackage)[]): Promise<void> {
    for (const file of files) {
      const fullPath = path.join(this.outputDir, file.path);
      const dir = path.dirname(fullPath);
      
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(fullPath, file.content);
    }
  }
}