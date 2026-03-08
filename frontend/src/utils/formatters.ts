/**
 * Format a number as USD currency string.
 * Example: 1234567.89 -> "$1,234,567.89"
 */
export function formatCurrency(amount: number): string {
  if (isNaN(amount)) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format a number as USD currency string without cents.
 * Example: 350000 -> "$350,000"
 */
export function formatCurrencyWhole(amount: number): string {
  if (isNaN(amount)) return '$0';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Parse a currency-formatted string back to a number.
 * Strips $, commas, and non-numeric characters (except . and -).
 * Example: "$1,234,567.89" -> 1234567.89
 */
export function parseCurrencyInput(value: string): number {
  const cleaned = value.replace(/[^0-9.\-]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Format an ISO date string to a human-readable date.
 * Example: "2026-03-07T12:00:00Z" -> "March 7, 2026"
 */
export function formatDate(date: string): string {
  if (!date) return '';
  try {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(date));
  } catch {
    return date;
  }
}

/**
 * Format an ISO date string to a short date.
 * Example: "2026-03-07T12:00:00Z" -> "03/07/2026"
 */
export function formatDateShort(date: string): string {
  if (!date) return '';
  try {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(new Date(date));
  } catch {
    return date;
  }
}

/**
 * Mask an SSN showing only last 4 digits.
 * Example: "123456789" -> "***-**-6789"
 */
export function formatSSN(ssn: string): string {
  if (!ssn) return '';
  const digits = ssn.replace(/\D/g, '');
  if (digits.length < 4) return '***-**-****';
  const last4 = digits.slice(-4);
  return `***-**-${last4}`;
}

/**
 * Format a raw SSN into the standard display format for input.
 * Example: "123456789" -> "123-45-6789"
 */
export function formatSSNInput(ssn: string): string {
  const digits = ssn.replace(/\D/g, '').slice(0, 9);
  if (digits.length <= 3) return digits;
  if (digits.length <= 5) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5)}`;
}

/**
 * Format a phone number.
 * Example: "5551234567" -> "(555) 123-4567"
 */
export function formatPhone(phone: string): string {
  if (!phone) return '';
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  if (digits.length === 11 && digits[0] === '1') {
    return `(${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  return phone;
}

/**
 * Format a phone number as the user types.
 */
export function formatPhoneInput(phone: string): string {
  const digits = phone.replace(/\D/g, '').slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

/**
 * Format file size in bytes to human readable.
 * Example: 1048576 -> "1.00 MB"
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${units[i]}`;
}

/**
 * Format a number with commas.
 * Example: 1234567 -> "1,234,567"
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}
