# N8N Node Generation Overview

This document explains how N8N nodes are generated from Tsonik resources in this repo.

## High-level Flow
- **Extract resource metadata** from `src/resources/*.ts` using `ts-morph`.
- **Generate sources** for:
  - One N8N node per resource.
  - Two shared credentials: `IconikApi` and `LicenseSpring`.
  - A package.json for the nodes package.
- **Scaffold package files**: README, `tsconfig.json`, `src/utils/licenseValidation.ts`, and copy `assets/iconik.svg` into each node folder.
- **Write outputs** into `packages/n8n-nodes/`.

Key files:
- `scripts/generate-n8n.ts`
- `generator/src/extractors/resource-extractor.ts`
- `generator/src/generators/node-generator.ts`

## Inputs: Resource Extraction
The extractor (`ResourceExtractor`) parses Tsonik resources and emits metadata consumed by the generator.

- File: `generator/src/extractors/resource-extractor.ts`
- Entrypoint: `ResourceExtractor.extractAllResources()`
- Selection:
  - Scans `src/resources/*.ts`, skipping `base.ts` and `index.ts`.
  - A class is considered a resource if it `extends BaseResource`.
- Metadata shape:
  - `ResourceMetadata`: `{ name, className, displayName, description, methods, basePath }`
  - `ResourceMethod`: `{ name, displayName, description, parameters, returnType, httpMethod }`
  - `ResourceParameter`: `{ name, type, required, description?, defaultValue? }`
- Details:
  - **basePath** is extracted from the resource constructor: `super(client, '...')`.
  - **methods** are public async methods; description comes from JSDoc if present, else a name heuristic.
  - **parameters** are typed from TS; `required` is based on `?`/initializer.
  - **returnType** attempts to unwrap `Promise<ApiResponse<T>>`.
  - **httpMethod** is inferred from the method name prefix.

## Generation: Node + Credentials + Package
The generator (`NodeGenerator`) consumes `ResourceMetadata[]` and builds the node files, credentials, and package.json in-memory, then writes them to disk.

- File: `generator/src/generators/node-generator.ts`
- Entrypoint: `NodeGenerator.generateNodes(resources)` returns `{ nodes, credentials, packageJson }`.
- Output locations (relative to `outputDir`):
  - Nodes: `src/nodes/Iconik<DisplayName>/Iconik<DisplayName>.node.ts`
  - Credentials:
    - `src/credentials/IconikApi.credentials.ts`
    - `src/credentials/LicenseSpring.credentials.ts`
  - Package manifest: `package.json`

### Node content generation
- Method: `generateNodeContent(resource, className)`
- Imports: `n8n-workflow`, `tsonik`, and `../../utils/licenseValidation`.
- Description section:
  - `credentials`: requires `iconikApi` and `licenseSpring`.
  - `properties`: builds an `Operation` options field and per-parameter fields.
- Parameters mapping:
  - Built by `generateProperties(methods)` and `generatePropertyForParameter(method, param)`.
  - Field type via `mapTypeToN8NType(tsType)` (strings/numbers/booleans; arrays treated as `string`).
  - Shown only for the selected `operation` via `displayOptions`.
- Execution:
  - Loads `iconikApi` and `licenseSpring` credentials; throws if missing.
  - Validates license via `LicenseValidator.checkLicenseStatus()`.
  - Instantiates `Tsonik` with Iconik creds.
  - Per item, switches on `operation` and calls `client.<resource>.<method>(...params)`.
  - Resource mapping via `getClientProperty(resourceName)` (e.g., `asset` → `assets`).
  - Wraps responses to `INodeExecutionData` and handles `IconikAuthError`/`IconikAPIError` distinctly.

### Credentials generation
- `generateIconikCredentialFile()` → `IconikApi.credentials.ts` with fields: `appId`, `authToken`, `baseURL`.
- `generateLicenseSpringCredentialFile()` → `LicenseSpring.credentials.ts` with fields: `licenseKey`, `apiKey`, `sharedKey`, `appName`, `appVersion`.

### Package manifest generation
- `generatePackageJson(resources)` creates a package.json with:
  - `name`: `tsonik-nodes` (note: differs from `DEFAULT_CONFIG.packageName`).
  - `n8n` section: `credentials` and `nodes` entries pointing at `dist/...` artifacts.
  - `dependencies`: `@licensespring/node-sdk`, `n8n-workflow`, `tsonik`.
  - Scripts: `build`, `dev`, `lint`, `format`, `test`.

## Generation Script: Orchestration
- File: `scripts/generate-n8n.ts`
- Steps:
  - Cleans `packages/n8n-nodes/` and recreates it.
  - Runs `ResourceExtractor('./src')` to collect resources.
  - Instantiates `NodeGenerator(PACKAGES_DIR)` and calls `generateNodes(...)`.
  - Writes all nodes, credentials, and package.json via `generator.writeFiles(...)`.
  - Creates `src/utils/licenseValidation.ts` with a `LicenseValidator` using `@licensespring/node-sdk`.
  - Copies `assets/iconik.svg` into each node’s directory.
  - Generates `README.md` and `tsconfig.json` for the package.

## Output Structure
Generated under `packages/n8n-nodes/`:
- `src/nodes/Iconik<DisplayName>/Iconik<DisplayName>.node.ts`
- `src/credentials/IconikApi.credentials.ts`
- `src/credentials/LicenseSpring.credentials.ts`
- `src/utils/licenseValidation.ts`
- `package.json`
- `README.md`
- `tsconfig.json`
- Copied `iconik.svg` per node directory

## How to Run
- From repo root:
```bash
npm run generate:n8n
```
- To build the generated package:
```bash
npm run build:n8n
```

## Extending/Config
- `generator/src/config.ts` defines `DEFAULT_CONFIG` and a `loadConfig()` stub for future extension (e.g., package name, author, license, resource filters). The current script does not load/apply this config yet.

## Notes & Limitations
- **Type mapping** is conservative: arrays/complex types become `string`/`any` in node params.
- **Operation default** uses the first method or `'get'` fallback.
- **Client property mapping** is a fixed map; unknown resource names default to lowercase.
- **Package name** in generated `package.json` is `tsonik-nodes` (consider aligning with `n8n-nodes-iconik`).
- **License requirement**: All nodes require `LicenseSpring` credentials to validate before execution.
