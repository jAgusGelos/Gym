import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utils/cn';

interface FilterButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isActive?: boolean;
}

export const FilterButton = forwardRef<HTMLButtonElement, FilterButtonProps>(
  ({ className, isActive = false, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
          isActive
            ? 'bg-primary-600 text-white dark:bg-primary-600 dark:text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600',
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

FilterButton.displayName = 'FilterButton';
