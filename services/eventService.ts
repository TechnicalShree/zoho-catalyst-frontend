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
    total_count: number;
    limit: number;
    offset: number;
};

export type EventDetailResponse = {
    status: string;
    data: { Events: CatalystEvent };
};

/**
 * Fetch paginated events.
 */
export async function getEvents(
    limit = 10,
    offset = 0,
    search = ""
): Promise<EventListResponse> {
    const params: Record<string, any> = { limit, offset };
    if (search.trim()) {
        params.search = search.trim();
    }
    const { data } = await api.get<EventListResponse>("/event", { params });
    return data;
}

/**
 * Fetch a single event by slug (query param).
 */
export async function getEventBySlug(
    slug: string
): Promise<CatalystEvent> {
    const { data } = await api.get<EventDetailResponse>("/event", {
        params: { slug },
    });
    return data.data.Events;
}

/**
 * Create a new event.
 */
export async function createEvent(
    payload: CreateEventPayload
): Promise<void> {
    await api.post("/event", payload);
}
