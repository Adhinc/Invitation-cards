import { createBrowserRouter } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';

const router = createBrowserRouter([
  {
    path: '/i/:slug',
    lazy: async () => {
      const { default: InvitationPage } = await import('./pages/InvitationPage');
      return { Component: InvitationPage };
    },
  },
  {
    element: <MainLayout />,
    children: [
      { path: '/', lazy: () => import('./pages/Home') },
      { path: '/events/:eventSlug', lazy: () => import('./pages/EventPage') },
      { path: '/chatbot', lazy: () => import('./pages/ChatbotPage') },
      { path: '/templates', lazy: () => import('./pages/TemplatePage') },
      { path: '/preview', lazy: () => import('./pages/PreviewPage') },
      { path: '/pricing', lazy: () => import('./pages/PricingPage') },
      { path: '/dashboard', lazy: () => import('./pages/DashboardPage') },
    ],
  },
]);

export default router;
