#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Function to fix a specific test file
function fixTestFile(fileName) {
  console.log(`Fixing ${fileName}...`);
  
  // Path to the file we want to fix
  const filePath = path.join(__dirname, 'src/__tests__', fileName);
  
  // Read the file content
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace all catch blocks with any type to use unknown type and proper type guards
  content = content.replace(/catch \(error: any\)/g, 'catch (error: unknown)');
  
  // Add type guards for error.message access
  content = content.replace(
    /error\.message/g,
    '(error instanceof Error ? error.message : "Unknown error")'
  );
  
  // Add type guards for error.response access
  content = content.replace(
    /error\.response/g,
    '(typeof error === "object" && error !== null && "response" in error ? error.response : undefined)'
  );
  
  // Add type guards for error.statusCode access
  content = content.replace(
    /error\.statusCode/g,
    '(typeof error === "object" && error !== null && "statusCode" in error ? error.statusCode : undefined)'
  );
  
  // Add type guards for error.status access
  content = content.replace(
    /error\.status/g,
    '(typeof error === "object" && error !== null && "status" in error ? error.status : undefined)'
  );
  
  // Fix unsafe assignments
  content = content.replace(
    /let (\w+): string;/g,
    'let $1 = "";'
  );
  
  // Write the fixed content back to the file
  fs.writeFileSync(filePath, content, 'utf8');
  
  console.log(`Fixed ${fileName} successfully!`);
}

// Fix the collections.integration.test.ts file
fixTestFile('collections.integration.test.ts');

// Fix the files.integration.test.ts file
fixTestFile('files.integration.test.ts');

console.log('All test files fixed successfully!');

// Run ESLint to check if all issues are fixed
try {
  console.log('Running ESLint to verify fixes...');
  execSync('npx eslint "src/__tests__/*.ts" --no-error-on-unmatched-pattern', { stdio: 'inherit' });
  console.log('All TypeScript lint errors fixed successfully!');
} catch (e) {
  console.error('Some TypeScript lint errors still remain. Manual fixes may be required.');
}
