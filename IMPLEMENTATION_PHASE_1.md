# IMPLEMENTATION PHASE 1
## Route System, layout.json, Theme Foundation

## Objective

Build the page structure and routing contract for The Meridian, driven by `layout.json` and restaurant information architecture.

## Tasks

1. Define page inventory
- Finalize route set from architecture docs:
  - Home
  - Menus hub + menu detail pages (dinner, cocktails, breakfast, dessert, wine)
  - About
  - Reservations
  - Private Dining
  - Events
  - Gallery
  - Contact
  - FAQ
  - Journal/Blog + article detail

2. Create `layout.json` for pages
- Add content layout definitions under site content
- Encode page sections and order, per page
- Keep IDs stable for editor and DB mapping

Example structure (per page):
- `hero`
- `feature-grid`
- `story-block`
- `cta`
- `seo`

3. Wire router to layout-driven rendering
- Ensure page entry points read layout config from DB/content fallback
- Add guard for missing sections
- Keep SSR/ISR behavior stable

4. Theme token integration
- Ensure theme variables are injected from content/theme config
- Remove hardcoded style constants in page-level components

5. Schema base alignment
- Ensure global `Restaurant` schema fields are data-driven from site config
- Remove hardcoded cuisine/hours from layout-level schema output

## Deliverables

- `layout.json` coverage for all required pages
- Route skeletons render from layout contract
- Theme token base functional
- Global schema no longer hardcoded

## Done-Gate Checklist

- [ ] Every core route renders without runtime error
- [ ] `layout.json` exists and drives section order
- [ ] Menu hub includes breakfast in architecture
- [ ] No hardcoded `servesCuisine` / opening-hours in global schema
- [ ] Lighthouse smoke run is acceptable for baseline

## Notes

The Meridian remains the active diner identity in all page metadata and placeholders.
