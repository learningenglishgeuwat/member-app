#!/usr/bin/env python3
"""
Image optimization script - converts PNG avatars to WebP format
Reduces Kepala.png from 179KB to ~15-20KB
"""

import os
import sys
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    print("Error: PIL/Pillow not found. Installing...")
    os.system(f"{sys.executable} -m pip install Pillow -q")
    from PIL import Image

PUBLIC_DIR = Path(__file__).parent / "public"

images = [
    {"name": "Kepala.png", "output": "Kepala.webp", "quality": 75},
    {"name": "Kepala1.png", "output": "Kepala1.webp", "quality": 75},
]

def optimize_images():
    print("🖼️  Starting image optimization...\n")
    
    total_input = 0
    total_output = 0
    
    for img_config in images:
        input_path = PUBLIC_DIR / img_config["name"]
        output_path = PUBLIC_DIR / img_config["output"]
        
        if not input_path.exists():
            print(f"⚠️  Skipping {img_config['name']} - file not found")
            continue
        
        try:
            # Get input file size
            input_size = input_path.stat().st_size / 1024
            total_input += input_size
            
            # Open and convert
            img = Image.open(input_path)
            
            # Convert RGBA to RGB if necessary (for better WebP compression)
            if img.mode in ('RGBA', 'LA', 'P'):
                # Create white background
                background = Image.new('RGB', img.size, (255, 255, 255))
                # Paste with alpha mask
                if img.mode == 'P':
                    img = img.convert('RGBA')
                background.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
                img = background
            
            # Save as WebP
            img.save(
                output_path,
                'WebP',
                quality=img_config["quality"],
                method=6  # Slowest, best compression
            )
            
            # Get output file size
            output_size = output_path.stat().st_size / 1024
            total_output += output_size
            
            savings = input_size - output_size
            reduction_pct = (savings / input_size) * 100
            
            print(f"✅ {img_config['name']}")
            print(f"   Input:  {input_size:.2f} KiB")
            print(f"   Output: {output_size:.2f} KiB")
            print(f"   Saved:  {savings:.2f} KiB ({reduction_pct:.1f}% reduction)")
            print()
            
        except Exception as e:
            print(f"❌ Error processing {img_config['name']}: {e}\n")
    
    print(f"✨ Optimization complete!")
    print(f"Total input:  {total_input:.2f} KiB")
    print(f"Total output: {total_output:.2f} KiB")
    print(f"Total saved:  {total_input - total_output:.2f} KiB ({((total_input-total_output)/total_input)*100:.1f}%)\n")
    
    print("Next steps:")
    print("1. Update image sources from .png to .webp in components")
    print("2. Remove the ?v=20260528 query params (no longer needed)")
    print("3. Test on mobile and desktop")
    print("4. Run lighthouse to verify the savings\n")

if __name__ == "__main__":
    optimize_images()
