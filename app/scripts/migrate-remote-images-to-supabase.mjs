#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const IMAGE_KEY_HINTS = new Set([
  'image',
  'images',
  'src',
  'url',
  'photo',
  'photoPortrait',
  'defaultItemImage',
  'ogImage',
]);

function readArgValue(flag, fallback = '') {
  const index = process.argv.findIndex((arg) => arg === flag);
  if (index === -1) return fallback;
  return process.argv[index + 1] || fallback;
}

function hasFlag(flag) {
  return process.argv.includes(flag);
}

async function loadDotEnvLocal(projectRoot) {
  const envPath = path.join(projectRoot, '.env.local');
  let raw = '';
  try {
    raw = await fs.readFile(envPath, 'utf-8');
  } catch {
    return;
  }
  for (const line of raw.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const index = trimmed.indexOf('=');
    if (index <= 0) continue;
    const key = trimmed.slice(0, index).trim();
    let value = trimmed.slice(index + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}

function resolveSupabaseUrl() {
  return (
    process.env.SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.SUPABASE_PROD_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_PROD_URL ||
    ''
  );
}

function resolveServiceRoleKey() {
  return (
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_PROD_SERVICE_ROLE_KEY ||
    ''
  );
}

function resolveBucket() {
  return (
    process.env.SUPABASE_STORAGE_BUCKET ||
    process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET ||
    'media'
  );
}

function shouldMigrateUrl(key, value) {
  if (typeof value !== 'string') return false;
  if (!/^https?:\/\//i.test(value)) return false;
  const lowKey = (key || '').toLowerCase();
  if (!IMAGE_KEY_HINTS.has(lowKey) && !lowKey.includes('image') && !lowKey.includes('photo')) {
    return false;
  }
  try {
    const host = new URL(value).hostname.toLowerCase();
    return host.includes('images.unsplash.com');
  } catch {
    return false;
  }
}

async function walkJsonFiles(dir, out) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walkJsonFiles(fullPath, out);
      continue;
    }
    if (entry.name.endsWith('.json')) out.push(fullPath);
  }
}

function contentTypeToExtension(contentType) {
  const normalized = String(contentType || '').toLowerCase();
  if (normalized.includes('image/png')) return 'png';
  if (normalized.includes('image/webp')) return 'webp';
  if (normalized.includes('image/avif')) return 'avif';
  if (normalized.includes('image/gif')) return 'gif';
  if (normalized.includes('image/svg')) return 'svg';
  return 'jpg';
}

async function uploadRemoteToSupabase(supabase, bucket, siteId, sourceUrl, cache) {
  if (cache.has(sourceUrl)) return cache.get(sourceUrl);

  const response = await fetch(sourceUrl);
  if (!response.ok) {
    throw new Error(`Download failed ${response.status}`);
  }
  const contentType = response.headers.get('content-type') || 'image/jpeg';
  const extension = contentTypeToExtension(contentType);
  const hash = crypto.createHash('sha1').update(sourceUrl).digest('hex');
  const objectPath = `${siteId}/external/unsplash/${hash}.${extension}`;
  const buffer = Buffer.from(await response.arrayBuffer());

  const { error } = await supabase.storage.from(bucket).upload(objectPath, buffer, {
    contentType,
    upsert: true,
    cacheControl: '31536000',
  });
  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from(bucket).getPublicUrl(objectPath);
  cache.set(sourceUrl, data.publicUrl);
  return data.publicUrl;
}

async function main() {
  const projectRoot = process.cwd();
  await loadDotEnvLocal(projectRoot);

  const siteId = readArgValue('--site', 'meridian-diner');
  const dryRun = hasFlag('--dry-run');
  const supabaseUrl = resolveSupabaseUrl();
  const serviceRoleKey = resolveServiceRoleKey();
  const bucket = resolveBucket();

  if (!supabaseUrl || !serviceRoleKey) {
    console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.');
    process.exit(1);
  }

  const contentRoot = path.join(projectRoot, 'content', siteId);
  const jsonFiles = [];
  await walkJsonFiles(contentRoot, jsonFiles);

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const urlCache = new Map();
  const migrationEntries = [];
  let filesUpdated = 0;
  let replacements = 0;

  for (const filePath of jsonFiles) {
    const raw = await fs.readFile(filePath, 'utf-8');
    let data;
    try {
      data = JSON.parse(raw);
    } catch {
      continue;
    }

    let changed = false;

    const transform = async (node) => {
      if (Array.isArray(node)) {
        for (let i = 0; i < node.length; i += 1) {
          node[i] = await transform(node[i]);
        }
        return node;
      }
      if (node && typeof node === 'object') {
        for (const key of Object.keys(node)) {
          const value = node[key];
          if (shouldMigrateUrl(key, value)) {
            if (dryRun) {
              const mock = `[DRY-RUN] ${value}`;
              if (mock !== value) {
                changed = true;
                replacements += 1;
              }
            } else {
              const nextUrl = await uploadRemoteToSupabase(
                supabase,
                bucket,
                siteId,
                value,
                urlCache
              );
              if (nextUrl !== value) {
                node[key] = nextUrl;
                changed = true;
                replacements += 1;
                migrationEntries.push({
                  file: path.relative(contentRoot, filePath).replace(/\\/g, '/'),
                  key,
                  from: value,
                  to: nextUrl,
                });
              }
            }
          } else {
            node[key] = await transform(value);
          }
        }
      }
      return node;
    };

    await transform(data);

    if (changed && !dryRun) {
      await fs.writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`);
      filesUpdated += 1;
    }
  }

  if (!dryRun) {
    const reportPath = path.join(contentRoot, 'media', 'supabase-migration-report.json');
    await fs.mkdir(path.dirname(reportPath), { recursive: true });
    await fs.writeFile(
      reportPath,
      `${JSON.stringify(
        {
          siteId,
          bucket,
          updatedAt: new Date().toISOString(),
          filesUpdated,
          replacements,
          migratedUrls: migrationEntries,
        },
        null,
        2
      )}\n`
    );
    console.log(`Report saved: ${reportPath}`);
  }

  console.log(`Scanned files: ${jsonFiles.length}`);
  console.log(`Replacements: ${replacements}`);
  console.log(`Files updated: ${filesUpdated}`);
  if (dryRun) {
    console.log('Dry run complete.');
  } else {
    console.log('Migration complete.');
  }
}

main().catch((error) => {
  console.error('Migration failed:', error.message);
  process.exit(1);
});
