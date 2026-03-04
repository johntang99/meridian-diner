# IMPLEMENTATION PHASE 4
## Onboarding, QA, SEO, Launch Readiness

## Objective

Finalize the diner platform so new restaurant clients can be onboarded reliably, and The Meridian is launch-ready with SEO and QA coverage.

## Tasks

1. Refactor onboarding pipeline to restaurant domain
- Replace dental-specific constants/prompts/categories
- Use restaurant intake model:
  - concept, cuisine, service style, neighborhood, tone, menu focus
- Ensure generated outputs include menu structure and required pages

2. Add The Meridian baseline content completeness
- Confirm all core content exists:
  - hero/story
  - menus (including breakfast)
  - events/private dining/reservations/contact
  - FAQ + SEO blocks

3. Structured data and SEO completion
- Validate `Restaurant`, `Menu`, `MenuItem`, `Event`, `FAQPage`, `BlogPosting`, `BreadcrumbList`
- Ensure per-page metadata and canonical tags
- Ensure open graph image coverage

4. QA automation
- Run or add scripts:
  - route checks
  - schema checks
  - SEO checks
  - content completeness checks
  - image/link checks

5. Launch checklist
- Production env review
- Error tracking enabled
- Analytics configured
- Final smoke test on deployed preview

## Deliverables

- Restaurant onboarding flow operational
- Meridian content complete and validated
- QA scripts pass
- Deployment ready

## Done-Gate Checklist

- [ ] Onboarding no longer contains dental terminology/logic
- [ ] All required schema checks pass
- [ ] QA scripts pass with no blockers
- [ ] Production preview is approved
- [ ] Launch handoff notes completed
