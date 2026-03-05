import Image from 'next/image';
import Link from 'next/link';

export interface BlogPostData {
  slug: string;
  title: string;
  excerpt?: string;
  category?: string;
  image?: string;
  author?: string;
  publishDate?: string;
  readTime?: string;
  featured?: boolean;
  published?: boolean;
}

interface BlogCardProps {
  post: BlogPostData;
  locale?: string;
}

const categoryLabels: Record<string, Record<string, string>> = {
  'seasonal-guide': { en: 'Seasonal Guide', zh: '时令指南', es: 'Guía Estacional' },
  'wine-spirits': { en: 'Wine & Spirits', zh: '葡萄酒与烈酒', es: 'Vinos y Licores' },
  'sourcing-ingredients': { en: 'Sourcing', zh: '食材采购', es: 'Ingredientes' },
  'events-announcements': { en: 'Events', zh: '活动', es: 'Eventos' },
  'chef-perspective': { en: "Chef's Perspective", zh: '主厨视角', es: 'Perspectiva del Chef' },
  'behind-the-scenes': { en: 'Behind the Scenes', zh: '幕后', es: 'Detrás de Escenas' },
  'kitchen-stories': { en: 'Kitchen Stories', zh: '厨房故事', es: 'Historias de Cocina' },
  news: { en: 'News', zh: '新闻', es: 'Noticias' },
};

function formatBlogDate(dateStr: string, locale: string): string {
  const d = new Date(dateStr);
  if (locale === 'zh') return d.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
  if (locale === 'es') return d.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

export function getCategoryLabel(category: string, locale: string): string {
  return categoryLabels[category]?.[locale] || categoryLabels[category]?.en || category.replace(/-/g, ' ');
}

export default function BlogCard({ post, locale = 'en' }: BlogCardProps) {
  return (
    <Link
      href={`/${locale}/blog/${post.slug}`}
      className="group block overflow-hidden transition-all"
      style={{
        borderRadius: 'var(--radius-base, 0.75rem)',
        backgroundColor: 'var(--color-surface)',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      {/* Image */}
      <div className="relative aspect-[16/9] overflow-hidden">
        {post.image ? (
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            style={{ transitionDuration: 'var(--duration-base)' }}
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="w-full h-full" style={{ backgroundColor: 'var(--backdrop-secondary)' }} />
        )}
      </div>

      {/* Content */}
      <div style={{ padding: 'var(--card-pad, 1.5rem)' }}>
        {/* Category + Date */}
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          {post.category && (
            <span
              className="px-2 py-0.5"
              style={{
                fontSize: '0.6875rem',
                borderRadius: 'var(--badge-radius)',
                backgroundColor: 'var(--backdrop-secondary)',
                color: 'var(--text-color-secondary)',
                textTransform: 'capitalize',
                fontFamily: 'var(--font-body)',
              }}
            >
              {getCategoryLabel(post.category, locale)}
            </span>
          )}
          {post.publishDate && (
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.75rem',
                color: 'var(--text-color-muted)',
              }}
            >
              {formatBlogDate(post.publishDate, locale)}
            </span>
          )}
        </div>

        <h3
          className="mb-1"
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'var(--text-subheading, 1.125rem)',
            letterSpacing: 'var(--tracking-heading)',
            color: 'var(--text-color-primary)',
          }}
        >
          {post.title}
        </h3>

        {post.excerpt && (
          <p
            className="line-clamp-2 mb-3"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-small, 0.875rem)',
              color: 'var(--text-color-secondary)',
              lineHeight: 'var(--leading-body, 1.65)',
            }}
          >
            {post.excerpt}
          </p>
        )}

        {/* Author + Read time */}
        <div className="flex items-center justify-between">
          {post.author && (
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.75rem',
                color: 'var(--text-color-muted)',
              }}
            >
              {post.author}
            </span>
          )}
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.75rem',
              color: 'var(--text-on-dark-primary)',
              fontWeight: 600,
            }}
          >
            {locale === 'en' ? 'Read' : locale === 'zh' ? '阅读' : 'Leer'} →
          </span>
        </div>
      </div>
    </Link>
  );
}
