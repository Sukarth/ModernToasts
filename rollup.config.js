import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read CSS file and prepare for injection
const cssContent = fs.readFileSync(path.resolve(__dirname, 'src/styles.css'), 'utf8');
const escapedCSS = cssContent.replace(/`/g, '\\`').replace(/\$/g, '\\$');

// Plugin to inject CSS into the JavaScript bundle
const injectCSS = () => ({
  name: 'inject-css',
  transform(code, id) {
    if (id.endsWith('ModernToasts.ts')) {
      return code.replace('\'/* CSS_PLACEHOLDER */\'', '`' + escapedCSS + '`');
    }
    return null;
  }
});

const baseConfig = {
  input: 'src/index.ts',
  plugins: [
    nodeResolve(),
    typescript({
      tsconfig: './tsconfig.json',
      declaration: true,
      declarationDir: './dist/types'
    }),
    injectCSS()
  ],
  external: []
};

export default [
  // UMD build for script tags
  {
    ...baseConfig,
    output: {
      file: 'dist/modern-toasts.umd.js',
      format: 'umd',
      name: 'ModernToasts',
      exports: 'named',
      globals: {}
    },
    plugins: [
      ...baseConfig.plugins
    ]
  },
  
  // Minified UMD build for script tags
  {
    ...baseConfig,
    output: {
      file: 'dist/modern-toasts.min.js',
      format: 'umd',
      name: 'ModernToasts',
      exports: 'named',
      globals: {}
    },
    plugins: [
      ...baseConfig.plugins,
      terser({
        compress: {
          drop_console: true,
          drop_debugger: true
        },
        mangle: {
          reserved: ['ModernToasts', 'toast', 'ToastType']
        }
      })
    ]
  },
  
  // ESM build for npm packages
  {
    ...baseConfig,
    output: {
      file: 'dist/modern-toasts.esm.js',
      format: 'es'
    },
    plugins: [
      ...baseConfig.plugins
    ]
  },
  
  // CommonJS build for Node.js
  {
    ...baseConfig,
    output: {
      file: 'dist/modern-toasts.cjs.js',
      format: 'cjs',
      exports: 'named'
    },
    plugins: [
      ...baseConfig.plugins
    ]
  }
];