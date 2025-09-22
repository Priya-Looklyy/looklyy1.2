#!/usr/bin/env python3
# Looklyy Startup Script with Image Initialization

import subprocess
import time
import sys
from pathlib import Path

def main():
    print("🚀 Starting Looklyy with Local Image Storage...")
    
    # Check if public/images directory exists
    images_dir = Path("public/images")
    if not images_dir.exists():
        print("📁 Creating images directory...")
        images_dir.mkdir(parents=True, exist_ok=True)
    
    # Initialize image manager and download initial images
    print("🖼️  Initializing image cache...")
    try:
        from image_manager import image_manager
        
        # Download initial set of images
        print("📥 Downloading initial fashion images...")
        for i in range(1, 51):
            image_manager.get_local_image_url(i)
            if i % 10 == 0:
                print(f"   Downloaded {i}/50 images...")
        
        stats = image_manager.get_image_stats()
        print(f"✅ Image cache initialized: {stats['total_images']} images, {stats['total_size_mb']} MB")
        
    except Exception as e:
        print(f"⚠️  Image initialization failed: {e}")
        print("   Continuing with fallback images...")
    
    # Start the API server
    print("🌐 Starting API server...")
    try:
        subprocess.run([sys.executable, "mock_api.py"], check=True)
    except KeyboardInterrupt:
        print("\n🛑 Shutting down Looklyy...")
    except Exception as e:
        print(f"❌ Failed to start API: {e}")

if __name__ == "__main__":
    main()
