# Image System Guide for Looklyy Slider

## 📁 Storage Location

**Directory Path:** `looklyy-demo/public/demo-images/`

All slider images are stored in the `public/demo-images/` folder. This is a Next.js public directory, meaning files here are served directly at the root URL path.

**Full Path Structure:**
```
looklyy-demo/
  └── public/
      └── demo-images/
          ├── 1.jpg
          ├── 2.jpg
          ├── 3.jpg
          ...
          ├── 27.jpg
          ├── 10        (special case - no extension)
          └── 11        (special case - no extension)
```

## 📝 File Naming Convention

### Current System:
- **Format:** Sequential numbers from 1 to 27
- **Extension:** `.jpg` (JPEG format)
- **Special Cases:** Files `10` and `11` have NO file extension (just the number)

### How It Works in Code:
```javascript
// Code generates paths like this:
sliderImagesArray = [
  '/demo-images/1.jpg',
  '/demo-images/2.jpg',
  ...
  '/demo-images/9.jpg',
  '/demo-images/10',      // No .jpg extension
  '/demo-images/11',      // No .jpg extension
  '/demo-images/12.jpg',
  ...
  '/demo-images/27.jpg'
]
```

**Total Images:** 27 images (numbered 1-27)

## 🖼️ Image Format & Technical Specifications

### Format:
- **Primary Format:** JPEG (`.jpg`)
- **Why JPEG:** Good balance of quality and file size for photos
- **Alternative:** You could use PNG, but JPEG is recommended for photos

### Aspect Ratio:
- **Required:** `3:4` (portrait orientation)
- **Why:** The polaroid card container uses `aspect-[3/4]` CSS class
- **Example:** If width is 300px, height should be 400px

### Display Dimensions:

#### Polaroid Card Container:
- **Mobile:** `280px` wide × `373px` tall (280 × 1.333 = 373px for 3:4 ratio)
- **Small screens:** `320px` wide × `427px` tall
- **Desktop/Large:** `380px` wide × `507px` tall

#### Image Display Area:
- **Container:** `aspect-[3/4]` (3:4 ratio)
- **Image:** Uses `object-cover` - images fill the container and crop if needed
- **Padding:** White polaroid frame has `p-4` (16px) padding, with `pb-10` (40px) bottom padding for caption

### Recommended Image Dimensions:

**For Best Quality:**
- **Minimum:** 570px × 760px (3:4 ratio)
- **Recommended:** 1140px × 1520px (2x for retina displays)
- **Maximum:** 2280px × 3040px (4x for ultra-high DPI)

**Why these sizes:**
- 380px (desktop card width) × 3 = 1140px (3x for retina)
- Maintains sharp quality on all devices
- Not too large to slow down loading

## 🎨 Visual Design Constraints

### Polaroid Frame:
- **White background:** `bg-white`
- **Rounded corners:** `rounded-2xl` (16px border radius)
- **Shadow:** `shadow-2xl` (large drop shadow)
- **Padding:** 16px on all sides, 40px bottom (for caption space)

### Image Container:
- **Background:** Light gray (`bg-gray-100`) while loading
- **Rounded:** `rounded-xl` (12px border radius)
- **Overflow:** `overflow-hidden` (clips image to container)

### Image Styling:
- **Object Fit:** `object-cover` - fills container, maintains aspect ratio, crops if needed
- **Position:** Center-focused (important for cropping)
- **Transition:** Smooth fade-in on load

## 🔄 How Images Are Loaded

### 1. **Path Generation:**
```javascript
// In page.tsx, line 40-47
const sliderImagesArray = Array.from({ length: 27 }, (_, i) => {
  const num = i + 1;
  if (num === 10 || num === 11) {
    return `/demo-images/${num}`;  // No extension
  }
  return `/demo-images/${num}.jpg`; // With .jpg extension
});
```

### 2. **Preloading:**
- Images for visible slides (center + 3 on each side = 7 total) are preloaded
- Uses `document.createElement('img')` to cache in browser
- Happens automatically when slider index changes

