import { Outlet } from 'react-router-dom';

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-[#FFF9F5] text-[#2D2D2D] font-sans">
      <Outlet />
    </div>
  );
}
