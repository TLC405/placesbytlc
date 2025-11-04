export async function optimizeImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Calculate new dimensions (max 2048px, min 1024px)
        let width = img.width;
        let height = img.height;
        const maxDim = 2048;
        const minDim = 1024;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = (height / width) * maxDim;
            width = maxDim;
          } else {
            width = (width / height) * maxDim;
            height = maxDim;
          }
        }

        // Ensure minimum dimensions for identity preservation
        if (width < minDim && height < minDim) {
          if (width > height) {
            height = (height / width) * minDim;
            width = minDim;
          } else {
            width = (width / height) * minDim;
            height = minDim;
          }
        }

        // Create canvas and draw optimized image
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        
        if (!ctx) {
          reject(new Error("Failed to get canvas context"));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to PNG (lossless)
        const optimizedDataUrl = canvas.toDataURL("image/png");
        resolve(optimizedDataUrl);
      };
      
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = e.target?.result as string;
    };
    
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}
