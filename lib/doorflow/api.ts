type EventApiPayload = {
  id: string;
  name: string;
  slug: string;
  startsAt: string;
  venue: string;
  capacity: number;
  createdAt: string;
};

export type CreateEventPayload = {
  tenant: {
    id: string;
    name: string;
    shortCode: string;
    city: string;
  };
  event: EventApiPayload;
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

export async function createEvent(payload: CreateEventPayload): Promise<void> {
  const response = await fetch("/api/create-event", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
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
