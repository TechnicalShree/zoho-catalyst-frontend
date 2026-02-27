import { FormEvent } from "react";
import { InputField } from "../atoms/InputField";
import { NoticeBanner } from "../atoms/NoticeBanner";
import { PrimaryButton } from "../atoms/PrimaryButton";
import { EventRecord, Notice, RegistrationDraft } from "../../lib/doorflow/types";
import { formatDateTime } from "../../lib/doorflow/utils";

type RegistrationPanelProps = {
  selectedEvent?: EventRecord;
  registrationDraft: RegistrationDraft;
  onRegistrationDraftChange: (
    field: keyof RegistrationDraft,
    value: string,
  ) => void;
  onRegisterAttendee: (event: FormEvent<HTMLFormElement>) => void;
  registrationNotice: Notice | null;
};

export function RegistrationPanel({
  selectedEvent,
  registrationDraft,
  onRegistrationDraftChange,
  onRegisterAttendee,
  registrationNotice,
}: RegistrationPanelProps) {
  return (
    <article className="surface-card reveal delay-2">
      <header className="mb-4 space-y-1">
        <h2 className="text-xl font-semibold text-slate-900">Public Registration</h2>
        <p className="text-sm text-slate-600">
          Simulated anonymous page for the selected event.
        </p>
      </header>

      {selectedEvent ? (
        <div className="mb-4 rounded-2xl border border-slate-200 bg-slate-50 p-3">
          <p className="text-sm font-semibold text-slate-800">{selectedEvent.name}</p>
          <p className="text-xs text-slate-600">/public/e/{selectedEvent.slug}</p>
          <p className="mt-2 text-xs text-slate-500">
            {formatDateTime(selectedEvent.startsAt)} • {selectedEvent.venue}
          </p>
        </div>
      ) : null}

      <form className="space-y-3" onSubmit={onRegisterAttendee}>
        <InputField
          label="Full name"
          value={registrationDraft.fullName}
          onChange={(event) =>
            onRegistrationDraftChange("fullName", event.target.value)
          }
          placeholder="Jordan Lee"
          required
        />
        <InputField
          label="Email"
          type="email"
          value={registrationDraft.email}
          onChange={(event) => onRegistrationDraftChange("email", event.target.value)}
          placeholder="jordan@example.com"
          required
        />

        <PrimaryButton className="w-full" type="submit">
          Register attendee
        </PrimaryButton>
      </form>

      <NoticeBanner notice={registrationNotice} className="mt-3" />
    </article>
  );
}
