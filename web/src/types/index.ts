export interface User {
  id: string;
  createdAt: string;
  updatedAt: string;
  organizationId: string;
  email: string;
  fullName: string;
  status: 'active' | 'inactive' | 'pending';
  emailVerifiedAt: string | null;
  role?: string | null;
  metadata?: {
    user_role?: string | null;
  };
}

export interface NavItem {
  allowedRoles?: string[];
  items?: NavItem[];
  [key: string]: unknown;
}
