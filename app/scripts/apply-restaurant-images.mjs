#!/usr/bin/env node
/**
 * apply-restaurant-images.mjs
 *
 * Reads the image-manifest.json and applies image URLs to content JSON files.
 * Run after fetch-restaurant-images.mjs to wire images into content.
 *
 * Usage:
 *   node scripts/apply-restaurant-images.mjs [--site=meridian-diner] [--dry-run]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const siteId = (args.find(a => a.startsWith('--site='))?.split('=')[1]) || 'meridian-diner';

const contentDir = path.join(ROOT, 'content', siteId);
const manifestPath = path.join(contentDir, 'image-manifest.json');

if (!fs.existsSync(manifestPath)) {
  console.error(`No image manifest found at ${manifestPath}`);
  console.error('Run fetch-restaurant-images.mjs first.');
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
const imagesByCategory = {};
for (const img of manifest.images) {
  if (!imagesByCategory[img.category]) imagesByCategory[img.category] = [];
  imagesByCategory[img.category].push(img);
}

function readJson(filePath) {
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

function writeJson(filePath, data) {
  if (dryRun) {
    console.log(`  [dry-run] Would write: ${filePath}`);
    return;
  }
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
  console.log(`  Updated: ${filePath}`);
}

// Get images by folder + prefix pattern
function getImage(folder, prefix, index = 0) {
  const images = (manifest.images || []).filter(
    (img) => img.folder === folder && img.prefix === prefix
  );
  return images[index]?.url || '';
}

function getImagesByFolder(folder) {
  return (manifest.images || []).filter((img) => img.folder === folder);
}

// 1. Apply hero images to homepage
function applyHeroImages() {
  console.log('\nApplying hero images...');
  for (const locale of ['en', 'zh', 'es']) {
    const homePath = path.join(contentDir, locale, 'pages', 'home.json');
    const home = readJson(homePath);
    if (!home) continue;

    const heroImage = getImage('hero', 'hero-main', 0) || getImage('hero', 'hero-dish', 0);
    if (heroImage && home.hero) {
      home.hero.image = heroImage;
      writeJson(homePath, home);
    }
  }
}

// 2. Apply team photos
function applyTeamImages() {
  console.log('\nApplying team images...');
  const teamPath = path.join(contentDir, 'en', 'team', 'team.json');
  const team = readJson(teamPath);
  if (!team?.members) return;

  const teamImages = getImagesByFolder('team');
  const mapping = {
    'marcus-bellamy': 'chef',
    'elena-vasquez': 'pastry-chef',
    'david-chen': 'sommelier',
    'sarah-kim': 'bartender',
    'james-morrison': 'manager',
  };

  for (const member of team.members) {
    const prefix = mapping[member.id];
    if (prefix) {
      const img = getImage('team', prefix, 0);
      if (img) member.photo = img;
    }
  }

  writeJson(teamPath, team);
}

// 3. Apply gallery images
function applyGalleryImages() {
  console.log('\nApplying gallery images...');
  const galleryPath = path.join(contentDir, 'en', 'gallery', 'gallery.json');
  const gallery = readJson(galleryPath);
  if (!gallery?.items) return;

  const galleryImages = getImagesByFolder('gallery');
  let imgIdx = 0;

  for (const item of gallery.items) {
    if (!item.url && imgIdx < galleryImages.length) {
      item.url = galleryImages[imgIdx].url;
      imgIdx++;
    }
  }

  writeJson(galleryPath, gallery);
}

// 4. Apply blog featured images
function applyBlogImages() {
  console.log('\nApplying blog images...');
  const blogPath = path.join(contentDir, 'en', 'blog', 'posts.json');
  const blog = readJson(blogPath);
  if (!blog?.posts) return;

  const blogImages = getImagesByFolder('blog');
  let imgIdx = 0;

  for (const post of blog.posts) {
    if (!post.image && imgIdx < blogImages.length) {
      post.image = blogImages[imgIdx].url;
      imgIdx++;
    }
  }

  writeJson(blogPath, blog);
}

// 5. Apply event images
function applyEventImages() {
  console.log('\nApplying event images...');
  const eventsPath = path.join(contentDir, 'en', 'events', 'events.json');
  const events = readJson(eventsPath);
  if (!events?.events) return;

  const eventImages = getImagesByFolder('events');
  let imgIdx = 0;

  for (const event of events.events) {
    if (!event.image && imgIdx < eventImages.length) {
      event.image = eventImages[imgIdx].url;
      imgIdx++;
    }
  }

  writeJson(eventsPath, events);
}

// Main
console.log(`Applying images from manifest for site: ${siteId}`);
console.log(`Manifest: ${manifest.totalImages || manifest.images.length} images`);
if (dryRun) console.log('DRY RUN — no files will be modified');

applyHeroImages();
applyTeamImages();
applyGalleryImages();
applyBlogImages();
applyEventImages();

console.log('\nDone!');
