export const formatCurrency = (amount: number | string | undefined, currency = 'USD') => {
  const num = typeof amount === 'string' ? Number(String(amount).replace(/,/g, '')) : Number(amount || 0);
  if (!Number.isFinite(num)) return '-';
  return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(num);
};

export const parseNumber = (value: unknown): number => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = Number(value.replace(/,/g, ''));
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
};
