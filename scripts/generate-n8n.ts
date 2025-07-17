#!/usr/bin/env node

/**
 * Script to generate N8N nodes from Tsonik resources
 * This script is part of the build process and generates the n8n-nodes package
 */

import { ResourceExtractor } from '../generator/src/extractors/resource-extractor';
import { NodeGenerator } from '../generator/src/generators/node-generator';
import { execSync } from 'child_process';
import fs from 'fs/promises';
import path from 'path';

const PACKAGES_DIR = './packages/n8n-nodes';

async function main() {
  try {
    console.log('🚀 Generating N8N nodes from Tsonik...');

    // Clean the packages directory
    console.log('🧹 Cleaning packages directory...');
    await fs.rm(PACKAGES_DIR, { recursive: true, force: true });
    await fs.mkdir(PACKAGES_DIR, { recursive: true });

    // Extract resource metadata from tsonik
    console.log('📖 Extracting Tsonik resources...');
    const extractor = new ResourceExtractor('./src');
    const resources = await extractor.extractAllResources();
    
    console.log(`✅ Found ${resources.length} resources:`);
    resources.forEach(resource => {
      console.log(`  - ${resource.displayName} (${resource.methods.length} methods)`);
    });

    // Generate N8N nodes
    console.log('🔨 Generating N8N nodes...');
    const generator = new NodeGenerator(PACKAGES_DIR);
    const { nodes, credentials, packageJson } = await generator.generateNodes(resources);

    // Write all generated files
    console.log('💾 Writing generated files...');
    const allFiles = [...nodes, ...credentials, packageJson];
    await generator.writeFiles(allFiles);

    // Copy iconik.svg to each node directory
    console.log('🎨 Copying assets...');
    for (const resource of resources) {
      const className = `Iconik${resource.displayName.replace(/\s+/g, '')}`;
      const iconPath = path.join(PACKAGES_DIR, `src/nodes/${className}/iconik.svg`);
      const iconDir = path.dirname(iconPath);
      
      await fs.mkdir(iconDir, { recursive: true });
      await fs.copyFile('./assets/iconik.svg', iconPath);
    }

    // Generate package files
    console.log('📦 Generating package files...');
    await generatePackageFiles(resources);

    console.log(`✅ Generated ${allFiles.length} files in ${PACKAGES_DIR}`);
    console.log('🎉 N8N node generation complete!');

  } catch (error) {
    console.error('❌ Error generating N8N nodes:', error);
    process.exit(1);
  }
}

/**
 * Generate additional package files (README, TypeScript config, etc.)
 */
async function generatePackageFiles(resources: any[]) {
  // Generate README
  const readmeContent = `# N8N Iconik Nodes

Auto-generated N8N community nodes for the Iconik API, powered by [Tsonik](https://github.com/your-org/tsonik).

## Installation

\`\`\`bash
npm install n8n-nodes-iconik
\`\`\`

## Available Nodes

${resources.map(resource => `### Iconik ${resource.displayName}

${resource.description}

**Available Operations:**
${resource.methods.map(method => `- **${method.displayName}**: ${method.description}`).join('\n')}
`).join('\n')}

## Configuration

1. Add Iconik API credentials in N8N:
   - Go to **Settings** → **Credentials**
   - Click **Add Credential**
   - Select **Iconik API**
   - Enter your App ID and Auth Token

2. Use any Iconik node in your workflows

## Support

- [Tsonik Documentation](https://github.com/your-org/tsonik)
- [Iconik API Documentation](https://app.iconik.io/docs)
- [N8N Documentation](https://docs.n8n.io)

---

*This package is auto-generated from Tsonik v${getCurrentVersion()}*
`;

  await fs.writeFile(path.join(PACKAGES_DIR, 'README.md'), readmeContent);

  // Generate TypeScript config
  const tsConfig = {
    compilerOptions: {
      target: 'ES2020',
      module: 'commonjs',
      lib: ['ES2020'],
      outDir: './dist',
      rootDir: './src',
      strict: true,
      esModuleInterop: true,
      skipLibCheck: true,
      forceConsistentCasingInFileNames: true,
      declaration: true,
      sourceMap: true,
      resolveJsonModule: true,
      moduleResolution: 'node'
    },
    include: ['src/**/*'],
    exclude: ['node_modules', 'dist']
  };

  await fs.writeFile(
    path.join(PACKAGES_DIR, 'tsconfig.json'), 
    JSON.stringify(tsConfig, null, 2)
  );
}

/**
 * Get current tsonik version from package.json
 */
function getCurrentVersion(): string {
  try {
    const packageJson = require('../package.json');
    return packageJson.version;
  } catch {
    return '1.0.0';
  }
}

// Create iconik.svg if it doesn't exist
async function ensureIconExists() {
  const iconPath = './assets/iconik.svg';
  const iconDir = path.dirname(iconPath);
  
  await fs.mkdir(iconDir, { recursive: true });
  
  try {
    await fs.access(iconPath);
  } catch {
    // Create a simple SVG icon
    const iconContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="10" fill="#2563eb"/>
  <text x="50" y="60" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="32" font-weight="bold">I</text>
</svg>`;
    await fs.writeFile(iconPath, iconContent);
  }
}

// Run the script
if (require.main === module) {
  ensureIconExists().then(() => main());
}

export { main as generateN8NNodes };