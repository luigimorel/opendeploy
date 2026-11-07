import { sidebarData } from '@/constants/sidebar-data';
import { type NavItem } from '@/types';

import { useCurrentUser } from './useCurrentUser';

export function useFilteredSidebar() {
  const { role, isLoading, user } = useCurrentUser();

  const filterItemByRole = (item: NavItem): NavItem | null => {
    if (item.allowedRoles && (!role || !item.allowedRoles.includes(role))) {
      return null;
    }

    if ('items' in item && item.items) {
      const allowedSubItems = item.items.filter(
        (subItem) => !subItem.allowedRoles || (role && subItem.allowedRoles.includes(role)),
      );

      if (allowedSubItems.length === 0) return null;

      return { ...item, items: allowedSubItems };
    }

    return item;
  };

  const filteredNavGroups = sidebarData.navGroups
    .map((group) => {
      const visibleItems = group.items.map(filterItemByRole).filter((item): item is NavItem => item !== null);

      return { ...group, items: visibleItems };
    })
    .filter((group) => group.items.length > 0);

  return {
    navGroups: filteredNavGroups,
    isLoading,
    user,
    role,
  };
}
