const fs = require('fs');
const zlib = require('zlib');
const path = require('path');

// Check all build files
const files = [
  'dist/modern-toasts.min.js',
  'dist/modern-toasts.umd.js',
  'dist/modern-toasts.esm.js',
  'dist/modern-toasts.cjs.js'
];

console.log('📦 ModernToasts Bundle Size Analysis\n');

files.forEach(file => {
  if (fs.existsSync(file)) {
    const data = fs.readFileSync(file);
    const compressed = zlib.gzipSync(data);
    
    console.log(`📄 ${path.basename(file)}:`);
    console.log(`   Original: ${(data.length / 1024).toFixed(2)} KB`);
    console.log(`   Gzipped:  ${(compressed.length / 1024).toFixed(2)} KB`);
    console.log(`   Ratio:    ${((compressed.length / data.length) * 100).toFixed(1)}%\n`);
  }
});