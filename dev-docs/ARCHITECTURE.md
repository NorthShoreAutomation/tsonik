# Tsonik Architecture

This document provides a high-level overview of the Tsonik library's architecture, design patterns, and component relationships.

## Overall Architecture

Tsonik is designed as a TypeScript client for the Iconik API, using an ORM-like pattern where resources map to API endpoints and provide strongly-typed methods for interacting with those endpoints.

```
┌────────────────────────────────────┐
│          IconikClient              │
├────────────────────────────────────┤
│                                    │
│  ┌─────────┐  ┌─────────────────┐  │
│  │  HTTP   │  │  Authentication │  │
│  │ Client  │◄─┤    Manager      │  │
│  └─────────┘  └─────────────────┘  │
│       ▲                            │
│       │                            │
│  ┌────┴─────────────────────────┐  │
│  │                              │  │
│  │        Resources             │  │
│  │                              │  │
│  │  ┌─────────┐  ┌──────────┐   │  │
│  │  │ Assets  │  │Collections│   │  │
│  │  └─────────┘  └──────────┘   │  │
│  │                              │  │
│  │  ┌─────────┐  ┌──────────┐   │  │
│  │  │ FileSets│  │ Formats  │   │  │
│  │  └─────────┘  └──────────┘   │  │
│  │                              │  │
│  │  ┌─────────┐  ┌──────────┐   │  │
│  │  │  Files  │  │   Jobs   │   │  │
│  │  └─────────┘  └──────────┘   │  │
│  │                              │  │
│  └──────────────────────────────┘  │
│                                    │
└────────────────────────────────────┘
```

## Core Components

### 1. Client Class

- **Purpose**: Main entry point for the API client
- **File**: `src/client.ts`
- **Responsibilities**:
  - Initialize the HTTP client (Axios)
  - Configure authentication
  - Instantiate resources
  - Provide common HTTP methods (get, post, put, delete)

### 2. Resources

- **Purpose**: Encapsulate API endpoints for specific entity types
- **Directory**: `src/resources/`
- **Base Pattern**: Each resource:
  - Receives the client instance
  - Provides methods that map to API operations
  - Handles parameter validation
  - Returns strongly-typed responses

### 3. Types

- **Purpose**: Define TypeScript interfaces for API objects and parameters
- **Directory**: `src/types/`
- **Organization**: Separate files for each resource type

### 4. Utilities

- **Purpose**: Shared helper functions and constants
- **Directory**: `src/utils/`

## Data Flow

1. **Client Initialization**:
   ```typescript
   const client = new IconikClient({
     apiKey: "your-api-key",
     baseUrl: "https://app.iconik.io/v1" // optional
   });
   ```

2. **Resource Method Call**:
   ```typescript
   const result = await client.assets.getAsset("asset-id");
   ```

3. **Internal Flow**:
   - Resource validates parameters
   - Resource calls client's HTTP method
   - Client adds authentication headers
   - Request is sent to API
   - Response is parsed and returned with TypeScript types

## Design Patterns

### 1. Dependency Injection

The client instance is injected into resources, which:
- Makes testing easier (mocking the client)
- Centralizes HTTP and auth logic
- Allows resource sharing of configuration

### 2. Resource Pattern

Similar to an ORM or Repository pattern:
- Resources represent logical API entities
- Methods represent operations on those entities
- Clean separation between HTTP concerns and business logic

### 3. Strongly-Typed Responses

All API responses are mapped to TypeScript interfaces:
- Enables IDE autocompletion
- Provides compile-time type checking
- Documents the API structure

## Error Handling

- All resource methods validate parameters before making API calls
- HTTP errors are caught and transformed into more helpful error messages
- Consistent error pattern across all resources

## Testing Strategy

### Unit Tests

- Mock the Axios instance to test resource logic
- Each resource method has comprehensive test cases
- Test both success and error scenarios
- Test parameter validation

### Integration Tests

- Test against the actual Iconik API
- Require valid API credentials
- Focus on key workflows
- Skip destructive tests by default

## Future Architecture Considerations

1. **Pagination Handling**: Implement more sophisticated pagination support
2. **Caching Layer**: Consider adding optional request caching
3. **Rate Limiting**: Add built-in rate limit handling
4. **Middleware Pattern**: Allow custom middleware for requests/responses
5. **Streaming Support**: For large file operations
