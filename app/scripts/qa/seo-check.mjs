#!/usr/bin/env node
/**
 * QA Script: SEO Metadata Check
 * Verifies every page has proper title, description, canonical, OG tags, and unique titles.
 * Usage: node scripts/qa/seo-check.mjs [baseUrl]
 */

const BASE_URL = process.argv[2] || 'http://localhost:3020';

const pages = [
  '/en', '/zh', '/es',
  '/en/menu', '/en/menu/dinner', '/en/menu/cocktails',
  '/en/about', '/en/about/team',
  '/en/reservations', '/en/contact',
  '/en/events', '/en/gallery', '/en/blog',
  '/en/press', '/en/faq',
  '/en/gift-cards', '/en/careers',
  '/en/reservations/private-dining',
  '/en/events/e-001',
  '/en/blog/spring-menu-2026',
  '/en/contemporary-american-restaurant/new-york',
  '/en/fine-dining/manhattan',
  '/en/fine-dining/tribeca',
];

let passed = 0;
let failed = 0;
let warned = 0;

function extractMeta(html, name) {
  const regex = new RegExp(`<meta[^>]*(?:name|property)="${name}"[^>]*content="([^"]*)"`, 'i');
  const match = html.match(regex);
  return match?.[1] || '';
}

function extractTag(html, tag) {
  const regex = new RegExp(`<${tag}[^>]*>([^<]*)</${tag}>`, 'i');
  const match = html.match(regex);
  return match?.[1]?.trim() || '';
}

function countTag(html, tag) {
  const regex = new RegExp(`<${tag}[\\s>]`, 'gi');
  return (html.match(regex) || []).length;
}

function extractCanonical(html) {
  const match = html.match(/<link[^>]*rel="canonical"[^>]*href="([^"]*)"/i);
  return match?.[1] || '';
}

function countHreflang(html) {
  return (html.match(/<link[^>]*hreflang=/gi) || []).length;
}

const allTitles = new Map(); // title -> [urls]

async function checkPage(url) {
  const fullUrl = `${BASE_URL}${url}`;
  try {
    const res = await fetch(fullUrl);
    if (res.status !== 200) {
      console.log(`  ❌ ${url} — HTTP ${res.status}`);
      failed++;
      return;
    }

    const html = await res.text();
    const issues = [];

    // Title
    const title = extractTag(html, 'title');
    if (!title) {
      issues.push('missing <title>');
    } else if (title.length > 70) {
      issues.push(`title too long (${title.length} chars)`);
    }

    // Track title uniqueness
    if (title) {
      const existing = allTitles.get(title) || [];
      existing.push(url);
      allTitles.set(title, existing);
    }

    // Description
    const desc = extractMeta(html, 'description');
    if (!desc) {
      issues.push('missing description');
    } else if (desc.length < 50) {
      issues.push(`description short (${desc.length} chars)`);
    } else if (desc.length > 170) {
      issues.push(`description long (${desc.length} chars)`);
    }

    // Canonical
    const canonical = extractCanonical(html);
    if (!canonical) {
      issues.push('missing canonical');
    }

    // OG tags
    const ogTitle = extractMeta(html, 'og:title');
    if (!ogTitle) issues.push('missing og:title');

    const ogDesc = extractMeta(html, 'og:description');
    if (!ogDesc) issues.push('missing og:description');

    // h1 count
    const h1Count = countTag(html, 'h1');
    if (h1Count === 0) issues.push('no <h1> found');
    else if (h1Count > 1) issues.push(`${h1Count} <h1> tags found`);

    // hreflang
    const hreflangCount = countHreflang(html);
    if (hreflangCount < 3 && !url.startsWith('/en/blog/') && !url.startsWith('/en/events/')) {
      issues.push(`only ${hreflangCount} hreflang tags`);
    }

    if (issues.length > 0) {
      const hasErrors = issues.some(i =>
        i.startsWith('missing') || i.startsWith('no ')
      );
      if (hasErrors) {
        console.log(`  ❌ ${url} — ${issues.join(', ')}`);
        failed++;
      } else {
        console.log(`  ⚠️  ${url} — ${issues.join(', ')}`);
        warned++;
      }
    } else {
      const titleLen = title?.length || 0;
      const descLen = desc?.length || 0;
      console.log(`  ✅ ${url} — title OK (${titleLen}), desc OK (${descLen}), h1: ${h1Count}`);
      passed++;
    }
  } catch (err) {
    console.log(`  ❌ ${url} — ${err.message}`);
    failed++;
  }
}

async function main() {
  console.log(`\n🔍 SEO Metadata Check — ${BASE_URL}\n`);
  console.log(`  Checking ${pages.length} pages...\n`);

  for (const page of pages) {
    await checkPage(page);
  }

  // Uniqueness check
  console.log(`\n  ── Title Uniqueness Check ──`);
  let dupFound = false;
  for (const [title, urls] of allTitles) {
    // Filter out locale variants of same page (e.g., /en vs /zh vs /es)
    const basePaths = urls.map(u => u.replace(/^\/(en|zh|es)/, ''));
    const uniquePaths = new Set(basePaths);
    if (uniquePaths.size < urls.length && urls.length > 1) {
      // Same base path, different locales — OK
      continue;
    }
    if (urls.length > 1) {
      console.log(`  ❌ DUPLICATE: "${title}" → ${urls.join(', ')}`);
      dupFound = true;
      failed++;
    }
  }
  if (!dupFound) {
    console.log(`  ✅ All titles are unique across pages`);
  }

  console.log(`\n  ────────────────────────────`);
  console.log(`  ✅ Passed: ${passed}`);
  if (warned > 0) console.log(`  ⚠️  Warned: ${warned}`);
  if (failed > 0) console.log(`  ❌ Failed: ${failed}`);
  console.log(`  Total checks: ${pages.length}\n`);

  process.exit(failed > 0 ? 1 : 0);
}

main();
