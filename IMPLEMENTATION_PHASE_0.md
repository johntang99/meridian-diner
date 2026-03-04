# IMPLEMENTATION PHASE 0
## Foundation, Fork, Data Safety, Environment

## Objective

Prepare a clean implementation base for The Meridian diner build inside `restaurant/meridian/app`, with safe DB isolation and repeatable local setup.

## Inputs

- `RESTAURANT_COMPLETE_PLAN.md`
- `a1` through `a6`
- Chosen base codebase to duplicate (recommended prior analysis: dental-clinic platform base)

## Tasks

1. Create app baseline
- Duplicate the selected baseline app into `restaurant/meridian/app`
- Remove obvious domain leftovers (dental/real-estate labels in readme, scripts, constants)

2. Environment setup
- Create `app/.env.local` for this workspace
- Define required variables (Supabase URL/key, site defaults, AI keys, Unsplash key)
- Keep env naming conventions consistent with existing platform
- Applied for this project:
  - `NEXT_PUBLIC_DEFAULT_SITE=meridian-diner`
  - `NEXT_PUBLIC_SITE_URL=http://localhost:3021`

3. DB strategy and site isolation
- Confirm Supabase project to use for restaurant stack
- Decide one of:
  - Reuse an existing site_id (single shared site), or
  - New site copy (`site_id = meridian-diner`) for safe parallel development
- Record decision in `app/README.md`
- Chosen decision for current implementation:
  - separate `site_id = meridian-diner`
  - separate local port `3021`

4. Minimum schema readiness
- Verify required content tables exist for restaurant contracts
- Add missing columns/tables only if required by `a6_content_contracts.md`
- Ensure row-level conventions include `site_id` where needed

5. Baseline verification
- Install dependencies
- Run local app
- Run typecheck/build

## Deliverables

- `restaurant/meridian/app` runnable locally
- `.env.local` created (not committed)
- DB/site isolation decision documented
- Baseline build passes

## Done-Gate Checklist

- [ ] `npm install` succeeds
- [ ] `npm run dev` starts without fatal errors
- [ ] `npm run build` succeeds
- [ ] DB target and `site_id` strategy documented
- [ ] No obvious cross-industry branding leftovers in app shell

## Risks

- Accidentally writing to production rows
- Shared `site_id` causing collisions
- Hidden template leftovers in onboarding logic

## Rollback

- Keep fork point commit tag
- Revert to baseline commit if migration/env causes instability
