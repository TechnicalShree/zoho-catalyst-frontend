import { NextResponse } from "next/server";

const CATALYST_BASE_URL =
    process.env.CATALYST_BASE_URL ??
    process.env.NEXT_PUBLIC_CATALYST_BASE_URL ??
    "https://catalyst-hackathon-915650487.development.catalystserverless.com";

type UpstreamEventItem = {
    Events?: Record<string, unknown>;
};

function buildEventUrl(): string {
    return `${CATALYST_BASE_URL.replace(/\/+$/, "")}/event`;
}

async function parseUpstreamResponse(response: Response): Promise<unknown> {
    const text = await response.text();
    if (!text) return null;
    try {
        return JSON.parse(text) as unknown;
    } catch {
        return { raw: text };
    }
}

function getUpstreamEventItems(body: unknown): UpstreamEventItem[] {
    if (Array.isArray(body)) {
        return body as UpstreamEventItem[];
    }

    if (body && typeof body === "object") {
        const data = (body as { data?: unknown }).data;
        if (Array.isArray(data)) {
            return data as UpstreamEventItem[];
        }
    }

    return [];
}

function findEventBySlug(body: unknown, slug: string): UpstreamEventItem | null {
    const normalizedSlug = slug.trim().toLowerCase();
    if (!normalizedSlug) {
        return null;
    }

    const eventItems = getUpstreamEventItems(body);

    for (const item of eventItems) {
        const eventRecord =
            item.Events && typeof item.Events === "object"
                ? item.Events
                : (item as Record<string, unknown>);

        const eventSlug = typeof eventRecord.slug === "string" ? eventRecord.slug : null;
        const eventId =
            typeof eventRecord.ROWID === "string"
                ? eventRecord.ROWID
                : typeof eventRecord.id === "string"
                    ? eventRecord.id
                    : null;

        if (
            (eventSlug && eventSlug.toLowerCase() === normalizedSlug) ||
            (eventId && eventId === slug)
        ) {
            return item;
        }
    }

    return null;
}

/**
 * GET /api/event → proxies to GET <Catalyst>/event and resolves slug lookups locally.
 */
export async function GET(request: Request) {
    const incomingUrl = new URL(request.url);
    const requestedSlug = incomingUrl.searchParams.get("slug");
    const endpoint = new URL(buildEventUrl());

    incomingUrl.searchParams.forEach((value, key) => {
        if (key === "slug") {
            return;
        }
        endpoint.searchParams.append(key, value);
    });

    try {
        const upstreamHeaders: Record<string, string> = {
            Accept: "application/json",
        };

        const cookieHeader = request.headers.get("cookie");
        if (cookieHeader) {
            upstreamHeaders["Cookie"] = cookieHeader;
        }

        const upstreamResponse = await fetch(endpoint, {
            method: "GET",
            headers: upstreamHeaders,
            cache: "no-store",
        });

        const upstreamBody = await parseUpstreamResponse(upstreamResponse);

        if (!upstreamResponse.ok) {
            return NextResponse.json(
                {
                    message: "Catalyst GET /event request failed.",
                    status: upstreamResponse.status,
                    upstream: upstreamBody,
                },
                { status: upstreamResponse.status },
            );
        }

        if (requestedSlug) {
            const matchingEvent = findEventBySlug(upstreamBody, requestedSlug);
            if (!matchingEvent) {
                return NextResponse.json(
                    { message: `Event not found for slug "${requestedSlug}".` },
                    { status: 404 },
                );
            }

            return NextResponse.json(matchingEvent);
        }

        return NextResponse.json(upstreamBody ?? []);
    } catch (err) {
        const detail = err instanceof Error ? err.message : "Unknown error";
        return NextResponse.json(
            { message: "Unable to reach Catalyst /event API.", detail },
            { status: 502 },
        );
    }
}

/**
 * POST /api/event → proxies to POST <Catalyst>/event (create event)
 */
export async function POST(request: Request) {
    let payload: unknown;

    try {
        payload = await request.json();
    } catch {
        return NextResponse.json(
            { message: "Request body must be valid JSON." },
            { status: 400 },
        );
    }

    const endpoint = buildEventUrl();

    try {
        const upstreamHeaders: Record<string, string> = {
            "Content-Type": "application/json",
        };

        const cookieHeader = request.headers.get("cookie");
        if (cookieHeader) {
            upstreamHeaders["Cookie"] = cookieHeader;
        }

        const upstreamResponse = await fetch(endpoint, {
            method: "POST",
            headers: upstreamHeaders,
            body: JSON.stringify(payload),
            cache: "no-store",
        });

        const upstreamBody = await parseUpstreamResponse(upstreamResponse);

        if (!upstreamResponse.ok) {
            return NextResponse.json(
                {
                    message: "Catalyst POST /event request failed.",
                    status: upstreamResponse.status,
                    upstream: upstreamBody,
                },
                { status: upstreamResponse.status },
            );
        }

        return NextResponse.json({ ok: true, upstream: upstreamBody });
    } catch (err) {
        const detail = err instanceof Error ? err.message : "Unknown error";
        return NextResponse.json(
            { message: "Unable to reach Catalyst /event API.", detail },
            { status: 502 },
        );
    }
}
