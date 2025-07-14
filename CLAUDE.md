# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Tsonik is a TypeScript client library for the Iconik API, providing a modern, type-safe interface for interacting with Iconik's media asset management platform. The library follows an ORM-like pattern with resource classes and includes comprehensive error handling.

## Development Commands

### Build and Development

- `npm run build` - Compile TypeScript to JavaScript in dist/ directory
- `npm run dev` - Run TypeScript compiler in watch mode for development
- `npm run prepare` - Build the project (runs automatically on npm install)

### Testing

- `npm test` - Run unit tests with Jest
- `npm run test:watch` - Run unit tests in watch mode
- `npm run test:integration` - Run integration tests (requires environment variables)
- `npm run test:integration:watch` - Run integration tests in watch mode
- `npm run test:all` - Run both unit and integration tests

### Linting

- `npm run lint` - Run ESLint on TypeScript files
- `npm run lint:fix` - Run ESLint and auto-fix issues

### Integration Test Setup

Integration tests require environment variables:

- `ICONIK_APP_ID` - Your Iconik App ID
- `ICONIK_AUTH_TOKEN` - Your Iconik Auth Token
- `ICONIK_BASE_URL` - Optional base URL (defaults to https://app.iconik.io)

Copy `.env.example` to `.env` and fill in credentials when running integration tests.

## Architecture

### Core Components

**Client Architecture**: The main `Tsonik` class (exported as `IconikClient`) serves as the central HTTP client, built on Axios with comprehensive error handling and request/response interceptors.

**Resource Pattern**: The library implements an ORM-like pattern with resource classes:

- `BaseResource` - Abstract base class providing common CRUD operations
- `AssetResource` - Asset management operations
- `CollectionResource` - Collection management operations
- `JobResource` - Job management operations

**Type System**: Comprehensive TypeScript types are organized by domain:

- `types/common.ts` - Shared types and API response structures
- `types/assets.ts` - Asset-specific types
- `types/collections.ts` - Collection-specific types
- `types/jobs.ts` - Job-specific types
- `types/http.ts` - HTTP request/response types

**Error Handling**: Custom error classes extend base `IconikError`:

- `IconikAuthError` - Authentication failures (401)
- `IconikAPIError` - API errors (4xx/5xx with detailed context)

### Key Patterns

**Configuration**: The `IconikConfig` interface defines client configuration with sensible defaults in `DEFAULT_CONFIG`.

**API Responses**: All API methods return `ApiResponse<T>` objects containing data, status, and headers.

**Pagination**: List operations return `PaginatedResponse<T>` for handling paginated results.

**Authentication**: Uses App-ID and Auth-Token headers for authentication (not API keys as mentioned in README).

## File Structure

```
src/
├── client.ts          # Main Tsonik client class
├── config.ts          # Configuration types and defaults
├── errors.ts          # Custom error classes
├── index.ts           # Main exports
├── resources/         # Resource classes
│   ├── base.ts        # Abstract base resource
│   ├── assets.ts      # Asset operations
│   ├── collections.ts # Collection operations
│   └── jobs.ts        # Job operations
└── types/             # TypeScript type definitions
    ├── common.ts      # Shared types
    ├── assets.ts      # Asset types
    ├── collections.ts # Collection types
    ├── jobs.ts        # Job types
    └── http.ts        # HTTP types
```

## Testing Strategy

- **Unit Tests**: Located in `src/__tests__/` using Jest and ts-jest
- **Integration Tests**: Real API calls with 30-second timeout
- **Test Configuration**: Separate Jest configs for unit vs integration tests
- **Coverage**: Configured to collect coverage from all TypeScript files
