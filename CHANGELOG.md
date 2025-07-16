# [1.8.0](https://github.com/NorthShoreAutomation/tsonik/compare/v1.7.0...v1.8.0) (2025-07-16)


### Features

* add comprehensive p-retry integration with intelligent defaults and documentation ([dbb1f3f](https://github.com/NorthShoreAutomation/tsonik/commit/dbb1f3f4f8b2ffb9ad54fea00f9efdd87c58cb9b))

# [1.7.0](https://github.com/NorthShoreAutomation/tsonik/compare/v1.6.0...v1.7.0) (2025-07-15)


### Features

* implement clean markdown theme with dark mode ([c20f271](https://github.com/NorthShoreAutomation/tsonik/commit/c20f27189cfdcf1c87abbbabd48b488a4e7d793d))

# [1.6.0](https://github.com/NorthShoreAutomation/tsonik/compare/v1.5.0...v1.6.0) (2025-07-15)


### Features

* improve documentation styling and presentation ([5e1983a](https://github.com/NorthShoreAutomation/tsonik/commit/5e1983a481b279a232b50a05dd65ce7a7522bf8b))

# [1.5.0](https://github.com/NorthShoreAutomation/tsonik/compare/v1.4.1...v1.5.0) (2025-07-15)


### Bug Fixes

* correct metadata API example in README ([dbd91b4](https://github.com/NorthShoreAutomation/tsonik/commit/dbd91b43baa53e9b52a0a02d0c0bcd7bee14aa3f))
* resolve ESLint errors with proper FormatComponent typing ([fe6452f](https://github.com/NorthShoreAutomation/tsonik/commit/fe6452f41181ef508cfc14a03c72d33e77c46f31))
* update test files to use Tsonik instead of IconikClient ([fc5b324](https://github.com/NorthShoreAutomation/tsonik/commit/fc5b3240eff7041951aca9fecde0d8421687c77d))


### Features

* add TypeScript best practices examples and resolve type conflicts ([3e8658e](https://github.com/NorthShoreAutomation/tsonik/commit/3e8658e5e1a14a95b555abe6fd65cdc134d8bb90))

## [1.4.1](https://github.com/NorthShoreAutomation/tsonik/compare/v1.4.0...v1.4.1) (2025-07-15)


### Bug Fixes

* correct API documentation based on actual codebase ([d115c06](https://github.com/NorthShoreAutomation/tsonik/commit/d115c06012ca94c8202d4547de11a54b81862501))

# [1.4.0](https://github.com/NorthShoreAutomation/tsonik/compare/v1.3.0...v1.4.0) (2025-07-15)


### Bug Fixes

* improve job bulk delete test reliability ([a6a5763](https://github.com/NorthShoreAutomation/tsonik/commit/a6a5763c49d67ce2d65e69b8a17239e637f5a696))


### Features

* create comprehensive GitHub Pages documentation site ([dfeb48d](https://github.com/NorthShoreAutomation/tsonik/commit/dfeb48d91f5296d6e7565bce7387803334465746))
* merge main and resolve conflicts for GitHub Pages docs ([31f6117](https://github.com/NorthShoreAutomation/tsonik/commit/31f61174b5d196ae599814f4b7965c38c1d8910e))

# [1.3.0](https://github.com/NorthShoreAutomation/tsonik/compare/v1.2.0...v1.3.0) (2025-07-15)


### Bug Fixes

* separate API docs from development docs ([34322e1](https://github.com/NorthShoreAutomation/tsonik/commit/34322e1bfc49c7af1df51d72feadd9ad09f7829c))


### Features

* add auto-generated API documentation with TypeDoc ([ca3a6e3](https://github.com/NorthShoreAutomation/tsonik/commit/ca3a6e3e44d5ae3f3252f09f81643024f4404a5f))

# [1.2.0](https://github.com/NorthShoreAutomation/tsonik/compare/v1.1.0...v1.2.0) (2025-07-15)


### Features

* add getClientInfo method for debugging and version tracking ([1210255](https://github.com/NorthShoreAutomation/tsonik/commit/12102557b24c3b10affad4eee70799f1dc23b943))

# [1.1.0](https://github.com/NorthShoreAutomation/tsonik/compare/v1.0.0...v1.1.0) (2025-07-14)


### Features

* add iconik env vars to semantic release workflow and update docs ([46f3395](https://github.com/NorthShoreAutomation/tsonik/commit/46f3395bb974e5994c9af288837c04e96de00f90))

# 1.0.0 (2025-07-14)


### Bug Fixes

* add proper permissions and token configuration for semantic-release workflow ([a417995](https://github.com/NorthShoreAutomation/tsonik/commit/a417995652340db382cc275a043309feaefa742e))
* code coverage issue ([b020919](https://github.com/NorthShoreAutomation/tsonik/commit/b020919e2a3e25f4bbb7199704ad3ee7a855c10c))
* remove git plugin from semantic-release to avoid branch protection conflicts ([6bfe04d](https://github.com/NorthShoreAutomation/tsonik/commit/6bfe04de6f3e6b61840f6f5c4a33fe085d75b836))
* replace undefined fail() with throw new Error() in jobs integration test ([0ae543e](https://github.com/NorthShoreAutomation/tsonik/commit/0ae543e07d7dc2896625abbf53f5cd7654a84857))
* update repository URLs to correct NorthShoreAutomation organization ([00a52a4](https://github.com/NorthShoreAutomation/tsonik/commit/00a52a49f53656ddaa5e09829a4160c9230bf409))
* use built-in GITHUB_TOKEN instead of custom GH_TOKEN for semantic-release ([4c90877](https://github.com/NorthShoreAutomation/tsonik/commit/4c9087789f52a230045ca293210eb34ec2467ff2))


### Features

* add fileset resource with CRUD operations and tests ([34577d0](https://github.com/NorthShoreAutomation/tsonik/commit/34577d018d2d22ec9cb349b0a7de276152ecbbf4))
* add metadata resource with get/put operations and remove bulk delete assets ([ee835ec](https://github.com/NorthShoreAutomation/tsonik/commit/ee835ec452a917598e5e4715ca39a9f13908f4c2))
* implement collections API with CRUD operations and integration tests, minor changes to asset types ([35c335c](https://github.com/NorthShoreAutomation/tsonik/commit/35c335c977eb2ea9e04b8f4e789f9134f0d4c787))
* implement core SDK structure with filesets and formats support ([9695729](https://github.com/NorthShoreAutomation/tsonik/commit/969572939d8f5ca20ab7ea9e12b41b4ba824ad12))
* **jobs:** Complete Jobs API implementation per OpenAPI specification ([c06a1f7](https://github.com/NorthShoreAutomation/tsonik/commit/c06a1f7c29ec04d745232bf8df40f25f2ce6894d))


### Reverts

* restore git plugin for changelog updates in semantic-release ([18c3600](https://github.com/NorthShoreAutomation/tsonik/commit/18c360065b2aaf03bd965bfe9316a16cfe4ab5db))
* use GH_TOKEN instead of GITHUB_TOKEN for semantic-release ([540ce94](https://github.com/NorthShoreAutomation/tsonik/commit/540ce9406356068a88bc379057123ce4597f8957))

# Changelog

All notable changes to this project will be documented in this file. This file is automatically generated by the semantic-release process.

## [0.1.0] - 2023-07-11

### Features

- Initial release of the Tsonik TypeScript client library
- Some Support for Assets, Collections, FileSet, Format, and Files resources
- TypeScript typings for API objects
- Comprehensive error handling and request validation
- Promise-based API with async/await support
