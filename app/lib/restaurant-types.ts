// ============================================
// RESTAURANT-SPECIFIC TYPE DEFINITIONS
// Content contracts for The Meridian template
// ============================================

// --- Primitives ---

export type ImageURL = string;
export type ISODate = string;
export type ISODateTime = string;
export type Slug = string;
export type Cents = number; // 2500 = $25.00
export type RichText = string; // markdown

export type BrandVariant =
  | 'noir-saison'
  | 'terre-vivante'
  | 'velocite'
  | 'matin-clair';

// --- Menu Types ---

export type MenuType =
  | 'lunch' | 'dinner' | 'brunch' | 'breakfast'
  | 'drinks' | 'cocktails' | 'wine' | 'beer' | 'spirits'
  | 'desserts' | 'kids' | 'seasonal' | 'happy-hour'
  | 'tasting-menu' | 'prix-fixe';

export type DayOfWeek =
  | 'monday' | 'tuesday' | 'wednesday' | 'thursday'
  | 'friday' | 'saturday' | 'sunday';

export type DietaryFlag =
  | 'vegan' | 'vegetarian' | 'gf' | 'gf-option'
  | 'nut-free' | 'dairy-free' | 'spicy' | 'halal' | 'kosher';

export type Allergen =
  | 'gluten' | 'dairy' | 'eggs' | 'nuts' | 'peanuts'
  | 'shellfish' | 'soy' | 'fish' | 'sesame';

export type WineStyle =
  | 'red' | 'white' | 'rosé' | 'sparkling'
  | 'dessert' | 'fortified' | 'orange';

export interface MenuCategory {
  id: string;
  name: string;
  description?: string;
  menuType: MenuType;
  slug: Slug;
  availableDays?: DayOfWeek[];
  availableFrom?: string;
  availableUntil?: string;
  displayOrder: number;
  active: boolean;
}

export interface MenuItem {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: Cents | null;
  priceNote?: string;
  priceRange?: { min: Cents; max: Cents };
  image?: ImageURL;
  dietaryFlags: DietaryFlag[];
  allergens: Allergen[];
  featured: boolean;
  seasonal: boolean;
  seasonalNote?: string;
  newItem: boolean;
  spiceLevel?: 0 | 1 | 2 | 3;
  available: boolean;
  displayOrder: number;
}

export interface WineListItem extends MenuItem {
  wine: {
    grapeVariety: string;
    region: string;
    producer: string;
    vintage?: number;
    style: WineStyle;
    tastingNotes?: string;
    pairingNotes?: string;
    glassPrice?: Cents;
    bottlePrice: Cents;
    magnumPrice?: Cents;
  };
}

export interface CocktailItem extends MenuItem {
  cocktail: {
    baseSpirit: string;
    ingredients: string;
    method: string;
    glassware?: string;
    bartender?: string;
    signature: boolean;
    seasonal: boolean;
  };
}

// --- Team Types ---

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  shortBio: string;
  photo: ImageURL;
  photoPortrait?: ImageURL;
  credentials: string[];
  awards?: string[];
  philosophy?: string;
  department: 'culinary' | 'service' | 'management' | 'bar' | 'pastry';
  featured: boolean;
  displayOrder: number;
  social?: {
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
  joinedYear?: number;
  active: boolean;
}

// --- Event Types ---

export type EventType =
  | 'wine-dinner' | 'tasting' | 'live-music' | 'dj-night'
  | 'holiday' | 'private' | 'pop-up' | 'class' | 'brunch-special'
  | 'happy-hour-event' | 'chef-collab' | 'seasonal-launch';

export interface RecurringPattern {
  frequency: 'weekly' | 'biweekly' | 'monthly' | 'custom';
  days?: DayOfWeek[];
  dayOfMonth?: number;
  endDate?: ISODate;
  exceptions?: ISODate[];
}

export interface RestaurantEvent {
  id: string;
  title: string;
  description: string;
  shortDescription?: string;
  eventType: EventType;
  image?: ImageURL;
  tags: string[];
  startDatetime: ISODateTime;
  endDatetime: ISODateTime;
  allDay?: boolean;
  recurring?: RecurringPattern | null;
  pricePerPerson?: Cents | null;
  priceNote?: string;
  priceTiers?: Array<{ label: string; price: Cents }>;
  reservationRequired: boolean;
  reservationLink?: string;
  capacity?: number;
  spotsRemaining?: number;
  featured: boolean;
  published: boolean;
  cancelled: boolean;
  cancelNote?: string;
}

