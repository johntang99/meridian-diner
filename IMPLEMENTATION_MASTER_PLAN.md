# The Meridian (Diner) Implementation Master Plan

This is the execution plan for building `restaurant/meridian/app` in phases.
It is aligned to:

- `RESTAURANT_COMPLETE_PLAN.md`
- `a1_industry_brief.md` through `a6_content_contracts.md`

## Project Decisions

- Brand/name stays: **The Meridian**
- Folder: `restaurant/meridian/`
- Build approach: phase-by-phase, each phase has a done-gate
- No phase skipping
- Parallel-copy safety settings:
  - `NEXT_PUBLIC_DEFAULT_SITE=meridian-diner`
  - `NEXT_PUBLIC_SITE_URL=http://localhost:3021`
  - keep isolated local env in `restaurant/meridian/app/.env.local`

## Phase Files

- `IMPLEMENTATION_PHASE_0.md` - Foundation + fork + schema + env
- `IMPLEMENTATION_PHASE_1.md` - Core routes + layout.json + theme tokens
- `IMPLEMENTATION_PHASE_2.md` - Content system + ContentEditor panels
- `IMPLEMENTATION_PHASE_3.md` - Media/Unsplash + page photo coverage
- `IMPLEMENTATION_PHASE_4.md` - QA + SEO + pipeline + launch readiness
- `IMPLEMENTATION_PHASE_5.md` - Post-launch growth operations

## Required Inclusions (explicit)

This implementation pack includes:

1. `layout.json` for pages (build order and starter structures)
2. `ContentEditor.tsx` short plan + panel additions
3. Unsplash photo ingestion and coverage for menus and all visual pages
4. The site identity remains **The Meridian**

## DB + Env Decision

Short answer: **Yes, you can use the same DB project and env pattern, with guardrails.**

Recommended:

- Same Supabase project for the same industry (`restaurant`) is acceptable
- Use a **separate `site_id`** if this is a separate runtime site copy (**chosen: `meridian-diner`**)
- Use separate local domain + port for this workspace (**chosen: `http://localhost:3021`**)
- Keep a separate `.env.local` in `restaurant/meridian/app`
- Never reuse another industry's DB (`medical` / `realestate`)

If this workspace is meant to be the exact same The Meridian site (not a second copy), then:

- You may point to the same `site_id` (not recommended for this repo)
- But avoid concurrent edits from two repos unless you explicitly want that

## Execution Rules

- Each phase ends with verification (`npm run build`, relevant QA scripts)
- If gate fails, fix before next phase
- Keep docs updated when scope changes
