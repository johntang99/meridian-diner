#!/usr/bin/env node
/**
 * QA Script: Route Smoke Tests
 * Verifies all pages return correct HTTP status codes and basic HTML structure.
 * Usage: node scripts/qa/route-check.mjs [baseUrl]
 */

const BASE_URL = process.argv[2] || 'http://localhost:3020';

const routes = [
  // Static pages × 3 locales
  { url: '/en', expect: 200 },
  { url: '/zh', expect: 200 },
  { url: '/es', expect: 200 },
  { url: '/en/menu', expect: 200 },
  { url: '/en/menu/dinner', expect: 200 },
  { url: '/en/menu/cocktails', expect: 200 },
  { url: '/en/about', expect: 200 },
  { url: '/en/about/team', expect: 200 },
  { url: '/en/reservations', expect: 200 },
  { url: '/en/contact', expect: 200 },
  { url: '/en/events', expect: 200 },
  { url: '/en/gallery', expect: 200 },
  { url: '/en/blog', expect: 200 },
  { url: '/en/press', expect: 200 },
  { url: '/en/faq', expect: 200 },
  { url: '/en/gift-cards', expect: 200 },
  { url: '/en/careers', expect: 200 },
  { url: '/en/reservations/private-dining', expect: 200 },
  { url: '/zh/menu/dinner', expect: 200 },
  { url: '/es/menu/dinner', expect: 200 },
  { url: '/zh/faq', expect: 200 },
  { url: '/es/gift-cards', expect: 200 },

  // Dynamic routes (events + blog)
  { url: '/en/events/e-001', expect: 200 },
  { url: '/en/events/e-003', expect: 200 },
  { url: '/en/blog/spring-menu-2026', expect: 200 },
  { url: '/en/blog/wine-guide-natural-wines', expect: 200 },

  // Programmatic SEO pages
  { url: '/en/contemporary-american-restaurant/new-york', expect: 200 },
  { url: '/en/fine-dining/manhattan', expect: 200 },
  { url: '/en/private-dining/tribeca', expect: 200 },
  { url: '/zh/fine-dining/soho', expect: 200 },

  // Expected 404s
  { url: '/en/nonexistent-page', expect: 404 },
  { url: '/en/events/this-event-does-not-exist', expect: 404 },
  { url: '/en/blog/fake-post-slug', expect: 404 },
  { url: '/en/fine-dining/nonexistent-city', expect: 404 },
];

let passed = 0;
let failed = 0;
let warned = 0;

async function checkRoute({ url, expect }) {
  const fullUrl = `${BASE_URL}${url}`;
  const start = Date.now();

  try {
    const res = await fetch(fullUrl, { redirect: 'follow' });
    const elapsed = Date.now() - start;
    const status = res.status;

    if (status === 500) {
      console.log(`  ❌ 500  ${url} — Internal Server Error`);
      failed++;
      return;
    }

    if (status !== expect) {
      console.log(`  ❌ ${status}  ${url} — expected ${expect}`);
      failed++;
      return;
    }

    // Basic HTML checks for 200 pages
    if (status === 200) {
      const html = await res.text();
      const issues = [];

      if (!/<title[^>]*>[^<]+<\/title>/.test(html)) {
        issues.push('missing <title>');
      }
      if (!/<h1[\s>]/.test(html)) {
        issues.push('missing <h1>');
      }
      if (/\[object Object\]/.test(html)) {
        issues.push('[object Object] found');
      }

      if (issues.length > 0) {
        console.log(`  ⚠️  ${status}  ${url} — ${elapsed}ms — ${issues.join(', ')}`);
        warned++;
        return;
      }

      if (elapsed > 3000) {
        console.log(`  ⚠️  SLOW ${url} — ${elapsed}ms (> 3000ms threshold)`);
        warned++;
        return;
      }
    }

    console.log(`  ✅ ${status}  ${url} — ${elapsed}ms`);
    passed++;
  } catch (err) {
    console.log(`  ❌ ERR  ${url} — ${err.message}`);
    failed++;
  }
}

async function main() {
  console.log(`\n🔍 Route Smoke Tests — ${BASE_URL}\n`);
  console.log(`  Testing ${routes.length} routes...\n`);

  for (const route of routes) {
    await checkRoute(route);
  }

  console.log(`\n  ────────────────────────────`);
  console.log(`  ✅ Passed: ${passed}`);
  if (warned > 0) console.log(`  ⚠️  Warned: ${warned}`);
  if (failed > 0) console.log(`  ❌ Failed: ${failed}`);
  console.log(`  Total: ${routes.length}\n`);

  process.exit(failed > 0 ? 1 : 0);
}

main();
