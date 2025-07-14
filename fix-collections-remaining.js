#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// Path to the file we want to fix
const filePath = path.join(__dirname, 'src/__tests__/collections.integration.test.ts');

// Read the file content
let content = fs.readFileSync(filePath, 'utf8');

// Fix pattern 1: Console log with error.message
content = content.replace(
  /console\.log\('Validation error caught as expected:', error\.message\);/g,
  `// Type guard to safely access error properties
        const errorMessage = error instanceof Error ? error.message : 
          (typeof error === 'object' && error !== null && 'message' in error && typeof error.message === 'string') 
            ? error.message 
            : 'Unknown error';
        console.log('Validation error caught as expected:', errorMessage);`
);

// Fix pattern 2: Unsafe assignment of an `any` value
content = content.replace(
  /let testCollectionId: string;/g,
  `let testCollectionId = '';`
);

// Fix pattern 3: Other console.log with error.message
content = content.replace(
  /console\.log\('(.*)', error\.message\);/g,
  `// Type guard to safely access error properties
        const errorMessage = error instanceof Error ? error.message : 
          (typeof error === 'object' && error !== null && 'message' in error && typeof error.message === 'string') 
            ? error.message 
            : 'Unknown error';
        console.log('$1', errorMessage);`
);

// Write the fixed content back to the file
fs.writeFileSync(filePath, content, 'utf8');

console.log('Fixed remaining issues in collections.integration.test.ts successfully!');
