import { NextResponse } from "next/server";

function buildCreateEventUrl(baseUrl: string): string {
    return `${baseUrl.replace(/\/+$/, "")}/event/create`;
}

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

    const baseUrl =
        process.env.CATALYST_BASE_URL ??
        process.env.NEXT_PUBLIC_CATALYST_BASE_URL;
    if (!baseUrl) {
        return NextResponse.json(
            {
                message:
                    "Missing CATALYST_BASE_URL or NEXT_PUBLIC_CATALYST_BASE_URL environment variable.",
            },
            { status: 500 },
        );
    }

    const endpoint = buildCreateEventUrl(baseUrl);

    try {
        const upstreamResponse = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
            cache: "no-store",
        });

        const text = await upstreamResponse.text();
        let upstreamBody: unknown = null;

        if (text) {
            try {
                upstreamBody = JSON.parse(text) as unknown;
            } catch {
                upstreamBody = { raw: text };
            }
        }

        if (!upstreamResponse.ok) {
            return NextResponse.json(
                {
                    message: "Catalyst event/create request failed.",
                    status: upstreamResponse.status,
                    upstream: upstreamBody,
                },
                { status: upstreamResponse.status },
            );
        }

        return NextResponse.json({ ok: true, upstream: upstreamBody });
    } catch {
        return NextResponse.json(
            { message: "Unable to reach Catalyst event/create API." },
            { status: 502 },
        );
    }
}
