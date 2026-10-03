export const STORAGE_KEY = 'mona-bookmarks';

const SLUG_PATTERN = /^mona-[0-9A-Za-z]{4}$/;

export function normalizeUrl(value) {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new TypeError('Enter a URL to save.');
  }

  const trimmed = value.trim();
  const candidate = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  const parsed = new URL(candidate);
  if (!['http:', 'https:'].includes(parsed.protocol) || !parsed.hostname) {
    throw new TypeError('Enter a valid HTTP or HTTPS URL.');
  }
  return parsed.href;
}

export function loadBookmarks(storedValue) {
  if (typeof storedValue !== 'string' || storedValue.trim() === '') return [];

  let parsed;
  try {
    parsed = JSON.parse(storedValue);
  } catch {
    return [];
  }

  if (!Array.isArray(parsed)) return [];

  return parsed.flatMap((entry) => {
    if (
      entry === null ||
      typeof entry !== 'object' ||
      Array.isArray(entry) ||
      typeof entry.url !== 'string' ||
      typeof entry.slug !== 'string' ||
      !SLUG_PATTERN.test(entry.slug)
    ) {
      return [];
    }

    try {
      return [{ url: normalizeUrl(entry.url), slug: entry.slug }];
    } catch {
      return [];
    }
  });
}

export function formatBookmark(bookmark) {
  return `${bookmark.url} :: ${bookmark.slug}`;
}
