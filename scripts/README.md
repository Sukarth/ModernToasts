# Build Scripts

This folder contains utility scripts for the ModernToasts build process.

## Scripts

### `check-size.cjs`
Analyzes bundle sizes for all build outputs and shows compression ratios.

**Usage:**
```bash
npm run size
```

**Output:**
- Original file sizes in KB
- Gzipped file sizes in KB  
- Compression ratios

### `create-gzipped.cjs`
Creates pre-compressed gzipped versions of all build outputs for optimal CDN delivery.

**Usage:**
```bash
# Automatically run during build
npm run build

# Or run directly
node scripts/create-gzipped.cjs
```

**Output:**
- `*.js.gz` files in the `dist/` directory
- Size confirmation for each compressed file

## Development

These scripts are written in CommonJS format (`.cjs`) to work with the project's ES module configuration.

Both scripts use Node.js built-in modules:
- `fs` - File system operations
- `zlib` - Gzip compression
- `path` - Path utilities