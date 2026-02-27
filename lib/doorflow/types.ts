export type CheckinSource = "search" | "code" | "scan";
export type NoticeTone = "success" | "warning" | "error";

export type CheckinRecord = {
  id: string;
  attendeeId: string;
  checkedInAt: string;
  checkedInBy: string;
  source: CheckinSource;
};

export type AttendeeRecord = {
  id: string;
  fullName: string;
  email: string;
  ticketCode: string;
  status: "registered" | "cancelled";
  createdAt: string;
};

export type EventRecord = {
  id: string;
  slug: string;
  name: string;
  startsAt: string;
  venue: string;
  capacity: number;
  attendees: AttendeeRecord[];
  checkins: CheckinRecord[];
  createdAt: string;
};

export type TenantRecord = {
  id: string;
  name: string;
  shortCode: string;
  city: string;
  events: EventRecord[];
};

export type Notice = {
  tone: NoticeTone;
  message: string;
  ticketCode?: string;
};

export type EventDraft = {
  name: string;
  slug: string;
  startsAt: string;
  capacity: number;
};

export type RegistrationDraft = {
  fullName: string;
  email: string;
};
