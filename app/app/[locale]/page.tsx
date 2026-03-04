import { Fragment } from 'react';
import { notFound } from 'next/navigation';
import { type Locale } from '@/lib/i18n';
import {
  getRequestSiteId,
  loadContent,
  loadPageContent,
  loadSiteInfo,
} from '@/lib/content';
import { buildPageMetadata } from '@/lib/seo';
import type { BlogPost, SiteInfo } from '@/lib/types';
import { getSiteDisplayName } from '@/lib/siteInfo';
import { loadLayoutEntries } from '@/lib/pageLayout';

// Restaurant-specific sections
import HeroFullscreenDish from '@/components/sections/HeroFullscreenDish';
import TrustBar from '@/components/sections/TrustBar';
import AboutPreview from '@/components/sections/AboutPreview';
import ReservationsCTA from '@/components/sections/ReservationsCTA';
import EventsPreview from '@/components/sections/EventsPreview';

// Reused sections from fork
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import BlogPreviewSection from '@/components/sections/BlogPreviewSection';
import GalleryPreviewSection from '@/components/sections/GalleryPreviewSection';
import CTASection from '@/components/sections/CTASection';
import TodaySpecialSection from '@/components/menu/TodaySpecialSection';
import ChefSignaturesSection from '@/components/menu/ChefSignaturesSection';
import {
  type MenuHubContent,
  defaultWeeklySpecials,
  resolveChefSignaturesFromDinner,
  resolveTodaySpecial,
} from '@/lib/menuHub';

interface PageProps {
  params: {
    locale: Locale;
  };
}

interface HomePageContent {
  hero: {
    variant?: 'dark-overlay' | 'light-overlay' | 'split-text' | 'gallery-background';
    image?: string;
    gallery?: string[];
    eyebrow?: string;
    headline: string;
    subline?: string;
    ctaPrimary?: { text: string; link: string };
    ctaSecondary?: { text: string; link: string };
  };
  trustBar?: {
    variant?: string;
    items: Array<{ type: string; label: string; logo?: string; value?: string; count?: string }>;
  };
  aboutPreview?: {
    variant?: 'split-image' | 'stacked' | 'minimal-text';
    image?: string;
    eyebrow?: string;
    headline: string;
    body: string;
    stats?: Array<{ value: string; label: string }>;
    cta?: { text: string; link: string };
  };
  reservationsCTA?: {
    variant?: 'banner' | 'split' | 'minimal';
    headline: string;
    subline?: string;
    urgencyNote?: string;
    ctaLabel?: string;
    ctaHref?: string;
  };
  testimonials?: any;
  eventsPreview?: {
    headline?: string;
    subline?: string;
    items?: Array<{
      title: string;
      type?: string;
      description?: string;
      date?: string;
      image?: string;
      price_per_person?: number;
      slug?: string;
    }>;
    ctaText?: string;
    ctaLink?: string;
  };
  gallery?: any;
  blog?: any;
  cta?: any;
}

interface BlogPostsData {
  posts: BlogPost[];
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = params;
  const siteId = await getRequestSiteId();
  const [content, siteInfo] = await Promise.all([
    loadPageContent<HomePageContent>('home', locale, siteId),
    loadSiteInfo(siteId, locale as Locale) as Promise<SiteInfo | null>,
  ]);

  const businessName = getSiteDisplayName(siteInfo, 'The Meridian');
  const location = siteInfo?.city && siteInfo?.state
    ? `${siteInfo.city}, ${siteInfo.state}`
    : '';
  const heroHeadline = content?.hero?.headline || '';
  const title = [heroHeadline, location]
    .filter(Boolean)
    .join(' | ')
    .trim();

  const description =
    content?.hero?.subline ||
    siteInfo?.description ||
    'Seasonal cuisine, craft cocktails, and impeccable hospitality.';

  return buildPageMetadata({
    siteId,
    locale,
    slug: 'home',
    title: title || businessName,
    description,
  });
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = params;

  const siteId = await getRequestSiteId();
  const content = await loadPageContent<HomePageContent>('home', locale, siteId);
  let menuContent = await loadPageContent<MenuHubContent>('menu', locale, siteId);
  let blogPostsData = await loadContent<BlogPostsData>(siteId, locale, 'blog/posts.json');
  if (!menuContent && locale !== 'en') {
    menuContent = await loadPageContent<MenuHubContent>('menu', 'en', siteId);
  }
  if (!blogPostsData && locale !== 'en') {
    blogPostsData = await loadContent<BlogPostsData>(siteId, 'en', 'blog/posts.json');
  }

  if (!content) {
    notFound();
  }

  const { hero } = content;

  const defaultSections = [
    'hero',
    'trustBar',
    'todaysSpecial',
    'chefSignatures',
    'aboutPreview',
    'reservationsCTA',
    'testimonials',
    'eventsPreview',
    'gallery',
    'blog',
    'cta',
  ];

