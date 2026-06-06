const CATEGORY_TERMS: Record<string, string[]> = {
  Apartment: ['apartment', 'apartments', 'flat', 'flats'],
  Villa: ['villa', 'villas'],
  Penthouse: ['penthouse', 'penthouses'],
  Townhouse: ['townhouse', 'townhouses', 'town house', 'town houses'],
  House: ['house', 'houses', 'home', 'homes', 'mansion', 'mansions'],
  Land: ['land', 'plot', 'plots'],
  Office: ['office', 'offices'],
  Retail: ['retail', 'shop', 'shops', 'showroom', 'showrooms'],
  Warehouse: ['warehouse', 'warehouses', 'industrial'],
  Rural: ['rural', 'farm', 'acreage'],
};

const CATEGORY_ALIASES = Object.entries(CATEGORY_TERMS).flatMap(([category, terms]) =>
  terms.map((term) => [term, category] as const),
);

function cleanToken(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function editDistance(left: string, right: string) {
  const matrix = Array.from({ length: left.length + 1 }, (_, row) =>
    Array.from({ length: right.length + 1 }, (_, col) => (row === 0 ? col : col === 0 ? row : 0)),
  );

  for (let row = 1; row <= left.length; row += 1) {
    for (let col = 1; col <= right.length; col += 1) {
      const cost = left[row - 1] === right[col - 1] ? 0 : 1;
      matrix[row][col] = Math.min(
        matrix[row - 1][col] + 1,
        matrix[row][col - 1] + 1,
        matrix[row - 1][col - 1] + cost,
      );
    }
  }

  return matrix[left.length][right.length];
}

export function normalizeCategory(value?: string | null) {
  const cleaned = cleanToken(value || '');
  if (!cleaned || cleaned === 'any') return undefined;
  const exact = Object.keys(CATEGORY_TERMS).find((category) => cleanToken(category) === cleaned);
  if (exact) return exact;
  return CATEGORY_ALIASES.find(([term]) => cleanToken(term) === cleaned)?.[1] || value?.trim();
}

export function cleanQueryForCategory(query?: string | null, category?: string | null) {
  const trimmed = (query || '').trim();
  const categories = (category || '').split(',').map(normalizeCategory).filter(Boolean) as string[];
  if (!trimmed || categories.length === 0) return trimmed || undefined;

  const tokens = trimmed.split(/\s+/).map(cleanToken).filter(Boolean);
  if (tokens.length === 0 || tokens.length > 2) return trimmed;

  const terms = categories.flatMap((selectedCategory) => CATEGORY_TERMS[selectedCategory] || [selectedCategory]);
  const isOnlyCategoryText = tokens.every((token) =>
    terms.some((term) => {
      const normalizedTerm = cleanToken(term);
      const tolerance = normalizedTerm.length >= 8 ? 2 : 1;
      return token === normalizedTerm || editDistance(token, normalizedTerm) <= tolerance;
    }),
  );

  return isOnlyCategoryText ? undefined : trimmed;
}

export function matchesTemplateCategory(
  source: { category?: string | null; propertyType?: string | null; type?: string | null; title?: string | null; description?: string | null; searchableText?: string | null },
  category?: string | null,
) {
  const categories = (category || '').split(',').map(normalizeCategory).filter(Boolean) as string[];
  if (categories.length === 0) return true;

  const haystack = [source.category, source.propertyType, source.type, source.title, source.description, source.searchableText]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  return categories.some((selectedCategory) => {
    const terms = CATEGORY_TERMS[selectedCategory] || [selectedCategory];
    return terms.some((term) => haystack.includes(term.toLowerCase()));
  });
}
