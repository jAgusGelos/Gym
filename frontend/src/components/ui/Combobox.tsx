import { InputHTMLAttributes, forwardRef, useState, useRef, useEffect } from 'react';
import { cn } from '../../utils/cn';

interface ComboboxOption {
  value: string;
  label: string;
}

interface ComboboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  error?: string;
  options: ComboboxOption[];
  value?: string;
  onChange?: (value: string) => void;
}

export const Combobox = forwardRef<HTMLInputElement, ComboboxProps>(
  ({ className, label, error, options, value, onChange, id, ...props }, ref) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(0);
    const comboboxId = id || `combobox-${Math.random().toString(36).substr(2, 9)}`;
    const optionsRef = useRef<(HTMLButtonElement | null)[]>([]);

    // Find the selected option label
    const selectedOption = options.find(opt => opt.value === value);
    const displayValue = selectedOption ? selectedOption.label : searchTerm;

    // Filter options based on search term
    const filteredOptions = options.filter(option =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Reset highlighted index when filtered options change
    useEffect(() => {
      setHighlightedIndex(0);
    }, [searchTerm]);

    // Scroll highlighted option into view
    useEffect(() => {
      if (isOpen && optionsRef.current[highlightedIndex]) {
        optionsRef.current[highlightedIndex]?.scrollIntoView({
          block: 'nearest',
          behavior: 'smooth',
        });
      }
    }, [highlightedIndex, isOpen]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
      setIsOpen(true);
    };

    const handleSelectOption = (option: ComboboxOption) => {
      onChange?.(option.value);
      setSearchTerm('');
      setIsOpen(false);
    };

    const handleInputFocus = () => {
      setIsOpen(true);
    };

    const handleInputBlur = () => {
      // Delay closing to allow click on option
      setTimeout(() => setIsOpen(false), 200);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!isOpen) {
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
          e.preventDefault();
          setIsOpen(true);
        }
        return;
      }

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev < filteredOptions.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev));
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredOptions[highlightedIndex]) {
            handleSelectOption(filteredOptions[highlightedIndex]);
          }
          break;
        case 'Escape':
          e.preventDefault();
          setIsOpen(false);
          setSearchTerm('');
          break;
        case 'Tab':
          setIsOpen(false);
          break;
      }
    };

    return (
      <div className="w-full relative">
        {label && (
          <label
            htmlFor={comboboxId}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={comboboxId}
            type="text"
            value={isOpen ? searchTerm : displayValue}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            onKeyDown={handleKeyDown}
            placeholder={props.placeholder || "Buscar..."}
            autoComplete="off"
            className={cn(
              'flex h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-base',
              'placeholder:text-gray-400 dark:placeholder:text-gray-500',
              'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
              'disabled:cursor-not-allowed disabled:opacity-50',
              'dark:bg-gray-800 dark:border-gray-600 dark:text-white',
              error && 'border-red-500 focus:ring-red-500',
              className
            )}
            {...props}
          />

          {isOpen && filteredOptions.length > 0 && (
            <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-auto">
              {filteredOptions.map((option, index) => (
                <button
                  key={option.value}
                  ref={(el) => (optionsRef.current[index] = el)}
                  type="button"
                  onClick={() => handleSelectOption(option)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  className={cn(
                    'w-full text-left px-3 py-2',
                    'text-gray-900 dark:text-white text-sm',
                    'transition-colors',
                    highlightedIndex === index && 'bg-blue-100 dark:bg-blue-900/30',
                    option.value === value && !highlightedIndex && 'bg-blue-50 dark:bg-blue-900/20'
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
      </div>
    );
  }
);

Combobox.displayName = 'Combobox';
