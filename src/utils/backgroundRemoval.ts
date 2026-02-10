// Background removal utility for Looklyy
// Provides scrapbook-style cut-out effects for fashion items

interface BackgroundColor {
  r: number;
  g: number;
  b: number;
}

/**
 * Detects the background color by sampling edge pixels
 */
const getBackgroundColor = (data: Uint8ClampedArray, width: number, height: number): BackgroundColor => {
  const samples: BackgroundColor[] = [];
  
  // Sample from edges
  for (let x = 0; x < width; x += 10) {
    // Top edge
    const topIndex = x * 4;
    samples.push({ r: data[topIndex], g: data[topIndex + 1], b: data[topIndex + 2] });
    
    // Bottom edge
    const bottomIndex = ((height - 1) * width + x) * 4;
    samples.push({ r: data[bottomIndex], g: data[bottomIndex + 1], b: data[bottomIndex + 2] });
  }
  
  for (let y = 0; y < height; y += 10) {
    // Left edge
    const leftIndex = y * width * 4;
    samples.push({ r: data[leftIndex], g: data[leftIndex + 1], b: data[leftIndex + 2] });
    
    // Right edge
    const rightIndex = (y * width + width - 1) * 4;
    samples.push({ r: data[rightIndex], g: data[rightIndex + 1], b: data[rightIndex + 2] });
  }
  
  // Calculate average background color
  const avgColor = samples.reduce(
    (acc, color) => ({
      r: acc.r + color.r,
      g: acc.g + color.g,
      b: acc.b + color.b,
    }),
    { r: 0, g: 0, b: 0 }
  );
  
  return {
    r: Math.round(avgColor.r / samples.length),
    g: Math.round(avgColor.g / samples.length),
    b: Math.round(avgColor.b / samples.length),
  };
};

/**
 * Flood fill algorithm to detect connected background regions
 */
const floodFillBackground = (
  isBackground: boolean[],
  width: number,
  height: number,
  data: Uint8ClampedArray,
  backgroundColor: BackgroundColor
): void => {
  const visited = new Array(isBackground.length).fill(false);
  const threshold = 30;
  
  const floodFill = (startIndex: number) => {
    const stack = [startIndex];
    
    while (stack.length > 0) {
      const index = stack.pop()!;
      if (visited[index]) continue;
      
      visited[index] = true;
      const pixelIndex = index * 4;
      
      const r = data[pixelIndex];
      const g = data[pixelIndex + 1];
      const b = data[pixelIndex + 2];
      
      const colorDiff = Math.sqrt(
        Math.pow(r - backgroundColor.r, 2) +
        Math.pow(g - backgroundColor.g, 2) +
        Math.pow(b - backgroundColor.b, 2)
      );
      
      if (colorDiff < threshold) {
        isBackground[index] = true;
        
        // Add neighbors to stack
        const row = Math.floor(index / width);
        const col = index % width;
        
        const neighbors = [
          { r: row - 1, c: col },     // top
          { r: row + 1, c: col },     // bottom
          { r: row, c: col - 1 },     // left
          { r: row, c: col + 1 },     // right
        ];
        
        neighbors.forEach(({ r: newRow, c: newCol }) => {
          if (newRow >= 0 && newRow < height && newCol >= 0 && newCol < width) {
            const neighborIndex = newRow * width + newCol;
            if (!visited[neighborIndex]) {
              stack.push(neighborIndex);
            }
          }
        });
      }
    }
  };
  
  // Start flood fill from edges
  for (let x = 0; x < width; x++) {
    floodFill(x); // Top edge
    floodFill((height - 1) * width + x); // Bottom edge
  }
  
  for (let y = 0; y < height; y++) {
    floodFill(y * width); // Left edge
    floodFill(y * width + width - 1); // Right edge
  }
};

/**
 * Calculate edge alpha for smooth transitions
 */
