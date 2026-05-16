export const formatCurrency = (amount, currency = 'INR') =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency }).format(amount ?? 0);

export const newIdempotencyKey = () => crypto.randomUUID();
