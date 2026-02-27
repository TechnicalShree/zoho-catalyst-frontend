"use client";

import { FormEvent, useMemo, useState } from "react";
import { HeroSection } from "../organisms/HeroSection";
import { OrganizerPanel } from "../organisms/OrganizerPanel";
import { RegistrationPanel } from "../organisms/RegistrationPanel";
import { CheckinPanel } from "../organisms/CheckinPanel";
import { RosterSection } from "../organisms/RosterSection";
import { DEFAULT_EVENT_STARTS_AT, INITIAL_TENANTS } from "../../lib/doorflow/constants";
import { createEvent as createEventApi } from "../../lib/doorflow/api";
import {
  CheckinRecord,
  EventDraft,
  EventRecord,
  Notice,
  RegistrationDraft,
  TenantRecord,
} from "../../lib/doorflow/types";
import {
  createId,
  createUniqueTicketCode,
  normalizeSlug,
} from "../../lib/doorflow/utils";

export default function DoorFlowTemplate() {
  const [tenants, setTenants] = useState<TenantRecord[]>(INITIAL_TENANTS);
  const [activeTenantId, setActiveTenantId] = useState(INITIAL_TENANTS[0].id);
  const [selectedEventId, setSelectedEventId] = useState(
    INITIAL_TENANTS[0].events[0]?.id ?? "",
  );

  const [eventDraft, setEventDraft] = useState<EventDraft>({
    name: "",
    slug: "",
    startsAt: DEFAULT_EVENT_STARTS_AT,
    venue: "",
    capacity: 120,
  });
  const [registrationDraft, setRegistrationDraft] = useState<RegistrationDraft>({
    fullName: "",
    email: "",
  });
  const [attendeeSearch, setAttendeeSearch] = useState("");
  const [checkinCode, setCheckinCode] = useState("");
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);

  const [eventNotice, setEventNotice] = useState<Notice | null>(null);
  const [registrationNotice, setRegistrationNotice] = useState<Notice | null>(
    null,
  );
  const [checkinNotice, setCheckinNotice] = useState<Notice | null>(null);

  const activeTenant = useMemo(
    () => tenants.find((tenant) => tenant.id === activeTenantId),
    [tenants, activeTenantId],
  );
  const effectiveSelectedEventId = useMemo(() => {
    if (!activeTenant) {
      return "";
    }

    const hasSelection = activeTenant.events.some(
      (eventItem) => eventItem.id === selectedEventId,
    );
    return hasSelection ? selectedEventId : activeTenant.events[0]?.id ?? "";
  }, [activeTenant, selectedEventId]);
  const selectedEvent = useMemo(
    () =>
      activeTenant?.events.find((event) => event.id === effectiveSelectedEventId),
    [activeTenant, effectiveSelectedEventId],
  );

  const checkinLookup = useMemo(() => {
    const map = new Map<string, CheckinRecord>();
    selectedEvent?.checkins.forEach((entry) => {
      map.set(entry.attendeeId, entry);
    });
    return map;
  }, [selectedEvent]);

  const filteredAttendees = useMemo(() => {
    if (!selectedEvent) {
      return [];
    }

    const query = attendeeSearch.trim().toLowerCase();
    if (!query) {
      return selectedEvent.attendees;
    }

    return selectedEvent.attendees.filter(
      (attendee) =>
        attendee.fullName.toLowerCase().includes(query) ||
        attendee.email.toLowerCase().includes(query) ||
        attendee.ticketCode.toLowerCase().includes(query),
    );
  }, [selectedEvent, attendeeSearch]);

  const totalAttendees = selectedEvent?.attendees.length ?? 0;
  const checkedInCount = selectedEvent
    ? new Set(selectedEvent.checkins.map((entry) => entry.attendeeId)).size
    : 0;
  const pendingCount = Math.max(totalAttendees - checkedInCount, 0);
  const occupancy = selectedEvent?.capacity
    ? Math.round((checkedInCount / selectedEvent.capacity) * 100)
    : 0;
  const totalEventsForTenant = activeTenant?.events.length ?? 0;

  function handleTenantChange(tenantId: string) {
    setActiveTenantId(tenantId);
    setEventNotice(null);
    setRegistrationNotice(null);
    setCheckinNotice(null);
  }

  function handleEventDraftChange(
    field: keyof EventDraft,
    value: EventDraft[keyof EventDraft],
  ) {
    setEventDraft((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleRegistrationDraftChange(
    field: keyof RegistrationDraft,
    value: string,
  ) {
    setRegistrationDraft((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleCreateEvent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!activeTenant) {
      return;
    }

    const slug = normalizeSlug(eventDraft.slug || eventDraft.name);
    if (!eventDraft.name.trim() || !slug || !eventDraft.venue.trim()) {
      setEventNotice({
        tone: "error",
        message: "Name, venue, and a valid slug are required.",
      });
      return;
    }

    if (!eventDraft.startsAt) {
      setEventNotice({
        tone: "error",
        message: "Pick a start time to continue.",
      });
      return;
    }

    const slugExists = activeTenant.events.some((item) => item.slug === slug);
    if (slugExists) {
      setEventNotice({
        tone: "warning",
        message: "Slug already used in this tenant. Try a unique one.",
      });
      return;
    }

    const capacity = Number.isFinite(eventDraft.capacity)
      ? Math.max(1, Math.floor(eventDraft.capacity))
      : 1;
    const nextEvent: EventRecord = {
      id: createId("evt"),
      slug,
      name: eventDraft.name.trim(),
      startsAt: eventDraft.startsAt,
      venue: eventDraft.venue.trim(),
      capacity,
      createdAt: new Date().toISOString(),
      attendees: [],
      checkins: [],
    };

    setIsCreatingEvent(true);
    try {
      await createEventApi({
        tenant: {
          id: activeTenant.id,
          name: activeTenant.name,
          shortCode: activeTenant.shortCode,
          city: activeTenant.city,
        },
        event: {
          id: nextEvent.id,
          name: nextEvent.name,
          slug: nextEvent.slug,
          startsAt: nextEvent.startsAt,
          venue: nextEvent.venue,
          capacity: nextEvent.capacity,
          createdAt: nextEvent.createdAt,
        },
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to create event through Catalyst API.";
      setEventNotice({
        tone: "error",
        message,
      });
      return;
    } finally {
      setIsCreatingEvent(false);
    }

    setTenants((current) =>
      current.map((tenant) =>
        tenant.id === activeTenantId
          ? { ...tenant, events: [nextEvent, ...tenant.events] }
          : tenant,
      ),
    );
    setSelectedEventId(nextEvent.id);
    setEventDraft({
      name: "",
      slug: "",
      startsAt: DEFAULT_EVENT_STARTS_AT,
      venue: "",
      capacity: 120,
    });
    setEventNotice({
      tone: "success",
      message: `Event "${nextEvent.name}" created for ${activeTenant.shortCode}.`,
    });
  }

  function handleRegisterAttendee(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!activeTenant || !selectedEvent) {
      return;
    }

    const fullName = registrationDraft.fullName.trim();
    const email = registrationDraft.email.trim().toLowerCase();
    if (!fullName || !email) {
      setRegistrationNotice({
        tone: "error",
        message: "Full name and email are required for registration.",
      });
      return;
    }

    let nextNotice: Notice = {
      tone: "error",
      message: "Unable to register attendee.",
    };

    setTenants((current) =>
      current.map((tenant) => {
        if (tenant.id !== activeTenantId) {
          return tenant;
        }

        return {
          ...tenant,
          events: tenant.events.map((eventItem) => {
            if (eventItem.id !== selectedEvent.id) {
              return eventItem;
            }

            const duplicate = eventItem.attendees.find(
              (attendee) => attendee.email.toLowerCase() === email,
            );
            if (duplicate) {
              nextNotice = {
                tone: "warning",
                message: `${duplicate.fullName} is already registered.`,
                ticketCode: duplicate.ticketCode,
              };
              return eventItem;
            }

            const existingCodes = new Set(
              eventItem.attendees.map((attendee) => attendee.ticketCode),
            );
            const ticketCode = createUniqueTicketCode(eventItem.slug, existingCodes);
            const nextAttendee = {
              id: createId("att"),
              fullName,
              email,
              ticketCode,
              status: "registered" as const,
              createdAt: new Date().toISOString(),
            };

            nextNotice = {
              tone: "success",
              message: "Registration complete. Ticket code is ready.",
              ticketCode,
            };

            return {
              ...eventItem,
              attendees: [nextAttendee, ...eventItem.attendees],
            };
          }),
        };
      }),
    );

    setRegistrationNotice(nextNotice);
    if (nextNotice.tone === "success") {
      setRegistrationDraft({
        fullName: "",
        email: "",
      });
    }
  }

  function handleCheckin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!activeTenant || !selectedEvent) {
      return;
    }

    const ticketCode = checkinCode.trim().toUpperCase();
    if (!ticketCode) {
      setCheckinNotice({
        tone: "error",
        message: "Enter a ticket code to continue.",
      });
      return;
    }

    let nextNotice: Notice = {
      tone: "error",
      message: "Ticket was not found for this event.",
    };

    setTenants((current) =>
      current.map((tenant) => {
        if (tenant.id !== activeTenantId) {
          return tenant;
        }

        return {
          ...tenant,
          events: tenant.events.map((eventItem) => {
            if (eventItem.id !== selectedEvent.id) {
              return eventItem;
            }

            const attendee = eventItem.attendees.find(
              (entry) => entry.ticketCode.toUpperCase() === ticketCode,
            );
            if (!attendee) {
              return eventItem;
            }

            const alreadyChecked = eventItem.checkins.some(
              (entry) => entry.attendeeId === attendee.id,
            );
            if (alreadyChecked) {
              nextNotice = {
                tone: "warning",
                message: `${attendee.fullName} is already checked in.`,
                ticketCode: attendee.ticketCode,
              };
              return eventItem;
            }

            const checkinEntry = {
              id: createId("chk"),
              attendeeId: attendee.id,
              checkedInAt: new Date().toISOString(),
              checkedInBy: "Front Desk",
              source: "code" as const,
            };

            nextNotice = {
              tone: "success",
              message: `${attendee.fullName} checked in successfully.`,
              ticketCode: attendee.ticketCode,
            };

            return {
              ...eventItem,
              checkins: [checkinEntry, ...eventItem.checkins],
            };
          }),
        };
      }),
    );

    setCheckinNotice(nextNotice);
    if (nextNotice.tone === "success") {
      setCheckinCode("");
    }
  }

  return (
    <main className="relative mx-auto flex min-h-screen w-full max-w-[1280px] flex-col gap-6 px-4 py-6 md:px-8 md:py-10">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="orb orb-one" />
        <div className="orb orb-two" />
      </div>

      <HeroSection
        activeTenantShortCode={activeTenant?.shortCode}
        totalEventsForTenant={totalEventsForTenant}
        checkedInCount={checkedInCount}
        occupancy={occupancy}
        tenants={tenants}
        activeTenantId={activeTenantId}
        onTenantChange={handleTenantChange}
      />

      <section className="grid gap-4 xl:grid-cols-[1.2fr_1fr_1fr]">
        <OrganizerPanel
          eventDraft={eventDraft}
          onEventDraftChange={handleEventDraftChange}
          onCreateEvent={handleCreateEvent}
          isCreatingEvent={isCreatingEvent}
          eventNotice={eventNotice}
          activeTenantShortCode={activeTenant?.shortCode}
          events={activeTenant?.events ?? []}
          selectedEventId={effectiveSelectedEventId}
          onSelectEvent={setSelectedEventId}
        />
        <RegistrationPanel
          selectedEvent={selectedEvent}
          registrationDraft={registrationDraft}
          onRegistrationDraftChange={handleRegistrationDraftChange}
          onRegisterAttendee={handleRegisterAttendee}
          registrationNotice={registrationNotice}
        />
        <CheckinPanel
          checkinCode={checkinCode}
          onCheckinCodeChange={setCheckinCode}
          onCheckin={handleCheckin}
          checkinNotice={checkinNotice}
          checkedInCount={checkedInCount}
          pendingCount={pendingCount}
        />
      </section>

      <RosterSection
        selectedEventName={selectedEvent?.name}
        attendeeSearch={attendeeSearch}
        onAttendeeSearchChange={setAttendeeSearch}
        attendees={filteredAttendees}
        checkinLookup={checkinLookup}
      />
    </main>
  );
}
