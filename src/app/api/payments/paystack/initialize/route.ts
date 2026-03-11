import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import admin from "firebase-admin";

export async function POST(req: Request) {
    try {
        const { email, amount, metadata, callbackUrl, plan } = await req.json();

        // Check if Admin SDK is initialized (needed for webhook/transaction tracking later)
        if (admin.apps.length === 0) {
            console.error("Paystack Init Error: Firebase Admin SDK not properly initialized.");
            return NextResponse.json({
                error: "Server configuration error",
                details: "Firebase Admin credentials missing."
            }, { status: 500 });
        }

        const amountInSubunits = amount ? Math.round(amount * 100) : undefined;

        console.log("Paystack Initializing:", { email, amount, plan });

        const response = await fetch("https://api.paystack.co/transaction/initialize", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                amount: amountInSubunits,
                plan,
                metadata,
                callback_url: callbackUrl,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Paystack API Error Detail:", data);
            return NextResponse.json(
                { error: data.message || "Paystack initialization failed", details: data },
                { status: response.status }
            );
        }

        return NextResponse.json(data.data);
    } catch (error: any) {
        console.error("Paystack API Internal Error:", error);
        return NextResponse.json({
            error: "Internal Server Error",
            details: error.message
        }, { status: 500 });
    }
}
