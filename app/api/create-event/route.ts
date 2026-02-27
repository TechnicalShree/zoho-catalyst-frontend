import { NextResponse } from "next/server";

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

  const endpoint = process.env.CATALYST_CREATE_EVENT_URL;
  if (!endpoint) {
    return NextResponse.json(
      { message: "Missing CATALYST_CREATE_EVENT_URL environment variable." },
      { status: 500 },
    );
  }

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
          message: "Catalyst create_event request failed.",
          status: upstreamResponse.status,
          upstream: upstreamBody,
        },
        { status: upstreamResponse.status },
      );
    }

    return NextResponse.json({ ok: true, upstream: upstreamBody });
  } catch {
    return NextResponse.json(
      { message: "Unable to reach Catalyst create_event API." },
      { status: 502 },
    );
  }
}
