#!/usr/bin/env node
/**
 * fetch-restaurant-images.mjs
 *
 * Fetches curated Unsplash images for The Meridian restaurant template.
 * Downloads images and uploads them to Supabase Storage, then updates content JSON files.
 *
 * Usage:
 *   node scripts/fetch-restaurant-images.mjs [--category=hero|menu|team|gallery|blog|events|all] [--dry-run] [--site=meridian-diner]
 *
 * Requires: UNSPLASH_ACCESS_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY in .env.local
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// Parse .env.local
function loadEnv() {
  const envPath = path.join(ROOT, '.env.local');
  if (!fs.existsSync(envPath)) {
    console.error('Missing .env.local — copy from .env.local.example');
    process.exit(1);
  }
  const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx < 0) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    let val = trimmed.slice(eqIdx + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  }
}

loadEnv();

const UNSPLASH_KEY = process.env.UNSPLASH_ACCESS_KEY;
if (!UNSPLASH_KEY) {
  console.error('Missing UNSPLASH_ACCESS_KEY in .env.local');
  process.exit(1);
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const STORAGE_BUCKET = process.env.SUPABASE_STORAGE_BUCKET || 'media';

// Parse CLI args
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const siteId = (args.find(a => a.startsWith('--site='))?.split('=')[1]) || 'meridian-diner';
const categoryArg = (args.find(a => a.startsWith('--category='))?.split('=')[1]) || 'all';

// Image search configs per category
const IMAGE_CONFIGS = {
  hero: [
    { query: 'fine dining restaurant interior dark ambiance', count: 2, folder: 'hero', prefix: 'hero-main' },
    { query: 'plated dish overhead elegant restaurant', count: 2, folder: 'hero', prefix: 'hero-dish' },
    { query: 'craft cocktail bar moody lighting', count: 2, folder: 'hero', prefix: 'hero-bar' },
    { query: 'restaurant exterior evening city', count: 1, folder: 'hero', prefix: 'hero-exterior' },
  ],
  menu: [
    { query: 'tuna tartare fine dining', count: 1, folder: 'menu', prefix: 'tuna-tartare' },
    { query: 'wagyu steak plating fine dining', count: 2, folder: 'menu', prefix: 'steak' },
    { query: 'seared scallops plated', count: 1, folder: 'menu', prefix: 'scallops' },
    { query: 'lobster pasta fine dining', count: 1, folder: 'menu', prefix: 'lobster' },
    { query: 'duck breast plated restaurant', count: 1, folder: 'menu', prefix: 'duck' },
    { query: 'chocolate fondant dessert', count: 1, folder: 'menu', prefix: 'chocolate' },
    { query: 'creme brulee dessert', count: 1, folder: 'menu', prefix: 'creme-brulee' },
    { query: 'artisan cocktail dark background', count: 3, folder: 'menu', prefix: 'cocktail' },
    { query: 'wine glass red wine restaurant', count: 2, folder: 'menu', prefix: 'wine' },
    { query: 'burrata tomato salad', count: 1, folder: 'menu', prefix: 'burrata' },
    { query: 'grilled octopus plated', count: 1, folder: 'menu', prefix: 'octopus' },
    { query: 'bone marrow restaurant', count: 1, folder: 'menu', prefix: 'bone-marrow' },
    { query: 'salmon plated fine dining', count: 1, folder: 'menu', prefix: 'salmon' },
    { query: 'rack of lamb plated', count: 1, folder: 'menu', prefix: 'lamb' },
    { query: 'risotto mushroom truffle', count: 1, folder: 'menu', prefix: 'risotto' },
    { query: 'cheese board restaurant', count: 1, folder: 'menu', prefix: 'cheese' },
    { query: 'seasonal fruit tart pastry', count: 1, folder: 'menu', prefix: 'tart' },
  ],
  team: [
    { query: 'chef portrait kitchen professional', count: 2, folder: 'team', prefix: 'chef' },
    { query: 'sommelier wine cellar portrait', count: 1, folder: 'team', prefix: 'sommelier' },
    { query: 'pastry chef kitchen', count: 1, folder: 'team', prefix: 'pastry-chef' },
    { query: 'bartender portrait craft cocktail', count: 1, folder: 'team', prefix: 'bartender' },
    { query: 'restaurant manager portrait', count: 1, folder: 'team', prefix: 'manager' },
  ],
  gallery: [
    { query: 'fine dining restaurant interior', count: 3, folder: 'gallery', prefix: 'interior' },
    { query: 'restaurant bar backlit bottles', count: 2, folder: 'gallery', prefix: 'bar' },
    { query: 'food photography overhead spread', count: 3, folder: 'gallery', prefix: 'food-spread' },
    { query: 'kitchen action chef cooking', count: 2, folder: 'gallery', prefix: 'kitchen' },
    { query: 'wine cellar bottles', count: 1, folder: 'gallery', prefix: 'wine-cellar' },
    { query: 'restaurant patio outdoor dining', count: 2, folder: 'gallery', prefix: 'patio' },
    { query: 'private dining room elegant', count: 1, folder: 'gallery', prefix: 'private-dining' },
    { query: 'table setting candlelight dinner', count: 2, folder: 'gallery', prefix: 'table-setting' },
  ],
  blog: [
    { query: 'seasonal spring vegetables fresh', count: 2, folder: 'blog', prefix: 'seasonal' },
    { query: 'natural wine bottles', count: 1, folder: 'blog', prefix: 'natural-wine' },
    { query: 'farm produce vegetables basket', count: 2, folder: 'blog', prefix: 'farm' },
    { query: 'cocktail making process', count: 1, folder: 'blog', prefix: 'cocktail-making' },
    { query: 'restaurant interior design detail', count: 2, folder: 'blog', prefix: 'design' },
    { query: 'artisan cheese wheels', count: 1, folder: 'blog', prefix: 'cheese' },
    { query: 'chef hands cooking close up', count: 2, folder: 'blog', prefix: 'hands' },
    { query: 'holiday dinner table festive', count: 1, folder: 'blog', prefix: 'holiday' },
    { query: 'sustainable restaurant kitchen', count: 1, folder: 'blog', prefix: 'sustainable' },
    { query: 'staff meal restaurant family', count: 1, folder: 'blog', prefix: 'staff-meal' },
  ],
  events: [
    { query: 'wine dinner event long table', count: 2, folder: 'events', prefix: 'wine-dinner' },
    { query: 'jazz night restaurant live music', count: 1, folder: 'events', prefix: 'jazz' },
    { query: 'cooking class hands on', count: 1, folder: 'events', prefix: 'cooking-class' },
    { query: 'brunch celebration champagne', count: 1, folder: 'events', prefix: 'brunch' },
    { query: 'chef tasting menu kitchen counter', count: 1, folder: 'events', prefix: 'chefs-table' },
    { query: 'garden party outdoor drinks', count: 1, folder: 'events', prefix: 'garden-party' },
    { query: 'pop up dinner chef collaboration', count: 1, folder: 'events', prefix: 'popup' },
  ],
};

// Unsplash API search
async function searchUnsplash(query, perPage = 3) {
  const url = new URL('https://api.unsplash.com/search/photos');
  url.searchParams.set('query', query);
  url.searchParams.set('per_page', String(perPage));
  url.searchParams.set('orientation', 'landscape');
  url.searchParams.set('content_filter', 'high');

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Unsplash API error ${res.status}: ${text}`);
  }

  const data = await res.json();
  return data.results.map((photo) => ({
    id: photo.id,
    url: photo.urls.regular, // 1080px wide
    downloadUrl: photo.links.download_location,
    alt: photo.alt_description || photo.description || query,
    photographer: photo.user.name,
    photographerUrl: photo.user.links.html,
  }));
}

// Track download for Unsplash API guidelines
async function triggerDownload(downloadUrl) {
  try {
    await fetch(`${downloadUrl}?client_id=${UNSPLASH_KEY}`);
  } catch {
    // Best effort
  }
}

// Download image to buffer
async function downloadImage(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed: ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

// Upload to Supabase Storage
async function uploadToSupabase(buffer, storagePath, contentType = 'image/jpeg') {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.log(`  [skip upload] No Supabase credentials — saving path reference only`);
    return null;
  }

  const url = `${SUPABASE_URL}/storage/v1/object/${STORAGE_BUCKET}/${storagePath}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${SUPABASE_KEY}`,
      'Content-Type': contentType,
      'x-upsert': 'true',
      'Cache-Control': 'public, max-age=31536000',
    },
    body: buffer,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Supabase upload error ${res.status}: ${text}`);
  }

  return `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${storagePath}`;
}

// Save image locally as fallback
function saveLocal(buffer, localPath) {
  const fullPath = path.join(ROOT, 'public', 'uploads', localPath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, buffer);
  return `/uploads/${localPath}`;
}

// Main fetch function for a category
async function fetchCategory(category) {
  const configs = IMAGE_CONFIGS[category];
  if (!configs) {
    console.error(`Unknown category: ${category}`);
    return [];
  }

  console.log(`\n--- Fetching ${category} images ---`);
  const results = [];

  for (const config of configs) {
    console.log(`  Searching: "${config.query}" (${config.count} images)`);

    if (dryRun) {
      console.log(`  [dry-run] Would fetch ${config.count} images`);
      continue;
    }

    try {
      const photos = await searchUnsplash(config.query, config.count);

      for (let i = 0; i < Math.min(photos.length, config.count); i++) {
        const photo = photos[i];
        const filename = `${config.prefix}-${i + 1}.jpg`;
        const storagePath = `${siteId}/${config.folder}/${filename}`;

        console.log(`  Downloading: ${photo.url.slice(0, 60)}...`);
        const buffer = await downloadImage(photo.url);

        // Trigger download for Unsplash guidelines
        await triggerDownload(photo.downloadUrl);

        // Try Supabase, fallback to local
        let publicUrl;
        try {
          publicUrl = await uploadToSupabase(buffer, storagePath);
        } catch (err) {
          console.log(`  [supabase error] ${err.message} — saving locally`);
        }

        if (!publicUrl) {
          publicUrl = saveLocal(buffer, storagePath);
        }

        results.push({
          category,
          folder: config.folder,
          prefix: config.prefix,
          filename,
          url: publicUrl,
          alt: photo.alt,
          credit: `Photo by ${photo.photographer} on Unsplash`,
          creditUrl: photo.photographerUrl,
        });

        console.log(`  Saved: ${filename} (${(buffer.length / 1024).toFixed(0)} KB)`);
      }

      // Rate limit: 50 req/hr on free tier, be conservative
      await new Promise((r) => setTimeout(r, 1200));
    } catch (err) {
      console.error(`  Error fetching "${config.query}": ${err.message}`);
    }
  }

  return results;
}

// Main
async function main() {
  console.log(`Fetching Unsplash images for site: ${siteId}`);
  console.log(`Category: ${categoryArg}`);
  if (dryRun) console.log('DRY RUN — no downloads or uploads');

  const categories = categoryArg === 'all'
    ? Object.keys(IMAGE_CONFIGS)
    : [categoryArg];

  const allResults = [];

  for (const cat of categories) {
    const results = await fetchCategory(cat);
    allResults.push(...results);
  }

  // Save manifest
  if (!dryRun && allResults.length > 0) {
    const manifestPath = path.join(ROOT, 'content', siteId, 'image-manifest.json');
    const existing = fs.existsSync(manifestPath)
      ? JSON.parse(fs.readFileSync(manifestPath, 'utf-8'))
      : { images: [] };

    // Merge — replace by filename, add new
    const byFilename = new Map(existing.images.map((img) => [img.filename, img]));
    for (const result of allResults) {
      byFilename.set(result.filename, result);
    }
    existing.images = Array.from(byFilename.values());
    existing.updatedAt = new Date().toISOString();
    existing.totalImages = existing.images.length;

    fs.writeFileSync(manifestPath, JSON.stringify(existing, null, 2));
    console.log(`\nManifest saved: ${manifestPath} (${existing.totalImages} images)`);
  }

  console.log(`\nDone! Fetched ${allResults.length} images total.`);
  if (allResults.length > 0) {
    console.log('\nTo update content JSON with image URLs, run:');
    console.log('  node scripts/apply-restaurant-images.mjs');
  }
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
