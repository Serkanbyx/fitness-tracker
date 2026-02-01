import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Dumbbell, Target, Moon, Sun } from 'lucide-react';
import clsx from 'clsx';
import { useThemeStore } from '../store';

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
  const { resolvedTheme, toggleTheme } = useThemeStore();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-50">
      <div className="flex items-center justify-around h-16">
        {navLinks.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              clsx(
                'flex flex-col items-center justify-center flex-1 h-full gap-1 transition-all duration-200',
                isActive
                  ? 'text-primary-600 dark:text-primary-400'
                  : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
              )
            }
          >
            <Icon className="w-5 h-5" />
            <span className="text-xs font-medium">{label}</span>
          </NavLink>
        ))}
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="flex flex-col items-center justify-center flex-1 h-full gap-1 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-all duration-200"
          aria-label={resolvedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {resolvedTheme === 'dark' ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
          <span className="text-xs font-medium">Theme</span>
        </button>
      </div>
    </nav>
  );
};

export default MobileNav;
