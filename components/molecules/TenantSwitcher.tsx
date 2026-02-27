import { TenantRecord } from "../../lib/doorflow/types";

type TenantSwitcherProps = {
  tenants: TenantRecord[];
  activeTenantId: string;
  onTenantChange: (tenantId: string) => void;
};

export function TenantSwitcher({
  tenants,
  activeTenantId,
  onTenantChange,
}: TenantSwitcherProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {tenants.map((tenant) => {
        const isActive = tenant.id === activeTenantId;
        return (
          <button
            key={tenant.id}
            type="button"
            onClick={() => onTenantChange(tenant.id)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
              isActive
                ? "border-slate-900 bg-slate-900 text-white"
                : "border-slate-200 bg-white text-slate-700 hover:border-slate-400"
            }`}
          >
            {tenant.name} ({tenant.city})
          </button>
        );
      })}
    </div>
  );
}
