const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const sharp = require('sharp');

async function buildExtension() {
  console.log('🚀 Starting EXOS extension build...');

  // Create directories if they don't exist
  const dirs = ['dist', 'dist/icons', 'dist/chunks', 'dist/assets', 'dist/content-scripts'];
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  // Build icons
  console.log('📦 Building icons...');
  const iconSizes = [16, 32, 48, 128];
  const svgBuffer = fs.readFileSync('src/icons/exos-icons.svg');
  
  for (const size of iconSizes) {
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(`dist/icons/${size}.png`);
  }

  // Build CSS
  console.log('🎨 Building CSS...');
  execSync('npx tailwindcss -i ./src/assets/providers.css -o ./dist/assets/providers.css');
  execSync('npx tailwindcss -i ./src/assets/sidepanel.css -o ./dist/assets/sidepanel.css');

  // Build JavaScript
  console.log('⚙️ Building JavaScript...');
  execSync('npx esbuild src/chunks/*.js --bundle --outdir=dist/chunks --format=esm');

  // Copy static files
  console.log('📄 Copying static files...');
  [
    'manifest.json',
    'background.js',
    'options.html',
    'sidepanel.html',
    'content-scripts/content.js'
  ].forEach(file => {
    fs.copyFileSync(
      path.join('src', file),
      path.join('dist', file)
    );
  });

  console.log('✅ Build complete! Extension is ready in the dist folder.');
}

buildExtension().catch(console.error);
