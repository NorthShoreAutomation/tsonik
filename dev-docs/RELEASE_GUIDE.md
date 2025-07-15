# Release Guide for Tsonik

This document outlines how to release new versions of the Tsonik package after adding new features or making other changes.

## Release Process Overview

Tsonik uses semantic versioning (SemVer) with two release methods:
1. **Automated releases** via semantic-release (recommended)
2. **Manual releases** via the version-and-release workflow

## Method 1: Automated Release with Semantic Release (Recommended)

### Prerequisites
- Your changes must be merged into the `main` branch
- You must follow the [Conventional Commits](https://www.conventionalcommit.org/) format in your commit messages

### Commit Message Format

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

Where `type` is one of:
- `feat`: A new feature (triggers a MINOR version bump)
- `fix`: A bug fix (triggers a PATCH version bump)
- `docs`: Documentation changes only
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code changes that neither fix bugs nor add features
- `perf`: Performance improvements
- `test`: Adding or correcting tests
- `chore`: Changes to the build process, tools, etc.

Adding `BREAKING CHANGE:` to the commit footer will trigger a MAJOR version bump.

### Example Commits

```
feat(format): add support for format replacement API

This adds the replaceAssetFormat method to FormatResource.
```

```
fix(client): resolve authentication token refresh issue

BREAKING CHANGE: The token refresh mechanism now requires a callback function.
```

### Release Process

1. Make your changes in a feature branch
2. Write tests that cover your new functionality
3. Ensure all tests pass by running `npm test`
4. Make commits using the conventional commit format
5. Create a pull request to `main`
6. After approval and merge to `main`, the semantic-release workflow will:
   - Analyze commit messages
   - Determine the next version number
   - Generate/update CHANGELOG.md
   - Create a new GitHub release with release notes
   - Publish to npm

The semantic-release workflow runs automatically when commits are pushed to `main`.

## Method 2: Manual Release with GitHub Actions

If you need more control over the release process, you can use the manual workflow:

1. Make your changes and ensure all tests pass
2. Merge your changes into `main`
3. Go to the GitHub repository Actions tab
4. Select the "Version and Release" workflow
5. Click "Run workflow"
6. Select the version bump type:
   - `patch`: For backward-compatible bug fixes (0.0.x)
   - `minor`: For backward-compatible new features (0.x.0)
   - `major`: For changes that break backward compatibility (x.0.0)
7. Click "Run workflow"

The workflow will:
- Run tests to ensure everything is working
- Bump the version in package.json
- Create a git tag for the version
- Push changes back to GitHub
- Create a GitHub Release
- The npm-publish workflow will then detect the release and publish to npm

## Post-Release Verification

After a release:

1. Check that the new version appears on [npm](https://www.npmjs.com/package/tsonik)
2. Verify the GitHub Release has been created with proper release notes
3. Confirm the CHANGELOG.md has been updated
4. Test the published package in a test project:
   ```
   npm install tsonik@latest
   ```

## Common Issues

### Semantic-Release Not Triggering

If the semantic-release process doesn't trigger, check:
- Commit messages follow the conventional format
- GitHub Actions has proper permissions
- Required secrets (NPM_TOKEN and GH_TOKEN) are configured

### Package Not Publishing to npm

If the package isn't published to npm, check:
- The NPM_TOKEN secret is properly configured in GitHub repository settings
- The npm registry is accessible from GitHub Actions
- The package name isn't already taken by another user

## Required GitHub Secrets

Ensure these secrets are configured in your GitHub repository:

- `NPM_TOKEN`: Access token for npm publishing
- `GH_TOKEN`: GitHub token with repo permissions
- `ICONIK_APP_ID`: Required for tests
- `ICONIK_AUTH_TOKEN`: Required for tests
- `ICONIK_BASE_URL`: Optional, for tests

## Additional Resources

- [Semantic Release Documentation](https://github.com/semantic-release/semantic-release)
- [Conventional Commits Specification](https://www.conventionalcommit.org/)
- [npm Publishing Documentation](https://docs.npmjs.com/packages-and-modules/publishing-packages)
