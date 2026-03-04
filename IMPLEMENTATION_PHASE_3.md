# IMPLEMENTATION PHASE 3
## Unsplash Media Pipeline + Full Photo Coverage

## Objective

Ensure menus and all key visual pages have production-ready photo coverage sourced from Unsplash (via API/account workflow), with optimized storage and attribution handling.

## Tasks

1. Define visual asset matrix
- Required photo slots by page:
  - Home: hero, featured dishes, ambiance, chef/story
  - Menus hub: category hero tiles
  - Each menu page: hero + 1 image per featured item section
  - About: chef portrait + interior
  - Events: event hero + gallery strip
  - Private Dining: room hero + detail shots
  - Gallery: curated grid (minimum 12-24)
  - Reservations/Contact: supporting ambiance image
  - Journal: article card fallback image

2. Implement Unsplash fetch workflow
- Add script/service using Unsplash API key from env
- Query by curated terms (The Meridian tone + cuisine style)
- Download/store selected images in controlled media location (Supabase Storage or local seed path)
- Persist metadata (author, source URL, attribution text) for compliance

3. Content mapping
- Connect stored media IDs/URLs to page content entries
- Add menu item image mapping where appropriate
- Ensure fallback image is present for every page/content card

4. Optimization
- Serve with `next/image`
- Include width/height for CLS safety
- Generate/choose WebP variants where possible
- Lazy-load non-critical images

5. QA for media
- Broken link scan
- Missing alt text scan
- Coverage report (required slots vs actual assigned)

## Deliverables

- Unsplash ingestion script/service documented and runnable
- Complete photo assignment for menus + all visual pages
- Attribution metadata recorded
- Image performance baseline acceptable

## Done-Gate Checklist

- [x] 100% required photo slots assigned (EN scope)
- [x] Menu pages all include page hero images
- [x] Breakfast page/menu includes visual assets
- [x] No broken media URLs in QA scan (`npm run qa:media`)
- [x] Alt text present on all rendered images (gallery/home preview + component fallbacks)

## Compliance Note

Respect Unsplash API and attribution requirements in display/admin metadata.
