import api from "./api";

export type CreateEventPayload = {
    slug: string;
    name: string;
    starts_at: string;
    capacity: number;
    banner_object_url: string;
    created_by_user_id: string;
    created_at: string;
};

export type CatalystEvent = {
    ROWID: string;
    name: string;
    slug: string;
    starts_at: string;
    capacity: string;
    banner_object_url: string | null;
    created_by_user_id: string | null;
    created_at: string | null;
    venue?: string;
    CREATEDTIME: string;
    MODIFIEDTIME: string;
    CREATORID: string;
};

export type EventListResponse = {
    status: string;
    data: Array<{ Events: CatalystEvent }>;
};

/**
 * Fetch all events.
 */
export async function getEvents(): Promise<EventListResponse["data"]> {
    const { data } = await api.get<EventListResponse>("/event");
    return data.data || [];
}

/**
 * Fetch a single event by slug.
 */
export async function getEventBySlug(slug: string) {
    const { data } = await api.get(`/event/${slug}`);
    return data.data;
}

/**
 * Create a new event.
 */
export async function createEvent(payload: CreateEventPayload): Promise<void> {
    await api.post("/event", payload);
}
