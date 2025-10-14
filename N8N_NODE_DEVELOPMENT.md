# N8N Node Development Guide

## Cache Clearing & Installation Process

When developing N8N nodes locally, caching issues can prevent updated nodes from loading properly. Follow this process to ensure clean installation:

### Prerequisites
- N8N installed globally: `npm install n8n -g`
- Node development package built and ready

### Step-by-Step Process

```bash
# 1. Stop N8N
pkill -f n8n

# 2. Clear N8N custom directory completely
rm -rf ~/.n8n/custom

# 3. Build our node package
cd packages/n8n-nodes
npm run build

# 4. Create global npm link
npm link

# 5. Create N8N custom directory
cd ~/.n8n
mkdir custom
cd custom
npm init -y

# 6. Link package in N8N custom directory
npm link tsonik-nodes

# 7. Verify installation
npm list
# Should show: tsonik-nodes@X.X.X extraneous -> path/to/packages/n8n-nodes

# 8. Start N8N
n8n start
```

### Troubleshooting

- **Nodes not appearing**: Make sure to search by node name (e.g., "asset") not package name ("tsonik-nodes")
- **Credentials not loading**: Check for dependency issues or naming conflicts
- **Old version loading**: Increment node version number and package version
- **Build errors**: Ensure all dependencies are properly installed

### Version Management

When making changes:
1. Increment `version` in `package.json`
2. Increment `version` in node description
3. Follow the cache clearing process above

### Based on Official N8N Documentation
This process follows the official N8N documentation:
https://docs.n8n.io/integrations/creating-nodes/test/run-node-locally/