/**
 * IndexNow — Instantly notify search engines of content changes.
 * Submits URLs to IndexNow API and Bing simultaneously.
 */

const INDEXNOW_API_KEY = process.env.INDEXNOW_API_KEY;
const SITE_HOST = process.env.NEXT_PUBLIC_SITE_HOST || 'themeridian.com';

export async function submitToIndexNow(urls: string[]): Promise<void> {
  if (!INDEXNOW_API_KEY) {
    console.log('[IndexNow] No API key configured, skipping submission');
    return;
  }

  if (urls.length === 0) return;

  const payload = {
    host: SITE_HOST,
    key: INDEXNOW_API_KEY,
    keyLocation: `https://${SITE_HOST}/${INDEXNOW_API_KEY}.txt`,
    urlList: urls,
  };

  const endpoints = [
    'https://api.indexnow.org/indexnow',
    'https://www.bing.com/indexnow',
  ];

  for (const endpoint of endpoints) {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify(payload),
      });
      console.log(
        `[IndexNow] ${endpoint} → ${res.status} (${urls.length} URLs)`,
      );
    } catch (err) {
      console.error(`[IndexNow] Failed to submit to ${endpoint}:`, err);
    }
  }
}

/** Helper: submit a single page URL after content update */
export async function notifyPageUpdate(
  locale: string,
  pagePath: string,
): Promise<void> {
  const url = `https://${SITE_HOST}/${locale}${pagePath}`;
  return submitToIndexNow([url]);
}
