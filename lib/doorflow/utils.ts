export function formatDateTime(value: string): string {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "TBD";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(parsed);
}

export function createId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

export function normalizeSlug(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

function buildTicketCode(slug: string): string {
  const base = slug
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 4)
    .padEnd(4, "X");
  const randomChunk = Math.random().toString(36).toUpperCase().slice(2, 6);
  return `${base}-${randomChunk}`;
}

export function createUniqueTicketCode(
  slug: string,
  existingCodes: Set<string>,
): string {
  let nextCode = buildTicketCode(slug);

  while (existingCodes.has(nextCode)) {
    nextCode = buildTicketCode(slug);
  }

  return nextCode;
}
