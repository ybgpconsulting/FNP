import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { isFirebaseConfigured, storage } from './config';

/**
 * Optimizes an image file by resizing client-side before upload to reduce payload size
 */
export async function optimizeImage(file: File, maxWidth = 1200, quality = 0.85): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(img.src);
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(file);
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            resolve(file);
          }
        },
        'image/jpeg',
        quality
      );
    };
    img.onerror = (err) => reject(err);
  });
}

/**
 * Uploads an image file to Firebase Storage if configured, or converts to compressed Data URL
 */
export async function uploadProductImage(file: File, folder = 'products'): Promise<string> {
  try {
    const optimizedBlob = await optimizeImage(file);

    if (isFirebaseConfigured() && storage) {
      const timestamp = Date.now();
      const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const storageRef = ref(storage, `${folder}/${timestamp}_${safeName}`);
      const uploadResult = await uploadBytes(storageRef, optimizedBlob);
      return await getDownloadURL(uploadResult.ref);
    }

    // Fallback to high-efficiency compressed Data URL when Firebase Storage is not yet provisioned
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to read image as data URL'));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(optimizedBlob);
    });
  } catch (error) {
    console.error('Image upload/processing error:', error);
    throw new Error('Image upload failed. Please try a different image or enter an image URL directly.');
  }
}
