#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

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

function readArgValue(flag, fallback = '') {
  const index = process.argv.findIndex((arg) => arg === flag);
  if (index === -1) return fallback;
  return process.argv[index + 1] || fallback;
}

async function main() {
  const root = process.cwd();
  await loadDotEnvLocal(root);

  const userId = readArgValue('--user', 'admin-1');
  const site = readArgValue('--site', 'meridian-diner');

  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  if (!supabaseUrl || !serviceRoleKey) {
    console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: row, error: getError } = await supabase
    .from('admin_users')
    .select('id,email,sites')
    .eq('id', userId)
    .single();
  if (getError) {
    console.error(`Failed loading admin user ${userId}: ${getError.message}`);
    process.exit(1);
  }

  const currentSites = Array.isArray(row.sites) ? row.sites : [];
  const nextSites = Array.from(new Set([...currentSites, site]));

  const { error: updateError } = await supabase
    .from('admin_users')
    .update({ sites: nextSites })
    .eq('id', userId);
  if (updateError) {
    console.error(`Failed updating admin user ${userId}: ${updateError.message}`);
    process.exit(1);
  }

  const { data: verify, error: verifyError } = await supabase
    .from('admin_users')
    .select('id,email,sites')
    .eq('id', userId)
    .single();
  if (verifyError) {
    console.error(`Failed verifying admin user ${userId}: ${verifyError.message}`);
    process.exit(1);
  }

  console.log(JSON.stringify(verify, null, 2));
}

main().catch((error) => {
  console.error('Unexpected error:', error.message);
  process.exit(1);
});
