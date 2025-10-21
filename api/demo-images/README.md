# Demo Images API

This API automatically reads images from the `public/demo-images` folder and serves them for the demo homepage.

## Endpoints

### `GET /api/demo-images/list`
Lists all images in the `public/demo-images` folder and organizes them into the 5-slider structure.

**Response:**
```json
{
  "success": true,
  "hasImages": true,
  "totalImages": 25,
  "sliders": {
    "slider1": {
      "id": 1,
      "title": "Minimalist Chic",
      "description": "Clean lines meet modern sophistication",
      "tag": "Runway Inspired",
      "images": [
        {
          "id": 1,
          "url": "/demo-images/image1.jpg",
          "name": "image1",
          "alt": "image1 demo image"
        }
      ]
    }
  }
}
```

## How It Works

1. Reads the `public/demo-images` folder
2. Filters for image files (jpg, jpeg, png, gif, webp, bmp)
3. Sorts images alphabetically (first 25 images used)
4. Automatically distributes across 5 sliders (5 images each)
5. Returns properly formatted slider data for the frontend

## Usage

Simply drop up to 25 images into `public/demo-images/` and the homepage will automatically pick them up when you refresh the demo app.
