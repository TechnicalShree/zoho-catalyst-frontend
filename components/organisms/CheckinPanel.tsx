import { FormEvent } from "react";
import { InputField } from "../atoms/InputField";
import { NoticeBanner } from "../atoms/NoticeBanner";
import { PrimaryButton } from "../atoms/PrimaryButton";
import { Notice } from "../../lib/doorflow/types";

type CheckinPanelProps = {
  checkinCode: string;
  onCheckinCodeChange: (value: string) => void;
  onCheckin: (event: FormEvent<HTMLFormElement>) => void;
  checkinNotice: Notice | null;
  checkedInCount: number;
  pendingCount: number;
};

export function CheckinPanel({
  checkinCode,
  onCheckinCodeChange,
  onCheckin,
  checkinNotice,
  checkedInCount,
  pendingCount,
}: CheckinPanelProps) {
  return (
    <article className="surface-card reveal delay-3">
      <header className="mb-4 space-y-1">
        <h2 className="text-xl font-semibold text-slate-900">Check-in Desk</h2>
        <p className="text-sm text-slate-600">
          Fast code entry with duplicate check-in protection.
        </p>
      </header>

      <form className="space-y-3" onSubmit={onCheckin}>
        <InputField
          label="Ticket code"
          className="text-lg tracking-[0.2em]"
          value={checkinCode}
          onChange={(event) => onCheckinCodeChange(event.target.value.toUpperCase())}
          placeholder="FOUN-7R4K"
        />
        <PrimaryButton className="w-full" type="submit">
          Check in attendee
        </PrimaryButton>
      </form>

      <NoticeBanner notice={checkinNotice} className="mt-3" />

      <div className="mt-4 grid grid-cols-2 gap-2 text-center">
        <div className="rounded-xl bg-slate-100 px-2 py-3">
          <p className="text-xs text-slate-500">Checked in</p>
          <p className="text-xl font-semibold text-slate-900">{checkedInCount}</p>
        </div>
        <div className="rounded-xl bg-slate-100 px-2 py-3">
          <p className="text-xs text-slate-500">Pending</p>
          <p className="text-xl font-semibold text-slate-900">{pendingCount}</p>
        </div>
      </div>
    </article>
  );
}
