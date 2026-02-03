import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import HomePage from './pages/HomePage';
import VideosPage from './pages/VideosPage';
import ContactPage from './pages/ContactPage';
import AdminInboxPage from './pages/admin/AdminInboxPage';
import AdminHomeBoxesPage from './pages/admin/AdminHomeBoxesPage';
import AdminManageAdminsPage from './pages/admin/AdminManageAdminsPage';
import SiteLayout from './components/layout/SiteLayout';
import { Toaster } from '@/components/ui/sonner';

const rootRoute = createRootRoute({
  component: SiteLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const videosRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/videos',
  component: VideosPage,
});

const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/contact',
  component: ContactPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminInboxPage,
});

const adminHomeBoxesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/home-boxes',
  component: AdminHomeBoxesPage,
});

const adminManageAdminsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/admins',
  component: AdminManageAdminsPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  videosRoute,
  contactRoute,
  adminRoute,
  adminHomeBoxesRoute,
  adminManageAdminsRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}
