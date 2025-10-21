# Demo Images Folder

## How to Add Your 25 Demo Images

1. **Simply drop your images into this folder** (`public/demo-images/`)

### Supported Image Formats:
- JPG/JPEG
- PNG  
- GIF
- WebP
- BMP

### Requirements:
- **Maximum 25 images** (will use the first 25 if you add more)
- Images will be automatically organized into 5 sliders with 5 images each:
  - **Images 1-5**: Slider 1 (Minimalist Chic)
  - **Images 6-10**: Slider 2 (Autumn Elegance) 
  - **Images 11-15**: Slider 3 (Street Style Edge)
  - **Images 16-20**: Slider 4 (Classic Revival)
  - **Images 21-25**: Slider 5 (Power Dressing)

### File Naming:
- Name your files descriptively (e.g., `minimalist-outfit-1.jpg`)
- Files are sorted alphabetically, so use leading zeros if needed (e.g., `01-outfit.jpg`, `02-outfit.jpg`)

### How It Works:
1. Drop your images into this folder
2. Refresh your demo app
3. Images will automatically appear on the homepage sliders
4. No API calls or database setup needed!

### Example File Structure:
```
public/demo-images/
├── 01-minimalist-white.jpg
├── 02-minimalist-black.jpg
├── 03-autumn-orange.jpg
├── ...
└── 25-power-suit.jpg
```

The system will automatically detect and serve these images through the `/api/demo-images/list` endpoint.
