export interface MenuSpecial {
  name: string;
  description: string;
  price: number;
  badges?: string[];
  image?: string;
  includes?: string[];
  menuType?: string;
  ctaLabel?: string;
}

export interface WeeklySpecial extends MenuSpecial {
  day: string;
  dayNumber?: number;
}

export interface ChefSignature {
  name: string;
  description: string;
  menuType: string;
  image?: string;
  badges?: string[];
  highlights?: string[];
  pairing?: string;
  ctaLabel?: string;
}

export interface MenuItemSource {
  id: string;
  categoryId: string;
  name: string;
  description?: string;
  image?: string;
  available?: boolean;
  displayOrder?: number;
  signature?: boolean;
  featured?: boolean;
  newItem?: boolean;
  seasonal?: boolean;
}

export interface MenuSource {
  menuType: string;
  title?: string;
  defaultItemImage?: string;
  items?: MenuItemSource[];
}

export interface MenuHubContent {
  hero?: {
    headline?: string;
    subline?: string;
  };
  sectionVariants?: Record<string, 'compact' | 'rich'>;
  homeSectionVariants?: Record<string, 'compact' | 'rich'>;
  todaySpecial?: MenuSpecial;
  weeklySpecials?: WeeklySpecial[];
}

export const defaultTodaySpecial: MenuSpecial = {
  name: 'Chef Bellamy Signature Meatloaf Plate',
  description: 'Braised short-rib meatloaf, buttery mash, seasonal vegetables, onion gravy.',
  price: 24,
  badges: ['Limited', 'Best Seller'],
  image:
    'https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&q=80&auto=format&fit=crop',
  includes: ['Creamy mash', 'Seasonal vegetables', 'House gravy'],
  menuType: 'dinner',
  ctaLabel: 'See Dinner Menu',
};

export const defaultWeeklySpecials: WeeklySpecial[] = [
  {
    day: 'Monday',
    dayNumber: 1,
    name: 'Chicken Pot Pie',
    description: 'Flaky crust, roasted chicken, root vegetables.',
    price: 18,
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=1200&q=80&auto=format&fit=crop',
    badges: ['House Favorite'],
    includes: ['Side salad', 'Dinner roll', 'Choice of tea or coffee'],
    menuType: 'lunch',
    ctaLabel: 'See Lunch Menu',
  },
  {
    day: 'Tuesday',
    dayNumber: 2,
    name: 'Turkey Dinner',
    description: 'Roast turkey, stuffing, mashed potatoes, cranberry.',
    price: 21,
    image: 'https://images.unsplash.com/photo-1516685018646-549198525c1b?w=1200&q=80&auto=format&fit=crop',
    badges: ['Classic'],
    includes: ['Turkey gravy', 'Seasonal vegetables', 'Cranberry relish'],
    menuType: 'dinner',
    ctaLabel: 'See Dinner Menu',
  },
  {
    day: 'Wednesday',
    dayNumber: 3,
    name: 'BBQ Meatloaf',
    description: 'House glaze, mac and cheese, collard greens.',
    price: 20,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&q=80&auto=format&fit=crop',
    badges: ['Best Seller'],
    includes: ['Creamy mac and cheese', 'Braised greens', 'Pickled onions'],
    menuType: 'dinner',
    ctaLabel: 'See Dinner Menu',
  },
  {
    day: 'Thursday',
    dayNumber: 4,
    name: 'Country Fried Steak',
    description: 'Pepper gravy, hash browns, green beans.',
    price: 22,
    image: 'https://images.unsplash.com/photo-1543332164-6e82f355bad5?w=1200&q=80&auto=format&fit=crop',
    badges: ['Comfort Food'],
    includes: ['Pepper gravy', 'Hash browns', 'Butter beans'],
    menuType: 'dinner',
    ctaLabel: 'See Dinner Menu',
  },
  {
    day: 'Friday',
    dayNumber: 5,
    name: 'Fish Fry',
    description: 'Beer-battered cod, fries, coleslaw, tartar.',
    price: 23,
    image: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=1200&q=80&auto=format&fit=crop',
    badges: ['Friday Special'],
    includes: ['Malt vinegar fries', 'House tartar', 'Cabbage slaw'],
    menuType: 'dinner',
    ctaLabel: 'See Dinner Menu',
  },
  {
    day: 'Saturday',
    dayNumber: 6,
    name: 'Prime Rib Night',
    description: 'Slow-roasted prime rib, au jus, baked potato.',
    price: 32,
    image: 'https://images.unsplash.com/photo-1558030006-450675393462?w=1200&q=80&auto=format&fit=crop',
    badges: ['Chef Choice', 'Limited'],
    includes: ['Yorkshire pudding', 'Baked potato', 'Horseradish cream'],
    menuType: 'dinner',
    ctaLabel: 'See Dinner Menu',
  },
  {
    day: 'Sunday',
    dayNumber: 0,
    name: 'Brunch Board',
    description: 'Pancakes, eggs, bacon, fruit, house jam.',
    price: 26,
    image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=1200&q=80&auto=format&fit=crop',
    badges: ['Weekend Only'],
    includes: ['Maple syrup', 'Seasonal fruit', 'Fresh pastry'],
    menuType: 'breakfast',
    ctaLabel: 'See Breakfast Menu',
  },
];

export function resolveChefSignaturesFromDinner(
  dinnerMenu: MenuSource | null | undefined,
  maxItems = 4
): ChefSignature[] {
  if (!dinnerMenu || dinnerMenu.menuType !== 'dinner') {
    return [];
  }
  const allItems = Array.isArray(dinnerMenu.items) ? dinnerMenu.items : [];
  const availableItems = allItems.filter((item) => item && item.available !== false);
  const explicitSignatureItems = availableItems.filter((item) => item.signature === true);
  const signatureSource =
    explicitSignatureItems.length > 0
      ? explicitSignatureItems
      : availableItems.filter((item) => item.featured === true);

  const sorted = [...signatureSource].sort(
    (a, b) => (a.displayOrder ?? Number.MAX_SAFE_INTEGER) - (b.displayOrder ?? Number.MAX_SAFE_INTEGER)
  );

  return sorted.slice(0, maxItems).map((item) => {
    const badges: string[] = ['Signature'];
    if (item.newItem) badges.push('New');
    if (item.seasonal) badges.push('Seasonal');
    return {
      name: item.name,
      description: item.description || '',
      menuType: 'dinner',
      image: item.image || dinnerMenu.defaultItemImage,
      badges,
      ctaLabel: 'See Dinner Menu',
    };
  });
}

export function resolveTodaySpecial(
  weeklySpecials: WeeklySpecial[],
  explicitSpecial: MenuSpecial | undefined,
  currentDayNumber: number
): MenuSpecial {
  if (explicitSpecial) {
    return explicitSpecial;
  }

  const weekdayNames = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
  ];
  const currentDayName = weekdayNames[currentDayNumber];
  const autoTodaySpecial = weeklySpecials.find((special) => {
    const byNumber =
      typeof special.dayNumber === 'number' && special.dayNumber === currentDayNumber;
    const byName = special.day.trim().toLowerCase() === currentDayName;
    return byNumber || byName;
  });

  return autoTodaySpecial || defaultTodaySpecial;
}
