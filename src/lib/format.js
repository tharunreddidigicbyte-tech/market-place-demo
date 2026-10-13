/**
 * Format a number as Indian Rupees (INR)
 */
export const formatINR = (amount, compact = false) => {
  if (compact) {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)}Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)}L`;
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format a date string to human-readable format
 */
export const formatDate = (dateStr, options = {}) => {
  const date = new Date(dateStr);
  const defaults = { day: '2-digit', month: 'short', year: 'numeric' };
  return date.toLocaleDateString('en-IN', { ...defaults, ...options });
};

/**
 * Format date to short form: DD MMM
 */
export const formatDateShort = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
};

/**
 * Format a percentage value
 */
export const formatPercent = (value, decimals = 2) => {
  return `${Number(value).toFixed(decimals)}%`;
};

/**
 * Calculate EMI using standard formula
 * P = principal, R = monthly rate (annual/12), N = tenure in months
 */
export const calculateEMI = (principal, annualRate, tenureMonths) => {
  const r = annualRate / 12 / 100;
  if (r === 0) return principal / tenureMonths;
  const emi = (principal * r * Math.pow(1 + r, tenureMonths)) / (Math.pow(1 + r, tenureMonths) - 1);
  return Math.round(emi);
};

/**
 * Generate full EMI schedule
 */
export const generateEmiSchedule = (principal, annualRate, tenureMonths) => {
  const emi = calculateEMI(principal, annualRate, tenureMonths);
  const r = annualRate / 12 / 100;
  let balance = principal;
  const schedule = [];
  const startDate = new Date();

  for (let i = 1; i <= tenureMonths; i++) {
    const interest = Math.round(balance * r);
    const principalPaid = Math.min(emi - interest, balance);
    balance = Math.max(0, balance - principalPaid);
    const dueDate = new Date(startDate);
    dueDate.setMonth(dueDate.getMonth() + i);
    schedule.push({
      month: i,
      emi,
      principal: principalPaid,
      interest,
      balance,
      dueDate: dueDate.toISOString().split('T')[0],
      paid: i <= 3,
    });
  }
  return schedule;
};

/**
 * Clamp a number between min and max
 */
export const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

/**
 * Get relative time string (e.g., "2 days ago")
 */
export const timeAgo = (dateStr) => {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = now - date;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (days > 30) return formatDate(dateStr);
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'Just now';
};
