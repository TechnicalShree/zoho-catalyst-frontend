"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";

// Extend window object for catalyst SDK
declare global {
    interface Window {
        catalyst: any;
    }
}

export default function LoginPage() {
    const loginDivRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Only attempt to initialize if the catalyst SDK is fully loaded
        const timer = setInterval(() => {
            if (window.catalyst && window.catalyst.auth && loginDivRef.current) {
                clearInterval(timer);

                const config = {
                    service_url: "/", // Provide redirect URL here
                };

                try {
                    // Mount the Native Catalyst Login Form
                    window.catalyst.auth.signIn("catalyst-login-container", config);
                } catch (e) {
                    console.error("Catalyst Login Error:", e);
                }
            }
        }, 500);

        return () => clearInterval(timer);
    }, []);

    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4">
            <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                <div className="orb orb-one blur-[100px]" />
                <div className="orb orb-two blur-[100px]" />
            </div>

            <div className="w-full max-w-md space-y-6 rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-xl backdrop-blur-xl">
                <div className="text-center">
                    <p className="inline-flex items-center rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold tracking-[0.2em] text-white">
                        REGINEXUS
                    </p>
                    <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
                        Sign in
                    </h1>
                    <p className="mt-2 text-sm text-slate-500">
                        Sign in or create an account to continue.
                    </p>
                </div>

                {/* Catalyst Scripts */}
                <Script
                    src="https://static.zohocdn.com/catalyst/sdk/js/4.5.0/catalystWebSDK.js"
                    strategy="beforeInteractive"
                />
                <Script
                    src="/__catalyst/sdk/init.js"
                    strategy="beforeInteractive"
                />

                <div className="mt-6 flex justify-center w-full">
                    {/* Catalyst Native Auth Iframe mounts here */}
                    <div id="catalyst-login-container" ref={loginDivRef} className="w-full h-[500px]">
                        {/* Loading placeholder */}
                        <div className="flex h-full w-full items-center justify-center">
                            <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-indigo-600"></div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
