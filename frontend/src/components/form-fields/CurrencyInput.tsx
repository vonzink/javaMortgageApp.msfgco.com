import { useState, useCallback, type ChangeEvent, type FocusEvent } from 'react';

interface CurrencyInputProps {
  value: number;
  onChange: (value: number) => void;
  label?: string;
  placeholder?: string;
  id?: string;
  required?: boolean;
  error?: string;
  className?: string;
}

export default function CurrencyInput({
  value,
  onChange,
  label,
  placeholder = '$0.00',
  id,
  required = false,
  error,
  className = '',
}: CurrencyInputProps) {
  const [displayValue, setDisplayValue] = useState(() => {
    if (value > 0) {
      return formatForDisplay(value);
    }
    return '';
  });
  const [isFocused, setIsFocused] = useState(false);

  function formatForDisplay(num: number): string {
    if (num === 0) return '';
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(num);
  }

  const handleFocus = useCallback((_e: FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    // Show raw number for easy editing
    if (value > 0) {
      setDisplayValue(String(value));
    } else {
      setDisplayValue('');
    }
  }, [value]);

  const handleBlur = useCallback((_e: FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    // Re-format on blur
    const cleaned = displayValue.replace(/[^0-9.]/g, '');
    const num = parseFloat(cleaned) || 0;
    onChange(num);
    setDisplayValue(num > 0 ? formatForDisplay(num) : '');
  }, [displayValue, onChange]);

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    // Only allow digits, decimal point, and empty
    if (raw === '' || /^[0-9]*\.?[0-9]*$/.test(raw)) {
      setDisplayValue(raw);
      const num = parseFloat(raw) || 0;
      onChange(num);
    }
  }, [onChange]);

  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="label">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          $
        </span>
        <input
          id={id}
          type="text"
          inputMode="decimal"
          value={isFocused ? displayValue : (value > 0 ? formatForDisplay(value) : '')}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={`input-field pl-7 ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
