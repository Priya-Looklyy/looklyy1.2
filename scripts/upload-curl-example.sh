#!/bin/bash

# Example cURL command to upload demo images
# Replace the image URLs with your actual image URLs

curl -X POST http://localhost:3000/api/homepage-demo-images/upload \
  -H "Content-Type: application/json" \
  -d '{
    "images": [
      {
        "url": "https://your-image1.com/image1.jpg",
        "name": "Your Image 1",
        "alt": "Description of your image 1"
      },
      {
        "url": "https://your-image2.com/image2.jpg", 
        "name": "Your Image 2",
        "alt": "Description of your image 2"
      }
      // Add 23 more images here...
    ]
  }'
