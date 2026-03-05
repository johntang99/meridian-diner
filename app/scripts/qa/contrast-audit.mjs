#!/usr/bin/env node
/**
 * QA Script: Runtime Contrast Audit
 * Runs axe-core color contrast checks in a real browser across key routes.
 *
 * Usage:
 *   node scripts/qa/contrast-audit.mjs
 *   node scripts/qa/contrast-audit.mjs --base-url=http://localhost:3021
 *   node scripts/qa/contrast-audit.mjs --routes=/,/menu,/contact
 */

import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..', '..');

const args = process.argv.slice(2);
const getArg = (name, fallback) =>
  args.find((arg) => arg.startsWith(`--${name}=`))?.split('=').slice(1).join('=') || fallback;

const baseUrl = getArg('base-url', process.env.QA_BASE_URL || 'http://localhost:3021');
const timeoutMs = Number(getArg('timeout-ms', '30000'));
const routesArg = getArg('routes', '');
const failOnNavigationError = getArg('fail-on-navigation-error', 'true') !== 'false';
const reportFile = getArg('report-file', path.join(ROOT, 'reports', 'qa-contrast-report.json'));
const routesReportFile = getArg('routes-report-file', path.join(ROOT, 'reports', 'qa-contrast-routes.json'));
const inventoryMode = getArg('inventory', process.env.QA_ROUTE_INVENTORY || 'extended');
const inventorySiteId = getArg('site-id', process.env.QA_SITE_ID || 'meridian-diner');
const inventoryLocale = getArg('locale', process.env.QA_LOCALE || 'en');
const includeSitemapDiscovery = getArg('include-sitemap', 'true') !== 'false';
const listRoutesOnly = getArg('list-routes-only', 'false') === 'true';

const defaultRoutes = [
  '/',
  '/en',
  '/en/menu',
  '/en/about',
  '/en/events',
  '/en/gallery',
  '/en/reservations',
  '/en/reservations/private-dining',
  '/en/contact',
  '/en/blog',
  '/en/careers',
  '/en/gift-cards',
  '/en/faq',
  '/en/privacy',
  '/en/terms',
];

function uniqueRoutes(values) {
  return Array.from(new Set(values.filter(Boolean)));
}

