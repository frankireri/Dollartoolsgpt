import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import admin from "firebase-admin";

export async function GET(req: NextRequest) {
    try {
        const authHeader = req.headers.get("authorization");
        if (!authHeader?.startsWith("Bearer ")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Check if Admin SDK is initialized
        if (admin.apps.length === 0) {
            console.error("User API Error: Firebase Admin SDK not properly initialized.");
            return NextResponse.json({
                error: "Server configuration error",
                details: "Firebase Admin credentials missing or invalid."
            }, { status: 500 });
        }

        const token = authHeader.split("Bearer ")[1];

        let userId: string;
        try {
            const decodedToken = await admin.auth().verifyIdToken(token);
            userId = decodedToken.uid;
        } catch (error) {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }

        // Query Firestore for user's projects
        const projectsSnapshot = await adminDb
            .collection("projects")
            .where("userId", "==", userId)
            .orderBy("createdAt", "desc")
            .get();

        const projects = projectsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            // Convert Firestore timestamps to ISO strings
            createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || null,
            updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || null,
        }));

        return NextResponse.json({ projects });

    } catch (error: any) {
        console.error("List files server error:", error);
        return NextResponse.json({
            error: "Failed to list files",
            details: error.message
        }, { status: 500 });
    }
}
