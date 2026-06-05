import os
import sys
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    print("Error: PIL/Pillow not found. Installing...")
    os.system(f"{sys.executable} -m pip install Pillow -q")
    from PIL import Image

def optimize_heavy_images():
    print("Starting image optimization...\n")
    
    public_dir = Path(__file__).parent.parent / "public"
    app_dir = Path(__file__).parent.parent / "app"
    
    tour_guide_img = public_dir / "saya_butuh_kepalanya_saja_2K_202606030940.png"
    logo_img = public_dir / "rasio_1_1_2K_202606030906.png"

    if tour_guide_img.exists():
        print("Optimizing Tour Guide Avatar...")
        img = Image.open(tour_guide_img)
        img.thumbnail((300, 300), Image.Resampling.LANCZOS)
        img.save(public_dir / "tour_guide_avatar.webp", "WebP", quality=80)
        print("✅ Created tour_guide_avatar.webp")
    else:
        print("⚠️ Tour Guide avatar not found")

    if logo_img.exists():
        print("Optimizing Login Logo...")
        img = Image.open(logo_img)
        img_copy = img.copy()
        img_copy.thumbnail((500, 500), Image.Resampling.LANCZOS)
        img_copy.save(public_dir / "login_logo.webp", "WebP", quality=80)
        print("✅ Created login_logo.webp")

        print("Generating App Icons...")
        icon_img = img.copy()
        icon_img.thumbnail((512, 512), Image.Resampling.LANCZOS)
        icon_img.save(app_dir / "icon.png", "PNG")
        print("✅ Created app/icon.png (512x512)")

        apple_img = img.copy()
        apple_img.thumbnail((180, 180), Image.Resampling.LANCZOS)
        apple_img.save(app_dir / "apple-icon.png", "PNG")
        print("✅ Created app/apple-icon.png (180x180)")

        favicon_img = img.copy()
        favicon_img.thumbnail((32, 32), Image.Resampling.LANCZOS)
        favicon_img.save(app_dir / "favicon.png", "PNG")
        print("✅ Created app/favicon.png (32x32)")
    else:
        print("⚠️ Logo image not found")

if __name__ == "__main__":
    optimize_heavy_images()
