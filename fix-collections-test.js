#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// Path to the file we want to fix
const filePath = path.join(__dirname, 'src/__tests__/collections.integration.test.ts');

// Read the file content
let content = fs.readFileSync(filePath, 'utf8');

// Fix pattern 1: Error response status checks
content = content.replace(
  /} catch \(error: any\) {\s*\/\/ Test passes if an error is thrown, regardless of the specific error\s*\/\/ The important part is that an error occurred rather than succeeding\s*if \(error\.response\?\.status\) {\s*expect\(error\.response\.status\)\.toBe\(404\);\s*} else {\s*console\.warn\('Error without response status:', error\.message\);\s*}/g,
  `} catch (error: unknown) {
        // Test passes if an error is thrown, regardless of the specific error
        // The important part is that an error occurred rather than succeeding
        
        // Type guard for response object
        type ErrorWithResponse = {
          response?: { status?: number };
          message?: string;
        };
        
        const hasResponse = (err: unknown): err is ErrorWithResponse => {
          return typeof err === 'object' && err !== null && 
            'response' in err && 
            typeof err.response === 'object' && 
            err.response !== null;
        };
        
        if (hasResponse(error) && error.response?.status) {
          expect(error.response.status).toBe(404);
        } else {
          // Safe access to message if it exists
          const errorMessage = error instanceof Error ? error.message : 
            (typeof error === 'object' && error !== null && 'message' in error && typeof error.message === 'string') 
              ? error.message 
              : 'Unknown error';
          
          console.warn('Error without response status:', errorMessage);
        }`
);

// Fix pattern 2: Simple error message checks
content = content.replace(
  /} catch \(error: any\) {\s*expect\(error\.message\)\.toEqual\(['"](.*)['"]\);/g,
  `} catch (error: unknown) {
        // Type guard to safely access error properties
        if (error instanceof Error) {
          expect(error.message).toEqual('$1');
        } else {
          fail('Caught error is not an Error instance');
        }`
);

// Fix pattern 3: Error message checks with contains
content = content.replace(
  /} catch \(error: any\) {\s*expect\(error\.message\)\.toContain\(['"](.*)['"]\);/g,
  `} catch (error: unknown) {
        // Type guard to safely access error properties
        if (error instanceof Error) {
          expect(error.message).toContain('$1');
        } else {
          fail('Caught error is not an Error instance');
        }`
);

// Write the fixed content back to the file
fs.writeFileSync(filePath, content, 'utf8');

console.log('Fixed collections.integration.test.ts successfully!');