async function readJsonIfExists(filePath) {
  try {
    const raw = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

async function discoverStaticRoutesFromAppTree(locale) {
  const localePrefix = `/${locale}`;
  const localeAppDir = path.join(ROOT, 'app', '[locale]');
  const staticRoutes = [];

  async function walk(currentDir, segments) {
    let entries = [];
    try {
      entries = await fs.readdir(currentDir, { withFileTypes: true });
    } catch {
      return;
    }

    const hasPage = entries.some((entry) => entry.isFile() && entry.name === 'page.tsx');
    if (hasPage && segments.every((segment) => !segment.includes('['))) {
      const joined = segments.join('/');
      staticRoutes.push(joined ? `${localePrefix}/${joined}` : localePrefix);
    }

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      if (entry.name.startsWith('_')) continue;
      await walk(path.join(currentDir, entry.name), [...segments, entry.name]);
    }
  }

  await walk(localeAppDir, []);
  return uniqueRoutes(staticRoutes);
}

async function buildExtendedRoutes(siteId, locale) {
  const localePrefix = `/${locale}`;
  const manualBaseRoutes = [
    '/',
    localePrefix,
    `${localePrefix}/menu`,
    `${localePrefix}/about`,
    `${localePrefix}/about/team`,
    `${localePrefix}/events`,
    `${localePrefix}/gallery`,
    `${localePrefix}/reservations`,
    `${localePrefix}/reservations/private-dining`,
    `${localePrefix}/contact`,
    `${localePrefix}/blog`,
    `${localePrefix}/careers`,
    `${localePrefix}/gift-cards`,
    `${localePrefix}/faq`,
    `${localePrefix}/privacy`,
    `${localePrefix}/terms`,
    `${localePrefix}/press`,
    `${localePrefix}/services`,
  ];
  const discoveredStaticRoutes = await discoverStaticRoutesFromAppTree(locale);
  const baseRoutes = uniqueRoutes([...manualBaseRoutes, ...discoveredStaticRoutes]);

  const contentRoot = path.join(ROOT, 'content', siteId, locale);
  const dynamicRoutes = [];

  const blogPosts = await readJsonIfExists(path.join(contentRoot, 'blog', 'posts.json'));
  for (const post of blogPosts?.posts || []) {
    if (!post?.slug) continue;
    if (post.published === false) continue;
    dynamicRoutes.push(`${localePrefix}/blog/${post.slug}`);
  }

  const events = await readJsonIfExists(path.join(contentRoot, 'events', 'events.json'));
  for (const event of events?.events || []) {
    const routeIds = [event?.id, event?.slug].filter(Boolean);
    for (const routeId of routeIds) {
      dynamicRoutes.push(`${localePrefix}/events/${routeId}`);
    }
  }

  const menuDir = path.join(contentRoot, 'menu');
  try {
    const entries = await fs.readdir(menuDir, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isFile() || !entry.name.endsWith('.json')) continue;
      const typeSlug = entry.name.replace(/\.json$/, '');
      dynamicRoutes.push(`${localePrefix}/menu/${typeSlug}`);
    }
  } catch {
    // menu directory may not exist for some sites
  }

  const servicesIndex = await readJsonIfExists(path.join(contentRoot, 'services', 'services.json'));
  for (const service of servicesIndex?.services || []) {
    if (!service?.slug) continue;
    dynamicRoutes.push(`${localePrefix}/services/${service.slug}`);
  }

  return uniqueRoutes([...baseRoutes, ...dynamicRoutes]);
}

async function discoverRoutesFromSitemap(locale) {
  try {
    const normalizedBase = baseUrl.replace(/\/+$/, '');
    const response = await fetch(`${normalizedBase}/sitemap.xml`);
    if (!response.ok) return [];

    const xml = await response.text();
    const matches = Array.from(xml.matchAll(/<loc>([^<]+)<\/loc>/g));
    const localePrefix = `/${locale}`;

    return uniqueRoutes(
      matches
        .map((match) => match[1]?.trim())
        .filter(Boolean)
        .map((url) => {
          try {
            const parsed = new URL(url);
            return parsed.pathname.replace(/\/+$/, '') || '/';
          } catch {
            return null;
          }
        })
        .filter((route) => {
          if (!route) return false;
          return route === localePrefix || route.startsWith(`${localePrefix}/`);
        })
    );
  } catch {
    return [];
  }
}

async function buildRoutes() {
  if (routesArg) {
    return uniqueRoutes(routesArg.split(',').map((item) => item.trim()));
  }

  if (inventoryMode === 'critical') {
    return defaultRoutes;
  }

  const extendedRoutes = await buildExtendedRoutes(inventorySiteId, inventoryLocale);
  if (inventoryMode !== 'exhaustive' && !includeSitemapDiscovery) {
    return extendedRoutes;
  }

  const sitemapRoutes = await discoverRoutesFromSitemap(inventoryLocale);
  if (inventoryMode === 'exhaustive') {
    return uniqueRoutes([...extendedRoutes, ...sitemapRoutes]);
  }

  return uniqueRoutes([...extendedRoutes, ...sitemapRoutes]);
}

const routes = await buildRoutes();

function normalizeUrl(route) {
  if (route.startsWith('http://') || route.startsWith('https://')) return route;
  const normalizedBase = baseUrl.replace(/\/+$/, '');
  const normalizedRoute = route.startsWith('/') ? route : `/${route}`;
  return `${normalizedBase}${normalizedRoute}`;
}

function nodeTarget(node) {
  if (!node) return '(unknown node)';
  if (Array.isArray(node.target) && node.target.length > 0) return node.target[0];
  return '(unknown selector)';
}

