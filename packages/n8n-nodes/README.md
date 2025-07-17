# N8N Iconik Nodes

Auto-generated N8N community nodes for the Iconik API, powered by [Tsonik](https://github.com/your-org/tsonik).

## Installation

```bash
npm install n8n-nodes-iconik
```

## Available Nodes

### Iconik Metadata

Manage Iconik metadata

**Available Operations:**
- **Get Metadata**: Get metadata for a specific object
- **Put Metadata**: Update metadata for a specific object

### Iconik Job

Manage Iconik job

**Available Operations:**
- **Get Job**: Get a specific job by ID
- **List Jobs**: Search and list jobs with optional filtering
- **Create Job**: Create a new job
- **Update Job**: Update an existing job
- **Replace Job**: Replace an existing job (full update)
- **Delete Job**: Delete a job
- **Update Priority**: Update job priority
- **Update Steps**: Update job steps
- **Bulk Edit Jobs**: Bulk edit jobs based on query filters
- **Bulk Update Priority**: Bulk update job priorities
- **Bulk Update State**: Bulk update job states
- **Bulk Delete**: Bulk delete multiple jobs
- **Reindex Job**: Reindex a job
- **Update Job Steps**: Update multiple steps for a job
- **Replace Job Steps**: Replace multiple steps for a job
- **Update Job Step**: Update a single job step
- **Replace Job Step**: Replace a single job step (complete replacement)

### Iconik Format

Manage Iconik format

**Available Operations:**
- **Get Asset Formats**: Get all formats for a specific asset
- **Get Asset Format**: Get a specific format for an asset
- **Update Asset Format**: Update an existing format for an asset
- **Replace Asset Format**: Replace an existing format for an asset (complete replacement)
- **Create Asset Format**: Create a new format and associate it to an asset

### Iconik Fileset

Manage Iconik fileset

**Available Operations:**
- **Get Asset Filesets**: Get all file sets for a specific asset
- **Get Asset Fileset**: Get a specific file set for an asset by ID
- **Create Asset Fileset**: Create a new file set for an asset
- **Delete Asset Fileset**: Delete a file set for an asset
- **Get File Set Files**: Get files from a file set

### Iconik File

Manage Iconik file

**Available Operations:**
- **Get Asset Files**: Get all files for an asset
- **Get Asset File**: Get a specific file for an asset by file ID
- **Create Asset File**: Create a new file and associate it to an asset

### Iconik Collection

Manage Iconik collection

**Available Operations:**
- **List Collections**: Get a list of collections
- **Get Collection**: Get a single collection by ID
- **Create Collection**: Create a new collection
- **Update Collection**: Update a collection by ID
- **Replace Collection**: Replace a collection by ID (PUT operation)
- **Delete Collection**: Delete a collection by ID

### Iconik Asset

Manage Iconik asset

**Available Operations:**
- **Get Asset**: Get a single asset by ID
- **List Assets**: List assets with optional filters
- **Create Asset**: Create a new asset
- **Update Asset**: Update an asset
- **Delete Asset**: Delete an asset


## Configuration

1. Add Iconik API credentials in N8N:
   - Go to **Settings** → **Credentials**
   - Click **Add Credential**
   - Select **Iconik API**
   - Enter your App ID and Auth Token

2. Use any Iconik node in your workflows

## Support

- [Tsonik Documentation](https://github.com/your-org/tsonik)
- [Iconik API Documentation](https://app.iconik.io/docs)
- [N8N Documentation](https://docs.n8n.io)

---

*This package is auto-generated from Tsonik v1.8.0*
