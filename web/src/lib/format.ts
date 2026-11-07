export const initials = (name: string) =>
  name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

export const pct = (n: number, d: number) => (d === 0 ? '0%' : `${((n / d) * 100).toFixed(1)}%`);

export const compact = (n: number) =>
  new Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(n);

export const uid = () => Math.random().toString(36).slice(2, 9);
