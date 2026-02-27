import { InputField } from "../atoms/InputField";
import { AttendeeRecord, CheckinRecord } from "../../lib/doorflow/types";
import { formatDateTime } from "../../lib/doorflow/utils";

type RosterSectionProps = {
  selectedEventName?: string;
  attendeeSearch: string;
  onAttendeeSearchChange: (value: string) => void;
  attendees: AttendeeRecord[];
  checkinLookup: Map<string, CheckinRecord>;
};

export function RosterSection({
  selectedEventName,
  attendeeSearch,
  onAttendeeSearchChange,
  attendees,
  checkinLookup,
}: RosterSectionProps) {
  return (
    <section className="surface-card reveal delay-2">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Attendee Roster</h2>
          <p className="text-sm text-slate-600">
            Tenant-safe roster for {selectedEventName ?? "selected event"}.
          </p>
        </div>
        <InputField
          label="Search attendees"
          wrapperClassName="min-w-[220px] max-w-[320px] flex-1"
          value={attendeeSearch}
          onChange={(event) => onAttendeeSearchChange(event.target.value)}
          placeholder="Name, email, or ticket"
        />
      </div>

      <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-100 text-left text-xs uppercase tracking-[0.12em] text-slate-500">
            <tr>
              <th className="px-3 py-3">Attendee</th>
              <th className="px-3 py-3">Ticket</th>
              <th className="px-3 py-3">Status</th>
              <th className="px-3 py-3">Registered</th>
              <th className="px-3 py-3">Checked in at</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {attendees.map((attendee) => {
              const checkin = checkinLookup.get(attendee.id);
              return (
                <tr key={attendee.id}>
                  <td className="px-3 py-3">
                    <p className="font-medium text-slate-900">{attendee.fullName}</p>
                    <p className="text-xs text-slate-500">{attendee.email}</p>
                  </td>
                  <td className="px-3 py-3 font-mono font-semibold text-slate-700">
                    {attendee.ticketCode}
                  </td>
                  <td className="px-3 py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                        checkin
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {checkin ? "Checked in" : "Registered"}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-slate-600">
                    {formatDateTime(attendee.createdAt)}
                  </td>
                  <td className="px-3 py-3 text-slate-600">
                    {checkin ? formatDateTime(checkin.checkedInAt) : "-"}
                  </td>
                </tr>
              );
            })}
            {attendees.length === 0 ? (
              <tr>
                <td className="px-3 py-5 text-center text-sm text-slate-500" colSpan={5}>
                  No attendees match the current filter.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}
