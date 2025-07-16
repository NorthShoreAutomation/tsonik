---
layout: default
title: Tsonik
description: TypeScript client library for the Iconik API
---

# 🎬 Tsonik

A modern TypeScript client library for the Iconik API that makes media asset management simple and type-safe.

## ✨ Features

- **🎯 TypeScript-First** - Full type safety with comprehensive interfaces
- **🚀 Promise-Based API** - Modern async/await support  
- **🛡️ Error Handling** - Detailed error types with helpful context
- **📡 Reliable HTTP** - Built on Axios with intelligent automatic retries and exponential backoff
- **🏗️ Resource Architecture** - Organized by domain: assets, collections, jobs, metadata
- **📚 Comprehensive Docs** - Real-world examples and TypeScript best practices

## 🚀 Quick Start

### Installation

```bash
npm install tsonik
```

### Basic Usage

```typescript
import { Tsonik } from 'tsonik';

// Initialize the client
const client = new Tsonik({
  appId: 'your-app-id',
  authToken: 'your-auth-token'
});

// Get all assets
const assets = await client.assets.listAssets({
  limit: 50,
  offset: 0
});
console.log(`Found ${assets.data.objects.length} assets`);

// Create a new asset
const newAsset = await client.assets.createAsset({
  title: 'My Video',
  type: 'ASSET',
  description: 'A sample video file'
});
```

## 📖 What's Next?

<div class="callout">
  <strong>📖 New to Tsonik?</strong> Start with our <a href="./docs/getting-started">Getting Started Guide</a> for complete setup instructions.
</div>

<div class="callout">
  <strong>💡 Want Examples?</strong> Check out our <a href="./docs/examples">Usage Examples</a> with real-world code samples for all features.
</div>

<div class="callout">
  <strong>📚 Need Reference?</strong> Browse the complete <a href="./docs/api-reference">API Reference</a> with method documentation.
</div>

<div class="callout">
  <strong>🔄 Retry Configuration?</strong> Learn about <a href="./docs/retry-configuration">Automatic Retry</a> and how to configure it for your needs.
</div>

## 🔗 Links

- **[GitHub Repository](https://github.com/NorthShoreAutomation/tsonik)** - Source code and issues
- **[npm Package](https://www.npmjs.com/package/tsonik)** - Installation and versions  
- **[Iconik API](https://developer.iconik.io/)** - Official API documentation

---

*Built with ❤️ for the media industry. Open source and community-driven.*