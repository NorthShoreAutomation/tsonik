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

### Friendly client

The root module also exports a human-named alias for every operation — the same names the `iconik` CLI uses (`tsonik/friendly` if you'd rather import them on their own). Path parameters are positional; anything an alias pins (e.g. `object_type` on the shared metadata endpoints) is baked in:

```ts
import { configure, putAssetMetadata, getAssetFiles } from 'tsonik';

configure({ appId, authToken });

await putAssetMetadata(assetId, viewId, { body: { metadata_values: { title: { field_values: [{ value: 'New title' }] } } } });
const { data } = await getAssetFiles(assetId, { query: { per_page: 10 } });
```

### Per-service clients

Each service subpath also exports its own `client` (a [hey-api fetch client](https://heyapi.dev/openapi-ts/clients/fetch)) if you need per-service interceptors, a custom fetch, or separate credentials:

```ts
import { client } from 'tsonik/assets';

client.interceptors.request.use((request) => {
  console.log(request.method, request.url);
  return request;
});

client.setConfig({ fetch: myFetch });
```

These are the same clients `configure()` writes to, and `setConfig` merges — so interceptors and your own config keys survive it in either order; only `auth` and `baseUrl` are the ones `configure()` sets.

## Regeneration

This repo's entire tree (minus README, `.github/`, `.gitignore`) is emitted by
[iconik-sdk-generator](https://github.com/NorthShoreAutomation/iconik-sdk-generator) — **do not edit it by hand**; changes belong in the generator.
