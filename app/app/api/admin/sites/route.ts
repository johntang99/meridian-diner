import { NextRequest, NextResponse } from 'next/server';
import { createSite, getSiteById, getSites } from '@/lib/sites';
import { getSessionFromRequest } from '@/lib/admin/auth';
import { getDefaultFooter } from '@/lib/footer';
import type { SiteConfig } from '@/lib/types';
import fs from 'fs/promises';
import path from 'path';
import {
  canUseContentDb,
  fetchContentEntry,
  listContentEntriesForSite,
  upsertContentEntry,
} from '@/lib/contentDb';
import { listMediaDb, upsertMediaDb } from '@/lib/admin/mediaDb';
import { filterSitesForUser, isSuperAdmin } from '@/lib/admin/permissions';
import { writeAuditLog } from '@/lib/admin/audit';

export async function GET(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }

  const sites = await getSites();
  const visible = filterSitesForUser(sites, session.user);
  return NextResponse.json(visible);
}

export async function POST(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }
  if (!isSuperAdmin(session.user)) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  const payload = (await request.json()) as Partial<SiteConfig> & {
    cloneFrom?: string;
  };
  if (!payload.id || !payload.name) {
    return NextResponse.json({ message: 'ID and name are required' }, { status: 400 });
  }

  try {
    const requestStartedAt = Date.now();
    const created = await createSite({
      id: payload.id,
      name: payload.name,
      domain: payload.domain,
      enabled: payload.enabled ?? true,
      defaultLocale: payload.defaultLocale ?? 'en',
      supportedLocales: payload.supportedLocales ?? ['en', 'zh'],
    });

    if (payload.cloneFrom) {
      const source = await getSiteById(payload.cloneFrom);
      if (!source) {
        return NextResponse.json({ message: 'Clone source not found' }, { status: 404 });
      }

      const copyDirectoryIfExists = async (sourceDir: string, targetDir: string) => {
        try {
          await fs.access(sourceDir);
        } catch {
          return;
        }
        await fs.mkdir(path.dirname(targetDir), { recursive: true });
        await fs.cp(sourceDir, targetDir, { recursive: true, errorOnExist: false });
      };

      if (canUseContentDb()) {
        const entries = await listContentEntriesForSite(source.id);
        const cloneBatchSize = 50;
        for (let i = 0; i < entries.length; i += cloneBatchSize) {
          const batch = entries.slice(i, i + cloneBatchSize);
          await Promise.all(
            batch.map((entry) =>
              upsertContentEntry({
                siteId: created.id,
                locale: entry.locale,
                path: entry.path,
                data: entry.data,
                updatedBy: session.user.id,
              })
            )
          );
        }

        // Clone media assets DB records for new site namespace.
        const sourceMedia = await listMediaDb(source.id);
        const mediaBatchSize = 100;
        for (let i = 0; i < sourceMedia.length; i += mediaBatchSize) {
          const batch = sourceMedia.slice(i, i + mediaBatchSize);
          await Promise.all(
            batch.map((item) =>
              upsertMediaDb({
                siteId: created.id,
                path: item.path,
                url: (item.url || '').replace(
                  `/uploads/${source.id}/`,
                  `/uploads/${created.id}/`
                ),
              })
            )
          );
        }
      }

      // Always copy file-based fallbacks/assets when source folders exist.
      const contentRoot = path.join(process.cwd(), 'content');
      await copyDirectoryIfExists(
        path.join(contentRoot, source.id),
        path.join(contentRoot, created.id)
      );

      const uploadsRoot = path.join(process.cwd(), 'public', 'uploads');
      await copyDirectoryIfExists(
        path.join(uploadsRoot, source.id),
        path.join(uploadsRoot, created.id)
      );
    }

    const ensureSeoFiles = async () => {
      const locales = created.supportedLocales?.length ? created.supportedLocales : ['en'];
      await Promise.all(
        locales.map(async (locale) => {
          const seoPayload = {
            title: created.name,
            description: '',
            home: {
              title: '',
              description: '',
            },
          };
          if (canUseContentDb()) {
            const existingSeo = await fetchContentEntry(created.id, locale, 'seo.json');
            if (existingSeo) return;
            await upsertContentEntry({
              siteId: created.id,
              locale,
              path: 'seo.json',
              data: seoPayload,
              updatedBy: session.user.id,
            });
            return;
          }

          const seoPath = path.join(process.cwd(), 'content', created.id, locale, 'seo.json');
          try {
            await fs.access(seoPath);
          } catch (error) {
            await fs.mkdir(path.dirname(seoPath), { recursive: true });
            await fs.writeFile(seoPath, JSON.stringify(seoPayload, null, 2));
          }
        })
      );
    };

    const ensureFooterFiles = async () => {
      const locales = created.supportedLocales?.length ? created.supportedLocales : ['en'];
      await Promise.all(
        locales.map(async (locale) => {
          const footer = getDefaultFooter(locale as any);
          if (canUseContentDb()) {
            const existingFooter = await fetchContentEntry(created.id, locale, 'footer.json');
            if (existingFooter) return;
            await upsertContentEntry({
              siteId: created.id,
              locale,
              path: 'footer.json',
              data: footer,
              updatedBy: session.user.id,
            });
            return;
          }

          const footerPath = path.join(process.cwd(), 'content', created.id, locale, 'footer.json');
          try {
            await fs.access(footerPath);
          } catch (error) {
            await fs.mkdir(path.dirname(footerPath), { recursive: true });
            await fs.writeFile(footerPath, JSON.stringify(footer, null, 2));
          }
        })
      );
    };

    await ensureSeoFiles();
    await ensureFooterFiles();

    const cloneStats = {
      clonedFrom: payload.cloneFrom || null,
      durationMs: Date.now() - requestStartedAt,
      contentMode: canUseContentDb() ? 'db' : 'file',
    };
    await writeAuditLog({
      actor: session.user,
      action: payload.cloneFrom ? 'site_clone_created' : 'site_created',
      siteId: created.id,
      metadata: cloneStats,
    });

    return NextResponse.json({
      ...created,
      cloneStats,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || 'Failed to create site' },
      { status: 500 }
    );
  }
}
