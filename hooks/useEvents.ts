import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getEvents,
    getEventBySlug,
    createEvent,
    CreateEventPayload,
    EventListResponse,
} from "../services/eventService";

export const eventKeys = {
    all: (limit: number, offset: number, search: string) => ["events", { limit, offset, search }] as const,
    detail: (slug: string) => ["events", "detail", slug] as const,
};

/**
 * Hook to fetch paginated events with optional search.
 */
export function useEvents(limit = 10, offset = 0, search = "") {
    return useQuery<EventListResponse>({
        queryKey: eventKeys.all(limit, offset, search),
        queryFn: () => getEvents(limit, offset, search),
    });
}

/**
 * Hook to fetch a single event by slug.
 */
export function useEvent(slug: string) {
    return useQuery({
        queryKey: eventKeys.detail(slug),
        queryFn: () => getEventBySlug(slug),
        enabled: !!slug,
    });
}

/**
 * Hook to create an event.
 */
export function useCreateEvent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateEventPayload) => createEvent(payload),
        onSuccess: () => {
            // Invalidate all event list queries
            queryClient.invalidateQueries({ queryKey: ["events"] });
        },
    });
}
