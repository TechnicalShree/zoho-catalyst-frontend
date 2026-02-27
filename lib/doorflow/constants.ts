import { NoticeTone, TenantRecord } from "./types";

export const INITIAL_TENANTS: TenantRecord[] = [
  {
    id: "org-nova",
    name: "Nova Events Collective",
    shortCode: "NOVA",
    city: "Austin",
    events: [
      {
        id: "evt-nova-1",
        slug: "founder-breakfast",
        name: "Founder Breakfast Meetup",
        startsAt: "2026-03-06T09:30",
        venue: "Lakeside Hall, Austin",
        capacity: 180,
        createdAt: "2026-02-20T10:12:00.000Z",
        attendees: [
          {
            id: "att-nova-1",
            fullName: "Alex Rivera",
            email: "alex.rivera@example.com",
            ticketCode: "FOUN-7R4K",
            status: "registered",
            createdAt: "2026-02-22T14:00:00.000Z",
          },
          {
            id: "att-nova-2",
            fullName: "Dina Park",
            email: "dina.park@example.com",
            ticketCode: "FOUN-9M1D",
            status: "registered",
            createdAt: "2026-02-23T10:15:00.000Z",
          },
          {
            id: "att-nova-3",
            fullName: "Marco Allen",
            email: "marco.allen@example.com",
            ticketCode: "FOUN-P4B2",
            status: "registered",
            createdAt: "2026-02-24T09:45:00.000Z",
          },
        ],
        checkins: [
          {
            id: "chk-nova-1",
            attendeeId: "att-nova-1",
            checkedInAt: "2026-03-06T09:05:00.000Z",
            checkedInBy: "Maya (Gate A)",
            source: "code",
          },
        ],
      },
      {
        id: "evt-nova-2",
        slug: "ops-workshop",
        name: "Ops Design Workshop",
        startsAt: "2026-03-08T14:00",
        venue: "Warehouse Studio",
        capacity: 80,
        createdAt: "2026-02-19T08:40:00.000Z",
        attendees: [],
        checkins: [],
      },
    ],
  },
  {
    id: "org-campus",
    name: "Campus Circle",
    shortCode: "CAMP",
    city: "San Jose",
    events: [
      {
        id: "evt-campus-1",
        slug: "career-day",
        name: "Career Day 2026",
        startsAt: "2026-03-10T11:00",
        venue: "Innovation Block B",
        capacity: 220,
        createdAt: "2026-02-21T11:20:00.000Z",
        attendees: [
          {
            id: "att-campus-1",
            fullName: "Taylor Kim",
            email: "taylor.kim@example.com",
            ticketCode: "CARE-K2P7",
            status: "registered",
            createdAt: "2026-02-24T16:22:00.000Z",
          },
        ],
        checkins: [],
      },
    ],
  },
];

export const NOTICE_STYLES: Record<NoticeTone, string> = {
  success: "bg-emerald-50 text-emerald-800 border-emerald-200",
  warning: "bg-amber-50 text-amber-800 border-amber-200",
  error: "bg-rose-50 text-rose-800 border-rose-200",
};

export const DEFAULT_EVENT_STARTS_AT = "2026-03-12T10:00";
