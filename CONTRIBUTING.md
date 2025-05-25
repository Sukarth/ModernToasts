# Contributing to ModernToasts

Thank you for your interest in contributing to ModernToasts! We welcome contributions from the community and are grateful for any help you can provide.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)
- [Coding Standards](#coding-standards)
- [Reporting Issues](#reporting-issues)
- [Additional Resources](#additional-resources)
- [Thank You!](#thank-you)

## 📜 Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](https://www.contributor-covenant.org/). By participating in this project you agree to abide by its terms.

## 🚀 Getting Started

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/your-username/ModernToasts.git
   cd ModernToasts
   ```
3. Add the upstream repository:
   ```bash
   git remote add upstream https://github.com/sukarth/ModernToasts.git
   ```

## 💻 Development Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Build the project:
   ```bash
   npm run build
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. In another terminal, serve the examples:
   ```bash
   npm run serve
   ```

5. Open http://localhost:8080 to see the examples

## 🔧 Making Changes

1. Create a new branch for your feature or bugfix:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes following our [coding standards](#coding-standards)

3. Add or update tests as needed

4. Run tests to ensure everything passes:
   ```bash
   npm test
   ```

5. Run linting:
   ```bash
   npm run lint
   ```

6. Build the project to ensure it compiles:
   ```bash
   npm run build
   ```

## 🧪 Testing

We use Jest for testing. Please ensure:

- All tests pass: `npm test`
- Coverage remains above 90%: `npm run test:coverage`
- New features include appropriate tests
- Bug fixes include regression tests

### Writing Tests

Tests are located in the `tests/` directory. Follow these patterns:

```typescript
describe('ComponentName', () => {
  describe('methodName', () => {
    it('should do something specific', () => {
      // Arrange
      const input = 'test';
      
      // Act
      const result = methodName(input);
      
      // Assert
      expect(result).toBe('expected');
    });
  });
});
```

## 📤 Submitting Changes

1. Commit your changes with a descriptive message:
   ```bash
   git commit -m "feat: add new animation direction option"
   ```

   Follow [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat:` for new features
   - `fix:` for bug fixes
   - `docs:` for documentation changes
   - `style:` for formatting changes
   - `refactor:` for code refactoring
   - `test:` for test additions/changes
   - `chore:` for maintenance tasks

2. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

3. Create a Pull Request on GitHub

### Pull Request Guidelines

- Fill out the PR template completely
- Link any related issues
- Ensure all CI checks pass
- Request review from maintainers
- Be responsive to feedback

## 📏 Coding Standards

### TypeScript

- Use TypeScript for all new code
- Provide proper type definitions
- Avoid `any` types
- Use interfaces over type aliases where appropriate

### Code Style

- Follow the ESLint configuration
- Use 2 spaces for indentation
- Use single quotes for strings
- Add trailing commas in multi-line objects/arrays
- Use meaningful variable and function names

### File Organization

```
src/
├── ModernToasts.ts    # Main class
├── types.ts           # TypeScript definitions
├── constants.ts       # Constants and configuration
├── utils.ts           # Utility functions
├── ToastBuilder.ts    # Builder pattern implementation
└── index.ts           # Entry point
```

### Best Practices

- Keep functions small and focused
- Write self-documenting code
- Add JSDoc comments for public APIs
- Handle errors gracefully
- Consider performance implications
- Ensure accessibility compliance

## 🐛 Reporting Issues

When reporting issues, please include:

1. **Description**: Clear description of the issue
2. **Steps to Reproduce**: Detailed steps to reproduce the issue
3. **Expected Behavior**: What you expected to happen
4. **Actual Behavior**: What actually happened
5. **Environment**: Browser, OS, ModernToasts version
6. **Code Sample**: Minimal reproduction code
7. **Screenshots**: If applicable

### Issue Templates

Use the appropriate issue template:
- Bug Report
- Feature Request
- Documentation Issue

## 📚 Additional Resources

- [API Documentation](API.md)
- [Security Policy](SECURITY.md)
- [Publishing Guide](PUBLISHING.md)

## 🙏 Thank You!

Thank you for contributing to ModernToasts! Your efforts help make this library better for everyone.

If you have any questions, feel free to:
- Open an issue
- Start a discussion
- Contact the maintainers

Happy coding! 🎉