async function run() {
  console.log('\n🎨 Runtime Contrast Audit\n');
  console.log(`  Base URL: ${baseUrl}`);
  console.log(`  Inventory: ${routesArg ? 'manual' : inventoryMode}`);
  if (!routesArg) {
    console.log(`  Site/Locale: ${inventorySiteId}/${inventoryLocale}`);
  }
  console.log(`  Routes: ${routes.length}\n`);

  const routesReport = {
    generatedAt: new Date().toISOString(),
    baseUrl,
    inventory: routesArg ? 'manual' : inventoryMode,
    siteId: inventorySiteId,
    locale: inventoryLocale,
    includeSitemapDiscovery,
    routes,
  };
  await fs.mkdir(path.dirname(routesReportFile), { recursive: true });
  await fs.writeFile(routesReportFile, JSON.stringify(routesReport, null, 2), 'utf-8');
  console.log(`  Route inventory report: ${routesReportFile}`);

  if (listRoutesOnly) {
    console.log('');
    for (const route of routes) {
      console.log(`  - ${route}`);
    }
    console.log('\n  ✅ Route inventory generated\n');
    process.exit(0);
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  let totalViolations = 0;
  let navErrors = 0;
  const report = {
    generatedAt: new Date().toISOString(),
    baseUrl,
    routes,
    totals: {
      routes: routes.length,
      contrastViolations: 0,
      routeErrors: 0,
    },
    results: [],
  };

  for (const route of routes) {
    const url = normalizeUrl(route);
    process.stdout.write(`  • Checking ${url} ... `);

    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: timeoutMs });
      const results = await new AxeBuilder({ page }).withRules(['color-contrast']).analyze();
      const violations = results.violations || [];
      const contrastViolations = violations.filter((v) => v.id === 'color-contrast');

      const violationCount = contrastViolations.reduce(
        (sum, violation) => sum + (violation.nodes?.length || 0),
        0
      );
      totalViolations += violationCount;
      report.results.push({
        route,
        url,
        status: violationCount === 0 ? 'ok' : 'fail',
        contrastViolations: violationCount,
        violations: contrastViolations.map((violation) => ({
          id: violation.id,
          impact: violation.impact || 'unknown',
          nodes: (violation.nodes || []).map((node) => ({
            target: nodeTarget(node),
            failureSummary: node.failureSummary || '',
          })),
        })),
      });

      if (violationCount === 0) {
        console.log('OK');
      } else {
        console.log(`FAIL (${violationCount})`);
        for (const violation of contrastViolations) {
          for (const node of violation.nodes || []) {
            const summary = node.failureSummary
              ? node.failureSummary.replace(/\s+/g, ' ').trim()
              : '(no summary)';
            console.log(`      - ${nodeTarget(node)} :: ${summary}`);
          }
        }
      }
    } catch (error) {
      navErrors += 1;
      report.results.push({
        route,
        url,
        status: 'error',
        contrastViolations: 0,
        error: error.message,
      });
      console.log('ERROR');
      console.log(`      - Navigation/audit failed: ${error.message}`);
    }
  }

  await browser.close();

  console.log('\n  ────────────────────────────');
  console.log(`  Routes checked: ${routes.length}`);
  console.log(`  Contrast violations: ${totalViolations}`);
  console.log(`  Route errors: ${navErrors}`);

  report.totals.contrastViolations = totalViolations;
  report.totals.routeErrors = navErrors;
  await fs.mkdir(path.dirname(reportFile), { recursive: true });
  await fs.writeFile(reportFile, JSON.stringify(report, null, 2), 'utf-8');
  console.log(`  Report: ${reportFile}`);

  if (totalViolations === 0 && (navErrors === 0 || !failOnNavigationError)) {
    console.log('  ✅ Runtime contrast audit passed\n');
    process.exit(0);
  }

  console.log('  ❌ Runtime contrast audit failed\n');
  process.exit(1);
}

run().catch((error) => {
  console.error(`Fatal: ${error.message}`);
  process.exit(1);
});
