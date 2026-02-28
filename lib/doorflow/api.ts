/**
 * @deprecated – Use `services/eventService` directly.
 * This file re-exports from the centralized services layer for backwards compatibility.
 */
export {
  createEvent,
  getEvents,
  getEventBySlug,
  type CreateEventPayload,
} from "../../services/eventService";
