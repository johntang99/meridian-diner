import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { defaultLocale, locales, type Locale } from '@/lib/i18n';
import { getDefaultSite, getSiteById } from '@/lib/sites';
import {
  getRequestSiteId,
  loadContent,
  loadSeo,
  loadTheme,
  loadSiteInfo,
} from '@/lib/content';
import type { SeoConfig, SiteInfo } from '@/lib/types';
import RestaurantHeader, { type RestaurantHeaderConfig } from '@/components/layout/RestaurantHeader';
import RestaurantFooter, { type RestaurantFooterConfig } from '@/components/layout/RestaurantFooter';
import StickyBookingBar from '@/components/layout/StickyBookingBar';
import { getBaseUrlFromHost } from '@/lib/seo';
import { getSiteDisplayName } from '@/lib/siteInfo';

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}) {
  const host = headers().get('host');
  const baseUrl = getBaseUrlFromHost(host);
  const requestSiteId = await getRequestSiteId();
  const site = (await getSiteById(requestSiteId)) || (await getDefaultSite());
  const locale = params.locale as Locale;

  if (!site) {
    return {
      metadataBase: baseUrl,
      title: 'Restaurant Website',
      description: 'Premium restaurant website',
      icons: {
        icon: '/icon',
        shortcut: '/icon',
        apple: '/icon',
      },
    };
  }

  const [siteInfo, seo] = await Promise.all([
    loadSiteInfo(site.id, locale) as Promise<SiteInfo | null>,
    loadSeo(site.id, locale) as Promise<SeoConfig | null>,
  ]);
  const titleBase = getSiteDisplayName(siteInfo, site.name);
  const description =
    seo?.description ||
    siteInfo?.description ||
    'Seasonal cuisine, craft cocktails, and impeccable hospitality.';
  const titleDefault = seo?.title || titleBase;
  const canonical = new URL(`/${locale}`, baseUrl).toString();
  const languageAlternates = locales.reduce<Record<string, string>>((acc, entry) => {
    acc[entry] = new URL(`/${entry}`, baseUrl).toString();
    return acc;
  }, {});

  return {
    metadataBase: baseUrl,
    title: {
      default: titleDefault,
      template: `%s | ${titleBase}`,
    },
    description,
    alternates: {
      canonical,
      languages: {
        ...languageAlternates,
        'x-default': new URL(`/${defaultLocale}`, baseUrl).toString(),
      },
    },
    openGraph: {
      title: titleDefault,
      description,
      url: canonical,
      siteName: titleBase,
      locale,
      type: 'website',
      images: seo?.ogImage ? [{ url: seo.ogImage }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: titleDefault,
      description,
      images: seo?.ogImage ? [seo.ogImage] : undefined,
    },
    icons: {
      icon: '/icon',
      shortcut: '/icon',
      apple: '/icon',
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = params;

  // Validate locale
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const host = headers().get('host');
  const requestSiteId = await getRequestSiteId();
  const site = (await getSiteById(requestSiteId)) || (await getDefaultSite());

  if (!site) {
    return <div>No site configured</div>;
  }

  // Load theme
  const theme = await loadTheme(site.id);

  // Load site info, seo, header, footer in parallel
  const [siteInfo, seo, headerConfig, footerConfig] = await Promise.all([
    loadSiteInfo(site.id, locale as Locale) as Promise<SiteInfo | null>,
    loadSeo(site.id, locale as Locale) as Promise<SeoConfig | null>,
    loadContent<RestaurantHeaderConfig>(site.id, locale as Locale, 'header.json'),
    loadContent<RestaurantFooterConfig>(site.id, locale as Locale, 'footer.json'),
  ]);
  const baseUrl = getBaseUrlFromHost(host);

  // Build siteData for footer (merge siteInfo fields)
  const siteData = siteInfo ? {
    businessName: (siteInfo as any).businessName || (siteInfo as any).clinicName || site.name,
    tagline: (siteInfo as any).tagline,
    phone: siteInfo.phone,
    email: siteInfo.email,
    address: siteInfo.address,
    city: siteInfo.city,
    state: siteInfo.state,
    zip: siteInfo.zip,
    social: siteInfo.social,
    hours: (siteInfo as any).hours,
  } : undefined;

  // Generate inline style for theme variables
  const t = theme as any;
  const themeStyle = t ? `
    :root {
      /* Typography — sizes */
      --text-display: ${t.typography.display};
      --text-heading: ${t.typography.heading};
      --text-subheading: ${t.typography.subheading};
      --text-body: ${t.typography.body};
      --text-small: ${t.typography.small};
      /* Typography — font families */
      --font-display: ${t.typography.fonts?.display || 'var(--font-body-default)'};
      --font-heading: ${t.typography.fonts?.heading || 'var(--font-body-default)'};
      --font-subheading: ${t.typography.fonts?.subheading || 'var(--font-body-default)'};
      --font-body: ${t.typography.fonts?.body || 'var(--font-body-default)'};
      --font-small: ${t.typography.fonts?.small || 'var(--font-body-default)'};
      /* Typography — tracking */
      --tracking-display: ${t.typography.tracking?.display || '0em'};
      --tracking-heading: ${t.typography.tracking?.heading || '0em'};
      --tracking-body: ${t.typography.tracking?.body || '0em'};
      --tracking-nav: ${t.typography.tracking?.nav || '0em'};
      --tracking-label: ${t.typography.tracking?.label || '0em'};
      /* Typography — line height */
      --leading-display: ${t.typography.lineHeight?.display || '1.1'};
      --leading-heading: ${t.typography.lineHeight?.heading || '1.35'};
      --leading-body: ${t.typography.lineHeight?.body || '1.65'};
      --leading-menu: ${t.typography.lineHeight?.menu || '1.65'};
      /* Typography — weight */
      --weight-display: ${t.typography.weight?.display || '400'};

      /* Primary Colors */
      --primary: ${t.colors.primary.DEFAULT};
      --primary-dark: ${t.colors.primary.dark};
      --primary-light: ${t.colors.primary.light};
      --primary-50: ${t.colors.primary['50']};
      --primary-100: ${t.colors.primary['100']};
      /* Secondary Colors */
      --secondary: ${t.colors.secondary.DEFAULT};
      --secondary-dark: ${t.colors.secondary.dark};
      --secondary-light: ${t.colors.secondary.light};
      --secondary-50: ${t.colors.secondary['50']};
      /* Backdrop Colors */
      --backdrop-primary: ${t.colors.backdrop.primary};
      --backdrop-secondary: ${t.colors.backdrop.secondary};
      --color-surface: ${t.colors.backdrop?.surface || '#FFFFFF'};
      --color-overlay: ${t.colors.backdrop?.overlay || 'rgba(0,0,0,0.5)'};
      /* Text Colors */
      --text-color-primary: ${t.colors.text?.primary || '#1A1A1A'};
      --text-color-secondary: ${t.colors.text?.secondary || '#4B5563'};
      --text-color-muted: ${t.colors.text?.muted || '#9CA3AF'};
      --text-color-inverse: ${t.colors.text?.inverse || '#FFFFFF'};
      --text-color-accent: ${t.colors.text?.accent || t.colors.primary.DEFAULT};
      /* Border Colors */
      --border-default: ${t.colors.border?.DEFAULT || 'rgba(0,0,0,0.10)'};
      --border-subtle: ${t.colors.border?.subtle || 'rgba(0,0,0,0.05)'};
      --border-emphasis: ${t.colors.border?.emphasis || 'rgba(0,0,0,0.25)'};
      /* Status Colors */
      --color-success: ${t.colors.status?.success || '#22C55E'};
      --color-warning: ${t.colors.status?.warning || '#F59E0B'};
      --color-error: ${t.colors.status?.error || '#EF4444'};

      /* Spacing */
      --section-py: ${t.spacing?.sectionPy || '5rem'};
      --section-py-sm: ${t.spacing?.sectionPySm || '3.5rem'};
      --container-max: ${t.spacing?.containerMax || '1200px'};
      --container-px: ${t.spacing?.containerPx || '2rem'};
      --card-pad: ${t.spacing?.cardPad || '1.5rem'};
      --menu-item-py: ${t.spacing?.menuItemPy || '1rem'};
      --nav-height: ${t.spacing?.navHeight || '72px'};
      --hero-min-h: ${t.spacing?.heroMinH || '80vh'};
      --grid-gap: ${t.spacing?.gridGap || '1.5rem'};

      /* Effects */
      --card-radius: ${t.effects?.cardRadius || '8px'};
      --btn-radius: ${t.effects?.btnRadius || '4px'};
      --badge-radius: ${t.effects?.badgeRadius || '4px'};
      --shadow-card: ${t.effects?.cardShadow || '0 1px 3px rgba(0,0,0,0.1)'};
      --shadow-card-hover: ${t.effects?.cardShadowHover || '0 4px 12px rgba(0,0,0,0.15)'};
      --hero-overlay: ${t.effects?.heroOverlay || 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.6) 100%)'};
      --menu-divider: ${t.effects?.menuDivider || '1px solid rgba(0,0,0,0.08)'};

      /* Motion */
      --duration-fast: ${t.motion?.durationFast || '150ms'};
      --duration-base: ${t.motion?.durationBase || '300ms'};
      --duration-slow: ${t.motion?.durationSlow || '500ms'};
      --easing: ${t.motion?.easing || 'cubic-bezier(0.4, 0, 0.2, 1)'};
      --hover-lift: ${t.motion?.hoverLift || '-2px'};
      --entrance-dist: ${t.motion?.entranceDist || '16px'};
    }
  ` : '';
  const googleFontsUrl = (t as any)?.googleFontsUrl as string | undefined;

  return (
    <>
      {/* Google Fonts */}
      {googleFontsUrl && (
        <link rel="stylesheet" href={googleFontsUrl} />
      )}

      {/* Inject theme CSS variables */}
      {t && (
        <style dangerouslySetInnerHTML={{ __html: themeStyle }} />
      )}

      {siteInfo && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Restaurant',
              '@id': new URL(`/${locale}/#restaurant`, baseUrl).toString(),
              name: getSiteDisplayName(siteInfo, site.name),
              url: new URL(`/${locale}`, baseUrl).toString(),
              description: siteInfo.description,
              telephone: siteInfo.phone,
              email: siteInfo.email,
              address: {
                '@type': 'PostalAddress',
                streetAddress: siteInfo.address,
                addressLocality: siteInfo.city,
                addressRegion: siteInfo.state,
                postalCode: siteInfo.zip,
                addressCountry: 'US',
              },
              servesCuisine: 'Contemporary American',
              priceRange: '$$$$',
              currenciesAccepted: 'USD',
              paymentAccepted: 'Cash, Credit Card',
              acceptsReservations: true,
              hasMenu: new URL(`/${locale}/menu`, baseUrl).toString(),
              menu: new URL(`/${locale}/menu`, baseUrl).toString(),
              openingHoursSpecification: [
                { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Tuesday', opens: '17:00', closes: '22:00' },
                { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Wednesday', opens: '17:00', closes: '22:00' },
                { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Thursday', opens: '17:00', closes: '22:00' },
                { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Friday', opens: '17:00', closes: '23:00' },
                { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Saturday', opens: '17:00', closes: '23:00' },
                { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Sunday', opens: '17:00', closes: '21:30' },
              ],
              sameAs: [
                siteInfo.social?.instagram,
                siteInfo.social?.facebook,
                siteInfo.social?.yelp,
              ].filter(Boolean),
            }),
          }}
        />
      )}

      <div className="min-h-screen flex flex-col relative">
        <RestaurantHeader
          locale={locale as Locale}
          siteId={site.id}
          siteInfo={siteInfo ?? undefined}
          headerConfig={headerConfig ?? undefined}
        />
        <main id="main-content" className="flex-grow">{children}</main>
        <RestaurantFooter
          locale={locale as Locale}
          siteId={site.id}
          siteData={siteData}
          footerConfig={footerConfig ?? undefined}
        />
        <StickyBookingBar
          locale={locale as Locale}
          phone={siteInfo?.phone}
          phoneDisplay={siteInfo?.phone}
          ctaLabel={headerConfig?.cta?.text}
          ctaHref={headerConfig?.cta?.link}
        />
      </div>
    </>
  );
}
