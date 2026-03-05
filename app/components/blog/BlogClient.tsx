'use client';

import { useState, useMemo } from 'react';
import BlogCard, { type BlogPostData, getCategoryLabel } from './BlogCard';

interface BlogClientProps {
  posts: BlogPostData[];
  locale?: string;
}

export default function BlogClient({ posts, locale = 'en' }: BlogClientProps) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [visibleCount, setVisibleCount] = useState(6);

  // Build category list with counts
  const categories = useMemo(() => {
    const counts: Record<string, number> = {};
    posts.forEach((p) => {
      if (p.category) counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return [
      { key: 'all', count: posts.length },
      ...Object.entries(counts)
        .sort(([, a], [, b]) => b - a)
        .map(([key, count]) => ({ key, count })),
    ];
  }, [posts]);

  const filteredPosts = useMemo(() => {
    if (activeCategory === 'all') return posts;
    return posts.filter((p) => p.category === activeCategory);
  }, [posts, activeCategory]);

  const visiblePosts = filteredPosts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredPosts.length;

  return (
    <>
      {/* Category Filter */}
      <div className="flex flex-wrap justify-center mb-10" style={{ gap: '0.5rem' }}>
        {categories.map(({ key, count }) => {
          const isActive = activeCategory === key;
          const label = key === 'all'
            ? (locale === 'en' ? 'All' : locale === 'zh' ? '全部' : 'Todo')
            : getCategoryLabel(key, locale);
          return (
            <button
              key={key}
              onClick={() => { setActiveCategory(key); setVisibleCount(6); }}
              className="transition-colors"
              style={{
                padding: '0.5rem 1rem',
                borderRadius: 'var(--radius-base, 0.5rem)',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'var(--font-body)',
                fontSize: '0.8rem',
                fontWeight: 600,
                backgroundColor: isActive ? 'var(--primary)' : 'var(--backdrop-secondary)',
                color: isActive ? 'var(--text-color-inverse)' : 'var(--text-color-secondary)',
                transitionDuration: 'var(--duration-fast, 150ms)',
                textTransform: 'capitalize',
              }}
            >
              {label}
              <span style={{ marginLeft: '0.35rem', fontSize: '0.7rem', opacity: 0.7 }}>
                ({count})
              </span>
            </button>
          );
        })}
      </div>

      {/* Blog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ gap: 'var(--grid-gap, 1.5rem)' }}>
        {visiblePosts.map((post) => (
          <BlogCard key={post.slug} post={post} locale={locale} />
        ))}
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="text-center mt-10">
          <button
            onClick={() => setVisibleCount((c) => c + 6)}
            className="transition-opacity hover:opacity-80"
            style={{
              padding: '0.75rem 2rem',
              borderRadius: 'var(--radius-base, 0.5rem)',
              border: '1px solid var(--border-default)',
              backgroundColor: 'transparent',
              color: 'var(--primary)',
              fontFamily: 'var(--font-body)',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {locale === 'en' ? 'Load More Articles' : locale === 'zh' ? '加载更多文章' : 'Cargar Más Artículos'}
          </button>
        </div>
      )}

      {/* Empty state */}
      {filteredPosts.length === 0 && (
        <p
          className="text-center py-16"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-body, 1rem)',
            color: 'var(--text-color-muted)',
          }}
        >
          {locale === 'en' ? 'No articles in this category yet.' : locale === 'zh' ? '该分类暂无文章。' : 'No hay artículos en esta categoría aún.'}
        </p>
      )}
    </>
  );
}
