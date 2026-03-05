import Image from 'next/image';
import Link from 'next/link';
import { type BlogPostData, getCategoryLabel } from './BlogCard';

interface FeaturedBlogPostProps {
  post: BlogPostData;
  locale?: string;
}

function formatBlogDate(dateStr: string, locale: string): string {
  const d = new Date(dateStr);
  if (locale === 'zh') return d.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
  if (locale === 'es') return d.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

export default function FeaturedBlogPost({ post, locale = 'en' }: FeaturedBlogPostProps) {
  return (
    <Link
      href={`/${locale}/blog/${post.slug}`}
      className="group block overflow-hidden"
      style={{
        borderRadius: 'var(--radius-base, 0.75rem)',
        backgroundColor: 'var(--color-surface)',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Image */}
        <div className="relative aspect-[16/9] lg:aspect-auto overflow-hidden" style={{ minHeight: '300px' }}>
          {post.image ? (
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              style={{ transitionDuration: 'var(--duration-base)' }}
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          ) : (
            <div className="w-full h-full" style={{ backgroundColor: 'var(--backdrop-secondary)' }} />
          )}
        </div>

        {/* Content */}
        <div
          className="flex flex-col justify-center"
          style={{ padding: 'var(--card-pad, 2rem)' }}
        >
          {/* Category badge */}
          {post.category && (
            <span
              className="inline-block self-start px-3 py-1 mb-3"
              style={{
                fontSize: '0.7rem',
                borderRadius: 'var(--badge-radius)',
                backgroundColor: 'var(--backdrop-secondary)',
                color: 'var(--text-color-secondary)',
                textTransform: 'capitalize',
                fontFamily: 'var(--font-body)',
                fontWeight: 600,
              }}
            >
              {getCategoryLabel(post.category, locale)}
            </span>
          )}

          {/* Date */}
          {post.publishDate && (
            <p
              className="mb-2"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.8rem',
                color: 'var(--text-color-muted)',
              }}
            >
              {formatBlogDate(post.publishDate, locale)}
            </p>
          )}

          {/* Title */}
          <h2
            className="mb-3"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'var(--text-heading, 2rem)',
              letterSpacing: 'var(--tracking-heading)',
              color: 'var(--text-color-primary)',
              lineHeight: 1.2,
            }}
          >
            {post.title}
          </h2>

          {/* Excerpt */}
          {post.excerpt && (
            <p
              className="line-clamp-3 mb-4"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-body, 1rem)',
                color: 'var(--text-color-secondary)',
                lineHeight: 'var(--leading-body, 1.65)',
              }}
            >
              {post.excerpt}
            </p>
          )}

          {/* Author + Read more */}
          <div className="flex items-center justify-between mt-auto">
            {post.author && (
              <span
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.8rem',
                  color: 'var(--text-color-muted)',
                }}
              >
                {locale === 'en' ? 'By' : locale === 'zh' ? '作者：' : 'Por'} {post.author}
              </span>
            )}
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.875rem',
                color: 'var(--text-on-dark-primary)',
                fontWeight: 600,
              }}
            >
              {locale === 'en' ? 'Read More' : locale === 'zh' ? '阅读更多' : 'Leer Más'} →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
