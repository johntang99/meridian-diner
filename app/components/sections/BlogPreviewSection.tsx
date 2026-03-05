import Link from 'next/link';
import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardContent, Badge, Carousel } from '@/components/ui';
import { cn } from '@/lib/utils';
import { BlogPost, Locale } from '@/lib/types';
import { Calendar, Clock, Video } from 'lucide-react';

export interface BlogPreviewSectionProps {
  locale: Locale;
  badge?: string;
  title: string;
  subtitle?: string;
  posts: BlogPost[];
  moreLink?: {
    text: string;
    url: string;
  };
  variant?: 'cards-grid' | 'featured-side' | 'list-detailed' | 'carousel';
  className?: string;
}

export default function BlogPreviewSection({
  locale,
  badge,
  title,
  subtitle,
  posts,
  moreLink,
  variant = 'cards-grid',
  className,
}: BlogPreviewSectionProps) {
  const getLocalizedUrl = (url: string) => {
    if (!url.startsWith('/')) return url;
    if (url.startsWith(`/${locale}/`) || url === `/${locale}`) return url;
    return `/${locale}${url}`;
  };

  return (
    <section
      className={cn('section-padding bg-white', className)}
      style={{
        ['--color-surface' as any]: '#FFFFFF',
        ['--text-color-primary' as any]: 'var(--heading-on-light, #111827)',
        ['--text-color-secondary' as any]: 'var(--body-on-light, #4B5563)',
        ['--text-color-muted' as any]: 'var(--muted-on-light, #6B7280)',
      }}
    >
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-12">
          {badge && (
            <Badge
              variant="primary"
              className="mb-4 bg-transparent border-transparent shadow-none px-0 py-0 rounded-none text-[var(--heading-on-light,#111827)]"
            >
              {badge}
            </Badge>
          )}
          <h2 className="text-heading font-bold mb-4 text-[var(--heading-on-light,#111827)]">{title}</h2>
          {subtitle && (
            <p className="text-[var(--text-color-secondary)] max-w-2xl mx-auto">{subtitle}</p>
          )}
        </div>

        {/* Render based on variant */}
        {variant === 'cards-grid' && (
          <BlogCardsGrid posts={posts} locale={locale} />
        )}
        
        {variant === 'featured-side' && (
          <BlogFeaturedSide posts={posts} locale={locale} />
        )}
        
        {variant === 'list-detailed' && (
          <BlogListDetailed posts={posts} locale={locale} />
        )}
        
        {variant === 'carousel' && (
          <BlogCarousel posts={posts} locale={locale} />
        )}

        {/* More Link */}
        {moreLink && (
          <div className="text-center mt-12">
            <Link
              href={getLocalizedUrl(moreLink.url)}
              className="text-[var(--heading-on-light,#111827)] hover:opacity-80 font-semibold inline-flex items-center gap-2 group"
            >
              {moreLink.text}
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

// ============================================
// VARIANT COMPONENTS
// ============================================

function BlogCardsGrid({ posts, locale }: { posts: BlogPost[]; locale: Locale }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <BlogCard key={post.slug} post={post} locale={locale} />
      ))}
    </div>
  );
}

function BlogFeaturedSide({ posts, locale }: { posts: BlogPost[]; locale: Locale }) {
  const [featured, ...others] = posts;
  
  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Featured Post */}
      {featured && (
        <BlogCard post={featured} featured locale={locale} />
      )}
      
      {/* Other Posts */}
      <div className="space-y-4">
        {others.map((post) => (
          <BlogCard key={post.slug} post={post} compact locale={locale} />
        ))}
      </div>
    </div>
  );
}

function BlogListDetailed({ posts, locale }: { posts: BlogPost[]; locale: Locale }) {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {posts.map((post) => (
        <BlogCard key={post.slug} post={post} horizontal locale={locale} />
      ))}
    </div>
  );
}

function BlogCarousel({ posts, locale }: { posts: BlogPost[]; locale: Locale }) {
  return (
    <Carousel autoPlay={false} showDots showArrows>
      {posts.map((post) => (
        <div key={post.slug} className="px-4">
          <BlogCard post={post} locale={locale} />
        </div>
      ))}
    </Carousel>
  );
}

// ============================================
// BLOG CARD COMPONENT
// ============================================

interface BlogCardProps {
  post: BlogPost;
  locale: Locale;
  featured?: boolean;
  compact?: boolean;
  horizontal?: boolean;
}

function BlogCard({ post, locale, featured, compact, horizontal }: BlogCardProps) {
  const isVideo = post.type === 'video';
  const href = `/${locale}/blog/${post.slug}`;
  
  if (horizontal) {
    return (
      <Link href={href}>
        <Card variant="default" hover>
          <CardContent className="md:flex gap-6 items-start">
            {/* Image */}
            {post.image && (
              <div
                className="relative flex-shrink-0 w-full md:w-48 h-32 bg-[var(--backdrop-secondary)] overflow-hidden mb-4 md:mb-0"
                style={{ borderRadius: 'var(--radius-base, 0.5rem)' }}
              >
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
                {isVideo && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                      <Video className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Content */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Badge variant="secondary" size="sm">
                  {post.category}
                </Badge>
                {post.readTime && (
                  <span className="text-small text-[var(--text-color-muted)] flex items-center gap-1">
                    <Clock size={14} />
                    {post.readTime}
                  </span>
                )}
              </div>
              <h3 className="text-subheading font-bold mb-2 hover:text-primary transition-colors">
                {post.title}
              </h3>
              <p className="text-[var(--text-color-secondary)] text-small line-clamp-2">{post.excerpt}</p>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  }
  
  if (compact) {
    return (
      <Link href={href}>
        <Card variant="default" hover>
          <CardContent className="flex gap-4 items-start">
            {/* Small Image */}
            {post.image && (
              <div
                className="relative flex-shrink-0 w-20 h-20 bg-[var(--backdrop-secondary)] overflow-hidden"
                style={{ borderRadius: 'var(--radius-base, 0.5rem)' }}
              >
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              <Badge variant="secondary" size="sm" className="mb-2">
                {post.category}
              </Badge>
              <h3 className="font-semibold text-small mb-1 line-clamp-2 hover:text-primary transition-colors">
                {post.title}
              </h3>
              {post.readTime && (
                <span className="text-small text-[var(--text-color-muted)] flex items-center gap-1">
                  <Clock size={12} />
                  {post.readTime}
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  }
  
  return (
    <Link href={href}>
      <Card variant="default" hover className={cn('h-full', featured && 'lg:row-span-2')}>
        {/* Image */}
        {post.image && (
          <div className={cn(
            'relative bg-[var(--backdrop-secondary)] overflow-hidden',
            featured ? 'h-64 lg:h-96' : 'h-48'
          )}
          style={{ borderTopLeftRadius: 'var(--radius-base, 0.75rem)', borderTopRightRadius: 'var(--radius-base, 0.75rem)' }}>
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
            />
            
            {/* Video Overlay */}
            {isVideo && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                  <Video className="w-8 h-8 text-primary" />
                </div>
              </div>
            )}
          </div>
        )}
        
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <Badge variant="secondary" size="sm">
              {post.category}
            </Badge>
            {post.readTime && (
              <span className="text-small text-[var(--text-color-muted)] flex items-center gap-1">
                <Clock size={14} />
                {post.readTime}
              </span>
            )}
          </div>
          <CardTitle className="hover:text-primary transition-colors">
            {post.title}
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <p className="text-[var(--text-color-secondary)] text-small line-clamp-3">{post.excerpt}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
