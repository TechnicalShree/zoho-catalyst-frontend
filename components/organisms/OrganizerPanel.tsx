import { FormEvent } from "react";
import { InputField } from "../atoms/InputField";
import { NoticeBanner } from "../atoms/NoticeBanner";
import { PrimaryButton } from "../atoms/PrimaryButton";
import { EventList } from "../molecules/EventList";
import { EventDraft, EventRecord, Notice } from "../../lib/doorflow/types";

type OrganizerPanelProps = {
  eventDraft: EventDraft;
  onEventDraftChange: (field: keyof EventDraft, value: string | number) => void;
  onCreateEvent: (event: FormEvent<HTMLFormElement>) => void | Promise<void>;
  isCreatingEvent: boolean;
  eventNotice: Notice | null;
  activeTenantShortCode?: string;
  events: EventRecord[];
  selectedEventId: string;
  onSelectEvent: (eventId: string) => void;
};

export function OrganizerPanel({
  eventDraft,
  onEventDraftChange,
  onCreateEvent,
  isCreatingEvent,
  eventNotice,
  activeTenantShortCode,
  events,
  selectedEventId,
  onSelectEvent,
}: OrganizerPanelProps) {
  return (
    <article className="surface-card reveal delay-1">
      <header className="mb-4 space-y-1">
        <h2 className="text-xl font-semibold text-slate-900">Organizer Console</h2>
        <p className="text-sm text-slate-600">
          Create events, pick one, and monitor registrations by tenant.
        </p>
      </header>

      <form className="space-y-3" onSubmit={onCreateEvent}>
        <div className="grid gap-3 md:grid-cols-2">
          <InputField
            label="Event name"
            wrapperClassName="md:col-span-2"
            value={eventDraft.name}
            onChange={(event) => onEventDraftChange("name", event.target.value)}
            placeholder="DesignOps Townhall"
            required
          />
          <InputField
            label="Public slug"
            value={eventDraft.slug}
            onChange={(event) => onEventDraftChange("slug", event.target.value)}
            placeholder="designops-townhall"
          />
          <InputField
            label="Capacity"
            type="number"
            min={1}
            value={eventDraft.capacity}
            onChange={(event) => onEventDraftChange("capacity", Number(event.target.value))}
            required
          />
          <InputField
            label="Starts at"
            type="datetime-local"
            wrapperClassName="md:col-span-2"
            value={eventDraft.startsAt}
            onChange={(event) => onEventDraftChange("startsAt", event.target.value)}
            required
          />
        </div>

        <PrimaryButton
          className="w-full sm:w-auto"
          type="submit"
          disabled={isCreatingEvent}
        >
          {isCreatingEvent ? "Creating..." : "Create event"}
        </PrimaryButton>
      </form>

      <NoticeBanner notice={eventNotice} className="mt-3" />

      <div className="mt-5 space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
          Events in {activeTenantShortCode}
        </p>
        <EventList
          events={events}
          selectedEventId={selectedEventId}
          onSelectEvent={onSelectEvent}
        />
      </div>
    </article>
  );
}