// --- Gallery Types ---

export type GalleryCategory =
  | 'food' | 'interior' | 'events' | 'team'
  | 'behind-the-scenes' | 'seasonal';

export interface GalleryItem {
  id: string;
  url: ImageURL;
  thumbnailUrl?: ImageURL;
  alt: string;
  category: GalleryCategory;
  caption?: string;
  credit?: string;
  featured: boolean;
  displayOrder: number;
  width?: number;
  height?: number;
  takenAt?: ISODate;
}

// --- Blog Types ---

export type BlogCategory =
  | 'kitchen-stories' | 'sourcing-ingredients' | 'wine-spirits'
  | 'events-announcements' | 'chef-perspective' | 'seasonal-guide'
  | 'behind-the-scenes' | 'news';

export interface BlogAuthor {
  type: 'team_member' | 'guest' | 'editorial';
  teamId?: string;
  name?: string;
  photo?: ImageURL;
  bio?: string;
}

export interface RestaurantBlogPost {
  id: string;
  title: string;
  slug: Slug;
  excerpt: string;
  body: RichText;
  author: BlogAuthor;
  category: BlogCategory;
  tags: string[];
  featuredImage: ImageURL;
  featuredImageAlt: string;
  featured: boolean;
  published: boolean;
  publishedAt: ISODateTime;
  readTimeMinutes?: number;
}

// --- Press & Awards Types ---

export interface PressItem {
  id: string;
  publication: string;
  logo?: ImageURL;
  headline: string;
  excerpt?: string;
  url?: string;
  date: ISODate;
  award?: string;
  isAward: boolean;
  featured: boolean;
  displayOrder: number;
}

// --- Reservation Types ---

export type ReservationProvider = 'opentable' | 'resy' | 'custom' | 'phone-only';

export type RestaurantBookingStatus =
  | 'pending' | 'confirmed' | 'seated'
  | 'completed' | 'cancelled' | 'no-show';

export interface ReservationConfig {
  provider: ReservationProvider;
  opentableRid?: string;
  resyVenueId?: string;
  resyApiKey?: string;
  custom?: {
    timeSlots: string[];
    partySizeMin: number;
    partySizeMax: number;
    partyLargeMin: number;
    advanceDaysMin: number;
    advanceDaysMax: number;
    blackoutDates?: ISODate[];
    requirePhone: boolean;
    requireCc: boolean;
    cancellationHours: number;
  };
  privateDining?: {
    minGuests: number;
    maxGuests: number;
    minSpend?: Cents;
    inquiryLeadDays: number;
    spaces?: Array<{
      name: string;
      capacity: number;
      description: string;
      image?: ImageURL;
    }>;
  };
  policies: {
    cancellation?: string;
    dressCode?: string;
    parking?: string;
    accessibility?: string;
    deposit?: string;
  };
}

// --- Section Types ---

export type RestaurantSectionType =
  | 'hero-fullscreen-dish'
  | 'hero-split-ambiance'
  | 'hero-video-atmosphere'
  | 'hero-editorial'
  | 'hero-cafe-welcome'
  | 'trust-bar'
  | 'testimonials'
  | 'press-logo-strip'
  | 'menu-preview'
  | 'menu-category-nav'
  | 'menu-section'
  | 'about-preview'
  | 'chef-hero-full'
  | 'team-grid'
  | 'reservations-cta'
  | 'reservation-widget-resy'
  | 'reservation-widget-opentable'
  | 'reservation-widget-custom'
  | 'events-preview'
  | 'events-grid'
  | 'gallery-preview'
  | 'gallery-grid'
  | 'blog-preview'
  | 'contact-info-block'
  | 'private-dining-cta'
  | 'sticky-booking-bar'
  | 'dietary-legend'
  | 'faq-accordion';

// --- Site Feature Flags ---

export interface RestaurantFeatures {
  onlineReservation: boolean;
  reservationProvider: ReservationProvider;
  opentableId?: string;
  resyVenueId?: string;
  privateDining: boolean;
  eventsSection: boolean;
  blog: boolean;
  gallery: boolean;
  pressSection: boolean;
  giftCards: boolean;
  onlineOrdering: boolean;
  catering: boolean;
  careers: boolean;
  kidsMenu: boolean;
  happyHour: boolean;
  wineList: boolean;
  cocktailMenu: boolean;
  allergenDisplay: boolean;
  seasonalMenu: boolean;
  loyaltyProgram: boolean;
}
