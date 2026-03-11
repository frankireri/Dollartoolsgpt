import { auth } from "./firebase";

interface UploadFileOptions {
    file: Blob;
    fileName: string;
    toolType: string;
}

interface Project {
    id: string;
    projectId: string;
    userId: string;
    toolType: string;
    fileName: string;
    fileSize: number;
    createdAt: string;
    updatedAt: string;
}

/**
 * Upload a file to the server
 */
export async function uploadFile({ file, fileName, toolType }: UploadFileOptions): Promise<Project> {
    const user = auth.currentUser;
    if (!user) {
        throw new Error("User must be authenticated");
    }

    const token = await user.getIdToken();

    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", fileName);
    formData.append("toolType", toolType);

    const response = await fetch("/api/files/upload", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to upload file");
    }

    return response.json();
}

/**
 * Get download URL for a project file
 */
export function getDownloadUrl(projectId: string): string {
    return `/api/files/${projectId}`;
}

/**
 * Download a project file
 */
export async function downloadFile(projectId: string, fileName: string): Promise<void> {
    const user = auth.currentUser;
    if (!user) {
        throw new Error("User must be authenticated");
    }

    const token = await user.getIdToken();

    const response = await fetch(`/api/files/${projectId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to download file");
    }

    // Download the file
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

/**
 * Delete a project file
 */
export async function deleteFile(projectId: string): Promise<void> {
    const user = auth.currentUser;
    if (!user) {
        throw new Error("User must be authenticated");
    }

    const token = await user.getIdToken();

    const response = await fetch(`/api/files/${projectId}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete file");
    }
}

/**
 * List all user's project files
 */
export async function listUserFiles(): Promise<Project[]> {
    const user = auth.currentUser;
    if (!user) {
        throw new Error("User must be authenticated");
    }

    const token = await user.getIdToken();

    const response = await fetch("/api/files/user", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to list files");
    }

    const data = await response.json();
    return data.projects;
}
