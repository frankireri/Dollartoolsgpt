import { db } from "./firebase";
import { doc, updateDoc, increment, getDoc } from "firebase/firestore";

export async function deductCredit(userId: string) {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) return false;

    const credits = userSnap.data().credits || 0;
    if (credits < 1) return false;

    await updateDoc(userRef, {
        credits: increment(-1)
    });

    return true;
}

export function isFreeTool(slug: string) {
    const freeTools = ["word-counter", "case-converter", "lorem-ipsum", "text-formatter"];
    return freeTools.includes(slug);
}