### 3. **Display:**
- Each image is wrapped in a `PolaroidCard` component
- Images load with `loading="eager"` (immediate loading)
- Fallback to `/single-homepage-image.jpg` if image fails to load

### 4. **Error Handling:**
- 10-second timeout per image
- If image doesn't load → tries fallback image
- If fallback fails → shows "Image unavailable" message

## 📐 Design Recommendations for New Images

### 1. **Aspect Ratio:**
✅ **MUST BE 3:4 (Portrait)**
- Width : Height = 3 : 4
- Example: 900px × 1200px, 1140px × 1520px

### 2. **Subject Positioning:**
- **Center-focused:** Important elements should be in the center
- **Why:** `object-cover` may crop edges, center stays visible
- **Safe Zone:** Keep important content within 80% of center area

### 3. **File Size:**
- **Target:** 200-500 KB per image
- **Maximum:** 1 MB (for fast loading)
- **Optimization:** Compress JPEGs at 80-85% quality

### 4. **Content Guidelines:**
- **Fashion looks:** Full-body or 3/4 body shots work best
- **Vertical orientation:** Portrait format (not landscape)
- **Background:** Can be any, but will be cropped to 3:4
- **Style:** Consistent aesthetic across all 27 images

### 5. **Naming Your New Images:**
```
1.jpg, 2.jpg, 3.jpg, ..., 9.jpg
10.jpg (or just "10" if you want to match current system)
11.jpg (or just "11" if you want to match current system)
12.jpg, 13.jpg, ..., 27.jpg
```

**Recommendation:** Use `.jpg` extension for all files (including 10 and 11) for consistency.

## 🔧 How to Replace Images

### Step-by-Step Process:

1. **Prepare Your Images:**
   - Resize to 3:4 aspect ratio
   - Optimize file size (200-500 KB)
   - Name them: `1.jpg`, `2.jpg`, ..., `27.jpg`

2. **Replace Files:**
   - Navigate to: `looklyy-demo/public/demo-images/`
   - Replace existing files with your new images
   - Keep the same naming convention

3. **Update Code (if needed):**
   - If you want to use `.jpg` for files 10 and 11, update line 43-44 in `page.tsx`:
   ```javascript
   // Change from:
   if (num === 10 || num === 11) {
     return `/demo-images/${num}`;
   }
   // To:
   if (num === 10 || num === 11) {
     return `/demo-images/${num}.jpg`;  // Add .jpg extension
   }
   ```

4. **Test:**
   - Clear browser cache
   - Check that all 27 images load correctly
   - Verify aspect ratio looks correct in polaroid frames

## 📊 Current Image Inventory

**Total:** 27 images
- Files 1-9: `.jpg` format
- File 10: No extension (just "10")
- File 11: No extension (just "11")
- Files 12-27: `.jpg` format

**Fallback Image:** `/single-homepage-image.jpg` (used if any image fails to load)

## ⚠️ Important Notes

1. **Aspect Ratio is Critical:** Images MUST be 3:4 ratio, or they will be cropped
2. **File Names Matter:** Must be sequential numbers (1-27)
3. **Extension Consistency:** Recommend using `.jpg` for all files
4. **File Size:** Keep under 1 MB for performance
5. **Center Focus:** Important content should be centered (edges may crop)
6. **Format:** JPEG recommended (PNG works but larger file sizes)

## 🎯 Quick Checklist for New Images

- [ ] 27 images total (numbered 1-27)
- [ ] All images are 3:4 aspect ratio (portrait)
- [ ] Recommended size: 1140px × 1520px
- [ ] File format: JPEG (.jpg)
- [ ] File size: 200-500 KB each
- [ ] Important content centered
- [ ] Consistent style across all images
- [ ] Named sequentially: 1.jpg, 2.jpg, ..., 27.jpg
- [ ] Stored in: `public/demo-images/` folder
