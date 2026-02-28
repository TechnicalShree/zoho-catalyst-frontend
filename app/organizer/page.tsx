import React from "react";
import Link from "next/link";
import { LayoutGrid, CalendarDays, QrCode, Users } from "lucide-react";

export default function OrganizerRoute() {
  const routes = [
    {
      title: "Manage Events",
      description: "View, create, and manage your events.",
      href: "/event",
      icon: <CalendarDays className="w-6 h-6 text-blue-600" />,
      bgColor: "bg-blue-50",
    },
    {
      title: "Check-in Desk",
      description: "Scan attendees and manage live check-ins.",
      href: "/checkin",
      icon: <QrCode className="w-6 h-6 text-emerald-600" />,
      bgColor: "bg-emerald-50",
    },
    {
      title: "Public Registration",
      description: "View the attendee registration portal.",
      href: "/registration",
      icon: <Users className="w-6 h-6 text-purple-600" />,
      bgColor: "bg-purple-50",
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-12">
      <div className="max-w-md mx-auto relative pt-4">
        {/* Header */}
        <header className="flex justify-between items-center px-4 mb-8 mt-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-sm">
              <LayoutGrid className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-slate-900">
              RegiNexus
            </span>
          </div>
          <div className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-600 shadow-sm">
            Organizer
          </div>
        </header>

        <main className="px-5">
          <h1 className="text-2xl font-bold tracking-tight mb-2 text-slate-900">
            Welcome back!
          </h1>
          <p className="text-sm text-slate-500 mb-8 font-medium">
            Select a module to continue managing your events.
          </p>

          <div className="grid grid-cols-1 gap-4">
            {routes.map((route, idx) => (
              <Link
                key={idx}
                href={route.href}
                className="group p-5 bg-white border border-slate-200 rounded-[28px] shadow-sm hover:shadow-md hover:border-blue-200 transition-all flex items-center gap-4"
              >
                <div
                  className={`w-14 h-14 rounded-[20px] flex items-center justify-center shrink-0 transition-colors ${route.bgColor} group-hover:scale-105 duration-300`}
                >
                  {route.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900 text-base mb-0.5">
                    {route.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed pr-2">
                    {route.description}
                  </p>
                </div>
                <div className="shrink-0 w-8 h-8 rounded-full border border-slate-100 flex items-center justify-center group-hover:bg-blue-50 group-hover:border-blue-100 transition-colors">
                  <span className="text-slate-400 group-hover:text-blue-600 transition-colors">
                    &rarr;
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
