# Contributing to Tsonik

Thank you for your interest in contributing to Tsonik! This document provides guidelines and instructions to help you contribute effectively.

## Development Setup

1. **Fork and clone the repository**:
   ```bash
   git clone https://github.com/yourusername/tsonik.git
   cd tsonik
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   - Copy `.env.example` to `.env` and fill in the required values:
   ```bash
   cp .env.example .env
   ```
   - Required variables:
     - `ICONIK_APP_ID` - Your Iconik API app ID
     - `ICONIK_AUTH_TOKEN` - Your Iconik API auth token
     - Optional: `ICONIK_BASE_URL`, `ICONIK_ALLOW_DESTRUCTIVE_TESTS`

4. **Run tests to verify your setup**:
   ```bash
   npm test
   ```

## Development Workflow

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Write code and tests**:
   - Follow the existing code style and patterns
   - Add comprehensive unit tests for all new functionality
   - Update integration tests when necessary
   - Ensure your code passes linting: `npm run lint`

3. **Run tests**:
   - Unit tests: `npm run test:unit`
   - Integration tests: `npm run test:integration`
   - Specific resource tests: `npm run test:assets`, etc.

4. **Check code coverage**:
   ```bash
   npm run test:coverage
   ```
   - All code in `/resources` should maintain at least 90% coverage

5. **Format your code**:
   ```bash
   npm run lint:fix
   ```

## Commit Guidelines

We use [Conventional Commits](https://www.conventionalcommit.org/) for semantic versioning:

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

Types:
- `feat`: A new feature (minor version)
- `fix`: A bug fix (patch version)
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code changes that neither fix bugs nor add features
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Changes to build process, tooling, etc.

Breaking changes:
- Add `BREAKING CHANGE:` in the commit footer to indicate a breaking change (major version)

Examples:
```
feat(assets): add support for bulk tagging

This implements the bulk tagging feature on the AssetResource.
```

```
fix(client): resolve authentication issue

BREAKING CHANGE: The auth method now requires an additional parameter.
```

## Pull Request Process

1. **Update documentation** if your changes require it
2. **Ensure all tests pass** and new features are covered by tests
3. **Verify code coverage** meets requirements
4. **Update the CHANGELOG.md** with details of your changes
5. **Submit a pull request** to the `main` branch
6. **Wait for code review and address feedback**

## Code Standards

- **TypeScript**: Use strong typing, avoid `any` unless absolutely necessary
- **Error Handling**: Use consistent error patterns, validate inputs
- **Documentation**: Add JSDoc comments to public methods and classes
- **Naming**: Use descriptive, consistent naming conventions
- **Resource Structure**: Follow the ORM-like pattern of the existing resources

## Testing Guidelines

- **Unit Tests**: Write comprehensive unit tests for all functionality
- **Mocking**: Use mock axios responses in unit tests
- **Integration Tests**: For testing against the real Iconik API
- **Test Organization**: Maintain the existing test structure and naming

## License

By contributing to Tsonik, you agree that your contributions will be licensed under the project's MIT License.
