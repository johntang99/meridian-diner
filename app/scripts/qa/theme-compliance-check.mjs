#!/usr/bin/env node
/**
 * QA Script: Theme Compliance Check
 * Scans route and UI files for hardcoded style patterns that bypass theme tokens.
 *
 * Usage:
 *   node scripts/qa/theme-compliance-check.mjs
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..', '..');

const cliArgs = process.argv.slice(2);
const scopeArg =
  cliArgs.find((arg) => arg.startsWith('--scope='))?.split('=')[1] || 'pages';
const scope = ['pages', 'components', 'all'].includes(scopeArg) ? scopeArg : 'pages';

const TARGET_DIRS = [
  ...(scope === 'pages' || scope === 'all' ? [path.join(ROOT, 'app', '[locale]')] : []),
  ...(scope === 'components' || scope === 'all' ? [path.join(ROOT, 'components')] : []),
];

const ALLOWED_FILE_PATTERNS = [
  /components\/admin\//,
  /\/components\/admin\//,
  /app\/\[locale\]\/components-preview\//,
  /\/app\/\[locale\]\/components-preview\//,
];

const CHECKS = [
  {
    id: 'legacy-radius-token',
    severity: 'fail',
    regex: /var\(--btn-radius\)|var\(--card-radius\)/g,
    message: 'Uses legacy radius token; use --radius-base instead',
  },
  {
    id: 'hardcoded-tailwind-text-color',
    severity: 'warn',
    regex: /\btext-(gray|zinc|neutral|slate|stone|black|white)(?:-\d{2,3}|\/\d+)?\b/g,
    message: 'Hardcoded text color class; prefer theme text tokens',
  },
  {
    id: 'hardcoded-tailwind-text-size',
    severity: 'warn',
    regex: /\btext-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl)\b/g,
    message: 'Hardcoded text size class; prefer text-display/heading/subheading/body/small',
  },
  {
    id: 'hardcoded-tailwind-radius',
    severity: 'warn',
    regex: /\brounded-(?:sm|md|lg|xl|2xl|3xl)\b/g,
    message: 'Hardcoded rounded-* class; prefer --radius-base-driven surfaces',
  },
  {
    id: 'hardcoded-tailwind-shadow',
    severity: 'warn',
    regex: /\bshadow-(?:sm|md|lg|xl|2xl)\b/g,
    message: 'Hardcoded shadow-* class; prefer --shadow-base-driven surfaces',
  },
  {
    id: 'literal-color-style',
    severity: 'warn',
    regex: /color\s*:\s*['"](#[0-9a-fA-F]{3,8}|rgb[a]?\([^)]+\)|white|black)['"]/g,
    message: 'Literal color in inline style; prefer theme CSS variables',
  },
];

let warnings = 0;
let failures = 0;
let filesScanned = 0;

function shouldSkip(filePath) {
  return ALLOWED_FILE_PATTERNS.some((pattern) => pattern.test(filePath));
}

function lineNumberForIndex(content, index) {
  return content.slice(0, index).split('\n').length;
}

async function listFilesRecursive(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listFilesRecursive(full)));
      continue;
    }
    if (!/\.(tsx|ts|jsx|js|css)$/.test(entry.name)) continue;
    files.push(full);
  }
  return files;
}

function reportIssue({ severity, relPath, line, message, sample }) {
  const icon = severity === 'fail' ? '❌ FAIL' : '⚠️  WARN';
  console.log(`  ${icon} ${relPath}:${line} — ${message}`);
  if (sample) {
    console.log(`         ↳ ${sample}`);
  }
}

function summarizeByRule(results) {
  const summary = new Map();
  for (const result of results) {
    summary.set(result.id, (summary.get(result.id) || 0) + 1);
  }
  return summary;
}

async function scanFile(filePath) {
  const relPath = path.relative(ROOT, filePath);
  if (shouldSkip(relPath)) return [];

  const content = await fs.readFile(filePath, 'utf-8');
  const results = [];

  for (const check of CHECKS) {
    const matches = [...content.matchAll(check.regex)];
    for (const match of matches) {
      const index = match.index ?? 0;
      const line = lineNumberForIndex(content, index);
      const sample = String(match[0]).slice(0, 120);
      results.push({
        id: check.id,
        severity: check.severity,
        relPath,
        line,
        message: check.message,
        sample,
      });
    }
  }

  return results;
}

async function main() {
  console.log('\n🎨 Theme Compliance Check\n');
  console.log(`  Scope: ${scope}\n`);

  const allFiles = [];
  for (const dir of TARGET_DIRS) {
    try {
      allFiles.push(...(await listFilesRecursive(dir)));
    } catch {
      // Ignore missing dirs
    }
  }

  const issues = [];
  for (const file of allFiles) {
    filesScanned += 1;
    const fileIssues = await scanFile(file);
    for (const issue of fileIssues) {
      issues.push(issue);
      if (issue.severity === 'fail') failures += 1;
      else warnings += 1;
      reportIssue(issue);
    }
  }

  const byRule = summarizeByRule(issues);

  console.log('\n  ────────────────────────────');
  console.log(`  Files scanned: ${filesScanned}`);
  if (warnings > 0) console.log(`  ⚠️  Warnings: ${warnings}`);
  if (failures > 0) console.log(`  ❌ Failures: ${failures}`);
  if (issues.length === 0) console.log('  ✅ No theme compliance issues detected');

  if (issues.length > 0) {
    console.log('\n  Rule breakdown:');
    for (const [rule, count] of byRule.entries()) {
      console.log(`    - ${rule}: ${count}`);
    }
  }
  console.log('');

  process.exit(failures > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
