import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getEvents,
    getEventBySlug,
    createEvent,
    CreateEventPayload,
} from "../services/eventService";

export const eventKeys = {
    all: ["events"] as const,
    detail: (slug: string) => ["events", slug] as const,
};

/**
 * Hook to fetch all events.
 */
export function useEvents() {
    return useQuery({
        queryKey: eventKeys.all,
        queryFn: getEvents,
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
            queryClient.invalidateQueries({ queryKey: eventKeys.all });
        },
    });
}
