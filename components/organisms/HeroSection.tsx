import { MetricCard } from "../atoms/MetricCard";
import { TenantSwitcher } from "../molecules/TenantSwitcher";
import { TenantRecord } from "../../lib/doorflow/types";

type HeroSectionProps = {
  activeTenantShortCode?: string;
  totalEventsForTenant: number;
  checkedInCount: number;
  occupancy: number;
  tenants: TenantRecord[];
  activeTenantId: string;
  onTenantChange: (tenantId: string) => void;
};

export function HeroSection({
  activeTenantShortCode,
  totalEventsForTenant,
  checkedInCount,
  occupancy,
  tenants,
  activeTenantId,
  onTenantChange,
}: HeroSectionProps) {
  return (
    <section className="surface-card reveal">
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="inline-flex items-center rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold tracking-[0.2em] text-white">
              DOORFLOW FRONTEND
            </p>
            <h1 className="text-balance text-3xl font-semibold leading-tight text-slate-900 md:text-4xl">
              Event registration and check-in that feels instant.
            </h1>
            <p className="max-w-2xl text-sm text-slate-600 md:text-base">
              Frontend-only multi-tenant demo for Zoho Catalyst: organizer
              console, public registration, and fast check-in in one UX flow.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
            <span className="pulse-dot" />
            Live demo mode
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Active tenant" value={activeTenantShortCode ?? "NA"} />
          <MetricCard label="Events" value={totalEventsForTenant} />
          <MetricCard label="Checked in" value={checkedInCount} />
          <MetricCard
            label="Occupancy"
            value={`${Number.isFinite(occupancy) ? occupancy : 0}%`}
          />
        </div>

        <TenantSwitcher
          tenants={tenants}
          activeTenantId={activeTenantId}
          onTenantChange={onTenantChange}
        />
      </div>
    </section>
  );
}
