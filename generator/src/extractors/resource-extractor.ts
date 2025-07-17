import { Project, ClassDeclaration, MethodDeclaration, ParameterDeclaration } from 'ts-morph';
import { glob } from 'glob';
import path from 'path';

export interface ResourceMethod {
  name: string;
  displayName: string;
  description: string;
  parameters: ResourceParameter[];
  returnType: string;
  httpMethod: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
}

export interface ResourceParameter {
  name: string;
  type: string;
  required: boolean;
  description?: string;
  defaultValue?: any;
}

export interface ResourceMetadata {
  name: string;
  className: string;
  displayName: string;
  description: string;
  methods: ResourceMethod[];
  basePath: string;
}

export class ResourceExtractor {
  private project: Project;

  constructor(private sourceDir: string = 'src') {
    this.project = new Project({
      tsConfigFilePath: path.join(process.cwd(), 'tsconfig.json'),
    });
  }

  /**
   * Extract metadata from all resource files
   */
  async extractAllResources(): Promise<ResourceMetadata[]> {
    const resourceFiles = await glob(`${this.sourceDir}/resources/*.ts`);
    const resources: ResourceMetadata[] = [];

    for (const file of resourceFiles) {
      if (file.includes('base.ts') || file.includes('index.ts')) {
        continue;
      }

      const resource = await this.extractResourceFromFile(file);
      if (resource) {
        resources.push(resource);
      }
    }

    return resources;
  }

  /**
   * Extract resource metadata from a single file
   */
  private async extractResourceFromFile(filePath: string): Promise<ResourceMetadata | null> {
    const sourceFile = this.project.addSourceFileAtPath(filePath);
    const classes = sourceFile.getClasses();

    for (const cls of classes) {
      if (this.isResourceClass(cls)) {
        return this.extractResourceMetadata(cls);
      }
    }

    return null;
  }

  /**
   * Check if a class is a resource class (extends BaseResource)
   */
  private isResourceClass(cls: ClassDeclaration): boolean {
    const baseClass = cls.getExtends();
    return baseClass?.getText() === 'BaseResource';
  }

  /**
   * Extract metadata from a resource class
   */
  private extractResourceMetadata(cls: ClassDeclaration): ResourceMetadata {
    const className = cls.getName()!;
    const resourceName = className.replace('Resource', '').toLowerCase();
    
    // Get constructor to extract basePath
    const constructor = cls.getConstructors()[0];
    const basePath = this.extractBasePath(constructor);

    const methods = cls.getMethods()
      .filter(method => method.hasModifier('async') && method.getScope() === 'public')
      .map(method => this.extractMethodMetadata(method));

    return {
      name: resourceName,
      className,
      displayName: this.toDisplayName(resourceName),
      description: `Manage Iconik ${resourceName}`,
      methods,
      basePath
    };
  }

  /**
   * Extract base path from constructor
   */
  private extractBasePath(constructor: any): string {
    const body = constructor?.getBody();
    if (!body) return '';

    const bodyText = body.getText();
    const match = bodyText.match(/super\(client,\s*['"`]([^'"`]+)['"`]\)/);
    return match ? match[1] : '';
  }

  /**
   * Extract method metadata
   */
  private extractMethodMetadata(method: MethodDeclaration): ResourceMethod {
    const methodName = method.getName();
    const parameters = method.getParameters().map(param => this.extractParameterMetadata(param));
    const returnType = this.extractReturnType(method);

    return {
      name: methodName,
      displayName: this.toDisplayName(methodName),
      description: this.extractMethodDescription(method),
      parameters,
      returnType,
      httpMethod: this.inferHttpMethod(methodName)
    };
  }

  /**
   * Extract parameter metadata
   */
  private extractParameterMetadata(param: ParameterDeclaration): ResourceParameter {
    const name = param.getName();
    const type = param.getType().getText();
    const required = !param.hasQuestionToken() && !param.hasInitializer();
    const defaultValue = param.getInitializer()?.getText();

    return {
      name,
      type,
      required,
      defaultValue: defaultValue ? eval(defaultValue) : undefined
    };
  }

  /**
   * Extract return type from method
   */
  private extractReturnType(method: MethodDeclaration): string {
    const returnType = method.getReturnType().getText();
    const match = returnType.match(/Promise<ApiResponse<(.+?)>>/);
    return match ? match[1] : returnType;
  }

  /**
   * Extract method description from JSDoc
   */
  private extractMethodDescription(method: MethodDeclaration): string {
    const jsDocs = method.getJsDocs();
    if (jsDocs.length > 0) {
      const description = jsDocs[0].getDescription();
      return description.trim();
    }
    
    // Generate description from method name
    const methodName = method.getName();
    if (methodName.startsWith('get')) return `Get ${methodName.substring(3).toLowerCase()}`;
    if (methodName.startsWith('list')) return `List ${methodName.substring(4).toLowerCase()}`;
    if (methodName.startsWith('create')) return `Create ${methodName.substring(6).toLowerCase()}`;
    if (methodName.startsWith('update')) return `Update ${methodName.substring(6).toLowerCase()}`;
    if (methodName.startsWith('delete')) return `Delete ${methodName.substring(6).toLowerCase()}`;
    
    return methodName;
  }

  /**
   * Infer HTTP method from method name
   */
  private inferHttpMethod(methodName: string): 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' {
    if (methodName.startsWith('get') || methodName.startsWith('list')) return 'GET';
    if (methodName.startsWith('create')) return 'POST';
    if (methodName.startsWith('update')) return 'PUT';
    if (methodName.startsWith('patch')) return 'PATCH';
    if (methodName.startsWith('delete')) return 'DELETE';
    return 'GET';
  }

  /**
   * Convert camelCase to Display Name
   */
  private toDisplayName(text: string): string {
    return text.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim();
  }
}