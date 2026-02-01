import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';

/**
 * Main layout component with sidebar navigation
 * Provides responsive layout for desktop and mobile views
 */
const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <Sidebar />
      
      {/* Mobile Navigation */}
      <MobileNav />
      
      {/* Main Content Area */}
      <main className="lg:ml-64 min-h-screen pb-20 lg:pb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
