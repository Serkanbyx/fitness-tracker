import clsx from 'clsx';

interface ProgressBarProps {
  value: number;
  max?: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

/**
 * Size configurations for progress bar height
 */
const sizes = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
};

/**
 * Color variants for progress bar fill
 */
const variants = {
  default: 'bg-primary-600',
  success: 'bg-green-500',
  warning: 'bg-amber-500',
  danger: 'bg-red-500',
};

/**
 * Get variant based on progress percentage
 */
const getAutoVariant = (percentage: number): 'default' | 'success' | 'warning' | 'danger' => {
  if (percentage >= 100) return 'success';
  if (percentage >= 75) return 'default';
  if (percentage >= 50) return 'warning';
  return 'danger';
};

/**
 * Reusable progress bar component with multiple variants
 */
const ProgressBar = ({
  value,
  max = 100,
  showLabel = false,
  size = 'md',
  variant,
}: ProgressBarProps) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  const autoVariant = variant || getAutoVariant(percentage);

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm font-medium text-gray-500">
            {percentage.toFixed(0)}%
          </span>
        </div>
      )}
      <div
        className={clsx('w-full bg-gray-200 rounded-full overflow-hidden', sizes[size])}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        <div
          className={clsx(
            'h-full rounded-full transition-all duration-500 ease-out',
            variants[autoVariant]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
