export type CreateEventPayload = {
  slug: string;
  name: string;
  starts_at: string;
  capacity: number;
  banner_object_url: string;
  created_by_user_id: string;
  created_at: string;
};

function getErrorMessage(value: unknown): string | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const message = (value as { message?: unknown }).message;
  if (typeof message === "string" && message.trim()) {
    return message;
  }

  return null;
}

/**
 * All requests to `/api/*` are rewritten by Next.js to the Catalyst backend.
 * e.g. POST /api/event → POST https://catalyst-...com/event
 *      GET  /api/event → GET  https://catalyst-...com/event
 * This avoids CORS issues since the browser only talks to our own origin.
 */

/**
 * Creates an event via POST /api/event.
 */
export async function createEvent(payload: CreateEventPayload): Promise<void> {
  const response = await fetch("/api/event", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  let body: unknown = null;
  try {
    body = (await response.json()) as unknown;
  } catch {
    body = null;
  }

  if (!response.ok) {
    const message =
      getErrorMessage(body) ?? "Unable to create event through Catalyst API.";
    throw new Error(message);
  }
}

/**
 * Fetches the list of all events via GET /api/event.
 */
export async function getEvents(): Promise<unknown[]> {
  const response = await fetch("/api/event", {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  let body: unknown = null;
  try {
    body = (await response.json()) as unknown;
  } catch {
    body = null;
  }

  if (!response.ok) {
    const message =
      getErrorMessage(body) ?? "Unable to fetch events from Catalyst API.";
    throw new Error(message);
  }

  // Return the body as an array; adjust based on actual Catalyst response shape
  if (Array.isArray(body)) {
    return body;
  }

  // If the response is an object with a data/events array, extract it
  if (body && typeof body === "object") {
    const obj = body as Record<string, unknown>;
    if (Array.isArray(obj.data)) return obj.data;
    if (Array.isArray(obj.events)) return obj.events;
  }

  return [];
}
