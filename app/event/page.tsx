"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Bell, Plus, LayoutGrid, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { EventCard } from "../../components/molecules/EventCard";
import { useEvents } from "../../hooks/useEvents";

const PAGE_SIZE = 10;

export default function EventListingPage() {
    const [page, setPage] = useState(0);
    const [search, setSearch] = useState("");
    const offset = page * PAGE_SIZE;

    const { data: response, isLoading: loading, error } = useEvents(PAGE_SIZE, offset, search);
    const events = response?.data || [];
    const totalCount = response?.total_count || 0;
    const totalPages = Math.ceil(totalCount / PAGE_SIZE);

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
                    <div className="relative mb-5">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
                            placeholder="Search events by name or location..."
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-medium placeholder:text-slate-400 placeholder:font-normal"
                        />
                    </div>

                    {/* Event List */}
                    <div className="flex flex-col gap-2.5">
                        {loading ? (
                            <div className="flex justify-center items-center py-12">
                                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                            </div>
                        ) : error ? (
                            <div className="p-4 bg-red-50 text-red-600 text-sm font-semibold rounded-2xl border border-red-200">
                                {error?.message || "Failed to load events"}
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

                    {/* Pagination */}
                    {!loading && totalPages > 1 && (
                        <div className="flex items-center justify-between mt-6 px-1">
                            <button
                                onClick={() => setPage((p) => Math.max(0, p - 1))}
                                disabled={page === 0}
                                className="flex items-center gap-1 text-[13px] font-semibold text-slate-600 hover:text-blue-600 disabled:text-slate-300 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                Previous
                            </button>

                            <div className="flex items-center gap-1">
                                {Array.from({ length: totalPages }, (_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setPage(i)}
                                        className={`w-7 h-7 rounded-lg text-[12px] font-bold transition-colors ${i === page
                                            ? "bg-blue-600 text-white shadow-sm"
                                            : "text-slate-500 hover:bg-slate-100"
                                            }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                                disabled={page >= totalPages - 1}
                                className="flex items-center gap-1 text-[13px] font-semibold text-slate-600 hover:text-blue-600 disabled:text-slate-300 disabled:cursor-not-allowed transition-colors"
                            >
                                Next
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
