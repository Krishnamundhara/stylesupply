/** Normalises a custom-colour string into a URL slug. */
export function customColourSlug(name: string): string {
  return name.toLowerCase().trim().replace(/\s+/g, '-');
}

/** Builds the detail-page href for a card, encoding the colour into ?colour=. */
export function cardHref(productId: string, colourSlug: string | null, customColour: string | null): string {
  const slug = colourSlug ?? (customColour ? customColourSlug(customColour) : null);
  return slug ? `/products/${productId}?colour=${encodeURIComponent(slug)}` : `/products/${productId}`;
}
