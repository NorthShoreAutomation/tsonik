# tsonik

A complete, generated TypeScript SDK for the [iconik](https://app.iconik.io) media management API.

- **15 services**, one subpath each: `tsonik/acls`, `tsonik/assets`, `tsonik/auth`, `tsonik/automations`, `tsonik/files`, `tsonik/jobs`, `tsonik/metadata`, `tsonik/ml`, `tsonik/notifications`, `tsonik/search`, `tsonik/settings`, `tsonik/stats`, `tsonik/transcode`, `tsonik/users`, `tsonik/users-notifications`
- **Every operation in every service** (953 endpoints) — generated from iconik's published OpenAPI specs with [@hey-api/openapi-ts](https://github.com/hey-api/openapi-ts). One fully typed function per operation, request and response types included, fetch-based client, ESM.
- Runs in Node ≥ 18 and modern browsers (anything with global `fetch`).

## Install

```sh
npm install tsonik
```

## Usage

Set your `App-ID` / `Auth-Token` credentials **once**; every call is then authenticated (operations that iconik's specs mark as unauthenticated — login/SAML flows — send no auth headers):

```ts
import { configure } from 'tsonik';
import { getAssets, getAssetsByAssetId } from 'tsonik/assets';

configure({
  appId: process.env.ICONIK_APP_ID!,
  authToken: process.env.ICONIK_AUTH_TOKEN!,
});

const { data, error } = await getAssets({ query: { per_page: 10 } });
const asset = await getAssetsByAssetId({ path: { asset_id: 'some-asset-uuid' } });
```

Every operation returns `{ data, error, request, response }`; pass `throwOnError: true` to get `data` directly and have non-2xx responses throw instead.

Self-hosted iconik? Pass `baseUrl`:

```ts
configure({ appId, authToken, baseUrl: 'https://iconik.example.com' });
```

### Per-service clients

Each service subpath also exports its own `client` (a [hey-api fetch client](https://heyapi.dev/openapi-ts/clients/fetch)) if you need per-service interceptors, custom fetch, or separate credentials:

```ts
import { client } from 'tsonik/assets';

client.interceptors.request.use((request) => {
  console.log(request.method, request.url);
  return request;
});
```

## Regeneration

This repo's entire tree (minus README, `.github/`, `.gitignore`) is emitted by
[iconik-sdk-generator](https://github.com/NorthShoreAutomation/iconik-sdk-generator) — **do not edit it by hand**; changes belong in the generator.
