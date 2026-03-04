# PHASE 3 MEDIA MATRIX

## Objective

Track required visual slots for The Meridian and ensure each slot has an assigned Unsplash-hosted image URL persisted through admin DB content.

## Required Slots

- Home
  - `pages/home.json.hero.image`
  - `pages/home.json.menuPreview.items[*].image` (>= 4)
  - `pages/home.json.aboutPreview.image`
  - `pages/home.json.eventsPreview.items[*].image` (>= 3)
  - `pages/home.json.gallery.images[*].src` (>= 4)
- Menu Hub
  - `pages/menu.json.todaySpecial.image`
  - `pages/menu.json.weeklySpecials[*].image` (7/7)
  - `pages/menu.json.chefSignatures[*].image` (all)
  - `app/[locale]/menu/page.tsx` menu type tile images (static map)
- Menu Type Pages
  - `menu/*.json.defaultItemImage` (all files)
  - `app/[locale]/menu/[type]/page.tsx` hero image from `defaultItemImage`
- About
  - `pages/about.json.hero.image`
  - `team/team.json.members[*].photo`
- Events
  - `pages/events.json.hero.image`
  - `events/events.json.events[*].image`
- Private Dining
  - `pages/private-dining.json.hero.image`
  - `pages/private-dining.json.spaces[*].image`
- Gallery
  - `pages/gallery.json.hero.image`
  - `gallery/gallery.json.items[*].url` (>= 12 assigned)
- Reservations / Contact / Blog
  - `pages/reservations.json.hero.image`
  - `pages/contact.json.hero.image`
  - `pages/blog.json.hero.image`
  - `blog/posts.json.posts[*].image`

## Attribution

- Source metadata file: `app/content/meridian-diner/en/media/attribution.json`
- Unsplash ingestion + manifest scripts:
  - `app/scripts/fetch-restaurant-images.mjs`
  - `app/scripts/apply-restaurant-images.mjs`

## QA

- Coverage + broken URL + alt checks: `npm run qa:media`
- Full QA suite: `npm run qa:all`
