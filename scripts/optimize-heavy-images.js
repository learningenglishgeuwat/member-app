const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function optimizeImages() {
  console.log('Starting optimization of heavy images...');
  
  const publicDir = path.join(__dirname, 'public');
  const appDir = path.join(__dirname, 'app');

  const tourGuideImgPath = path.join(publicDir, 'saya_butuh_kepalanya_saja_2K_202606030940.png');
  const logoImgPath = path.join(publicDir, 'rasio_1_1_2K_202606030906.png');
  
  // 1. Optimize Tour Guide Avatar
  if (fs.existsSync(tourGuideImgPath)) {
    console.log('Optimizing Tour Guide Avatar...');
    await sharp(tourGuideImgPath)
      .resize(300, 300, { fit: 'inside' })
      .webp({ quality: 80 })
      .toFile(path.join(publicDir, 'tour_guide_avatar.webp'));
    console.log('✅ Created tour_guide_avatar.webp');
  } else {
    console.log('⚠️ Tour Guide avatar not found');
  }

  // 2. Optimize Login Header Logo
  if (fs.existsSync(logoImgPath)) {
    console.log('Optimizing Login Logo...');
    await sharp(logoImgPath)
      .resize(500, 500, { fit: 'inside' })
      .webp({ quality: 80 })
      .toFile(path.join(publicDir, 'login_logo.webp'));
    console.log('✅ Created login_logo.webp');

    // 3. Generate Icons for App
    console.log('Generating App Icons...');
    await sharp(logoImgPath)
      .resize(512, 512)
      .png({ quality: 90 })
      .toFile(path.join(appDir, 'icon.png'));
    console.log('✅ Generated app/icon.png (512x512)');

    await sharp(logoImgPath)
      .resize(180, 180)
      .png({ quality: 90 })
      .toFile(path.join(appDir, 'apple-icon.png'));
    console.log('✅ Generated app/apple-icon.png (180x180)');
    
    // Create a 32x32 png for favicon
    await sharp(logoImgPath)
      .resize(32, 32)
      .png()
      .toFile(path.join(appDir, 'favicon.png'));
    console.log('✅ Generated app/favicon.png (32x32)');
  } else {
    console.log('⚠️ Logo image not found');
  }

  console.log('Done.');
}

optimizeImages().catch(console.error);
