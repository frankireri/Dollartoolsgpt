import { NextResponse } from "next/server";

// List of all your app webhook endpoints
const APPS = [
    "http://localhost:3000/api/payments/paystack/webhook", // This App
    "http://localhost:3001/api/payments/paystack/webhook", // Your Other App (Change port/path as needed)
    // Add more here...
];

export async function POST(req: Request) {
    try {
        const body = await req.text();
        const signature = req.headers.get("x-paystack-signature");

        console.log(`[Dispatcher] Received Paystack event. Broadcasting to ${APPS.length} apps...`);

        // Broadcast to all apps simultaneously
        const broadcastPromises = APPS.map(async (url) => {
            try {
                const response = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "x-paystack-signature": signature || "",
                    },
                    body: body,
                });

                return { url, status: response.status, ok: response.ok };
            } catch (err) {
                return { url, status: "FAILED", ok: false };
            }
        });

        const results = await Promise.all(broadcastPromises);
        console.log("[Dispatcher] Results:", results);

        return NextResponse.json({
            message: "Dispatched",
            results
        });

    } catch (error) {
        console.error("[Dispatcher] Error:", error);
        return NextResponse.json({ error: "Dispatch failed" }, { status: 500 });
    }
}
