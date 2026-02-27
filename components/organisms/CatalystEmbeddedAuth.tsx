"use client";

import { useRef, useState } from "react";
import Script from "next/script";

declare global {
  interface Window {
    catalyst?: {
      auth?: {
        signIn: (elementId: string, config?: Record<string, unknown>) => void;
      };
    };
  }
}

const LOGIN_ELEMENT_ID = "loginDivElementId";
const CATALYST_SIGNIN_CONFIG: Record<string, unknown> = {
  signin_providers_only: true,
  css_url: "/css/embeddediframe.css",
  service_url: "/app/index.html",
};

export function CatalystEmbeddedAuth() {
  const sdkLoadedRef = useRef(false);
  const initLoadedRef = useRef(false);
  const initializedRef = useRef(false);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function initializeCatalystSignIn() {
    if (initializedRef.current) {
      return;
    }
    if (!sdkLoadedRef.current || !initLoadedRef.current) {
      return;
    }

    const signIn = window.catalyst?.auth?.signIn;
    if (!signIn) {
      setStatus("error");
      setErrorMessage(
        "Catalyst auth SDK is not available. Ensure this app runs on Catalyst hosting with /__catalyst/sdk/init.js.",
      );
      return;
    }

    try {
      signIn(LOGIN_ELEMENT_ID, CATALYST_SIGNIN_CONFIG);
      initializedRef.current = true;
      setStatus("ready");
      setErrorMessage(null);
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to initialize Catalyst embedded login.",
      );
    }
  }

  return (
    <section className="surface-card reveal delay-1">
      <Script
        src="https://static.zohocdn.com/catalyst/sdk/js/4.5.0/catalystWebSDK.js"
        strategy="afterInteractive"
        onLoad={() => {
          sdkLoadedRef.current = true;
          initializeCatalystSignIn();
        }}
        onError={() => {
          setStatus("error");
          setErrorMessage("Failed to load catalystWebSDK.js from static.zohocdn.com.");
        }}
      />
      <Script
        src="/__catalyst/sdk/init.js"
        strategy="afterInteractive"
        onLoad={() => {
          initLoadedRef.current = true;
          initializeCatalystSignIn();
        }}
        onError={() => {
          setStatus("error");
          setErrorMessage(
            "Failed to load /__catalyst/sdk/init.js. This endpoint is available in Catalyst hosting/runtime.",
          );
        }}
      />

      <div className="mb-3">
        <h2 className="text-xl font-semibold text-slate-900">Catalyst Embedded Login</h2>
        <p className="text-sm text-slate-600">
          SDK v4.5.0 is wired for Google OAuth via social-login-only mode using
          `catalyst.auth.signIn(elementId, config)`.
        </p>
        <p className="mt-1 text-xs text-slate-500">
          Keep only Google enabled in Catalyst Social Logins to enforce Google-only
          sign in.
        </p>
      </div>

      <div
        id={LOGIN_ELEMENT_ID}
        className="min-h-105 rounded-2xl border border-slate-200 bg-white p-2"
      />

      <p className="mt-3 text-xs text-slate-500">
        Status:{" "}
        <span className="font-semibold">
          {status === "ready" ? "ready" : status === "loading" ? "loading" : "error"}
        </span>
      </p>
      {errorMessage ? (
        <p className="mt-1 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
          {errorMessage}
        </p>
      ) : null}
    </section>
  );
}