  const layoutEntries = await loadLayoutEntries('home', locale, siteId, defaultSections);
  const layoutSections = layoutEntries.map((entry) => entry.id);
  const layoutVariants = Object.fromEntries(
    layoutEntries.map((entry) => [entry.id, entry.variant]).filter(([, variant]) => Boolean(variant))
  ) as Record<string, string>;
  const currentDayNumber = new Date().getDay();
  let dinnerMenu = await loadContent<any>(siteId, locale, 'menu/dinner.json');
  if (!dinnerMenu && locale !== 'en') {
    dinnerMenu = await loadContent<any>(siteId, 'en', 'menu/dinner.json');
  }
  const weeklySpecials = menuContent?.weeklySpecials?.length
    ? menuContent.weeklySpecials
    : defaultWeeklySpecials;
  const todaySpecial = resolveTodaySpecial(
    weeklySpecials,
    menuContent?.todaySpecial,
    currentDayNumber
  );
  const chefSignatures = resolveChefSignaturesFromDinner(dinnerMenu, 9);
  const homeSectionVariants =
    menuContent?.homeSectionVariants && typeof menuContent.homeSectionVariants === 'object'
      ? menuContent.homeSectionVariants
      : {};
  const getSectionVariant = (sectionId: string, fallback: 'compact' | 'rich') => {
    const sectionVariant = homeSectionVariants[sectionId];
    if (sectionVariant === 'compact' || sectionVariant === 'rich') {
      return sectionVariant;
    }
    const layoutVariant = layoutVariants[sectionId];
    if (layoutVariant === 'compact' || layoutVariant === 'rich') {
      return layoutVariant;
    }
    return fallback;
  };
  const featuredJournalPosts =
    (blogPostsData?.posts || [])
      .filter((post) => post.published !== false && post.featured)
      .sort((a, b) => new Date(b.publishDate || '').getTime() - new Date(a.publishDate || '').getTime())
      .slice(0, 3);
  const fallbackJournalPosts =
    (blogPostsData?.posts || [])
      .filter((post) => post.published !== false)
      .sort((a, b) => new Date(b.publishDate || '').getTime() - new Date(a.publishDate || '').getTime())
      .slice(0, 3);
  const homeBlogPosts =
    (content.blog?.posts && content.blog.posts.length > 0)
      ? content.blog.posts
      : (featuredJournalPosts.length > 0 ? featuredJournalPosts : fallbackJournalPosts);

  const renderSection = (sectionId: string) => {
    switch (sectionId) {
      case 'hero': {
        const galleryImages = Array.isArray(hero.gallery) ? hero.gallery : [];
        return (
          <HeroFullscreenDish
            variant={hero.variant}
            image={hero.image}
            galleryImages={galleryImages}
            eyebrow={hero.eyebrow}
            headline={hero.headline}
            subline={hero.subline}
            ctaPrimary={hero.ctaPrimary}
            ctaSecondary={hero.ctaSecondary}
          />
        );
      }
      case 'trustBar':
        return content.trustBar ? (
          <TrustBar
            variant={content.trustBar.variant as any}
            items={content.trustBar.items as any}
          />
        ) : null;
      case 'todaysSpecial':
        return (
          <TodaySpecialSection
            locale={locale}
            special={todaySpecial}
            weeklySpecials={weeklySpecials}
            currentDayNumber={currentDayNumber}
            title="Today's Special"
            variant={getSectionVariant('todaysSpecial', 'compact')}
          />
        );
      case 'chefSignatures':
        return (
          <ChefSignaturesSection
            locale={locale}
            signatures={chefSignatures}
            variant={getSectionVariant('chefSignatures', 'compact')}
            showViewAllMenusButton
          />
        );
      case 'aboutPreview':
        return content.aboutPreview ? (
          <AboutPreview
            variant={content.aboutPreview.variant}
            image={content.aboutPreview.image}
            eyebrow={content.aboutPreview.eyebrow}
            headline={content.aboutPreview.headline}
            body={content.aboutPreview.body}
            stats={content.aboutPreview.stats}
            cta={content.aboutPreview.cta}
          />
        ) : null;
      case 'reservationsCTA':
        return content.reservationsCTA ? (
          <ReservationsCTA
            variant={content.reservationsCTA.variant}
            headline={content.reservationsCTA.headline}
            subline={content.reservationsCTA.subline}
            urgencyNote={content.reservationsCTA.urgencyNote}
            ctaLabel={content.reservationsCTA.ctaLabel}
            ctaHref={content.reservationsCTA.ctaHref}
          />
        ) : null;
      case 'testimonials':
        return content.testimonials ? (
          <TestimonialsSection {...content.testimonials} />
        ) : null;
      case 'eventsPreview':
        return content.eventsPreview ? (
          <EventsPreview
            headline={content.eventsPreview.headline}
            subline={content.eventsPreview.subline}
            items={content.eventsPreview.items}
            ctaText={content.eventsPreview.ctaText}
            ctaLink={content.eventsPreview.ctaLink}
            locale={locale}
          />
        ) : null;
      case 'gallery':
        return content.gallery ? <GalleryPreviewSection {...content.gallery} /> : null;
      case 'blog':
        return content.blog ? <BlogPreviewSection locale={locale} {...content.blog} posts={homeBlogPosts} /> : null;
      case 'cta':
        return content.cta ? <CTASection {...content.cta} /> : null;
      default:
        return null;
    }
  };

  return (
    <main>
      {layoutSections.map((sectionId, index) => (
        <Fragment key={`${sectionId}-${index}`}>{renderSection(sectionId)}</Fragment>
      ))}
    </main>
  );
}
