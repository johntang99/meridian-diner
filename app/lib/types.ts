// ============================================
// TYPE DEFINITIONS FOR MULTI-SITE CONTENT SYSTEM
// ============================================

export type Locale = 'en' | 'zh' | 'es' | 'ko';
export type RuntimeEnvironment = 'dev' | 'staging' | 'prod';

export interface SiteDomainAlias {
  id: string;
  siteId: string;
  domain: string;
  environment: RuntimeEnvironment;
  isPrimary: boolean;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SiteConfig {
  id: string;
  name: string;
  domain?: string;
  domainAliases?: SiteDomainAlias[];
  enabled: boolean;
  defaultLocale: Locale;
  supportedLocales: Locale[];
  createdAt: string;
  updatedAt: string;
}

export interface SeoConfig {
  title?: string;
  description?: string;
  ogImage?: string;
  home?: {
    title?: string;
    description?: string;
  };
  pages?: Record<string, { title?: string; description?: string }>;
}

export interface ThemeConfig {
  typography: {
    display: string;
    heading: string;
    subheading: string;
    body: string;
    small: string;
    fonts?: {
      display?: string;
      heading?: string;
      subheading?: string;
      body?: string;
      small?: string;
    };
  };
  colors: {
    primary: {
      DEFAULT: string;
      dark: string;
      light: string;
      50: string;
      100: string;
    };
    secondary: {
      DEFAULT: string;
      dark: string;
      light: string;
      50: string;
    };
    backdrop: {
      primary: string;
      secondary: string;
    };
  };
}

export interface NavigationLink {
  text: string;
  url: string;
  external?: boolean;
}

export interface SiteInfo {
  businessName?: string;
  // Legacy alias kept for backward compatibility with existing content.
  clinicName?: string;
  tagline: string;
  description: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email: string;
  addressMapUrl?: string;
  social?: SocialMedia;
  headerVariant?: 'default' | 'centered' | 'transparent' | 'stacked';
  hours?: string[];
  features?: Record<string, any>;
}

export interface BusinessHours {
  day: string;
  time: string;
  isOpen: boolean;
}

export interface SocialMedia {
  facebook?: string;
  instagram?: string;
  youtube?: string;
  wechat?: string;
  yelp?: string;
  google_maps?: string;
}

export interface SEOConfig {
  siteTitle: string;
  metaDescription: string;
  keywords: string[];
  googleAnalyticsId?: string;
  googleMapsApiKey?: string;
}

// ============================================
// HOMEPAGE SECTION TYPES
// ============================================

export interface Stat {
  icon: string;
  number: string;
  label: string;
}

export interface HeroSection {
  variant?: 'centered' | 'split-photo-right' | 'split-photo-left' | 'overlap' | 'photo-background' | 'video-background' | 'gallery-background';
  businessName?: string;
  // Legacy alias kept for backward compatibility with existing content.
  clinicName?: string;
  tagline: string;
  description: string;
  primaryCta: {
    text: string;
    link: string;
  };
  secondaryCta: {
    text: string;
    link: string;
  };
  image?: string;
  video?: string;
  gallery?: string[];
  floatingTags: string[];
  stats: Stat[];
  trustBadges: string[];
}

export interface Testimonial {
  quote: string;
  name: string;
  condition: string;
  image?: string;
  featured?: boolean;
}

export interface TestimonialsSection {
  variant?: 'carousel' | 'grid' | 'masonry' | 'slider-vertical' | 'featured-single';
  badge: string;
  title: string;
  subtitle: string;
  testimonials: Testimonial[];
  moreLink: {
    text: string;
    url: string;
  };
}

export interface Step {
  number: number;
  icon?: string;
  title: string;
  description: string;
  duration?: string;
}

export interface HowItWorksSection {
  variant?: 'horizontal' | 'vertical' | 'cards' | 'vertical-image-right';
  title: string;
  subtitle: string;
  image?: string;
  imageAlt?: string;
  steps: Step[];
}

export interface Service {
  id: string;
  icon: string;
  title: string;
  subtitle?: string;
  shortDescription: string;
  fullDescription?: string;
  price?: string;
  durationMinutes?: number;
  benefits?: string[];
  whatToExpect?: string;
  image?: string;
  link?: string;
  order?: number;
  featured?: boolean;
}

export interface ServicesSection {
  variant?:
    | 'grid-cards'
    | 'featured-large'
    | 'list-horizontal'
    | 'accordion'
    | 'tabs'
    | 'detail-alternating'
    | 'detail-image-right';
  badge: string;
  title: string;
  subtitle: string;
  featured?: Service;
  services: Service[];
  moreLink: {
    text: string;
    url: string;
  };
}

export interface BlogPost {
  slug: string;
  type: 'article' | 'video';
  image: string;
  category: string;
  readTime?: string;
  title: string;
  excerpt: string;
  content?: string;
  author?: string;
  publishDate?: string;
  tags?: string[];
  featured?: boolean;
  published?: boolean;
  videoUrl?: string;
}

export interface BlogSection {
  variant?: 'cards-grid' | 'featured-side' | 'list-detailed' | 'carousel';
  badge: string;
  title: string;
  subtitle: string;
  posts: BlogPost[];
  moreLink: {
    text: string;
    url: string;
  };
}

export interface GalleryImage {
  src: string;
  alt: string;
  label: string;
  category?: string;
  featured?: boolean;
  order?: number;
}

export interface GallerySection {
  variant?: 'grid-masonry' | 'grid-uniform' | 'carousel' | 'lightbox-grid';
  badge: string;
  title: string;
  subtitle: string;
  images: GalleryImage[];
  moreLink: {
    text: string;
    url: string;
  };
}

export interface Feature {
  icon: string;
  image?: string;
  title: string;
  description: string;
}

export interface WhyChooseUsSection {
  badge: string;
  title: string;
  subtitle: string;
  features: Feature[];
}

export interface CTASection {
  variant?: 'centered' | 'split' | 'banner' | 'card-elevated';
  title: string;
  subtitle: string;
  primaryCta: {
    text: string;
    link: string;
  };
  secondaryCta: {
    text: string;
    link: string;
  };
  contactInfo?: string;
}

export interface FooterSection {
  brand: {
    logoText: string;
    name: string;
    description: string;
  };
  quickLinks: NavigationLink[];
  services: NavigationLink[];
  contact: {
    addressLines: string[];
    phone: string;
    phoneLink?: string;
    email: string;
    emailLink?: string;
  };
  hours: string[];
  legalLinks?: NavigationLink[];
  copyright: string;
}


// ============================================
// PAGE CONTENT TYPES
// ============================================

export interface HomePage {
  topBar: {
    address: string;
    addressMapUrl?: string;
    phone: string;
    email: string;
    badge: {
      text: string;
      visible: boolean;
    };
  };
  menu?: {
    variant?: 'default' | 'centered' | 'transparent' | 'stacked';
    fontWeight?: 'regular' | 'semibold';
    items: NavigationLink[];
    cta?: {
      text: string;
      link: string;
    };
  };
  hero: HeroSection;
  testimonials: TestimonialsSection;
  howItWorks: HowItWorksSection;
  services: ServicesSection;
  blog: BlogSection;
  gallery: GallerySection;
  whyChooseUs: WhyChooseUsSection;
  cta: CTASection;
}

export interface ServicesPage {
  hero: {
    variant?:
      | 'centered'
      | 'split-photo-right'
      | 'split-photo-left'
      | 'overlap'
      | 'photo-background'
      | 'video-background'
      | 'gallery-background';
    title: string;
    subtitle: string;
    backgroundImage?: string;
  };
  overview: {
    variant?: 'centered' | 'left';
    introduction: string;
    benefits: string[];
    title?: string;
  };
  trustBar?: {
    items: Array<{
      icon?: string;
      title: string;
      description: string;
    }>;
  };
  heroPlaceholder?: {
    emoji?: string;
    title?: string;
    subtitle?: string;
  };
  servicesList?: {
    variant?:
      | 'grid-cards'
      | 'grid-cards-2x'
      | 'grid-cards-3x'
      | 'featured-large'
      | 'list-horizontal'
      | 'accordion'
      | 'tabs'
      | 'detail-alternating'
      | 'detail-image-right';
    title?: string;
    subtitle?: string;
    badge?: string;
    items: Service[];
  };
  legacyLabels?: {
    servicePrefix?: string;
    keyBenefitsTitle?: string;
    whatToExpectTitle?: string;
  };
  services?: Service[];
  faq: {
    variant?: 'accordion' | 'simple' | 'card';
    title: string;
    subtitle?: string;
    faqs: Array<{
      question: string;
      answer: string;
    }>;
  };
  relatedReading?: {
    title?: string;
    subtitle?: string;
    viewAllText?: string;
    defaultCategory?: string;
    preferredSlugs?: string[];
  };
  cta: {
    variant?: 'centered' | 'split' | 'banner' | 'card-elevated';
    title: string;
    subtitle?: string;
    primaryCta: {
      text: string;
      link: string;
    };
    secondaryCta?: {
      text: string;
      link: string;
    };
  };
}

export interface PricingItem {
  name: string;
  description?: string;
  price: string;
  duration: string;
  notes?: string;
}

export interface PricingPackage {
  name: string;
  description: string;
  sessions: number;
  totalPrice: string;
  perSessionPrice: string;
  savings: string;
  popular?: boolean;
  includes: string[];
}

export interface ContactPage {
  hero: {
    variant?: 'centered' | 'split-photo-right' | 'split-photo-left' | 'overlap' | 'photo-background' | 'video-background' | 'gallery-background';
    title: string;
    subtitle: string;
  };
  location: {
    title: string;
    address: string;
    city: string;
    mapUrl: string;
    directions?: string;
  };
  phone: {
    title: string;
    number: string;
    secondaryNumber?: string;
  };
  email: {
    title: string;
    address: string;
  };
  hours: {
    title: string;
    schedule: BusinessHours[];
    note?: string;
  };
  form: {
    variant?: 'single-column' | 'two-column' | 'multi-step' | 'modal' | 'inline-minimal';
    title: string;
    subtitle: string;
    reasonOptions: string[];
    submitButton: {
      text: string;
    };
    successMessage: string;
    errorMessage: string;
  };
  map: {
    embedUrl: string;
    showMap: boolean;
  };
  emergency?: {
    title: string;
    message: string;
    phone: string;
    visible: boolean;
  };
}

// ============================================
// ADMIN DASHBOARD TYPES
// ============================================

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'site_admin' | 'editor' | 'viewer';
  sites: string[];
  avatar?: string;
  createdAt: string;
  lastLoginAt: string;
}

export interface Session {
  user: User;
  expiresAt: string;
  token: string;
}

export interface ImageMetadata {
  id: string;
  siteId: string;
  filename: string;
  path: string;
  url: string;
  thumbnailUrl?: string;
  webpUrl?: string;
  category: string;
  alt: string;
  title?: string;
  width: number;
  height: number;
  size: number;
  mimeType: string;
  uploadedBy: string;
  uploadedAt: string;
  usedIn: string[];
}
