#!/usr/bin/env node
/**
 * QA Script: Link Checker
 * Crawls internal links from the homepage and reports any broken links.
 * Usage: node scripts/qa/link-check.mjs [baseUrl]
 */

const BASE_URL = process.argv[2] || 'http://localhost:3020';
const MAX_DEPTH = 4;
const CONCURRENCY = 5;

const visited = new Set();
const broken = [];
const queue = [{ url: '/en', depth: 0 }];

function extractLinks(html, currentUrl) {
  const links = [];
  const regex = /href="([^"]*?)"/g;
  let match;
  while ((match = regex.exec(html)) !== null) {
    let href = match[1];
    if (!href) continue;

    // Skip external, mailto, tel, anchors, javascript
    if (
      href.startsWith('http://') ||
      href.startsWith('https://') ||
      href.startsWith('mailto:') ||
      href.startsWith('tel:') ||
      href.startsWith('#') ||
      href.startsWith('javascript:')
    ) {
      continue;
    }

    // Normalize relative URLs
    if (!href.startsWith('/')) {
      const base = currentUrl.replace(/\/[^/]*$/, '');
      href = `${base}/${href}`;
    }

    // Remove query and hash
    href = href.split('?')[0].split('#')[0];

    // Skip static assets
    if (/\.(css|js|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/i.test(href)) {
      continue;
    }

    links.push(href);
  }
  return [...new Set(links)];
}

async function checkUrl(url) {
  if (visited.has(url)) return [];
  visited.add(url);

  const fullUrl = `${BASE_URL}${url}`;
  try {
    const res = await fetch(fullUrl, { redirect: 'follow' });
    if (res.status === 404 || res.status === 500) {
      broken.push({ url, status: res.status });
      return [];
    }
    if (res.status === 200) {
      const html = await res.text();
      return extractLinks(html, url);
    }
    return [];
  } catch (err) {
    broken.push({ url, status: 'ERR', message: err.message });
    return [];
  }
}

async function main() {
  console.log(`\n🔗 Link Checker — ${BASE_URL}\n`);

  while (queue.length > 0) {
    // Process batch
    const batch = queue.splice(0, CONCURRENCY);
    const results = await Promise.all(
      batch.map(async ({ url, depth }) => {
        const links = await checkUrl(url);
        if (depth < MAX_DEPTH) {
          return links
            .filter((l) => !visited.has(l))
            .map((l) => ({ url: l, depth: depth + 1 }));
        }
        return [];
      }),
    );

    for (const items of results) {
      for (const item of items) {
        if (!visited.has(item.url)) {
          queue.push(item);
        }
      }
    }
  }

  console.log(`  Crawled ${visited.size} internal links`);

  if (broken.length === 0) {
    console.log(`  ✅ ${visited.size} OK — no broken links\n`);
    process.exit(0);
  } else {
    console.log(`  ✅ ${visited.size - broken.length} OK`);
    console.log(`  ❌ ${broken.length} broken:\n`);
    for (const b of broken) {
      console.log(`    ${b.status}  ${b.url}`);
    }
    console.log('');
    process.exit(1);
  }
}

main();
