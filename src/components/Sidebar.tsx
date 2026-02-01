import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Dumbbell, 
  Target, 
  Activity 
} from 'lucide-react';
import clsx from 'clsx';

/**
 * Navigation link configuration
 */
const navLinks = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/workouts', icon: Dumbbell, label: 'Workouts' },
  { to: '/goals', icon: Target, label: 'Goals' },
];

/**
 * Desktop sidebar navigation component
 * Hidden on mobile, shown on large screens
 */
const Sidebar = () => {
  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white border-r border-gray-200">
      {/* Logo Section */}
      <div className="flex items-center gap-3 h-16 px-6 border-b border-gray-200">
        <div className="flex items-center justify-center w-10 h-10 bg-primary-600 rounded-xl">
          <Activity className="w-6 h-6 text-white" />
        </div>
        <span className="text-xl font-bold text-gray-900">FitTracker</span>
      </div>
      
      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navLinks.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200',
                isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              )
            }
          >
            <Icon className="w-5 h-5" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
      
      {/* Footer Section */}
      <div className="p-4 border-t border-gray-200">
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-4 text-white">
          <p className="font-semibold mb-1">Stay Consistent!</p>
          <p className="text-sm text-primary-100">
            Track your progress daily for best results.
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
