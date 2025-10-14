#!/bin/bash

# dev-setup.sh
# Automates the n8n node development workflow
# This script builds the package, sets up npm links, and prepares the n8n custom environment

# Exit on error
set -e

echo "📦 Starting n8n node development setup..."

# Step 1: Navigate to the n8n-nodes package directory
echo "📂 Navigating to n8n-nodes package directory..."
cd "$(dirname "$0")/../packages/n8n-nodes"

# Step 2: Build the package
echo "🔨 Building package..."
npm run build

# Step 3: Create a global npm link
echo "🔗 Creating global npm link..."
npm link

# Step 4: Navigate to n8n directory
echo "📂 Navigating to n8n directory..."
cd ~/.n8n/

# Step 5: Stop n8n server if running
echo "🛑 Stopping n8n server..."
pkill -f n8n || echo "n8n server was not running"

# Step 6: Remove existing link if present
echo "🧹 Cleaning up existing links..."
npm unlink tsonik-nodes || echo "No previous link to remove"

# Step 7: Navigate to custom directory
echo "📂 Navigating to n8n custom directory..."
cd ~/.n8n/custom || mkdir -p ~/.n8n/custom && cd ~/.n8n/custom

# Step 8: Clean node_modules
echo "🧹 Removing node_modules..."
rm -rf node_modules

# Step 9: Link your package
echo "🔗 Linking tsonik-nodes..."
npm link tsonik-nodes

echo "✅ Setup complete! You can now start n8n with 'n8n start'"
echo "🔍 To verify the installation, run 'npm list' in ~/.n8n/custom"
