#!/usr/bin/env node
/**
 * QA Script: Schema Validation
 * Verifies JSON-LD schema.org data is present on key pages.
 * Usage: node scripts/qa/schema-check.mjs [baseUrl]
 */

const BASE_URL = process.argv[2] || 'http://localhost:3020';

const schemaChecks = [
  {
    url: '/en',
    expectedTypes: ['Restaurant'],
    label: 'Homepage — Restaurant schema',
  },
  {
    url: '/en/menu/dinner',
    expectedTypes: ['Restaurant', 'Menu'],
    label: 'Dinner — Restaurant + Menu schema',
  },
  {
    url: '/en/menu/cocktails',
    expectedTypes: ['Menu'],
    label: 'Cocktails — Menu schema',
  },
  {
    url: '/en/events/e-001',
    expectedTypes: ['Event'],
    label: 'Event detail — Event schema',
  },
  {
    url: '/en/blog/spring-menu-2026',
    expectedTypes: ['BlogPosting'],
    label: 'Blog article — BlogPosting schema',
  },
  {
    url: '/en/faq',
    expectedTypes: ['FAQPage'],
    label: 'FAQ — FAQPage schema',
  },
  {
    url: '/en/fine-dining/manhattan',
    expectedTypes: ['Restaurant'],
    label: 'Programmatic SEO — Restaurant schema',
  },
];

let passed = 0;
let failed = 0;

function extractSchemaTypes(html) {
  const types = [];
  const regex = /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    try {
      const data = JSON.parse(match[1]);
      if (data['@type']) {
        types.push(data['@type']);
      }
    } catch {
      // Skip invalid JSON
    }
  }
  return types;
}

async function checkSchema({ url, expectedTypes, label }) {
  const fullUrl = `${BASE_URL}${url}`;
  try {
    const res = await fetch(fullUrl);
    if (res.status !== 200) {
      console.log(`  ❌ ${label} — HTTP ${res.status}`);
      failed++;
      return;
    }

    const html = await res.text();
    const foundTypes = extractSchemaTypes(html);

    const missing = expectedTypes.filter((t) => !foundTypes.includes(t));
    if (missing.length > 0) {
      console.log(
        `  ❌ ${label} — missing: ${missing.join(', ')} (found: ${foundTypes.join(', ') || 'none'})`,
      );
      failed++;
    } else {
      console.log(`  ✅ ${label} — ${foundTypes.join(', ')}`);
      passed++;
    }
  } catch (err) {
    console.log(`  ❌ ${label} — ${err.message}`);
    failed++;
  }
}

async function main() {
  console.log(`\n🔍 Schema.org Validation — ${BASE_URL}\n`);

  for (const check of schemaChecks) {
    await checkSchema(check);
  }

  console.log(`\n  ────────────────────────────`);
  console.log(`  ✅ Passed: ${passed}`);
  if (failed > 0) console.log(`  ❌ Failed: ${failed}`);
  console.log(`  Total: ${schemaChecks.length}\n`);

  process.exit(failed > 0 ? 1 : 0);
}

main();
