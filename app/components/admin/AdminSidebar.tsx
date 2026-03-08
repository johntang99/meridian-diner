import { getSession } from '@/lib/admin/auth';
import { isSuperAdmin } from '@/lib/admin/permissions';
import { AdminSidebarNav } from './AdminSidebarNav';
import type { IconKey } from './AdminSidebarNav';

const navigation: Array<{
  name: string;
  href: string;
  iconKey: IconKey;
  group: 'site' | 'system';
  preserveContext?: boolean;
}> = [
  { name: 'Site Settings', href: '/admin/site-settings', iconKey: 'slidersHorizontal', group: 'site' },
  { name: 'Content', href: '/admin/content', iconKey: 'fileText', group: 'site' },
  { name: 'Menu', href: '/admin/menu', iconKey: 'utensilsCrossed', group: 'site' },
  { name: 'Events', href: '/admin/events', iconKey: 'calendar', group: 'site' },
  { name: 'Gallery', href: '/admin/gallery', iconKey: 'imageIcon', group: 'site' },
  { name: 'Blog Posts', href: '/admin/blog-posts', iconKey: 'bookOpen', group: 'site' },
  { name: 'Press', href: '/admin/press', iconKey: 'newspaper', group: 'site' },
  { name: 'Team', href: '/admin/team', iconKey: 'usersRound', group: 'site' },
  { name: 'Media', href: '/admin/media', iconKey: 'image', group: 'site' },

  { name: 'Onboarding', href: '/admin/onboarding', iconKey: 'rocket', group: 'system', preserveContext: false },
  { name: 'Sites', href: '/admin/sites', iconKey: 'building2', group: 'system', preserveContext: false },
  { name: 'Components', href: '/admin/components', iconKey: 'layoutGrid', group: 'system', preserveContext: false },
  { name: 'Variants', href: '/admin/variants', iconKey: 'layers', group: 'system', preserveContext: false },
  { name: 'Users', href: '/admin/users', iconKey: 'users', group: 'system', preserveContext: false },
  { name: 'Settings', href: '/admin/settings', iconKey: 'settings', group: 'system', preserveContext: false },
];

export async function AdminSidebar() {
  const session = await getSession();
  const isAdmin = session?.user ? isSuperAdmin(session.user) : false;
  const items = isAdmin ? navigation : navigation.filter((item) => item.name !== 'Users');
  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white border-r border-gray-200">
      <div className="flex items-center h-16 px-6 border-b border-gray-200">
        <span className="text-lg font-semibold">Admin Dashboard</span>
      </div>
      <AdminSidebarNav items={items} />
    </aside>
  );
}
