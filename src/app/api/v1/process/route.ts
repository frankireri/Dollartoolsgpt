import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function POST(req: Request) {
    try {
        const apiKey = req.headers.get("x-api-key");

        if (!apiKey) {
            return NextResponse.json({ error: "Missing API key" }, { status: 401 });
        }

        // Validate API key
        const keyQuery = await adminDb.collection("apiKeys")
            .where("apiKey", "==", apiKey)
            .where("status", "==", "active")
            .limit(1)
            .get();

        if (keyQuery.empty) {
            return NextResponse.json({ error: "Invalid or inactive API key" }, { status: 403 });
        }

        const keyDoc = keyQuery.docs[0];
        const userId = keyDoc.data().userId;

        // Parse request body
        const formData = await req.formData();
        const file = formData.get("file") as File;
        const action = formData.get("action") as string;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        // Log usage
        await adminDb.collection("apiKeyUsage").add({
            apiKeyId: keyDoc.id,
            userId,
            action,
            timestamp: new Date().toISOString(),
            fileName: file.name,
            fileSize: file.size
        });

        // Mock processing for now
        // In a real scenario, we'd use Sharp or similar on the server
        return NextResponse.json({
            message: "File received and authenticated",
            fileInfo: {
                name: file.name,
                size: file.size,
                type: file.type
            },
            actionRequested: action,
            status: "processed (mock)"
        });

    } catch (error) {
        console.error("API Processing Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
