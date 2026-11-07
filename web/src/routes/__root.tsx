import { NotFoundPage } from '@/pages/not-found';
import { Outlet, createRootRoute } from '@tanstack/react-router';

export const Route = createRootRoute({
  component: Outlet,
  notFoundComponent: NotFoundPage,
});
