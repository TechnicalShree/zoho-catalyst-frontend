"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Bell, Plus, LayoutGrid, Loader2 } from "lucide-react";
import { EventCard } from "../../components/molecules/EventCard";
import { getEvents } from "../../lib/doorflow/api";
import { EventRecord } from "../../lib/doorflow/types";

export default function EventListingPage() {
    const [events, setEvents] = useState<EventRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchEvents() {
            try {
                const res = await fetch("https://catalyst-hackathon-915650487.development.catalystserverless.com/event");
                if (!res.ok) {
                    throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
                }
                const json = await res.json();
                const data = json.data || json;

                // Assuming data is an array of EventRecord
                setEvents((Array.isArray(data) ? data : []) as EventRecord[]);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load events");
            } finally {
                setLoading(false);
            }
        }
        fetchEvents();
    }, []);

    const formatEventForCard = (rawItem: any) => {
        const event = rawItem.Events || rawItem;
        const dateString = event.starts_at || event.startsAt;
        const date = dateString ? new Date(dateString) : new Date(NaN);

        const month = Number.isNaN(date.getTime())
            ? "TBD"
            : date.toLocaleDateString("en-US", { month: "short" }).toUpperCase();
        const day = Number.isNaN(date.getTime())
            ? "--"
            : date.toLocaleDateString("en-US", { day: "2-digit" });

        const capacity = parseInt(event.capacity || "0", 10);
        // We'll mock attendees count for now if it's not present
        const currentRegistrations = event.attendees?.length || Math.floor(Math.random() * capacity * 0.8) || 0;

        return {
            month,
            day,
            title: event.name || "Untitled Event",
            status: "Active" as const,
            location: event.venue || "TBD Location",
            metricLabel: "Registration",
            metricCurrent: currentRegistrations,
            metricTotal: capacity,
            slug: event.slug || "",
        };
    };

    return (
        <div className="min-h-screen bg-white text-slate-900 pb-12">
            <div className="max-w-md mx-auto relative pt-4">
                {/* Header */}
                <header className="flex justify-between items-center px-4 mb-6">
                    <Link href="/organizer" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                        <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-white">
                            <LayoutGrid className="w-4 h-4" />
                        </div>
                        <span className="font-bold text-lg tracking-tight">RegiNexus</span>
                    </Link>
                    <div className="flex items-center gap-3">
                        <button className="p-2 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors relative">
                            <Bell className="w-5 h-5 text-slate-600" />
                        </button>
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-orange-200">
                            <img
                                src="https://api.dicebear.com/7.x/notionists/svg?seed=Felix&backgroundColor=ffd5dc"
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </header>

                <main className="px-4">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold tracking-tight">My Events</h1>
                        <Link href="/event/create" className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-4 py-2 rounded-xl transition-colors shrink-0">
                            <Plus className="w-4 h-4" strokeWidth={2.5} />
                            Create Event
                        </Link>
                    </div>



                    {/* Search Bar */}
                    <div className="relative mb-6">
                        <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Search events by name or location..."
                            className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-medium placeholder:text-slate-400 placeholder:font-normal"
                        />
                    </div>

                    {/* Event List */}
                    <div className="flex flex-col gap-4">
                        {loading ? (
                            <div className="flex justify-center items-center py-12">
                                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                            </div>
                        ) : error ? (
                            <div className="p-4 bg-red-50 text-red-600 text-sm font-semibold rounded-2xl border border-red-200">
                                {error}
                            </div>
                        ) : events.length === 0 ? (
                            <div className="p-8 text-center text-slate-500 font-medium">
                                No events found.
                            </div>
                        ) : (
                            events.map((event, idx) => {
                                const { slug, ...cardProps } = formatEventForCard(event);
                                return <EventCard key={idx} {...cardProps} href={`/event/${slug}`} />;
                            })
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
