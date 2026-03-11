"use client";

import { useAuth } from "@/context/AuthContext";

export const usePaystack = () => {
    const { user } = useAuth();

    const initializePayment = async ({
        email,
        amount,
        plan,
        metadata = {},
        callbackUrl,
    }: {
        email: string;
        amount?: number;
        plan?: string;
        metadata?: any;
        callbackUrl?: string;
    }) => {
        try {
            if (!user) throw new Error("User must be logged in");

            const response = await fetch("/api/payments/paystack/initialize", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    amount,
                    plan,
                    callbackUrl,
                    metadata: {
                        ...metadata,
                        userId: user.uid,
                        source: "dollartools_gpt", // Key for multi-app filtering
                    },
                }),
            });

            const data = await response.json();
            if (!response.ok) {
                const errorInstance: any = new Error(data.error || "Initialization failed");
                errorInstance.details = data.details;
                throw errorInstance;
            }

            return data; // { authorization_url, reference }
        } catch (error: any) {
            console.error("Paystack Init Error:", error);
            throw error;
        }
    };

    return { initializePayment };
};
