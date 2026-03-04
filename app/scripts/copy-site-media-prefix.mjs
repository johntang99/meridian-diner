#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

function readArgValue(flag, fallback = '') {
  const index = process.argv.findIndex((arg) => arg === flag);
  if (index === -1) return fallback;
  return process.argv[index + 1] || fallback;
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

async function listAllFiles(supabase, bucket, prefix) {
  const out = [];
  let offset = 0;
  const limit = 100;
  while (true) {
    const { data, error } = await supabase.storage.from(bucket).list(prefix, {
      limit,
      offset,
      sortBy: { column: 'name', order: 'asc' },
    });
    if (error) throw new Error(error.message);
    const rows = data || [];
    for (const row of rows) {
      if (row.id) out.push(row.name);
    }
    if (rows.length < limit) break;
    offset += limit;
  }
  return out;
}

async function main() {
  const root = process.cwd();
  await loadDotEnvLocal(root);

  const fromSite = readArgValue('--from', '');
  const toSite = readArgValue('--to', '');
  const bucket =
    process.env.SUPABASE_STORAGE_BUCKET || process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || 'media';
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  if (!fromSite || !toSite) {
    console.error('Missing required --from and --to');
    process.exit(1);
  }
  if (!supabaseUrl || !key) {
    console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const oldPrefix = `${fromSite}/external/unsplash`;
  const newPrefix = `${toSite}/external/unsplash`;
  const names = await listAllFiles(supabase, bucket, oldPrefix);

  let copied = 0;
  let failed = 0;

  for (const name of names) {
    const from = `${oldPrefix}/${name}`;
    const to = `${newPrefix}/${name}`;
    const { error } = await supabase.storage.from(bucket).copy(from, to);
    if (error && !String(error.message).toLowerCase().includes('exists')) {
      failed += 1;
      console.error(`copy failed ${name}: ${error.message}`);
      continue;
    }
    copied += 1;
  }

  console.log(`from=${fromSite} to=${toSite} total=${names.length} copied=${copied} failed=${failed}`);
}

main().catch((error) => {
  console.error('Copy failed:', error.message);
  process.exit(1);
});
