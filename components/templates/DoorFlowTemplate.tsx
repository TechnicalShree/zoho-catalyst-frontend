"use client";

import { FormEvent, useMemo, useState, useEffect } from "react";
import { OrganizerPanel } from "../organisms/OrganizerPanel";
import { RegistrationPanel } from "../organisms/RegistrationPanel";
import { CheckinPanel } from "../organisms/CheckinPanel";
import { DEFAULT_EVENT_STARTS_AT, INITIAL_TENANTS } from "../../lib/doorflow/constants";
import { createEvent as createEventApi, getEvents as getEventsApi } from "../../services/eventService";
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

type DoorFlowTemplateProps = {
  defaultScreen?: "organizer" | "registration" | "checkin";
  roleName?: string;
  hideTabs?: boolean;
};

export default function DoorFlowTemplate({
  defaultScreen = "organizer",
  roleName,
  hideTabs = false,
}: DoorFlowTemplateProps = {}) {
  const [tenants, setTenants] = useState<TenantRecord[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = window.localStorage.getItem("zoho_tenants_data");
        if (stored) return JSON.parse(stored);
      } catch (err) { }
    }
    return INITIAL_TENANTS;
  });

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Persist attendees/checkins locally since we split into different routes
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("zoho_tenants_data", JSON.stringify(tenants));
    }
  }, [tenants]);

  const [activeTenantId, setActiveTenantId] = useState(INITIAL_TENANTS[0].id);
  const [selectedEventId, setSelectedEventId] = useState(
    INITIAL_TENANTS[0].events[0]?.id ?? "",
  );
  const [activeScreen, setActiveScreen] = useState<"organizer" | "registration" | "checkin">(defaultScreen);

  const [eventDraft, setEventDraft] = useState<EventDraft>({
    name: "",
    slug: "",
    startsAt: DEFAULT_EVENT_STARTS_AT,
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

  useEffect(() => {
    let active = true;
    async function fetchServerEvents() {
      try {
        const response = await getEventsApi();
        if (!active) return;

        const rawList = response.data || [];
        const validEvents = rawList.map((row: any) => {
          const ev = row.Events || row;
          return {
            id: String(ev.ROWID || ev.id || createId("evt")),
            slug: String(ev.slug || ""),
            name: String(ev.name || "Untitled Event"),
            startsAt: String(ev.starts_at || DEFAULT_EVENT_STARTS_AT),
            venue: String(ev.venue || "TBD"),
            capacity: Number(ev.capacity) || 120,
            createdAt: String(ev.created_at || ev.CREATEDTIME || new Date().toISOString()),
            attendees: [],
            checkins: [],
            _tenantId: String(ev.created_by_user_id || INITIAL_TENANTS[0].id)
          };
        });

        setTenants((currentTenants) => {
          return currentTenants.map((tenant) => {
            // Find events belonging to this tenant
            const remoteForTenant = validEvents.filter(e => e._tenantId === tenant.id);
            const remoteEventsMapped = remoteForTenant.map(e => {
              const { _tenantId, ...rest } = e;
              return rest as EventRecord;
            });

            // For now, if the server returns events for this tenant, we append them 
            // to existing local / template events, avoiding duplicates by ID or slug if we want,
            // or we just replace the tenant's events entirely.
            // Replacing entirely makes it 100% server-driven. Let's merge server + initial data 
            // so the initial demo data stays if server has nothing, otherwise show server items + initial.
            // Best is to use server events, and fallback to initial if none, or mix them.
            // Let's mix them but deduplicate by ID:
            const merged = [...remoteEventsMapped];
            const existingIds = new Set(remoteEventsMapped.map(x => x.id));
            const existingSlugs = new Set(remoteEventsMapped.map(x => x.slug));

            for (const initialEv of tenant.events) {
              if (!existingIds.has(initialEv.id) && !existingSlugs.has(initialEv.slug)) {
                merged.push(initialEv);
              }
            }

            // sort by newest first
            merged.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

            return {
              ...tenant,
              events: merged
            };
          });
        });
      } catch (err) {
        console.error("Failed to load events", err);
      }
    }
    fetchServerEvents();
    return () => { active = false; };
  }, []);

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

  function toCatalystStartsAt(value: string): string {
    if (!value) {
      return value;
    }

    if (/[zZ]$|[+-]\d{2}:\d{2}$/.test(value)) {
      return value;
    }

    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) {
      return `${value}:00Z`;
    }

    return value;
  }

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
    if (!eventDraft.name.trim() || !slug) {
      setEventNotice({
        tone: "error",
        message: "Name and a valid slug are required.",
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
      venue: activeTenant.city,
      capacity,
      createdAt: new Date().toISOString(),
      attendees: [],
      checkins: [],
    };

    setIsCreatingEvent(true);
    try {
      await createEventApi({
        slug: nextEvent.slug,
        name: nextEvent.name,
        starts_at: toCatalystStartsAt(nextEvent.startsAt),
        capacity: nextEvent.capacity,
        banner_object_url: "https://example.com/banner.jpg",
        created_by_user_id: activeTenant.id,
        created_at: nextEvent.createdAt,
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

  if (!isMounted) {
    return null;
  }

  return (
    <main className="relative mx-auto flex min-h-screen w-full max-w-[1280px] flex-col gap-6 px-4 py-6 md:px-8 md:py-10">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="orb orb-one" />
        <div className="orb orb-two" />
      </div>



      {!hideTabs && (
        <div className="mx-auto flex w-full max-w-sm gap-2 rounded-2xl bg-slate-100/80 p-1.5 backdrop-blur-md border border-slate-200 shadow-sm mt-2">
          {(["organizer", "registration", "checkin"] as const).map((screen) => (
            <button
              key={screen}
              onClick={() => setActiveScreen(screen)}
              className={`flex-1 rounded-xl px-3 py-2 text-sm font-semibold capitalize transition ${activeScreen === screen
                ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200/50"
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-200/50"
                }`}
            >
              {screen}
            </button>
          ))}
        </div>
      )}

      {activeScreen === "organizer" && (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <section className="mx-auto w-full max-w-3xl">
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
          </section>
        </div>
      )}

      {activeScreen === "registration" && (
        <section className="mx-auto w-full max-w-md animate-in fade-in slide-in-from-bottom-2 duration-300">
          <RegistrationPanel
            selectedEvent={selectedEvent}
            registrationDraft={registrationDraft}
            onRegistrationDraftChange={handleRegistrationDraftChange}
            onRegisterAttendee={handleRegisterAttendee}
            registrationNotice={registrationNotice}
          />
        </section>
      )}

      {activeScreen === "checkin" && (
        <section className="mx-auto w-full max-w-md animate-in fade-in slide-in-from-bottom-2 duration-300">
          <CheckinPanel
            checkinCode={checkinCode}
            onCheckinCodeChange={setCheckinCode}
            onCheckin={handleCheckin}
            checkinNotice={checkinNotice}
            checkedInCount={checkedInCount}
            pendingCount={pendingCount}
          />
        </section>
      )}
    </main>
  );
}
