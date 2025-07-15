# Tsonik Maintenance Guide

This document is intended for maintainers of the Tsonik library, explaining the CI/CD pipeline, tools, and maintenance procedures.

## CI/CD Pipeline Overview

Tsonik uses GitHub Actions for CI/CD with several workflows:

### 1. Linting (lint.yml)

- **Trigger**: Push to `main` branch or pull requests
- **Purpose**: Runs ESLint on the codebase
- **Command**: `npm run lint`
- **Configuration**: `.eslintrc.js`

### 2. Unit Tests (unit-tests.yml)

- **Trigger**: Push to `main` branch or pull requests
- **Purpose**: Runs Jest unit tests and verifies code coverage
- **Commands**: `npm run test:unit -- --coverage`
- **Coverage Requirements**: 
  - Resources directory must have >90% statement coverage
  - Coverage reports are uploaded to Codecov
- **Configuration**: `jest.config.js`

### 3. Integration Tests (integration-tests.yml)

- **Trigger**: Push to `main` branch or pull requests
- **Purpose**: Runs integration tests against the live Iconik API
- **Command**: `npm run test:integration`
- **Requirements**: Valid API credentials in GitHub secrets
- **Configuration**: `jest.integration.config.js`

### 4. Semantic Release (semantic-release.yml)

- **Trigger**: Push to `main` branch
- **Purpose**: Automatic versioning and releases based on commit history
- **Key Steps**:
  - Analyzes commit messages using conventional commits
  - Determines version bump (patch/minor/major)
  - Updates CHANGELOG.md
  - Creates GitHub release
  - Publishes to npm
- **Configuration**: `.releaserc.json`

### 5. NPM Publish (npm-publish.yml)

- **Trigger**: New GitHub release created
- **Purpose**: Publishes package to npm
- **Key Steps**:
  - Runs tests
  - Builds the package
  - Publishes to npm registry
- **Requirements**: NPM_TOKEN in GitHub secrets

### 6. Version and Release (version-and-release.yml)

- **Trigger**: Manual workflow dispatch
- **Purpose**: Manual version bumping and release
- **Options**: patch, minor, or major version bump
- **Key Steps**:
  - Runs tests
  - Bumps version in package.json
  - Creates Git tag
  - Pushes changes
  - Creates GitHub release

### 7. CodeQL Analysis (codeql-analysis.yml)

- **Trigger**: Push to `main`, pull requests, and weekly schedule
- **Purpose**: Security analysis
- **Languages**: JavaScript/TypeScript
- **Configuration**: Default CodeQL settings

## Required GitHub Secrets

The following secrets must be configured in the GitHub repository settings:

- **NPM_TOKEN**: npm authentication token for publishing
- **GH_TOKEN**: GitHub token with repo scope for creating releases
- **ICONIK_APP_ID**: Iconik API application ID
- **ICONIK_AUTH_TOKEN**: Iconik API authentication token
- **ICONIK_BASE_URL**: (Optional) Iconik API base URL

## Tools and Utilities

### Semantic Release

- **Purpose**: Automates version management and package publishing
- **Configuration**: `.releaserc.json`
- **Plugins**:
  - @semantic-release/commit-analyzer
  - @semantic-release/release-notes-generator
  - @semantic-release/changelog
  - @semantic-release/npm
  - @semantic-release/git
  - @semantic-release/github

### Size Limit

- **Purpose**: Monitors bundle size
- **Configuration**: `size-limit` section in package.json
- **Commands**: 
  - `npm run size`: Check current bundle size
  - `npm run analyze`: Analyze what's contributing to the size

### TypeDoc

- **Purpose**: Generates API documentation
- **Configuration**: `typedoc.json`
- **Command**: `npm run docs`
- **Output**: `/docs` directory

### ESLint

- **Purpose**: Static code analysis
- **Configuration**: `.eslintrc.js`
- **Commands**:
  - `npm run lint`: Check for issues
  - `npm run lint:fix`: Automatically fix issues

### Jest

- **Purpose**: Testing framework
- **Configuration**: `jest.config.js` and `jest.integration.config.js`
- **Commands**: Various test scripts in package.json

### Dependabot

- **Purpose**: Automated dependency updates
- **Configuration**: `.github/dependabot.yml`
- **Monitoring**: npm packages and GitHub Actions

## Maintenance Procedures

### Adding a New Resource

1. Create the resource TypeScript file in `src/resources/`
2. Define types in `src/types/`
3. Add resource to the client class in `src/client.ts`
4. Export from `src/resources/index.ts`
5. Add comprehensive unit tests in `src/__tests__/resources.test.ts`
6. Add integration tests in `src/__tests__/<resource>.integration.test.ts`
7. Ensure >90% code coverage for the new resource

### Updating Dependencies

1. Review Dependabot PRs regularly
2. Run tests before merging dependency updates
3. Check for breaking changes in major version updates

### Handling Breaking Changes

1. Document breaking changes in commit messages with `BREAKING CHANGE:`
2. Update documentation to reflect the changes
3. Consider providing migration guides for major version changes

### Regular Maintenance Tasks

1. Monitor Codecov reports for coverage regressions
2. Review and address security alerts
3. Update TypeDoc documentation when API changes
4. Keep the CHANGELOG.md updated
5. Regularly run `npm audit` to check for vulnerabilities

## Troubleshooting

### Failed CI Build

1. Check the GitHub Actions logs for specific errors
2. Common issues:
   - Failed tests
   - Coverage below threshold
   - Linting errors
   - Missing environment variables

### Failed Release

1. Verify that commit messages follow conventional commits format
2. Check that required secrets are properly configured
3. Ensure the npm package name is not taken or you have publish rights

### Integration Tests Failures

1. Verify API credentials are valid
2. Check if API endpoints have changed
3. Review rate limiting or quota issues
