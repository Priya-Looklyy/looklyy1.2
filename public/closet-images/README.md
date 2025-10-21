# Closet Images Folder System

This folder contains the closet items organized by looks that correspond to the homepage slider images.

## Folder Structure

```
closet-images/
├── look-1/     # Corresponds to homepage slider 1, image 1
├── look-2/     # Corresponds to homepage slider 1, image 2
├── look-3/     # Corresponds to homepage slider 1, image 3
├── ...
├── look-25/    # Corresponds to homepage slider 5, image 5
```

## How to Use

1. **Upload Images**: Simply drag and drop images into the appropriate `look-X` folder
2. **Image Requirements**: 
   - Supported formats: `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`, `.bmp`
   - Images should be individual closet items (tops, bottoms, shoes, accessories, etc.)
   - Each folder can contain multiple images representing different items from that look

## Example

- `look-1/` folder should contain individual clothing items from the first look in the first homepage slider
- `look-2/` folder should contain individual clothing items from the second look in the first homepage slider
- And so on...

## Automatic Loading

The system will automatically:
- Detect all images in each folder
- Load them into the closet interface
- Display them in the 2x2 grid with smooth scrolling
- Fall back to default items if no folder images are found

No code changes needed - just upload your images to the appropriate folders!
