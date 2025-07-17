#!/usr/bin/env node

import { ResourceExtractor } from './extractors/resource-extractor';
import { NodeGenerator } from './generators/node-generator';
import path from 'path';
import fs from 'fs/promises';

/**
 * Main generator function
 */
async function generateN8NNodes() {
  try {
    console.log('🚀 Starting N8N node generation...');

    // Extract resource metadata
    console.log('📖 Extracting resource metadata...');
    const extractor = new ResourceExtractor('src');
    const resources = await extractor.extractAllResources();
    
    console.log(`✅ Found ${resources.length} resources:`);
    resources.forEach(resource => {
      console.log(`  - ${resource.displayName} (${resource.methods.length} methods)`);
    });

    // Generate nodes
    console.log('\n🔨 Generating N8N nodes...');
    const generator = new NodeGenerator('./generated-nodes');
    const { nodes, credentials, packageJson } = await generator.generateNodes(resources);

    // Write files
    console.log('💾 Writing files...');
    const allFiles = [...nodes, ...credentials, packageJson];
    await generator.writeFiles(allFiles);

    console.log(`✅ Generated ${allFiles.length} files:`);
    allFiles.forEach(file => {
      console.log(`  - ${file.path}`);
    });

    // Generate README
    await generateReadme(resources);

    console.log('\n🎉 N8N node generation complete!');
    console.log('📁 Output directory: ./generated-nodes');
    console.log('📚 Next steps:');
    console.log('  1. Review generated files');
    console.log('  2. Run npm install in generated-nodes/');
    console.log('  3. Run npm run build');
    console.log('  4. Test nodes in N8N');

  } catch (error) {
    console.error('❌ Error generating N8N nodes:', error);
    process.exit(1);
  }
}

/**
 * Generate README.md file
 */
async function generateReadme(resources: any[]) {
  const readmeContent = `# N8N Iconik Nodes

Auto-generated N8N nodes for the Iconik API using the [Tsonik](https://github.com/your-org/tsonik) TypeScript library.

## Available Nodes

${resources.map(resource => `### ${resource.displayName}

${resource.description}

**Operations:**
${resource.methods.map(method => `- **${method.displayName}**: ${method.description}`).join('\n')}

`).join('\n')}

## Installation

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Build the nodes:
\`\`\`bash
npm run build
\`\`\`

3. Install in N8N:
\`\`\`bash
# For local development
npm link
\`\`\`

## Configuration

Add your Iconik API credentials in N8N:

1. Go to Settings → Credentials
2. Add new "Iconik API" credential
3. Enter your App ID and Auth Token

## Usage

Add any of the Iconik nodes to your N8N workflow and configure the operations as needed.

## Generated Files

This package was auto-generated from the Tsonik library. Do not edit the generated files directly - they will be overwritten on the next generation.

To make changes:
1. Modify the Tsonik library
2. Re-run the generator
3. Review and merge the changes

## Support

For issues with the nodes, please check:
1. [Tsonik Documentation](https://github.com/your-org/tsonik)
2. [N8N Documentation](https://docs.n8n.io)
3. [Iconik API Documentation](https://app.iconik.io/docs)
`;

  await fs.writeFile('./generated-nodes/README.md', readmeContent);
}

// Run the generator if this file is executed directly
if (require.main === module) {
  generateN8NNodes();
}

export { generateN8NNodes };