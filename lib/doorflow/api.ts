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
 * Creates an event by calling our own Next.js API route (`/api/create-event`),
 * which proxies the request to the Catalyst backend server-side.
 * This avoids CORS issues since the browser only talks to our own origin.
 */
export async function createEvent(payload: CreateEventPayload): Promise<void> {
  const response = await fetch("/api/event/create", {
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
