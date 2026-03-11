import { NextRequest, NextResponse } from "next/server";
import { readFile, unlink } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import { adminDb } from "@/lib/firebase-admin";

const USER_FILES_DIR = process.env.USER_FILES_PATH || join(process.cwd(), "user-files");

export async function GET(
     req: NextRequest,
     { params }: { params: Promise<{ projectId: string }> }
 ) {
    try {
        const authHeader = req.headers.get("authorization");
        if (!authHeader?.startsWith("Bearer ")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const token = authHeader.split("Bearer ")[1];
        const admin = await import("firebase-admin");

        let userId: string;
        try {
            const decodedToken = await admin.auth().verifyIdToken(token);
            userId = decodedToken.uid;
        } catch (error) {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }

        const projectId = params.projectId;

        // Get project from Firestore
        const projectDoc = await adminDb.collection("projects").doc(projectId).get();

        if (!projectDoc.exists) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        const projectData = projectDoc.data();

        // Verify ownership
        if (projectData?.userId !== userId) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        // Read file from disk
        const filePath = join(USER_FILES_DIR, projectData.filePath);

        if (!existsSync(filePath)) {
            return NextResponse.json({ error: "File not found on server" }, { status: 404 });
        }

        const fileBuffer = await readFile(filePath);
        const fileName = projectData.fileName || "download";

        // Determine content type based on file extension
        const ext = fileName.split(".").pop()?.toLowerCase();
        const contentTypes: { [key: string]: string } = {
            pdf: "application/pdf",
            png: "image/png",
            jpg: "image/jpeg",
            jpeg: "image/jpeg",
            gif: "image/gif",
            webp: "image/webp",
            json: "application/json",
            txt: "text/plain",
            csv: "text/csv",
        };
        const contentType = contentTypes[ext || ""] || "application/octet-stream";

        return new NextResponse(fileBuffer, {
            headers: {
                "Content-Type": contentType,
                "Content-Disposition": `attachment; filename="${fileName}"`,
                "Content-Length": fileBuffer.length.toString(),
            },
        });

    } catch (error) {
        console.error("Download error:", error);
        return NextResponse.json({ error: "Failed to download file" }, { status: 500 });
    }
}

export async function DELETE(
     req: NextRequest,
     { params }: { params: Promise<{ projectId: string }> }
 ) {
    try {
        const authHeader = req.headers.get("authorization");
        if (!authHeader?.startsWith("Bearer ")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const token = authHeader.split("Bearer ")[1];
        const admin = await import("firebase-admin");

        let userId: string;
        try {
            const decodedToken = await admin.auth().verifyIdToken(token);
            userId = decodedToken.uid;
        } catch (error) {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }

        const projectId = params.projectId;

        // Get project from Firestore
        const projectDoc = await adminDb.collection("projects").doc(projectId).get();

        if (!projectDoc.exists) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        const projectData = projectDoc.data();

        // Verify ownership
        if (projectData?.userId !== userId) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        // Delete file from disk
        const filePath = join(USER_FILES_DIR, projectData.filePath);

        if (existsSync(filePath)) {
            await unlink(filePath);
        }

        // Delete Firestore record
        await adminDb.collection("projects").doc(projectId).delete();

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Delete error:", error);
        return NextResponse.json({ error: "Failed to delete file" }, { status: 500 });
    }
}
