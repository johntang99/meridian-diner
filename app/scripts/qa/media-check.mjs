#!/usr/bin/env node
/**
 * QA Script: Media coverage + link health
 * Usage: node scripts/qa/media-check.mjs
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..', '..');
const EN_DIR = path.join(ROOT, 'content', 'meridian-diner', 'en');

let warnings = 0;
let failures = 0;

function warn(message) {
  warnings += 1;
  console.log(`  ⚠ WARN  ${message}`);
}

function fail(message) {
  failures += 1;
  console.log(`  ✖ FAIL  ${message}`);
}

function ok(message) {
  console.log(`  ✓ OK    ${message}`);
}

async function readJson(...parts) {
  const filePath = path.join(EN_DIR, ...parts);
  const raw = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(raw);
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function collectImageUrls(value, bag = new Set()) {
  if (!value || typeof value !== 'object') return bag;
  if (Array.isArray(value)) {
    value.forEach((item) => collectImageUrls(item, bag));
    return bag;
  }

  for (const [key, entry] of Object.entries(value)) {
    if (typeof entry === 'string') {
      if (
        ['image', 'url', 'src', 'defaultItemImage', 'photo', 'photoPortrait'].includes(key) &&
        /^https?:\/\//.test(entry)
      ) {
        bag.add(entry);
      }
      continue;
    }
    collectImageUrls(entry, bag);
  }
  return bag;
}

async function checkCoverage() {
  const [
    homePage,
    menuPage,
    aboutPage,
    eventsPage,
    privateDiningPage,
    galleryPage,
    reservationsPage,
    contactPage,
    blogPage,
    eventsData,
    galleryData,
    blogPosts,
    teamData,
  ] = await Promise.all([
    readJson('pages', 'home.json'),
    readJson('pages', 'menu.json'),
    readJson('pages', 'about.json'),
    readJson('pages', 'events.json'),
    readJson('pages', 'private-dining.json'),
    readJson('pages', 'gallery.json'),
    readJson('pages', 'reservations.json'),
    readJson('pages', 'contact.json'),
    readJson('pages', 'blog.json'),
    readJson('events', 'events.json'),
    readJson('gallery', 'gallery.json'),
    readJson('blog', 'posts.json'),
    readJson('team', 'team.json'),
  ]);

  // Required page visual slots
  if (!isNonEmptyString(homePage?.hero?.image)) fail('pages/home.json hero.image missing');
  if (!isNonEmptyString(homePage?.aboutPreview?.image)) fail('pages/home.json aboutPreview.image missing');
  if (!isNonEmptyString(aboutPage?.hero?.image)) fail('pages/about.json hero.image missing');
  if (!isNonEmptyString(eventsPage?.hero?.image)) fail('pages/events.json hero.image missing');
  if (!isNonEmptyString(privateDiningPage?.hero?.image)) fail('pages/private-dining.json hero.image missing');
  if (!isNonEmptyString(galleryPage?.hero?.image)) fail('pages/gallery.json hero.image missing');
  if (!isNonEmptyString(reservationsPage?.hero?.image)) fail('pages/reservations.json hero.image missing');
  if (!isNonEmptyString(contactPage?.hero?.image)) fail('pages/contact.json hero.image missing');
  if (!isNonEmptyString(blogPage?.hero?.image)) fail('pages/blog.json hero.image missing');

  // Home visual modules
  const menuPreviewImages = Array.isArray(homePage?.menuPreview?.items)
    ? homePage.menuPreview.items.filter((item) => isNonEmptyString(item?.image)).length
    : 0;
  if (menuPreviewImages < 4) fail(`home menu preview images assigned ${menuPreviewImages}/4`);

  const homeGalleryImages = Array.isArray(homePage?.gallery?.images)
    ? homePage.gallery.images.filter((item) => isNonEmptyString(item?.src)).length
    : 0;
  if (homeGalleryImages < 4) fail(`home gallery preview images assigned ${homeGalleryImages}/4`);

  // Menu hub sections
  if (!isNonEmptyString(menuPage?.todaySpecial?.image)) fail('pages/menu.json todaySpecial.image missing');
  const weeklyWithImage = Array.isArray(menuPage?.weeklySpecials)
    ? menuPage.weeklySpecials.filter((item) => isNonEmptyString(item?.image)).length
    : 0;
  if (weeklyWithImage < 7) fail(`weekly specials images assigned ${weeklyWithImage}/7`);
  const signatureWithImage = Array.isArray(menuPage?.chefSignatures)
    ? menuPage.chefSignatures.filter((item) => isNonEmptyString(item?.image)).length
    : 0;
  if (signatureWithImage < 3) fail(`chef signatures images assigned ${signatureWithImage}/3`);

  // Menu type heroes
  const menuDir = path.join(EN_DIR, 'menu');
  const menuFiles = (await fs.readdir(menuDir)).filter((name) => name.endsWith('.json'));
  for (const fileName of menuFiles) {
    const data = JSON.parse(await fs.readFile(path.join(menuDir, fileName), 'utf-8'));
    if (!isNonEmptyString(data?.defaultItemImage)) {
      fail(`menu/${fileName} defaultItemImage missing`);
    }
  }

  // Breakfast visual coverage explicit check
  const breakfast = JSON.parse(
    await fs.readFile(path.join(menuDir, 'breakfast.json'), 'utf-8')
  );
  if (!isNonEmptyString(breakfast?.defaultItemImage)) {
    fail('menu/breakfast.json defaultItemImage missing');
  }

  // Events data + gallery
  const publishedEvents = Array.isArray(eventsData?.events)
    ? eventsData.events.filter((item) => item?.published !== false)
    : [];
  const eventsWithImage = publishedEvents.filter((item) => isNonEmptyString(item?.image)).length;
  if (eventsWithImage < publishedEvents.length) {
    fail(`events/events.json images assigned ${eventsWithImage}/${publishedEvents.length}`);
  }

  const galleryItems = Array.isArray(galleryData?.items) ? galleryData.items : [];
  const galleryWithUrl = galleryItems.filter((item) => isNonEmptyString(item?.url)).length;
  if (galleryWithUrl < 12) fail(`gallery coverage below minimum 12 (found ${galleryWithUrl})`);

  const galleryMissingAlt = galleryItems.filter((item) => !isNonEmptyString(item?.alt)).length;
  if (galleryMissingAlt > 0) fail(`gallery items missing alt: ${galleryMissingAlt}`);

  // Team / Blog cards
  const members = Array.isArray(teamData?.members) ? teamData.members : [];
  const membersWithPhoto = members.filter((member) => isNonEmptyString(member?.photo)).length;
  if (membersWithPhoto < members.length) {
    fail(`team/team.json photos assigned ${membersWithPhoto}/${members.length}`);
  }

  const posts = Array.isArray(blogPosts?.posts) ? blogPosts.posts : [];
  const postsWithImage = posts.filter((post) => isNonEmptyString(post?.image)).length;
  if (postsWithImage < posts.length) fail(`blog/posts.json images assigned ${postsWithImage}/${posts.length}`);

  ok('Coverage matrix checks completed');

  return {
    urls: Array.from(
      [
        homePage,
        menuPage,
        aboutPage,
        eventsPage,
        privateDiningPage,
        galleryPage,
        reservationsPage,
        contactPage,
        blogPage,
        eventsData,
        galleryData,
        blogPosts,
        teamData,
      ].reduce((set, item) => collectImageUrls(item, set), new Set())
    ),
  };
}

async function checkUrlHealth(urls) {
  const toCheck = urls.slice(0, 200);
  const timeoutMs = 8000;

  for (const url of toCheck) {
    let response;
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);
      response = await fetch(url, { method: 'HEAD', signal: controller.signal });
      clearTimeout(timer);
    } catch {
      // fallback to GET when HEAD is unsupported
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), timeoutMs);
        response = await fetch(url, { method: 'GET', signal: controller.signal });
        clearTimeout(timer);
      } catch (error) {
        fail(`broken media URL (network): ${url}`);
        continue;
      }
    }

    if (!response || !response.ok) {
      fail(`broken media URL (${response?.status || 'unknown'}): ${url}`);
    }
  }
}

async function main() {
  console.log('\n📸 Media Coverage QA\n');
  const { urls } = await checkCoverage();
  await checkUrlHealth(urls);

  console.log('\n  ────────────────────────────');
  if (warnings > 0) console.log(`  ⚠ Warnings: ${warnings}`);
  if (failures > 0) console.log(`  ✖ Failures: ${failures}`);
  if (warnings === 0 && failures === 0) console.log('  ✓ All media checks passed');
  console.log('');

  process.exit(failures > 0 ? 1 : 0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
