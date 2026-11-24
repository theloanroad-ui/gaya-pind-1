export function formatNfDate(dateStr?: string): string {
  if (!dateStr) return 'Nov 11, 2026';
  const parsed = new Date(dateStr);
  if (Number.isNaN(parsed.getTime())) return dateStr;
  return parsed.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function normalizeCatName(cat?: string): string {
  if (!cat) return 'News';
  if (cat.toLowerCase() === 'world') return 'World';
  if (cat.toLowerCase() === 'career') return 'Career';
  return cat;
}

