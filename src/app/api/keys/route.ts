import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { cookies } from "next/headers";
import crypto from "crypto";

export async function POST(req: Request) {
    try {
        const cookieStore = await cookies();
        const authCookie = cookieStore.get("session")?.value;
        if (!authCookie) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Verify session and get userId (Assuming session-based auth for API)
        // For now, let's assume we have a way to get the userId.
        // In this project, we might be using Firebase Client Auth primarily.
        // If we want to support this on the server, we need firebase-admin.

        // Let's check if we have firebase-admin configured.

        const apiKey = `dt_${crypto.randomBytes(32).toString("hex")}`;
        const keyData = {
            apiKey,
            userId: "temp-user", // Placeholder
            createdAt: new Date().toISOString(),
            lastUsed: null,
            status: "active"
        };

        await adminDb.collection("apiKeys").add(keyData);
        return NextResponse.json({ apiKey });
    } catch (error) {
        console.error("API Key Generation Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const keys = await adminDb.collection("apiKeys").where("userId", "==", "temp-user").get();
        const apiKeys = keys.docs.map((doc: any) => ({
            id: doc.id,
            ...doc.data()
        }));
        return NextResponse.json({ apiKeys });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
