import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Dumbbell, Target } from 'lucide-react';
import clsx from 'clsx';

/**
 * Navigation link configuration for mobile
 */
const navLinks = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/workouts', icon: Dumbbell, label: 'Workouts' },
  { to: '/goals', icon: Target, label: 'Goals' },
];

/**
 * Mobile bottom navigation component
 * Shown on mobile, hidden on large screens
 */
const MobileNav = () => {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex items-center justify-around h-16">
        {navLinks.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              clsx(
                'flex flex-col items-center justify-center flex-1 h-full gap-1 transition-all duration-200',
                isActive
                  ? 'text-primary-600'
                  : 'text-gray-500 hover:text-gray-900'
              )
            }
          >
            <Icon className="w-5 h-5" />
            <span className="text-xs font-medium">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default MobileNav;
