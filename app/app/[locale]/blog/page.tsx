import { type Locale } from '@/lib/i18n';
import { getRequestSiteId, loadContent, loadPageContent } from '@/lib/content';
import { buildPageMetadata } from '@/lib/seo';
import { type BlogPostData } from '@/components/blog/BlogCard';
import FeaturedBlogPost from '@/components/blog/FeaturedBlogPost';
import BlogClient from '@/components/blog/BlogClient';
import NewsletterSignup from '@/components/blog/NewsletterSignup';
import PageHero from '@/components/sections/PageHero';

interface BlogPageContent {
  hero: { variant?: string; headline: string; subline?: string; image?: string };
  newsletter?: {
    headline?: string;
    description?: string;
    placeholder?: string;
    buttonText?: string;
  };
}

interface BlogData {
  posts: BlogPostData[];
}

interface PageProps {
  params: { locale: Locale };
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = params;
  const siteId = await getRequestSiteId();
  return buildPageMetadata({
    siteId,
    locale,
    slug: 'blog',
    title: locale === 'en' ? 'From the Kitchen' : locale === 'zh' ? '来自厨房' : 'Desde la Cocina',
    description: locale === 'en'
      ? 'Stories, recipes, and perspectives from Chef Marcus Bellamy and the team at The Meridian.'
      : undefined,
  });
}

export default async function BlogPage({ params }: PageProps) {
  const { locale } = params;
  const siteId = await getRequestSiteId();

  const [pageContent, blogData] = await Promise.all([
    loadPageContent<BlogPageContent>('blog', locale, siteId),
    loadContent<BlogData>(siteId, locale, 'blog/posts.json'),
  ]);

  const blog = blogData || (locale !== 'en' ? await loadContent<BlogData>(siteId, 'en', 'blog/posts.json') : null);

  const hero = pageContent?.hero || {
    headline: locale === 'en' ? 'From the Kitchen' : locale === 'zh' ? '来自厨房' : 'Desde la Cocina',
  };

  const allPosts = (blog?.posts || [])
    .filter((p) => p.published !== false)
    .sort((a, b) => new Date(b.publishDate || '').getTime() - new Date(a.publishDate || '').getTime());

  // Featured post: first with featured=true, or most recent
  const featuredPost = allPosts.find((p) => p.featured) || allPosts[0];
  const remainingPosts = allPosts.filter((p) => p.slug !== featuredPost?.slug);

  return (
    <main>
      {/* Hero */}
      <PageHero hero={hero} />

      {/* Featured Post */}
      {featuredPost && (
        <section
          className="px-6"
          style={{ paddingTop: 'var(--section-py)', paddingBottom: 'var(--section-py-sm)' }}
        >
          <div className="mx-auto" style={{ maxWidth: 'var(--container-max, 1200px)' }}>
            <FeaturedBlogPost post={featuredPost} locale={locale} />
          </div>
        </section>
      )}

      {/* Blog Grid with Category Filter */}
      {remainingPosts.length > 0 && (
        <section
          className="px-6"
          style={{ paddingTop: 'var(--section-py-sm)', paddingBottom: 'var(--section-py)' }}
        >
          <div className="mx-auto" style={{ maxWidth: 'var(--container-max, 1200px)' }}>
            <BlogClient posts={remainingPosts} locale={locale} />
          </div>
        </section>
      )}

      {/* Newsletter Signup */}
      <section
        className="px-6"
        style={{
          paddingTop: 'var(--section-py)',
          paddingBottom: 'var(--section-py)',
          backgroundColor: 'var(--backdrop-secondary)',
        }}
      >
        <div className="mx-auto" style={{ maxWidth: '600px' }}>
          <NewsletterSignup
            headline={pageContent?.newsletter?.headline}
            description={pageContent?.newsletter?.description}
            placeholder={pageContent?.newsletter?.placeholder}
            buttonText={pageContent?.newsletter?.buttonText}
            locale={locale}
          />
        </div>
      </section>
    </main>
  );
}
