import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="orb orb-one blur-[100px]" />
        <div className="orb orb-two blur-[100px]" />
      </div>

      <div className="w-full max-w-lg space-y-8 rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-xl backdrop-blur-xl">
        <div className="text-center">
          <p className="inline-flex items-center rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold tracking-[0.2em] text-white">
            REGINEXUS
          </p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
            Select Your Role
          </h1>
          <p className="mt-2 text-slate-500">
            Choose a role below to access your specific portal.
          </p>
        </div>

        <div className="grid gap-4">
          <Link
            href="/organizer"
            className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition-all hover:border-slate-400 hover:shadow-md"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Organizer Admin</h2>
              <p className="text-sm text-slate-500">Create events & view rosters</p>
            </div>
          </Link>

          <Link
            href="/registration"
            className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition-all hover:border-slate-400 hover:shadow-md"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Public Guest</h2>
              <p className="text-sm text-slate-500">Register for events</p>
            </div>
          </Link>

          <Link
            href="/checkin"
            className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition-all hover:border-slate-400 hover:shadow-md"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-600">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Event Staff</h2>
              <p className="text-sm text-slate-500">Check-in registered attendees</p>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}
