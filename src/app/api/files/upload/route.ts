import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import { v4 as uuidv4 } from "uuid";
import { adminDb } from "@/lib/firebase-admin";

// Configure max file size (50MB)
const MAX_FILE_SIZE = 50 * 1024 * 1024;

// User files directory (configure based on environment)
const USER_FILES_DIR = process.env.USER_FILES_PATH || join(process.cwd(), "user-files");

export async function POST(req: NextRequest) {
    try {
        // Get auth token from headers
        const authHeader = req.headers.get("authorization");
        if (!authHeader?.startsWith("Bearer ")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const token = authHeader.split("Bearer ")[1];

        // Verify Firebase token (server-side)
        const admin = await import("firebase-admin");
        let userId: string;

        try {
            const decodedToken = await admin.auth().verifyIdToken(token);
            userId = decodedToken.uid;
        } catch (error) {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }

        // Parse multipart form data
        const formData = await req.formData();
        const file = formData.get("file") as File;
        const toolType = formData.get("toolType") as string;
        const fileName = formData.get("fileName") as string;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json(
                { error: `File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB` },
                { status: 400 }
            );
        }

        // Generate project ID
        const projectId = uuidv4();

        // Create user directory path
        const userDir = join(USER_FILES_DIR, "projects", userId);
        const projectDir = join(userDir, projectId);

        // Create directories if they don't exist
        if (!existsSync(userDir)) {
            await mkdir(userDir, { recursive: true });
        }
        if (!existsSync(projectDir)) {
            await mkdir(projectDir, { recursive: true });
        }

        // Get file extension
        const fileExt = fileName.split(".").pop() || "bin";
        const sanitizedFileName = `processed.${fileExt}`;
        const filePath = join(projectDir, sanitizedFileName);

        // Convert file to buffer and save
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        await writeFile(filePath, buffer);

        // Create Firestore record
        const projectData = {
            projectId,
            userId,
            toolType: toolType || "unknown",
            fileName: fileName || file.name,
            filePath: `projects/${userId}/${projectId}/${sanitizedFileName}`,
            fileSize: file.size,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        };

        await adminDb.collection("projects").doc(projectId).set(projectData);

        return NextResponse.json({
            success: true,
            projectId,
            fileName: fileName || file.name,
            fileSize: file.size,
        });

    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json(
            { error: "Failed to upload file" },
            { status: 500 }
        );
    }
}

export const config = {
    api: {
        bodyParser: false,
    },
};
