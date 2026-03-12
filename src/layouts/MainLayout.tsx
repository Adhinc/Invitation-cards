import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function MainLayout() {
  const location = useLocation();
  const hideNavFooter = ['/chatbot', '/preview'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-[#FFF9F5] text-[#2D2D2D] font-sans">
      {!hideNavFooter && <Navbar />}
      <main className={!hideNavFooter ? 'pt-16' : ''}>
        <Outlet />
      </main>
      {!hideNavFooter && <Footer />}
    </div>
  );
}
