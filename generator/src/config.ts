/**
 * Configuration for the N8N node generator
 */

export interface GeneratorConfig {
  // Output configuration
  outputDir: string;
  packageName: string;
  packageVersion: string;
  
  // Repository configuration
  targetRepo: {
    owner: string;
    repo: string;
    branch: string;
  };
  
  // Licensing configuration
  license: {
    type: string; // 'MIT', 'Apache-2.0', 'GPL-3.0', etc.
    holder: string; // Copyright holder
    year: number;
    customText?: string; // Custom license text if needed
  };
  
  // Author information
  author: {
    name: string;
    email: string;
    url?: string;
  };
  
  // Generation options
  generation: {
    includeTests: boolean;
    includeDocumentation: boolean;
    includeExamples: boolean;
    resourceFilter?: string[]; // Only generate specific resources
  };
}

export const DEFAULT_CONFIG: GeneratorConfig = {
  outputDir: './generated-nodes',
  packageName: 'n8n-nodes-iconik',
  packageVersion: '1.0.0',
  
  targetRepo: {
    owner: 'your-org',
    repo: 'n8n-nodes-iconik',
    branch: 'main'
  },
  
  license: {
    type: 'MIT',
    holder: 'Your Organization',
    year: new Date().getFullYear()
  },
  
  author: {
    name: 'Your Name',
    email: 'your.email@example.com'
  },
  
  generation: {
    includeTests: true,
    includeDocumentation: true,
    includeExamples: false
  }
};

/**
 * Load configuration from environment variables or config file
 */
export function loadConfig(): GeneratorConfig {
  // TODO: Load from environment variables and config file
  return {
    ...DEFAULT_CONFIG,
    license: {
      ...DEFAULT_CONFIG.license,
      type: process.env.LICENSE_TYPE || DEFAULT_CONFIG.license.type,
      holder: process.env.LICENSE_HOLDER || DEFAULT_CONFIG.license.holder,
      year: parseInt(process.env.LICENSE_YEAR || DEFAULT_CONFIG.license.year.toString())
    },
    author: {
      ...DEFAULT_CONFIG.author,
      name: process.env.AUTHOR_NAME || DEFAULT_CONFIG.author.name,
      email: process.env.AUTHOR_EMAIL || DEFAULT_CONFIG.author.email
    }
  };
}