"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
    onAuthStateChanged,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    User
} from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc, updateDoc, increment } from "firebase/firestore";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    credits: number;
    subscription: {
        status: string;
        planCode: string;
    } | null;
    login: () => Promise<void>;
    logout: () => Promise<void>;
    refreshCredits: () => Promise<void>;
    useCredit: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [credits, setCredits] = useState(0);
    const [subscription, setSubscription] = useState<AuthContextType["subscription"]>(null);

    const refreshCredits = async () => {
        if (user) {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
                const data = userDoc.data();
                setCredits(data.credits || 0);
                setSubscription(data.subscription || null);
            }
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
            setUser(user);
            if (user) {
                // Check if user exists in Firestore, if not create them
                const userRef = doc(db, "users", user.uid);
                const userSnap = await getDoc(userRef);

                if (!userSnap.exists()) {
                    await setDoc(userRef, {
                        email: user.email,
                        displayName: user.displayName,
                        credits: 2, // 2 Free start credits
                        createdAt: new Date(),
                    });
                    setCredits(2);
                    setSubscription(null);
                } else {
                    const data = userSnap.data();
                    setCredits(data.credits || 0);
                    setSubscription(data.subscription || null);
                }
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const login = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error("Login Error:", error);
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Logout Error:", error);
        }
    };

    const useCredit = async () => {
        if (!user) return false;

        // If user has active subscription, bypass credit deduction
        if (subscription?.status === "active") return true;

        if (credits < 1) return false;

        try {
            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, {
                credits: increment(-1)
            });
            setCredits(prev => prev - 1);
            return true;
        } catch (error) {
            console.error("Credit deduction failed:", error);
            return false;
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, credits, subscription, login, logout, refreshCredits, useCredit }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
