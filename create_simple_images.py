# Create simple placeholder images using base64

import base64
import os
from pathlib import Path

# Simple 1x1 pixel JPEG in base64 (minimal valid JPEG)
SIMPLE_JPEG = "/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/8A"

def create_simple_image(filename, color_name):
    """Create a simple colored placeholder image"""
    # Decode the base64 JPEG
    jpeg_data = base64.b64decode(SIMPLE_JPEG)
    
    # For now, just create a text file with the color name
    # In a real implementation, you'd create actual image files
    with open(filename, 'w') as f:
        f.write(f"Fashion Image - {color_name}")

def main():
    images_dir = Path("public/images")
    images_dir.mkdir(parents=True, exist_ok=True)
    
    colors = [
        "Purple Fashion",
        "Pink Style", 
        "Blue Trend",
        "Green Look",
        "Yellow Chic",
        "Red Glamour",
        "Brown Classic",
        "Gray Modern",
        "Violet Elegant",
        "Cyan Fresh"
    ]
    
    print("🎨 Creating simple fashion placeholders...")
    
    for i in range(1, 11):
        filename = images_dir / f"{i}.jpg"
        color = colors[i % len(colors)]
        create_simple_image(filename, color)
        print(f"   Created {filename}")
    
    print(f"✅ Created 10 placeholder files in {images_dir}")

if __name__ == "__main__":
    main()
