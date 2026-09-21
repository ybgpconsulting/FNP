export function safeExternalUrl(value: string | undefined): string {
  if (!value) return '';
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : '';
  } catch {
    return '';
  }
}

export function safeImageUrl(value: string | undefined): string {
  if (!value) return '';
  if (value.startsWith('data:image/')) return value;
  return safeExternalUrl(value);
}

export function safeCtaUrl(value: string | undefined): string {
  if (!value) return '/shop';
  if (value.startsWith('/') && !value.startsWith('//')) return value;
  return safeExternalUrl(value) || '/shop';
}
