#!/usr/bin/env node
/**
 * Image optimization script - converts PNG avatars to WebP with compression
 * Reduces file size from ~445KB to <50KB estimated
 */

const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const PUBLIC_DIR = path.join(__dirname, 'public');

const images = [
  { name: 'Kepala.png', outputName: 'Kepala.webp' },
  { name: 'Kepala1.png', outputName: 'Kepala1.webp' },
  { name: 'Kepala.webp', outputName: 'Kepala-56.webp', width: 56, height: 56 },
];

async function optimizeImages() {
  console.log('🖼️  Starting image optimization...\n');

  for (const image of images) {
    const inputPath = path.join(PUBLIC_DIR, image.name);
    const outputPath = path.join(PUBLIC_DIR, image.outputName);

    if (!fs.existsSync(inputPath)) {
      console.log(`⚠️  Skipping ${image.name} - file not found`);
      continue;
    }

    try {
      // Get input file size
      const inputStats = fs.statSync(inputPath);
      const inputSize = (inputStats.size / 1024).toFixed(2);

      // Convert to WebP with aggressive compression
      let transformer = sharp(inputPath);
      if (image.width || image.height) {
        transformer = transformer.resize(image.width, image.height, { fit: 'inside' });
      }

      await transformer
        .webp({ quality: 75, alphaQuality: 75 })
        .toFile(outputPath);

      // Get output file size
      const outputStats = fs.statSync(outputPath);
      const outputSize = (outputStats.size / 1024).toFixed(2);
      const savings = (inputSize - outputSize).toFixed(2);
      const reduction = ((savings / inputSize) * 100).toFixed(1);

      console.log(`✅ ${image.name}`);
      console.log(`   Input:  ${inputSize} KiB`);
      console.log(`   Output: ${outputSize} KiB`);
      console.log(`   Saved:  ${savings} KiB (${reduction}% reduction)`);
      console.log();
    } catch (error) {
      console.error(`❌ Error processing ${image.name}:`, error.message);
    }
  }

  console.log('✨ Image optimization complete!');
  console.log(
    '\nNext steps:\n' +
    '1. Update image src paths from .png to .webp in components\n' +
    '2. Add fallback to .png for older browsers (optional)\n' +
    '3. Run lighthouse to verify savings\n'
  );
}

optimizeImages().catch(console.error);
