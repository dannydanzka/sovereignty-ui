/**
 * Array utility functions
 */

export const unique = <T>(arr: T[]): T[] => [...new Set(arr)];

export const uniqueBy = <T>(arr: T[], key: keyof T): T[] => {
  const seen = new Set();
  return arr.filter((item) => {
    const val = item[key];
    if (seen.has(val)) return false;
    seen.add(val);
    return true;
  });
};

export const groupBy = <T>(arr: T[], key: keyof T): Record<string, T[]> =>
  arr.reduce<Record<string, T[]>>((groups, item) => {
    const groupKey = String(item[key]);
    const group = groups[groupKey] ?? [];
    group.push(item);
    groups[groupKey] = group;
    return groups;
  }, {});

export const sortBy = <T>(arr: T[], key: keyof T, direction: 'asc' | 'desc' = 'asc'): T[] =>
  [...arr].sort((a, b) => {
    const valA = a[key];
    const valB = b[key];
    if (valA < valB) return direction === 'asc' ? -1 : 1;
    if (valA > valB) return direction === 'asc' ? 1 : -1;
    return 0;
  });

export const chunk = <T>(arr: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
};
