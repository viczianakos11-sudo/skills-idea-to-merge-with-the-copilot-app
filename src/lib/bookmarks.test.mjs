import test from 'node:test';
import assert from 'node:assert/strict';
import { formatBookmark, loadBookmarks, normalizeUrl, STORAGE_KEY } from './bookmarks.mjs';

test('normalizes URLs with and without https to the same saved value', () => {
  assert.equal(normalizeUrl('www.example.com'), 'https://www.example.com/');
  assert.equal(normalizeUrl('https://www.example.com'), 'https://www.example.com/');
});

test('recovers from empty, corrupted, legacy, and non-array stored values', () => {
  assert.equal(STORAGE_KEY, 'mona-bookmarks');
  for (const storedValue of [null, '', '{broken', '"https://example.com"', '42', 'null']) {
    assert.deepEqual(loadBookmarks(storedValue), []);
  }
  assert.deepEqual(loadBookmarks(JSON.stringify(['https://example.com', { url: 'https://example.com', slug: 'old' }])), []);
});

test('drops malformed records and returns validated bookmarks only', () => {
  const records = [
    { url: 'example.com', slug: 'mona-7fk2' },
    { url: 'javascript:alert(1)', slug: 'mona-1234' },
    { url: 'https://example.org', slug: 'invalid' },
    null,
  ];
  assert.deepEqual(loadBookmarks(JSON.stringify(records)), [
    { url: 'https://example.com/', slug: 'mona-7fk2' },
  ]);
});

test('formats a bookmark with the exact visible separator', () => {
  assert.equal(
    formatBookmark({ url: 'https://www.example.com', slug: 'mona-7fk2' }),
    'https://www.example.com :: mona-7fk2',
  );
});
