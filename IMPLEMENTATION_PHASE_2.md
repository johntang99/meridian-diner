# IMPLEMENTATION PHASE 2
## Content Contracts + ContentEditor Panels

## Objective

Implement restaurant content contracts (`a6`) and provide a short, maintainable `ContentEditor.tsx` with panelized editing for all key content domains.

## Scope Requirement (explicit)

- Keep `ContentEditor.tsx` short (target: orchestration only)
- Move heavy panel UI logic into focused panel components

## Tasks

1. Contract-first typing
- Implement/verify interfaces:
  - `LocalizedString`
  - Site settings
  - Menu categories/items
  - Events
  - Team/Chef bios
  - Testimonials/press
  - FAQ
  - SEO payloads
- Ensure all public text fields are localized where required

2. Refactor `ContentEditor.tsx` (short shell)
- `ContentEditor.tsx` should:
  - Load selected page/content type
  - Select panel from registry
  - Handle save/publish actions
  - Handle shared error/loading states
- Move form specifics out to panels

3. Add panel components
- Required panels:
  - `SiteSettingsPanel`
  - `HomePagePanel`
  - `MenuHubPanel`
  - `MenuCategoryPanel`
  - `MenuItemPanel`
  - `ReservationsPanel`
  - `PrivateDiningPanel`
  - `EventsPanel`
  - `GalleryPanel`
  - `AboutPanel`
  - `TeamPanel`
  - `FAQPanel`
  - `SEOPanel`

4. Add `layout.json` editor support
- Panel to edit section ordering and visibility per page
- Validation for required sections (hero, seo, etc.)

5. Validation and publish flow
- Enforce required fields before publish
- Show missing localized fields warnings
- Add lightweight draft/published state indicators

## Deliverables

- Short `ContentEditor.tsx` with panel registry
- Restaurant panel set implemented
- `layout.json` editable from admin
- Validation errors are clear and actionable

## Done-Gate Checklist

- [ ] `ContentEditor.tsx` reduced to orchestration + registry
- [ ] All required panels available and reachable
- [ ] Save/publish works for each panel type
- [ ] `layout.json` can be edited safely
- [ ] Typecheck passes with contracts enabled

## Suggested Definition of "Short"

- Keep `ContentEditor.tsx` under ~220-300 lines
- No page-specific form fields directly inside `ContentEditor.tsx`
