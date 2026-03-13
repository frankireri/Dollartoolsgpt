import admin from "firebase-admin";

// Keep track of initialization state
let isInitialized = false;

function initializeAdmin() {
    if (isInitialized || admin.apps.length > 0) {
        isInitialized = true;
        return true;
    }

    try {
        const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
        const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
        let privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
        
        // Strip quotes if they were added by the shell or env file
        if (privateKey?.startsWith('"') && privateKey?.endsWith('"')) {
            privateKey = privateKey.substring(1, privateKey.length - 1);
        }

        if (!projectId || !clientEmail || !privateKey) {
            console.error("Firebase Admin Error: Missing credentials in .env.local", {
                projectId: !!projectId,
                clientEmail: !!clientEmail,
                privateKey: !!privateKey
            });
            return false;
        }

        admin.initializeApp({
            credential: admin.credential.cert({
                projectId,
                clientEmail,
                privateKey,
            }),
        });
        console.log("Firebase Admin Initialized successfully.");
        isInitialized = true;
        return true;
    } catch (error) {
        console.error("Firebase Admin Initialization Failed:", error);
        return false;
    }
}

// Export a proxy or helper to get the database
export const getAdminDb = () => {
    if (!initializeAdmin()) return null;
    return admin.firestore();
};

export const getAdminAuth = () => {
    if (!initializeAdmin()) return null;
    return admin.auth();
};

// Also export the original ones for compatibility, but they are now getters
export const adminDb = isInitialized || admin.apps.length > 0 ? admin.firestore() : null as any;
export const adminAuth = isInitialized || admin.apps.length > 0 ? admin.auth() : null as any;
