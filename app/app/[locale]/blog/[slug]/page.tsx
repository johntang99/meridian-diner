import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { type Locale } from '@/lib/i18n';
import { getRequestSiteId, loadContent, loadSiteInfo } from '@/lib/content';
import { buildPageMetadata } from '@/lib/seo';
import type { SiteInfo } from '@/lib/types';
import { getSiteDisplayName } from '@/lib/siteInfo';
import BlogCard, { type BlogPostData, getCategoryLabel } from '@/components/blog/BlogCard';
import NewsletterSignup from '@/components/blog/NewsletterSignup';

interface BlogData {
  posts: Array<BlogPostData & {
    body?: string;
    tags?: string[];
  }>;
}

interface TeamData {
  members: Array<{
    name: string;
    role?: string;
    photo?: string;
    shortBio?: string;
    department?: string;
  }>;
}

interface PageProps {
  params: { locale: Locale; slug: string };
}

function formatArticleDate(dateStr: string, locale: string): string {
  const d = new Date(dateStr);
  if (locale === 'zh') return d.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
  if (locale === 'es') return d.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

export async function generateMetadata({ params }: PageProps) {
  const { locale, slug } = params;
  const siteId = await getRequestSiteId();
  let blogData = await loadContent<BlogData>(siteId, locale, 'blog/posts.json');
  if (!blogData && locale !== 'en') blogData = await loadContent<BlogData>(siteId, 'en', 'blog/posts.json');

  const post = blogData?.posts?.find((p) => p.slug === slug && p.published !== false);
  if (!post) return {};

  const siteInfo = await loadSiteInfo(siteId, locale) as SiteInfo | null;
  const businessName = getSiteDisplayName(siteInfo, 'The Meridian');

  return buildPageMetadata({
    siteId,
    locale,
    slug: `blog/${slug}`,
    title: post.title,
    description: post.excerpt,
  });
}

export default async function BlogArticlePage({ params }: PageProps) {
  const { locale, slug } = params;
  const siteId = await getRequestSiteId();

  let blogData = await loadContent<BlogData>(siteId, locale, 'blog/posts.json');
  if (!blogData && locale !== 'en') blogData = await loadContent<BlogData>(siteId, 'en', 'blog/posts.json');

  const posts = blogData?.posts || [];
  const post = posts.find((p) => p.slug === slug && p.published !== false);

  if (!post) notFound();

  const [siteInfo, teamData] = await Promise.all([
    loadSiteInfo(siteId, locale) as Promise<SiteInfo | null>,
    loadContent<TeamData>(siteId, locale, 'team/team.json'),
  ]);

  const businessName = getSiteDisplayName(siteInfo, 'The Meridian');

  // Find author from team
  const authorMember = teamData?.members?.find((m) =>
    m.name === post.author || m.name.includes(post.author || ''),
  );

  // Related posts: same category, then recent, exclude current
  const relatedPosts = posts
    .filter((p) => p.slug !== post.slug && p.published !== false)
    .sort((a, b) => {
      const aMatch = a.category === post.category ? 0 : 1;
      const bMatch = b.category === post.category ? 0 : 1;
      if (aMatch !== bMatch) return aMatch - bMatch;
      return new Date(b.publishDate || '').getTime() - new Date(a.publishDate || '').getTime();
    })
    .slice(0, 3);

  // Schema.org BlogPosting
  const schemaOrg = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    author: { '@type': 'Person', name: post.author || businessName },
    datePublished: post.publishDate,
    image: post.image || undefined,
    publisher: { '@type': 'Organization', name: businessName },
  };

  return (
    <main>
      {/* Schema.org */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
      />

      {/* Hero Image */}
      <section className="relative w-full overflow-hidden" style={{ height: '50vh', minHeight: '300px' }}>
        {post.image ? (
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        ) : (
          <div className="w-full h-full" style={{ backgroundColor: 'var(--backdrop-secondary)' }} />
        )}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, var(--backdrop-primary) 0%, transparent 60%)' }}
        />
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-8">
          <div className="mx-auto" style={{ maxWidth: '720px' }}>
            {post.category && (
              <span
                className="inline-block px-3 py-1 mb-3"
                style={{
                  fontSize: '0.7rem',
                  borderRadius: 'var(--badge-radius)',
                  backgroundColor: 'var(--primary)',
                  color: 'var(--text-color-inverse)',
                  textTransform: 'capitalize',
                  fontWeight: 600,
                  fontFamily: 'var(--font-body)',
                }}
              >
                {getCategoryLabel(post.category, locale)}
              </span>
            )}
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--text-display, 3rem)',
                fontWeight: 'var(--weight-display, 400)' as any,
                letterSpacing: 'var(--tracking-display)',
                lineHeight: 'var(--leading-display, 1.1)',
                color: 'var(--text-on-dark-primary)',
              }}
            >
              {post.title}
            </h1>
          </div>
        </div>
      </section>

      {/* Article Header */}
      <section className="px-6" style={{ paddingTop: 'var(--section-py-sm)' }}>
        <div className="mx-auto" style={{ maxWidth: '720px' }}>
          <div className="flex items-center flex-wrap gap-4 mb-8" style={{ borderBottom: '1px solid var(--border-default)', paddingBottom: '1.5rem' }}>
            {/* Author */}
            <div className="flex items-center gap-2">
              {authorMember?.photo ? (
                <Image
                  src={authorMember.photo}
                  alt={post.author || ''}
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                />
              ) : (
                <div
                  className="flex items-center justify-center rounded-full"
                  style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: 'var(--backdrop-secondary)',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.875rem',
                    color: 'var(--text-color-muted)',
                    fontWeight: 600,
                  }}
                >
                  {(post.author || 'A').charAt(0)}
                </div>
              )}
              <div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 600, color: 'var(--heading-on-light, #111827)' }}>
                  {post.author}
                </p>
                {authorMember?.role && (
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--muted-on-light, #6B7280)' }}>
                    {authorMember.role}
                  </p>
                )}
              </div>
            </div>

            {/* Date */}
            {post.publishDate && (
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--muted-on-light, #6B7280)' }}>
                {formatArticleDate(post.publishDate, locale)}
              </span>
            )}

            {/* Read time */}
            {post.readTime && (
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--muted-on-light, #6B7280)' }}>
                {post.readTime} {locale === 'en' ? 'read' : locale === 'zh' ? '阅读' : 'lectura'}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Article Body */}
      <section className="px-6" style={{ paddingBottom: 'var(--section-py)' }}>
        <div className="mx-auto" style={{ maxWidth: '720px' }}>
          {post.body ? (
            <div
              className="article-body"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-body, 1rem)',
                lineHeight: 1.8,
                color: 'var(--body-on-light, #4B5563)',
              }}
              dangerouslySetInnerHTML={{ __html: post.body }}
            />
          ) : (
            /* Render excerpt as placeholder body */
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-body, 1rem)',
                lineHeight: 1.8,
                color: 'var(--body-on-light, #4B5563)',
              }}
            >
              {post.excerpt}
            </p>
          )}

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-8 pt-6" style={{ borderTop: '1px solid var(--border-default)' }}>
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1"
                  style={{
                    fontSize: '0.75rem',
                    borderRadius: 'var(--badge-radius)',
                    backgroundColor: 'var(--backdrop-secondary)',
                    color: 'var(--text-on-dark-secondary)',
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Author Bio */}
      {authorMember && (
        <section
          className="px-6"
          style={{
            paddingTop: 'var(--section-py-sm)',
            paddingBottom: 'var(--section-py)',
            backgroundColor: 'var(--backdrop-secondary)',
          }}
        >
          <div className="mx-auto" style={{ maxWidth: '720px' }}>
            <div className="flex items-start gap-4">
              {authorMember.photo ? (
                <Image
                  src={authorMember.photo}
                  alt={authorMember.name}
                  width={80}
                  height={80}
                  className="rounded-full object-cover flex-shrink-0"
                />
              ) : (
                <div
                  className="flex items-center justify-center rounded-full flex-shrink-0"
                  style={{
                    width: '80px',
                    height: '80px',
                    backgroundColor: 'var(--color-surface)',
                    fontFamily: 'var(--font-heading)',
                    fontSize: '2rem',
                    color: 'var(--text-color-muted)',
                  }}
                >
                  {authorMember.name.charAt(0)}
                </div>
              )}
              <div>
                <p style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-subheading, 1.125rem)', color: 'var(--text-color-primary)', letterSpacing: 'var(--tracking-heading)' }}>
                  {authorMember.name}
                </p>
                {authorMember.role && (
                  <p className="mb-2" style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600 }}>
                    {authorMember.role}
                  </p>
                )}
                {authorMember.shortBio && (
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-small, 0.875rem)', color: 'var(--text-color-secondary)', lineHeight: 'var(--leading-body, 1.65)' }}>
                    {authorMember.shortBio}
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section
          className="px-6"
          style={{ paddingTop: 'var(--section-py)', paddingBottom: 'var(--section-py)' }}
        >
          <div className="mx-auto" style={{ maxWidth: 'var(--container-max, 1200px)' }}>
            <h2
              className="text-center mb-10"
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'var(--text-heading, 2rem)',
                letterSpacing: 'var(--tracking-heading)',
                color: 'var(--heading-on-light, #111827)',
              }}
            >
              {locale === 'en' ? 'You Might Also Enjoy' : locale === 'zh' ? '您可能还会喜欢' : 'También Podría Interesarte'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: 'var(--grid-gap, 1.5rem)' }}>
              {relatedPosts.map((p) => (
                <BlogCard key={p.slug} post={p} locale={locale} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter */}
      <section
        className="px-6"
        style={{
          paddingTop: 'var(--section-py)',
          paddingBottom: 'var(--section-py)',
          backgroundColor: 'var(--backdrop-secondary)',
        }}
      >
        <div className="mx-auto" style={{ maxWidth: '600px' }}>
          <NewsletterSignup locale={locale} />
        </div>
      </section>
    </main>
  );
}
