# Tsonik NPM Scripts Reference

This document provides a comprehensive reference for all npm scripts available in the Tsonik project.

## Build & Development Scripts

| Script            | Description                                                     |
| ----------------- | --------------------------------------------------------------- |
| `npm run build`   | Cleans the dist directory and compiles TypeScript to JavaScript |
| `npm run dev`     | Runs TypeScript compiler in watch mode for development          |
| `npm run prepare` | Automatically runs build script when installing the package     |

## Testing Scripts

| Script                  | Description                                       |
| ----------------------- | ------------------------------------------------- |
| `npm test`              | Runs all Jest tests                               |
| `npm run test:watch`    | Runs tests in watch mode                          |
| `npm run test:coverage` | Runs tests with coverage reporting                |
| `npm run test:unit`     | Runs only unit tests (excludes integration tests) |
| `npm run test:all`      | Runs both unit and integration tests              |

### Resource-Specific Test Scripts

| Script                     | Description                     |
| -------------------------- | ------------------------------- |
| `npm run test:jobs`        | Runs unit tests for JobResource |
| `npm run test:assets`      | Runs unit tests for assets      |
| `npm run test:collections` | Runs unit tests for collections |

### Integration Test Scripts

| Script                                 | Description                            |
| -------------------------------------- | -------------------------------------- |
| `npm run test:integration`             | Runs all integration tests             |
| `npm run test:integration:watch`       | Runs integration tests in watch mode   |
| `npm run test:integration:jobs`        | Runs integration tests for jobs        |
| `npm run test:integration:assets`      | Runs integration tests for assets      |
| `npm run test:integration:collections` | Runs integration tests for collections |
| `npm run test:integration:filesets`    | Runs integration tests for filesets    |
| `npm run test:integration:files`       | Runs integration tests for files       |
| `npm run test:integration:formats`     | Runs integration tests for formats     |
| `npm run test:integration:metadata`    | Runs integration tests for metadata    |

## Linting Scripts

| Script             | Description                                              |
| ------------------ | -------------------------------------------------------- |
| `npm run lint`     | Runs ESLint on all TypeScript files                      |
| `npm run lint:fix` | Runs ESLint and automatically fixes issues when possible |

## Documentation Scripts

| Script              | Description                                |
| ------------------- | ------------------------------------------ |
| `npm run docs`      | Generates API documentation using TypeDoc  |
| `npm run changelog` | Generates or updates the CHANGELOG.md file |

## Bundle Analysis Scripts

| Script            | Description                                 |
| ----------------- | ------------------------------------------- |
| `npm run size`    | Checks the bundle size against limits       |
| `npm run analyze` | Analyzes what's contributing to bundle size |

## Security Scripts

| Script             | Description                                          |
| ------------------ | ---------------------------------------------------- |
| `npm run security` | Runs npm audit for high and critical vulnerabilities |

## Release Scripts

| Script                   | Description                                                       |
| ------------------------ | ----------------------------------------------------------------- |
| `npm run prepublishOnly` | Runs before npm publish, ensures code is linted, tested and built |

## Common Use Cases

### Initial Setup

```bash
npm install
```

### Development Loop

```bash
npm run dev       # Watch for changes
npm run test:watch  # Run tests on change
```

### Before Committing

```bash
npm run lint:fix   # Fix linting issues
npm test           # Make sure tests pass
```

### Preparing a Release

```bash
npm run changelog  # Update changelog
npm run docs       # Update documentation
```

### Analyzing Package Size

```bash
npm run size       # Check bundle size
npm run analyze    # Analyze size in detail
```

### Running Security Checks

```bash
npm run security   # Check for vulnerabilities
```
