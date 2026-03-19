import { createBrowserRouter } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: '/', lazy: () => import('./pages/Home') },
      { path: '/events/:eventSlug', lazy: () => import('./pages/EventPage') },
      { path: '/chatbot', lazy: () => import('./pages/ChatbotPage') },
      { path: '/templates', lazy: () => import('./pages/TemplatePage') },
      { path: '/preview', lazy: () => import('./pages/PreviewPage') },
      { path: '/pricing', lazy: () => import('./pages/PricingPage') },
      // { path: '/dashboard', lazy: () => import('./pages/DashboardPage') }, // re-enable after auth
    ],
  },
]);

export default router;
