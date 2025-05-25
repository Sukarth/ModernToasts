const fs = require('fs');
const zlib = require('zlib');
const path = require('path');

// Create gzipped versions of all build files
const files = [
  'dist/modern-toasts.min.js',
  'dist/modern-toasts.umd.js',
  'dist/modern-toasts.esm.js',
  'dist/modern-toasts.cjs.js'
];

console.log('🗜️ Creating gzipped versions...\n');

files.forEach(file => {
  if (fs.existsSync(file)) {
    const data = fs.readFileSync(file);
    const compressed = zlib.gzipSync(data);
    const gzippedFile = file + '.gz';
    
    fs.writeFileSync(gzippedFile, compressed);
    
    console.log(`✅ Created ${path.basename(gzippedFile)}`);
    console.log(`   Size: ${(compressed.length / 1024).toFixed(2)} KB`);
  }
});

console.log('\n🎉 All gzipped files created successfully!');