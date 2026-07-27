// Generate all PWA icon sizes from app-icon.png (1024x1024)
import sharp from 'sharp';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { mkdirSync, existsSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');
const sourceIcon = join(publicDir, 'app-icon.png');

// Standard PWA icon sizes
const SIZES = [48, 72, 96, 128, 144, 192, 256, 384, 512];

async function generateIcons() {
  console.log(`Source: ${sourceIcon}`);
  
  for (const size of SIZES) {
    const outputPath = join(publicDir, `icon-${size}.png`);
    console.log(`Generating ${size}x${size}...`);
    await sharp(sourceIcon)
      .resize(size, size)
      .png()
      .toFile(outputPath);
  }

  // Generate maskable icons (with safe-zone padding)
  // Maskable icons need 41.67% padding from edges for Android adaptive icons
  for (const size of [192, 512]) {
    const outputPath = join(publicDir, `icon-${size}-maskable.png`);
    console.log(`Generating maskable ${size}x${size}...`);
    
    // Create a padded version: place the icon in the safe zone (58.33% of total)
    const safeSize = Math.round(size * 0.5833);
    const padded = await sharp(sourceIcon)
      .resize(safeSize, safeSize)
      .extend({
        top: Math.round((size - safeSize) / 2),
        bottom: Math.round((size - safeSize) / 2),
        left: Math.round((size - safeSize) / 2),
        right: Math.round((size - safeSize) / 2),
        background: { r: 34, g: 197, b: 94, alpha: 1 } // fresh-500 green background
      })
      .png()
      .toFile(outputPath);
  }

  console.log('Done! All icons generated.');
}

generateIcons().catch(err => {
  console.error('Icon generation failed:', err);
  process.exit(1);
});
