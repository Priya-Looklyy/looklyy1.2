# Looklyy Image Manager - Local Storage & Cron Updates

import os
import requests
import json
import hashlib
from datetime import datetime, timedelta
from pathlib import Path
import schedule
import time
import logging

class LooklyyImageManager:
    def __init__(self):
        self.base_dir = Path("public/images")
        self.cache_dir = self.base_dir / "cache"
        self.metadata_file = self.base_dir / "image_metadata.json"
        self.logger = logging.getLogger("image_manager")
        
        # Create directories
        self.base_dir.mkdir(exist_ok=True)
        self.cache_dir.mkdir(exist_ok=True)
        
        # Load existing metadata
        self.metadata = self.load_metadata()
        
        # Fashion image sources (reliable, high-quality)
        self.fashion_sources = [
            "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=600&fit=crop&q=80",
            "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=600&fit=crop&q=80",
            "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=600&fit=crop&q=80",
            "https://images.unsplash.com/photo-1566479179817-c0b30c6e9b33?w=400&h=600&fit=crop&q=80",
            "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=600&fit=crop&q=80",
            "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=600&fit=crop&q=80",
            "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=600&fit=crop&q=80",
            "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=600&fit=crop&q=80",
            "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=600&fit=crop&q=80",
            "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=600&fit=crop&q=80",
            "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=600&fit=crop&q=80",
            "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=600&fit=crop&q=80",
            "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=400&h=600&fit=crop&q=80",
            "https://images.unsplash.com/photo-1542295669297-4d352b042bca?w=400&h=600&fit=crop&q=80",
            "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400&h=600&fit=crop&q=80"
        ]
    
    def load_metadata(self):
        """Load image metadata from file"""
        if self.metadata_file.exists():
            try:
                with open(self.metadata_file, 'r') as f:
                    return json.load(f)
            except:
                pass
        return {"images": {}, "last_update": None}
    
    def save_metadata(self):
        """Save image metadata to file"""
        with open(self.metadata_file, 'w') as f:
            json.dump(self.metadata, f, indent=2)
    
    def get_image_hash(self, url):
        """Generate hash for image URL"""
        return hashlib.md5(url.encode()).hexdigest()
    
    def download_image(self, url, image_id):
        """Download and cache an image"""
        try:
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            
            # Generate filename
            file_extension = url.split('.')[-1].split('?')[0]
            if file_extension not in ['jpg', 'jpeg', 'png', 'webp']:
                file_extension = 'jpg'
            
            filename = f"{image_id}.{file_extension}"
            filepath = self.cache_dir / filename
            
            # Save image
            with open(filepath, 'wb') as f:
                f.write(response.content)
            
            # Update metadata
            self.metadata["images"][str(image_id)] = {
                "filename": filename,
                "url": url,
                "downloaded_at": datetime.now().isoformat(),
                "size": len(response.content),
                "status": "cached"
            }
            
            self.logger.info(f"Downloaded image {image_id}: {filename}")
            return f"/images/cache/{filename}"
            
        except Exception as e:
            self.logger.error(f"Failed to download image {image_id}: {e}")
            # Return a fallback image
            return "/images/fallback.jpg"
    
    def get_local_image_url(self, image_id, source_url=None):
        """Get local image URL, download if not cached"""
        image_id_str = str(image_id)
        
        # Check if already cached
        if image_id_str in self.metadata["images"]:
            cached_info = self.metadata["images"][image_id_str]
            filepath = self.cache_dir / cached_info["filename"]
            
            if filepath.exists():
                return f"/images/cache/{cached_info['filename']}"
        
        # Download if not cached
        if source_url:
            return self.download_image(source_url, image_id)
        else:
            # Use rotating fashion sources
            source_index = image_id % len(self.fashion_sources)
            return self.download_image(self.fashion_sources[source_index], image_id)
    
    def update_all_images(self):
        """Update all cached images (cron job)"""
        self.logger.info("Starting image update cycle...")
        
        updated_count = 0
        for image_id, info in self.metadata["images"].items():
            try:
                # Re-download image
                local_url = self.download_image(info["url"], int(image_id))
                updated_count += 1
                
            except Exception as e:
                self.logger.error(f"Failed to update image {image_id}: {e}")
        
        self.metadata["last_update"] = datetime.now().isoformat()
        self.save_metadata()
        
        self.logger.info(f"Updated {updated_count} images")
        return updated_count
    
    def cleanup_old_images(self, days_old=30):
        """Remove images older than specified days"""
        cutoff_date = datetime.now() - timedelta(days=days_old)
        
        to_remove = []
        for image_id, info in self.metadata["images"].items():
            downloaded_at = datetime.fromisoformat(info["downloaded_at"])
            if downloaded_at < cutoff_date:
                to_remove.append(image_id)
        
        for image_id in to_remove:
            info = self.metadata["images"][image_id]
            filepath = self.cache_dir / info["filename"]
            if filepath.exists():
                filepath.unlink()
            del self.metadata["images"][image_id]
        
        self.save_metadata()
        self.logger.info(f"Cleaned up {len(to_remove)} old images")
    
    def get_image_stats(self):
        """Get image cache statistics"""
        total_images = len(self.metadata["images"])
        total_size = sum(info["size"] for info in self.metadata["images"].values())
        
        return {
            "total_images": total_images,
            "total_size_mb": round(total_size / (1024 * 1024), 2),
            "last_update": self.metadata.get("last_update"),
            "cache_dir": str(self.cache_dir)
        }

# Global instance
image_manager = LooklyyImageManager()

# Cron job setup
def setup_cron_jobs():
    """Setup scheduled image updates"""
    # Update images every 6 hours
    schedule.every(6).hours.do(image_manager.update_all_images)
    
    # Cleanup old images daily
    schedule.every().day.at("02:00").do(image_manager.cleanup_old_images)
    
    logging.info("Cron jobs scheduled: 6-hour updates, daily cleanup")

def run_scheduler():
    """Run the scheduler (for background process)"""
    setup_cron_jobs()
    while True:
        schedule.run_pending()
        time.sleep(60)  # Check every minute

if __name__ == "__main__":
    # Initial image download
    logging.basicConfig(level=logging.INFO)
    print("🖼️  Looklyy Image Manager - Downloading initial images...")
    
    # Download initial set of images
    for i in range(1, 51):
        image_manager.get_local_image_url(i)
    
    print(f"✅ Downloaded {len(image_manager.metadata['images'])} images")
    print(f"📊 Stats: {image_manager.get_image_stats()}")
    
    # Start scheduler
    print("⏰ Starting cron scheduler...")
    run_scheduler()
