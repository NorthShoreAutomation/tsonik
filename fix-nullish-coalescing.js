#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// Path to the file we want to fix
const filePath = path.join(__dirname, 'src/__tests__/formats.integration.test.ts');

// Read the file content
let content = fs.readFileSync(filePath, 'utf8');

// Replace `statusCode || 500` with `statusCode ?? 500`
content = content.replace(/statusCode \|\| 500/g, 'statusCode ?? 500');

// Write the fixed content back to the file
fs.writeFileSync(filePath, content, 'utf8');

console.log('Fixed nullish coalescing in formats.integration.test.ts successfully!');
