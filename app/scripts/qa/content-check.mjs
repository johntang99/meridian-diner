#!/usr/bin/env node
/**
 * QA Script: Content Completeness Check
 * Scans content files for placeholders, missing images, and translation gaps.
 * Usage: node scripts/qa/content-check.mjs
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = path.join(__dirname, '..', '..', 'content', 'meridian-diner');

const PLACEHOLDER_PATTERNS = [
  /lorem ipsum/i,
  /\bplaceholder\b/i,
  /\bTODO\b/,
  /\bFIXME\b/,
  /\[NAME\]/,
  /\[CITY\]/,
  /\[PHONE\]/,
  /\x00/, // null bytes
];

let warnings = 0;
let failures = 0;

function checkPlaceholders(data, filePath) {
  const str = JSON.stringify(data);
  for (const pattern of PLACEHOLDER_PATTERNS) {
    if (pattern.test(str)) {
      console.log(`  ⚠️  WARN  ${filePath} — contains "${pattern.source}"`);
      warnings++;
    }
  }
}

function checkHeroImages(data, filePath) {
  // Check for hero sections with missing images
  if (data?.hero?.image === '') {
    console.log(`  ⚠️  WARN  ${filePath} — hero.image is empty`);
    warnings++;
  }
}

async function scanJsonFiles(dir, relativeTo) {
  let files;
  try {
    files = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }

  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    const relPath = path.relative(relativeTo, fullPath);

    if (file.isDirectory()) {
      await scanJsonFiles(fullPath, relativeTo);
      continue;
    }

    if (!file.name.endsWith('.json')) continue;

    try {
      const raw = await fs.readFile(fullPath, 'utf-8');
      const data = JSON.parse(raw);
      checkPlaceholders(data, relPath);
      checkHeroImages(data, relPath);
    } catch (err) {
      console.log(`  ❌ FAIL  ${relPath} — invalid JSON: ${err.message}`);
      failures++;
    }
  }
}

async function checkMenuItems() {
  const menuFiles = ['dinner.json', 'cocktails.json'];
  for (const file of menuFiles) {
    try {
      const raw = await fs.readFile(
        path.join(CONTENT_DIR, 'en', 'menu', file),
        'utf-8',
      );
      const data = JSON.parse(raw);
      const items = data.items || [];

      // Check featured items have images
      const featuredNoImage = items.filter(
        (i) => i.featured && (!i.image || i.image === ''),
      );
      if (featuredNoImage.length > 0) {
        console.log(
          `  ⚠️  WARN  menu/${file} — ${featuredNoImage.length} featured items missing image`,
        );
        warnings++;
      }

      // Check all items have names
      const noName = items.filter((i) => !i.name);
      if (noName.length > 0) {
        console.log(
          `  ❌ FAIL  menu/${file} — ${noName.length} items missing name`,
        );
        failures++;
      }
    } catch {
      // File doesn't exist — skip
    }
  }
}

async function checkEvents() {
  try {
    const raw = await fs.readFile(
      path.join(CONTENT_DIR, 'en', 'events', 'events.json'),
      'utf-8',
    );
    const data = JSON.parse(raw);
    const events = data.events || data || [];
    if (!Array.isArray(events)) return;

    const noTitle = events.filter((e) => !e.title);
    if (noTitle.length > 0) {
      console.log(`  ❌ FAIL  events/events.json — ${noTitle.length} events missing title`);
      failures++;
    }

    const published = events.filter((e) => e.published !== false);
    console.log(`  ✅ events/events.json — ${published.length} published events`);
  } catch {
    // File doesn't exist
  }
}

async function checkBlogPosts() {
  try {
    const raw = await fs.readFile(
      path.join(CONTENT_DIR, 'en', 'blog', 'posts.json'),
      'utf-8',
    );
    const data = JSON.parse(raw);
    const posts = Array.isArray(data) ? data : data.posts || [];

    const published = posts.filter((p) => p.published !== false);
    const stubPosts = published.filter(
      (p) => !p.excerpt || p.excerpt.length < 50,
    );
    if (stubPosts.length > 0) {
      console.log(
        `  ⚠️  WARN  blog/posts.json — ${stubPosts.length} published posts with short excerpts`,
      );
      warnings++;
    }

    console.log(
      `  ✅ blog/posts.json — ${published.length} published posts`,
    );
  } catch {
    // File doesn't exist
  }
}

async function checkSiteHours() {
  try {
    const raw = await fs.readFile(
      path.join(CONTENT_DIR, 'en', 'site.json'),
      'utf-8',
    );
    const data = JSON.parse(raw);
    const hours = data.hours || [];

    if (hours.length < 4) {
      console.log(
        `  ⚠️  WARN  site.json — only ${hours.length} hours entries (expected at least 4)`,
      );
      warnings++;
    } else {
      console.log(`  ✅ site.json — ${hours.length} hours entries`);
    }
  } catch {
    console.log(`  ❌ FAIL  site.json — could not read`);
    failures++;
  }
}

async function main() {
  console.log(`\n📋 Content Completeness Check\n`);
  console.log(`  Scanning ${CONTENT_DIR}...\n`);

  // Scan all JSON files for placeholders
  await scanJsonFiles(CONTENT_DIR, CONTENT_DIR);

  // Check specific content types
  await checkMenuItems();
  await checkEvents();
  await checkBlogPosts();
  await checkSiteHours();

  console.log(`\n  ────────────────────────────`);
  if (warnings > 0) console.log(`  ⚠️  Warnings: ${warnings}`);
  if (failures > 0) console.log(`  ❌ Failures: ${failures}`);
  if (warnings === 0 && failures === 0) {
    console.log(`  ✅ All content checks passed`);
  }
  console.log('');

  process.exit(failures > 0 ? 1 : 0);
}

main();
