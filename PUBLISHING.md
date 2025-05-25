# Publishing Guide for ModernToasts

This guide covers how to publish ModernToasts to npm and maintain the package.

## Pre-Publishing Checklist

### ✅ Code Quality
- [x] All tests passing (77/77 tests)
- [x] Linting clean (0 errors, 0 warnings)
- [x] Build successful (all formats generated)
- [x] TypeScript compilation clean
- [x] Examples working correctly

### ✅ Documentation
- [x] README.md comprehensive and up-to-date
- [x] API.md complete with all methods
- [x] CHANGELOG.md with version history
- [x] CONTRIBUTING.md for contributors
- [x] SECURITY.md for security policies
- [x] LICENSE file (MIT)

### ✅ Package Configuration
- [x] package.json properly configured
- [x] Correct entry points (main, module, browser, types)
- [x] Proper exports configuration
- [x] Files array includes only necessary files
- [x] Keywords for discoverability
- [x] Repository and homepage URLs

### ✅ Build Artifacts
- [x] dist/modern-toasts.umd.js (UMD build)
- [x] dist/modern-toasts.min.js (Minified UMD)
- [x] dist/modern-toasts.esm.js (ES modules)
- [x] dist/modern-toasts.cjs.js (CommonJS)
- [x] dist/types/ (TypeScript definitions)

## Publishing Steps

### 1. Final Verification

```bash
# Run all quality checks
npm run lint
npm test
npm run build

# Verify package contents
npm pack --dry-run
```

### 2. Version Management

```bash
# For patch release (1.0.1)
npm version patch

# For minor release (1.1.0)
npm version minor

# For major release (2.0.0)
npm version major
```

### 3. Publish to npm

```bash
# Login to npm (first time only)
npm login

# Publish the package
npm publish

# For beta/alpha releases
npm publish --tag beta
npm publish --tag alpha
```

### 4. Post-Publishing

```bash
# Create GitHub release
git tag v1.0.0
git push origin v1.0.0

# Update documentation sites
# Update demo site
# Announce on social media
```

## npm Commands Reference

### Development
```bash
npm run dev          # Watch mode for development
npm run build        # Build all formats
npm test             # Run test suite
npm run test:watch   # Watch mode for tests
npm run test:coverage # Generate coverage report
npm run lint         # Run ESLint
npm run lint:fix     # Fix linting issues
npm run serve        # Serve examples locally
```

### Publishing
```bash
npm run prepublishOnly  # Runs automatically before publish
npm run prepack        # Runs before creating package
npm pack              # Create tarball for testing
npm publish           # Publish to npm registry
```

## Package.json Key Fields

### Entry Points
```json
{
  "main": "dist/modern-toasts.cjs.js",     // CommonJS entry
  "module": "dist/modern-toasts.esm.js",   // ES modules entry
  "browser": "dist/modern-toasts.min.js",  // Browser/UMD entry
  "types": "dist/types/index.d.ts",        // TypeScript definitions
  "exports": {
    ".": {
      "import": "./dist/modern-toasts.esm.js",
      "require": "./dist/modern-toasts.cjs.js",
      "browser": "./dist/modern-toasts.min.js",
      "types": "./dist/types/index.d.ts"
    }
  }
}
```

### Files to Include
```json
{
  "files": [
    "dist/",
    "README.md",
    "LICENSE",
    "CONTRIBUTING.md"
  ]
}
```

### Scripts for Publishing
```json
{
  "scripts": {
    "prepublishOnly": "npm run lint && npm test && npm run build",
    "prepack": "npm run build"
  }
}
```

## Version Strategy

### Semantic Versioning (SemVer)

- **MAJOR** (1.0.0 → 2.0.0): Breaking changes
- **MINOR** (1.0.0 → 1.1.0): New features, backward compatible
- **PATCH** (1.0.0 → 1.0.1): Bug fixes, backward compatible

### Release Types

#### Patch Release (1.0.x)
- Bug fixes
- Performance improvements
- Documentation updates
- Security patches

#### Minor Release (1.x.0)
- New features
- New configuration options
- New API methods (non-breaking)
- Deprecations (with warnings)

#### Major Release (x.0.0)
- Breaking API changes
- Removed deprecated features
- Major architecture changes
- New minimum requirements

## Distribution Channels

### 1. npm Registry
- Primary distribution method
- Automatic via `npm publish`
- Available at: https://www.npmjs.com/package/modern-toasts

### 2. CDN (unpkg)
- Automatic from npm
- Available at: https://unpkg.com/modern-toasts@latest/dist/modern-toasts.min.js
- Version-specific: https://unpkg.com/modern-toasts@1.0.0/dist/modern-toasts.min.js

### 3. CDN (jsDelivr)
- Automatic from npm
- Available at: https://cdn.jsdelivr.net/npm/modern-toasts@latest/dist/modern-toasts.min.js

### 4. GitHub Releases
- Manual via GitHub interface
- Include built assets
- Release notes from CHANGELOG.md

## Quality Gates

### Before Publishing
1. **Tests**: All tests must pass
2. **Linting**: No linting errors
3. **Build**: All formats must build successfully
4. **Examples**: All examples must work
5. **Documentation**: Must be up-to-date

### Automated Checks
The `prepublishOnly` script runs:
```bash
npm run lint && npm test && npm run build
```

## Maintenance

### Regular Tasks
- Update dependencies monthly
- Review and respond to issues
- Update documentation as needed
- Monitor bundle size
- Check browser compatibility

### Security
- Monitor for security vulnerabilities
- Update dependencies with security patches
- Review and respond to security reports
- Maintain SECURITY.md

### Community
- Respond to issues and PRs
- Update CONTRIBUTING.md as needed
- Maintain CODE_OF_CONDUCT.md
- Engage with users on social media

## Rollback Strategy

### If Issues Found After Publishing

1. **Immediate**: Deprecate problematic version
```bash
npm deprecate modern-toasts@1.0.1 "Critical bug, use 1.0.2 instead"
```

2. **Quick Fix**: Publish patch version
```bash
# Fix the issue
npm version patch
npm publish
```

3. **Major Issues**: Unpublish (within 24 hours only)
```bash
npm unpublish modern-toasts@1.0.1
```

## Analytics and Monitoring

### npm Statistics
- Download counts: https://npm-stat.com/charts.html?package=modern-toasts
- Package info: https://www.npmjs.com/package/modern-toasts

### Bundle Analysis
- Bundle size: https://bundlephobia.com/package/modern-toasts
- Package composition: Use `npm pack` and analyze contents

### User Feedback
- GitHub issues and discussions
- npm package page comments
- Social media mentions
- Developer surveys

## Success Metrics

### Technical
- Bundle size < 10KB minified + gzipped
- Test coverage > 80%
- Zero critical security vulnerabilities
- TypeScript support score > 95%

### Adoption
- Weekly downloads > 1,000
- GitHub stars > 100
- Issues response time < 48 hours
- Community contributions

## Contact Information

- **Maintainer**: Sukarth Acharya
- **Email**: sukarthacharya@gmail.com
- **GitHub**: @sukarth
- **npm**: https://www.npmjs.com/~sukarth

## Resources

- [npm Publishing Guide](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)
- [Semantic Versioning](https://semver.org/)
- [npm CLI Documentation](https://docs.npmjs.com/cli/v8)
- [TypeScript Declaration Files](https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html)