const calculateEdgeAlpha = (
  data: Uint8ClampedArray,
  pixelIndex: number,
  width: number,
  height: number,
  isBackground: boolean[]
): number => {
  const pixelRow = Math.floor(pixelIndex / 4 / width);
  const pixelCol = (pixelIndex / 4) % width;
  
  let backgroundNeighbors = 0;
  let totalNeighbors = 0;
  
  // Check 5x5 neighborhood for smooth edges
  for (let dr = -2; dr <= 2; dr++) {
    for (let dc = -2; dc <= 2; dc++) {
      const newRow = pixelRow + dr;
      const newCol = pixelCol + dc;
      
      if (newRow >= 0 && newRow < height && newCol >= 0 && newCol < width) {
        const neighborIndex = newRow * width + newCol;
        if (isBackground[neighborIndex]) backgroundNeighbors++;
        totalNeighbors++;
      }
    }
  }
  
  const backgroundRatio = backgroundNeighbors / totalNeighbors;
  
  if (backgroundRatio > 0.3) {
    return Math.floor(255 * (1 - backgroundRatio * 0.6)); // Partial transparency
  } else {
    return 255; // Full opacity
  }
};

/**
 * Main function to remove background from an image
 * Creates a scrapbook-style cut-out effect perfect for fashion items
 */
export const removeBackground = async (imageUrl: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Draw the original image
        ctx.drawImage(img, 0, 0);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // SCRAPBOOK-STYLE: Enhanced background removal for cut-out effect
        const backgroundColor = getBackgroundColor(data, canvas.width, canvas.height);
        
        // First pass: detect and mark background pixels
        const isBackground = new Array(data.length / 4).fill(false);
        const threshold = 40;
        
        for (let i = 0; i < data.length; i += 4) {
          const pixelIndex = i / 4;
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          
          // Enhanced color difference calculation
          const colorDiff = Math.sqrt(
            Math.pow(r - backgroundColor.r, 2) +
            Math.pow(g - backgroundColor.g, 2) +
            Math.pow(b - backgroundColor.b, 2)
          );
          
          // Aggressive removal for cut-out effect
          const isNearWhite = r > 235 && g > 235 && b > 235;
          const isNearGray = Math.abs(r - g) < 15 && Math.abs(g - b) < 15 && r > 200;
          const isLightBackground = r > 220 && g > 220 && b > 220;
          
          if (colorDiff < threshold || isNearWhite || isNearGray || isLightBackground) {
            isBackground[pixelIndex] = true;
          }
        }
        
        // Second pass: flood fill from edges
        floodFillBackground(isBackground, canvas.width, canvas.height, data, backgroundColor);
        
        // Third pass: apply transparency with edge smoothing
        for (let i = 0; i < data.length; i += 4) {
          const pixelIndex = i / 4;
          
          if (isBackground[pixelIndex]) {
            data[i + 3] = 0; // Make transparent
          } else {
            // Apply edge smoothing
            const edgeAlpha = calculateEdgeAlpha(data, i, canvas.width, canvas.height, isBackground);
            data[i + 3] = Math.min(data[i + 3], edgeAlpha);
          }
        }
        
        ctx.putImageData(imageData, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      } catch (error) {
        reject(error);
      }
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    
    img.src = imageUrl;
  });
};

/**
 * Process multiple images for background removal
 */
export const removeBackgroundBatch = async (imageUrls: string[]): Promise<string[]> => {
  const results = await Promise.allSettled(
    imageUrls.map(url => removeBackground(url))
  );
  
  return results.map(result => 
    result.status === 'fulfilled' ? result.value : ''
  ).filter(Boolean);
};

/**
 * Check if an image has a suitable background for removal
 */
export const canRemoveBackground = (imageUrl: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        resolve(false);
        return;
      }
      
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const backgroundColor = getBackgroundColor(imageData.data, canvas.width, canvas.height);
      
      // Check if background is uniform enough for removal
      const isUniformBackground = 
        Math.abs(backgroundColor.r - backgroundColor.g) < 30 &&
        Math.abs(backgroundColor.g - backgroundColor.b) < 30;
      
      resolve(isUniformBackground);
    };
    
    img.onerror = () => resolve(false);
    img.src = imageUrl;
  });
};
