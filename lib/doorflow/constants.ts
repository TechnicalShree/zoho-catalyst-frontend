import { NoticeTone, TenantRecord } from "./types";

export const INITIAL_TENANTS: TenantRecord[] = [
  {
    id: "org-nova",
    name: "Nova Events Collective",
    shortCode: "NOVA",
    city: "Austin",
    events: [],
  },
  {
    id: "org-campus",
    name: "Campus Circle",
    shortCode: "CAMP",
    city: "San Jose",
    events: [],
  },
];

export const NOTICE_STYLES: Record<NoticeTone, string> = {
  success: "bg-emerald-50 text-emerald-800 border-emerald-200",
  warning: "bg-amber-50 text-amber-800 border-amber-200",
  error: "bg-rose-50 text-rose-800 border-rose-200",
};

export const DEFAULT_EVENT_STARTS_AT = "2026-03-12T10:00";
