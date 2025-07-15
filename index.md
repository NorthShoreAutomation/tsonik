---
layout: default
title: Home
---

<div class="hero-section">

# Tsonik
{: .hero-title}

A modern TypeScript client library for the Iconik API that makes media asset management simple and type-safe.
{: .hero-subtitle}

</div>

## ✨ Features

<div class="feature-grid">

### 🎯 TypeScript-First
Full type safety with comprehensive interfaces and intelligent autocomplete

### 🚀 Promise-Based API  
Modern async/await support with clean, readable code

### 🛡️ Error Handling
Detailed error types with helpful context for debugging

### 📡 Reliable HTTP
Built on Axios with automatic retries and request optimization

### 🏗️ Resource Architecture
Intuitive organization by domain: assets, collections, jobs, metadata

### 📚 Comprehensive Docs
Real-world examples and TypeScript best practices

</div>

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

## 📖 Documentation

<div class="docs-grid">

<div class="doc-card">
  <h3>📖 Getting Started</h3>
  <p>Complete setup guide and first steps</p>
  <a href="./docs/getting-started.html" class="doc-link">Get Started →</a>
</div>

<div class="doc-card">
  <h3>💡 Usage Examples</h3>
  <p>Real-world examples for all features</p>
  <a href="./docs/examples.html" class="doc-link">View Examples →</a>
</div>

<div class="doc-card">
  <h3>📚 API Reference</h3>
  <p>Complete method documentation</p>
  <a href="./docs/api-reference.html" class="doc-link">Browse API →</a>
</div>

<div class="doc-card">
  <h3>🛠️ Best Practices</h3>
  <p>TypeScript patterns and performance tips</p>
  <a href="./docs/best-practices.html" class="doc-link">Learn More →</a>
</div>

</div>

## 🔗 Links

- **[GitHub Repository](https://github.com/NorthShoreAutomation/tsonik)** - Source code and issues
- **[npm Package](https://www.npmjs.com/package/tsonik)** - Installation and versions
- **[Iconik API](https://developer.iconik.io/)** - Official API documentation

---

<div class="footer-note">
Built with ❤️ for the media industry. Open source and community-driven.
</div>

<style>
.hero-section {
  text-align: center;
  padding: 2rem 0 3rem 0;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  margin: -2rem -2rem 3rem -2rem;
  border-radius: 12px;
}

.hero-title {
  font-size: 3rem;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 1rem;
  border: none !important;
  padding-bottom: 0 !important;
}

.hero-subtitle {
  font-size: 1.25rem;
  color: #475569;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
}

.feature-grid h3 {
  margin-top: 0;
  color: #1e293b;
  font-size: 1.1rem;
  font-weight: 600;
}

.feature-grid p {
  color: #64748b;
  margin: 0;
  font-size: 0.95rem;
}

.docs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
}

.doc-card {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1.5rem;
  transition: all 0.2s ease;
}

.doc-card:hover {
  border-color: #3b82f6;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
  transform: translateY(-2px);
}

.doc-card h3 {
  margin-top: 0;
  margin-bottom: 0.5rem;
  color: #1e293b;
  font-size: 1.1rem;
}

.doc-card p {
  color: #64748b;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.doc-link {
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9rem;
}

.doc-link:hover {
  color: #1d4ed8;
}

.footer-note {
  text-align: center;
  color: #64748b;
  font-style: italic;
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid #e2e8f0;
}

@media (max-width: 768px) {
  .hero-section {
    margin: -1rem -1rem 2rem -1rem;
    padding: 1.5rem 1rem 2rem 1rem;
  }
  
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-subtitle {
    font-size: 1.1rem;
  }
}
</style>