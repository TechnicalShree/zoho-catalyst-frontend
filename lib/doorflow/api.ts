export type CreateEventPayload = {
  name: string;
  starts_at: string;
};

function buildCreateEventUrl(baseUrl: string): string {
  return `${baseUrl.replace(/\/+$/, "")}/create_event`;
}

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
  const baseUrl = process.env.NEXT_PUBLIC_CATALYST_BASE_URL;
  const endpoint = baseUrl ? buildCreateEventUrl(baseUrl) : "/api/create-event";

  const response = await fetch(endpoint, {
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
