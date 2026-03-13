import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function MainLayout() {
  const location = useLocation();
  const hideNavFooter = ['/chatbot', '/preview'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text-primary)] font-sans">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-[var(--color-primary)] focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-semibold"
      >
        Skip to main content
      </a>
      {!hideNavFooter && <Navbar />}
      <main id="main-content" className={!hideNavFooter ? 'pt-16' : ''}>
        <Outlet />
      </main>
      {!hideNavFooter && <Footer />}
    </div>
  );
}
