import type { FooterSection, Locale } from './types';

export function getDefaultFooter(locale: Locale): FooterSection {
  const isEnglish = locale === 'en';

  return {
    brand: {
      logoText: 'BIZ',
      name: 'Business Name',
      description: isEnglish
        ? 'Helping customers with high-quality, professional service.'
        : '以高品质、专业的服务支持客户需求。',
    },
    quickLinks: [
      { text: isEnglish ? 'About Us' : '关于我们', url: `/${locale}/about` },
      { text: isEnglish ? 'Menu' : '菜单', url: `/${locale}/menu` },
      { text: isEnglish ? 'Reservations' : '预订', url: `/${locale}/reservations` },
      { text: isEnglish ? 'Events' : '活动', url: `/${locale}/events` },
      { text: isEnglish ? 'Gallery' : '画廊', url: `/${locale}/gallery` },
      { text: isEnglish ? 'Blog' : '博客', url: `/${locale}/blog` },
      { text: isEnglish ? 'Contact' : '联系我们', url: `/${locale}/contact` },
    ],
    services: [
      { text: isEnglish ? 'Dinner Menu' : '晚餐菜单', url: `/${locale}/menu/dinner` },
      { text: isEnglish ? 'Cocktails & Wine' : '鸡尾酒与葡萄酒', url: `/${locale}/menu/cocktails` },
      { text: isEnglish ? 'Private Dining' : '私人包间', url: `/${locale}/private-dining` },
      { text: isEnglish ? 'Gift Cards' : '礼品卡', url: `/${locale}/gift-cards` },
    ],
    contact: {
      addressLines: [
        isEnglish ? '142 West 72nd Street' : '西72街142号',
        isEnglish ? 'New York, NY 10023' : '纽约, 纽约州 10023',
      ],
      phone: '(212) 555-0142',
      phoneLink: 'tel:+12125550142',
      email: 'info@themeridian.com',
      emailLink: 'mailto:info@themeridian.com',
    },
    hours: ['Mon-Fri: 9:00 AM - 6:00 PM', 'Sat: 10:00 AM - 2:00 PM'],
    legalLinks: [
      { text: isEnglish ? 'Privacy Policy' : '隐私政策', url: `/${locale}/privacy` },
      { text: isEnglish ? 'Terms of Service' : '服务条款', url: `/${locale}/terms` },
    ],
    copyright: isEnglish
      ? '© {year} Business Name. All rights reserved.'
      : '© {year} Business Name. 版权所有。',
  };
}
