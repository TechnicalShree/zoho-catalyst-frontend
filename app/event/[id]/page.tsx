"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Notice } from "../../../lib/doorflow/types";

type EventRecord = {
    ROWID?: string;
    id?: string;
    name?: string;
    eventName?: string;
    slug?: string | null;
    capacity?: string | number | null;
    starts_at?: string | null;
    startsAt?: string | null;
};

export default function EventDetailsPage({
    params,
}: {
    params: { id: string };
}) {
    const [eventData, setEventData] = useState<EventRecord | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Notice | null>(null);

    useEffect(() => {
        async function fetchEventDetails() {
            try {
                const response = await fetch(`/api/event?id=${params.id}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch event details");
                }
                const data = (await response.json()) as {
                    data?: Array<{ Events?: EventRecord }>;
                    Events?: EventRecord;
                };
                const eventItem =
                    data.data?.[0]?.Events ??
                    data.Events ??
                    null;

                if (!eventItem) {
                    throw new Error("Event not found");
                }

                setEventData(eventItem);
            } catch (err: unknown) {
                setError({
                    tone: "error",
                    message:
                        err instanceof Error ? err.message : "Failed to fetch event.",
                });
            } finally {
                setLoading(false);
            }
        }

        fetchEventDetails();
    }, [params.id]);

    return (
        <main className="relative mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-6 px-4 py-8 md:px-8 md:py-12">
            <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                <div className="orb orb-one blur-[100px]" />
                <div className="orb orb-two blur-[100px]" />
            </div>

            <div className="flex items-center gap-4 mb-2">
                <Link
                    href="/organizer"
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/50 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-white hover:text-slate-900 shadow-sm backdrop-blur-md"
                >
                    &larr; Back to Organizer
                </Link>
            </div>

            <div className="surface-card flex flex-col gap-6">
                {loading ? (
                    <div className="flex justify-center p-12">
                        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-indigo-600"></div>
                    </div>
                ) : error ? (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
                        <h3 className="font-semibold">Error fetching event</h3>
                        <p className="mt-1 text-sm">{error.message}</p>
                    </div>
                ) : eventData ? (
                    <>
                        <div className="space-y-4">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                                        {eventData.name || eventData.eventName || "Untitled Event"}
                                    </h1>
                                    <p className="mt-2 inline-flex items-center rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold tracking-[0.2em] text-white">
                                        {eventData.slug || "NO SLUG"}
                                    </p>
                                </div>
                                {/* Visual date block */}
                                <div className="flex flex-col items-center justify-center rounded-xl bg-indigo-50 px-4 py-2 border border-indigo-100">
                                    <span className="text-xs font-bold text-indigo-500 uppercase">
                                        Starts
                                    </span>
                                    <span className="text-lg font-bold text-indigo-900 mt-1">
                                        {eventData.starts_at || eventData.startsAt
                                            ? new Date(
                                                eventData.starts_at || eventData.startsAt || "",
                                            ).toLocaleDateString([], {
                                                month: "short",
                                                day: "numeric",
                                            })
                                            : "TBA"}
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mt-6">
                                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                                    <p className="text-sm font-semibold text-slate-500">
                                        Capacity
                                    </p>
                                    <p className="mt-1 text-xl font-bold text-slate-800">
                                        {eventData.capacity || "N/A"}
                                    </p>
                                </div>
                                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                                    <p className="text-sm font-semibold text-slate-500">
                                        Event ID
                                    </p>
                                    <p className="mt-1 text-sm font-medium text-slate-800 break-all font-mono">
                                        {eventData.ROWID || eventData.id || params.id}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <hr className="border-slate-100" />

                        <div className="flex justify-between items-center bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                            <div>
                                <h3 className="font-semibold text-indigo-900">Registration Link</h3>
                                <p className="text-sm text-indigo-700 mt-1">Share this link to allow guests to register.</p>
                            </div>
                            <Link
                                href={`/registration?event=${eventData.ROWID || eventData.id || params.id}`}
                                className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm hover:bg-indigo-700 transition"
                            >
                                Go to Registration
                            </Link>
                        </div>
                    </>
                ) : (
                    <div className="p-8 text-center text-slate-500">
                        Event not found
                    </div>
                )}
            </div>
        </main>
    );
}
