#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';

function readArgValue(flag, fallback = '') {
  const index = process.argv.findIndex((arg) => arg === flag);
  if (index === -1) return fallback;
  return process.argv[index + 1] || fallback;
}

async function walk(dir, out) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(fullPath, out);
      continue;
    }
    if (entry.name.endsWith('.json') || entry.name.endsWith('.md') || entry.name.endsWith('.sql')) {
      out.push(fullPath);
    }
  }
}

async function main() {
  const root = process.cwd();
  const fromValue = readArgValue('--from', 'meridian-diner');
  const toValue = readArgValue('--to', 'meridian-diner');
  const target = readArgValue('--target', path.join(root, 'content', 'meridian-diner'));

  const files = [];
  await walk(target, files);

  let changedFiles = 0;
  let replacements = 0;

  for (const file of files) {
    const raw = await fs.readFile(file, 'utf-8');
    if (!raw.includes(fromValue)) continue;
    const next = raw.split(fromValue).join(toValue);
    const count = raw.split(fromValue).length - 1;
    await fs.writeFile(file, next);
    changedFiles += 1;
    replacements += count;
  }

  console.log(`target=${target}`);
  console.log(`changedFiles=${changedFiles}`);
  console.log(`replacements=${replacements}`);
}

main().catch((error) => {
  console.error('Replace failed:', error.message);
  process.exit(1);
});
