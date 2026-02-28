"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, Calendar, CalendarDays, Users, ImagePlus } from "lucide-react";
import { createEvent } from "../../../lib/doorflow/api";
import { createId, normalizeSlug } from "../../../lib/doorflow/utils";

export default function CreateEventPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [name, setName] = useState("");
    const [venue, setVenue] = useState("");
    const [startsAt, setStartsAt] = useState("");
    const [endsAt, setEndsAt] = useState("");
    const [capacity, setCapacity] = useState("150");

    const [isPublic, setIsPublic] = useState(true);
    const [slug, setSlug] = useState("");
    const [error, setError] = useState("");

    const handleCreate = async () => {
        if (!name.trim()) {
            setError("Event Name is required");
            return;
        }

        setIsSubmitting(true);
        setError("");

        try {
            const finalSlug = slug.trim() ? normalizeSlug(slug) : normalizeSlug(name);

            await createEvent({
                slug: finalSlug,
                name: name.trim(),
                starts_at: startsAt ? new Date(startsAt).toISOString() : new Date().toISOString(),
                capacity: parseInt(capacity, 10) || 100,
                banner_object_url: "",
                created_by_user_id: "org-nova", // Mocking active tenant
                created_at: new Date().toISOString(),
            });

            router.push("/event");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to create event");
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f4f7fa] text-slate-900 pb-12 font-sans">
            <div className="max-w-md mx-auto relative relative">

                {/* Header */}
                <header className="flex justify-between items-center px-4 py-4 bg-[#f4f7fa] sticky top-0 z-10 border-b border-slate-200/50">
                    <Link href="/event" className="flex items-center text-blue-600 font-medium text-[15px] hover:text-blue-700 transition w-1/4">
                        <ChevronLeft className="w-5 h-5 -ml-1" />
                        <span>Events</span>
                    </Link>
                    <div className="flex-1 text-center font-bold text-[16px] text-slate-900 h-full flex items-center justify-center">
                        New Event
                    </div>
                    <button
                        onClick={handleCreate}
                        disabled={isSubmitting}
                        className="w-1/4 text-right text-blue-600 font-semibold text-[15px] hover:text-blue-700 transition disabled:opacity-50"
                    >
                        {isSubmitting ? "Saving..." : "Create"}
                    </button>
                </header>

                <main className="px-5 pt-6 flex flex-col gap-6">
                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm font-semibold -mb-2">
                            {error}
                        </div>
                    )}

                    {/* EVENT DETAILS */}
                    <section>
                        <h2 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">
                            Event Details
                        </h2>
                        <div className="bg-white rounded-[16px] shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                            <div className="p-3.5 pb-2.5 bg-white">
                                <label className="block text-[13px] font-bold text-slate-700 mb-0.5">Event Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Q1 Town Hall"
                                    className="w-full text-[15px] font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none placeholder:font-normal"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div className="h-px w-full bg-slate-100" />
                            <div className="p-3.5 pt-2.5 bg-white">
                                <label className="block text-[13px] font-bold text-slate-700 mb-0.5 mt-1">Venue Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Conference Room A"
                                    className="w-full text-[15px] font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none placeholder:font-normal"
                                    value={venue}
                                    onChange={(e) => setVenue(e.target.value)}
                                />
                            </div>
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium px-1 mt-2.5 leading-relaxed">
                            The name will be displayed on the check-in screen and public page.
                        </p>
                    </section>

                    {/* SCHEDULE & LOGISTICS */}
                    <section>
                        <h2 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">
                            Schedule & Logistics
                        </h2>
                        <div className="bg-white rounded-[16px] shadow-sm border border-slate-200 overflow-hidden flex flex-col">

                            <div className="flex items-center gap-3.5 p-4 border-b border-slate-100">
                                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100/50">
                                    <Calendar className="w-4 h-4 text-blue-600" />
                                </div>
                                <div className="flex-1 flex items-center justify-between">
                                    <span className="font-bold text-[15px] text-slate-800">Starts</span>
                                    {/* Mocking date input display to match screenshot perfectly for now */}
                                    <input
                                        type="datetime-local"
                                        className="w-36 text-blue-600 font-medium text-[14px] text-right focus:outline-none"
                                        value={startsAt}
                                        onChange={(e) => setStartsAt(e.target.value)}
                                    />
                                    {/* For absolute screenshot perfection if we can't use a datetime-local properly styled:
                                        <span className="text-blue-600 font-medium text-[15px]">11/15/2023, 09:00 AM</span>
                                    */}
                                </div>
                            </div>

                            <div className="flex items-center gap-3.5 p-4 border-b border-slate-100">
                                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100/50">
                                    <CalendarDays className="w-4 h-4 text-blue-600" />
                                </div>
                                <div className="flex-1 flex items-center justify-between">
                                    <span className="font-bold text-[15px] text-slate-800">Ends</span>
                                    <input
                                        type="datetime-local"
                                        className="w-36 text-slate-600 font-medium text-[14px] text-right focus:outline-none"
                                        value={endsAt}
                                        onChange={(e) => setEndsAt(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-3.5 p-4">
                                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100/50">
                                    <Users className="w-4 h-4 text-blue-600" />
                                </div>
                                <div className="flex-1 flex items-center justify-between">
                                    <span className="font-bold text-[15px] text-slate-800">Max Capacity</span>
                                    <input
                                        type="number"
                                        className="w-20 text-slate-900 font-bold text-[15px] text-right focus:outline-none"
                                        value={capacity}
                                        onChange={(e) => setCapacity(e.target.value)}
                                    />
                                </div>
                            </div>

                        </div>
                    </section>

                    {/* PUBLIC LINK SETTINGS */}
                    <section>
                        <h2 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">
                            Public Link Settings
                        </h2>
                        <div className="bg-white rounded-[16px] shadow-sm border border-slate-200 overflow-hidden flex flex-col">

                            <div className="flex items-center justify-between p-4 border-b border-slate-100">
                                <div>
                                    <h3 className="font-bold text-[15px] text-slate-800 leading-tight">Enable Public Page</h3>
                                    <p className="text-[12px] text-slate-500 font-medium mt-0.5">Allow anyone with the link to register</p>
                                </div>
                                {/* iOS Switch Toggle Component Mocked */}
                                <button
                                    onClick={() => setIsPublic(!isPublic)}
                                    className={`relative w-[48px] h-[28px] rounded-full transition-colors flex items-center px-0.5 shrink-0 ${isPublic ? 'bg-blue-600' : 'bg-slate-300'}`}
                                >
                                    <div className={`w-[24px] h-[24px] bg-white rounded-full shadow-sm transform transition-transform ${isPublic ? 'translate-x-[20px]' : 'translate-x-[0px]'}`} />
                                </button>
                            </div>

                            <div className="p-4 pt-3.5">
                                <label className="block text-[13px] font-bold text-slate-700 mb-2">URL Slug</label>
                                <div className="flex items-center border border-slate-200 rounded-[10px] overflow-hidden bg-white px-3 py-2.5 shadow-sm">
                                    <span className="text-slate-500 text-[15px] font-medium shrink-0">doorflow.app/e/</span>
                                    <input
                                        type="text"
                                        placeholder="q1-town-hall"
                                        className="flex-1 bg-transparent px-1 focus:outline-none text-[15px] font-medium text-slate-900 placeholder:text-slate-300 placeholder:font-normal"
                                        value={slug}
                                        onChange={(e) => setSlug(e.target.value)}
                                    />
                                </div>
                                <p className="text-[11px] text-slate-500 font-medium mt-2.5 leading-relaxed">
                                    Unique identifier for your event link. Must be lowercase and hyphenated.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* BRANDING */}
                    <section>
                        <h2 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">
                            Branding
                        </h2>
                        <div className="bg-white rounded-[16px] shadow-sm border border-slate-200 flex flex-col items-center justify-center p-8 mb-4">
                            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center shrink-0 mb-3 border border-blue-50/50">
                                <ImagePlus className="w-5 h-5 text-blue-600" />
                            </div>
                            <span className="text-blue-600 font-bold text-[14px]">
                                Upload Banner Image
                            </span>
                            <span className="text-slate-400 font-medium text-[11px] mt-1">
                                Recommended: 1200x600px
                            </span>
                        </div>
                    </section>

                </main>
            </div>
        </div>
    );
}
