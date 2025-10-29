# Closet Looks Images - 7 Weekly Looks

This folder contains the 7 main closet looks that appear on the Closet page (Monday through Sunday).

## Folder Structure

```
closet-looks/
├── monday/      # Monday Look
├── tuesday/     # Tuesday Look  
├── wednesday/   # Wednesday Look
├── thursday/    # Thursday Look
├── friday/      # Friday Look
├── saturday/    # Saturday Look (Weekend - Purple band)
└── sunday/      # Sunday Look (Weekend - Purple band)
```

## How to Upload Your Images

### **Step 1: Prepare Your Images**
- **Supported formats**: `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`, `.bmp`
- **Recommended size**: 400x600px or similar aspect ratio
- **Quality**: High resolution for best display

### **Step 2: Upload to Correct Folders**
1. **Monday Look**: Upload your Monday outfit image to `monday/` folder
2. **Tuesday Look**: Upload your Tuesday outfit image to `tuesday/` folder
3. **Wednesday Look**: Upload your Wednesday outfit image to `wednesday/` folder
4. **Thursday Look**: Upload your Thursday outfit image to `thursday/` folder
5. **Friday Look**: Upload your Friday outfit image to `friday/` folder
6. **Saturday Look**: Upload your Saturday outfit image to `saturday/` folder
7. **Sunday Look**: Upload your Sunday outfit image to `sunday/` folder

### **Step 3: File Naming**
- Name your main image as `main.jpg` or `main.png` (this will be the primary display image)
- You can also add additional images with any names (they'll be used as alternatives)

## Visual Indicators

- **Weekdays** (Mon-Fri): Gray transparent band at top
- **Weekends** (Sat-Sun): Purple transparent band at top
- **Action Icons**: Heart (Love) and Change icons at bottom

## Automatic Loading

The system will automatically:
- Detect images in each folder
- Use the main image for display
- Fall back to default images if no custom images are found
- Apply the correct weekday/weekend styling

## Example File Structure After Upload:

```
closet-looks/
├── monday/
│   └── main.jpg
├── tuesday/
│   └── main.png
├── wednesday/
│   ├── main.jpg
│   └── alternative.jpg
├── thursday/
│   └── main.jpeg
├── friday/
│   └── main.png
├── saturday/
│   └── main.jpg
└── sunday/
    └── main.png
```

**No code changes needed - just upload your images!**
