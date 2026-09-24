const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

export async function optimizeImage(file: File, maxWidth = 1200, quality = 0.85): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const image = new Image(); image.src = URL.createObjectURL(file);
    image.onload = () => { URL.revokeObjectURL(image.src); let { width, height } = image; if (width > maxWidth) { height = Math.round((height * maxWidth) / width); width = maxWidth; } const canvas = document.createElement('canvas'); canvas.width = width; canvas.height = height; const context = canvas.getContext('2d'); if (!context) { resolve(file); return; } context.drawImage(image, 0, 0, width, height); canvas.toBlob((blob) => resolve(blob || file), 'image/jpeg', quality); };
    image.onerror = reject;
  });
}

export async function uploadProductImage(file: File, folder = 'products'): Promise<string> {
  try {
    const optimized = await optimizeImage(file); const form = new FormData(); form.append('file', optimized, file.name); form.append('folder', folder);
    const response = await fetch(`${API_BASE}/api/media/upload`, { method: 'POST', body: form, credentials: 'include' });
    if (!response.ok) { const payload = await response.json().catch(() => null) as { error?: string } | null; throw new Error(payload?.error || 'Image upload failed.'); }
    return (await response.json() as { url: string }).url;
  } catch (error) { console.error('Image upload/processing error:', error); throw new Error(error instanceof Error ? error.message : 'Image upload failed. Please try a different image.'); }
}

export async function deleteProductImage(key: string): Promise<void> {
  const response = await fetch(`${API_BASE}/api/media`, { method: 'DELETE', credentials: 'include', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ key }) });
  if (!response.ok) throw new Error('Image deletion failed.');
}

export function mediaKeyFromUrl(url: string): string | null {
  try { const parsed = new URL(url, window.location.origin); return parsed.pathname.startsWith('/media/') ? decodeURIComponent(parsed.pathname.slice(7)) : null; } catch { return null; }
}
