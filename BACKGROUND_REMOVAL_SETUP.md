# Background Removal Setup Guide

## 🎯 Overview
This guide explains how to set up the proven background removal system for the Looklyy demo project.

## 🔧 Setup Steps

### 1. Get Remove.bg API Key
1. Visit [remove.bg](https://www.remove.bg/api)
2. Sign up for an account
3. Get your API key from the dashboard

### 2. Configure Environment Variables
Create a `.env` file in the project root:

```bash
# Copy from env.example
cp env.example .env
```

Edit `.env` and add your API key:
```bash
# Background Removal API
REMOVEBG_API_KEY="your-actual-remove-bg-api-key-here"

# Frontend Environment Variables  
REACT_APP_API_BASE_URL="/api"
```

### 3. Test the System
1. Start the development server: `npm run dev`
2. Navigate to the demo page
3. Drag an item from closet to canvas
4. Check browser console for processing messages

## 🎨 How It Works

### Frontend Flow:
1. User drags item to canvas
2. `applyBackgroundRemoval()` is called
3. Frontend sends image URL to backend
4. Backend processes with Remove.bg API
5. Returns PNG with transparency
6. Frontend displays paper cutout

### Backend Flow:
1. Receives image URL from frontend
2. Calls Remove.bg API with proper parameters
3. Returns PNG buffer with transparency
4. Sets correct headers for frontend

## 🔍 Console Messages
You should see these messages when working:
- `🎯 Starting background removal for: [imageUrl]`
- `🚀 Processing image with backend service...`
- `✅ Backend processing complete - PNG with transparency`

## 🚨 Troubleshooting

### API Key Issues:
- Ensure `REMOVEBG_API_KEY` is set correctly
- Check that the API key is valid and has credits

### CORS Issues:
- The backend sets proper CORS headers
- If issues persist, check browser network tab

### Image Processing Issues:
- Check that image URLs are accessible
- Verify Remove.bg API is responding

## 📊 Features
- ✅ **Guaranteed PNG Transparency**: Remove.bg returns proper PNG with alpha channel
- ✅ **Secure API Key**: Key stays on backend, not exposed to frontend
- ✅ **Error Handling**: Graceful fallback to original image
- ✅ **CORS Support**: Proper headers for cross-origin requests
- ✅ **Production Ready**: Proven implementation from previous project

## 🎯 Result
Users can now drag items from closet/partner brands to the canvas and see them as clean paper cutouts with transparent backgrounds, just like in your proven implementation!
