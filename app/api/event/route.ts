import { NextResponse } from "next/server";

const CATALYST_BASE_URL =
    process.env.CATALYST_BASE_URL ??
    process.env.NEXT_PUBLIC_CATALYST_BASE_URL ??
    "https://catalyst-hackathon-915650487.development.catalystserverless.com";

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

/**
 * GET /api/event → proxies to GET <Catalyst>/event and forwards query params.
 */
export async function GET(request: Request) {
    const endpoint = new URL(buildEventUrl());
    const incomingUrl = new URL(request.url);

    incomingUrl.searchParams.forEach((value, key) => {
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
