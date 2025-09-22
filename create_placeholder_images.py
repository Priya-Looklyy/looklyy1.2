# Create placeholder images for Looklyy

from PIL import Image, ImageDraw, ImageFont
import os
from pathlib import Path

def create_placeholder_image(width, height, text, filename, color_scheme):
    """Create a placeholder image with text"""
    # Create image with gradient background
    img = Image.new('RGB', (width, height), color_scheme['bg'])
    draw = ImageDraw.Draw(img)
    
    # Add gradient effect (simple version)
    for y in range(height):
        ratio = y / height
        r = int(color_scheme['bg'][0] * (1 - ratio) + color_scheme['grad'][0] * ratio)
        g = int(color_scheme['bg'][1] * (1 - ratio) + color_scheme['grad'][1] * ratio)
        b = int(color_scheme['bg'][2] * (1 - ratio) + color_scheme['grad'][2] * ratio)
        draw.line([(0, y), (width, y)], fill=(r, g, b))
    
    # Add text
    try:
        # Try to use a nice font
        font = ImageFont.truetype("arial.ttf", 24)
    except:
        font = ImageFont.load_default()
    
    # Get text size and center it
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    
    x = (width - text_width) // 2
    y = (height - text_height) // 2
    
    # Draw text with shadow
    draw.text((x+2, y+2), text, fill=(0, 0, 0, 128), font=font)
    draw.text((x, y), text, fill=color_scheme['text'], font=font)
    
    # Save image
    img.save(filename, 'JPEG', quality=85)

def main():
    # Create images directory
    images_dir = Path("public/images")
    images_dir.mkdir(parents=True, exist_ok=True)
    
    # Color schemes for different fashion categories
    color_schemes = [
        {"bg": (147, 51, 234), "grad": (168, 85, 247), "text": (255, 255, 255)},  # Purple
        {"bg": (236, 72, 153), "grad": (251, 113, 133), "text": (255, 255, 255)},  # Pink
        {"bg": (59, 130, 246), "grad": (96, 165, 250), "text": (255, 255, 255)},  # Blue
        {"bg": (16, 185, 129), "grad": (52, 211, 153), "text": (255, 255, 255)},  # Green
        {"bg": (245, 158, 11), "grad": (251, 191, 36), "text": (0, 0, 0)},        # Yellow
        {"bg": (239, 68, 68), "grad": (248, 113, 113), "text": (255, 255, 255)},  # Red
        {"bg": (139, 69, 19), "grad": (180, 83, 9), "text": (255, 255, 255)},     # Brown
        {"bg": (75, 85, 99), "grad": (107, 114, 128), "text": (255, 255, 255)},   # Gray
        {"bg": (124, 58, 237), "grad": (147, 51, 234), "text": (255, 255, 255)},  # Violet
        {"bg": (6, 182, 212), "grad": (34, 211, 238), "text": (0, 0, 0)},         # Cyan
    ]
    
    # Fashion trend texts
    trend_texts = [
        "Minimalist Chic",
        "Street Style",
        "Runway Fashion", 
        "Celebrity Look",
        "Vintage Revival",
        "Sustainable Style",
        "Power Dressing",
        "Casual Elegance",
        "Bohemian Vibes",
        "Modern Classic"
    ]
    
    print("🎨 Creating placeholder fashion images...")
    
    for i in range(1, 11):
        filename = images_dir / f"{i}.jpg"
        color_scheme = color_schemes[i % len(color_schemes)]
        text = trend_texts[i % len(trend_texts)]
        
        create_placeholder_image(400, 600, text, filename, color_scheme)
        print(f"   Created {filename}")
    
    print(f"✅ Created 10 placeholder images in {images_dir}")
    print("🖼️  Images are ready for the API!")

if __name__ == "__main__":
    try:
        main()
    except ImportError:
        print("❌ PIL (Pillow) not installed. Installing...")
        import subprocess
        import sys
        subprocess.check_call([sys.executable, "-m", "pip", "install", "Pillow"])
        print("✅ Pillow installed. Run the script again.")
    except Exception as e:
        print(f"❌ Error creating images: {e}")
        print("📝 Creating simple text files as placeholders...")
        
        # Fallback: create simple text files
        images_dir = Path("public/images")
        images_dir.mkdir(parents=True, exist_ok=True)
        
        for i in range(1, 11):
            with open(images_dir / f"{i}.jpg", "w") as f:
                f.write(f"Fashion Image {i}")
        
        print("✅ Created 10 placeholder files")
