import Link from "next/link";
import React from "react";
import { EventRecord } from "../../lib/doorflow/types";
import { formatDateTime } from "../../lib/doorflow/utils";

type EventListProps = {
  events: EventRecord[];
  selectedEventId: string;
  onSelectEvent: (eventId: string) => void;
};

export function EventList({
  events,
  selectedEventId,
  onSelectEvent,
}: EventListProps) {
  return (
    <div className="grid gap-2">
      {events.map((eventItem) => {
        const isCurrent = eventItem.id === selectedEventId;
        const eventCheckins = new Set(
          eventItem.checkins.map((entry) => entry.attendeeId),
        ).size;

        return (
          <div
            key={eventItem.id}
            className={`rounded-2xl border px-3 py-3 text-left transition relative flex flex-col items-start ${isCurrent
              ? "border-slate-900 bg-slate-900 text-white"
              : "border-slate-200 bg-white hover:border-slate-400"
              }`}
          >
            <button
              type="button"
              onClick={() => onSelectEvent(eventItem.id)}
              className="w-full text-left"
            >
              <p className="font-semibold">{eventItem.name}</p>
              <p className={`text-xs ${isCurrent ? "text-slate-300" : "text-slate-500"}`}>
                {formatDateTime(eventItem.startsAt)} • {eventItem.venue}
              </p>
              <p className={`mt-2 text-xs ${isCurrent ? "text-slate-200" : "text-slate-600"}`}>
                {eventItem.attendees.length} registered / {eventCheckins} checked in
              </p>
            </button>
            <Link
              href={`/event/${eventItem.slug || eventItem.id}`}
              className={`mt-3 self-end text-xs font-semibold px-3 py-1.5 rounded-lg border transition ${isCurrent
                ? "bg-slate-800 border-slate-700 text-white hover:bg-slate-700"
                : "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200"
                }`}
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              View Info &rarr;
            </Link>
          </div>
        );
      })}
    </div>
  );
}
