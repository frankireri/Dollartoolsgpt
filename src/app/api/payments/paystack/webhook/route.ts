import { NextResponse } from "next/server";
import crypto from "crypto";
import { adminDb } from "@/lib/firebase-admin";
import admin from "firebase-admin";

export async function POST(req: Request) {
    try {
        const body = await req.text();
        const hash = crypto
            .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY!)
            .update(body)
            .digest("hex");

        // Verify signature
        if (hash !== req.headers.get("x-paystack-signature")) {
            return new Response("Invalid signature", { status: 401 });
        }

        const event = JSON.parse(body);

        // Handle "multiple softwares" concern: 
        // Filter events by checking metadata 'source'
        const metadata = event.data.metadata;
        if (metadata?.source !== "dollartools_gpt" && event.event === "charge.success") {
            // Not our app's payment, ignore but return 200 to acknowledge
            console.log("Paystack Webhook: Ignoring event from another source", metadata?.source);
            return NextResponse.json({ status: "ignored" });
        }

        const { reference, amount, customer, plan } = event.data;
        const userId = metadata?.userId || event.data.customer.metadata?.userId;

        // Handle One-time Credit Purchases
        if (event.event === "charge.success" && !plan) {
            if (userId) {
                const amountInBaseUnits = amount / 100;
                const creditsToAdd = Math.floor(amountInBaseUnits / 10);

                const userRef = adminDb.collection("users").doc(userId);
                await adminDb.runTransaction(async (transaction) => {
                    const userDoc = await transaction.get(userRef);
                    if (!userDoc.exists) {
                        transaction.set(userRef, { credits: creditsToAdd, email: customer.email, updatedAt: admin.firestore.FieldValue.serverTimestamp() });
                    } else {
                        const currentCredits = userDoc.data()?.credits || 0;
                        transaction.update(userRef, { credits: currentCredits + creditsToAdd, updatedAt: admin.firestore.FieldValue.serverTimestamp() });
                    }
                    transaction.set(adminDb.collection("payments").doc(reference), { userId, amount: amountInBaseUnits, gateway: "paystack", reference, status: "success", createdAt: admin.firestore.FieldValue.serverTimestamp() });
                });
                console.log(`Successfully added ${creditsToAdd} credits to user ${userId}`);
            }
        }

        // Handle Subscriptions (Initial and Renewals)
        if (event.event === "subscription.create" || event.event === "invoice.update") {
            // Paystack sends invoice.update when a recurring payment succeeds
            if (event.event === "invoice.update" && event.data.status !== "success") return NextResponse.json({ status: "skipped" });

            const subscriptionCode = event.data.subscription_code || event.data.subscription?.subscription_code;

            if (userId && plan) {
                const userRef = adminDb.collection("users").doc(userId);

                await userRef.set({
                    subscription: {
                        status: "active",
                        planCode: plan.plan_code || plan,
                        subscriptionCode,
                        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
                        // Set expiry one month from now (simulated, Paystack tracks this normally)
                        nextPaymentDate: event.data.next_payment_date || null
                    }
                }, { merge: true });

                console.log(`Updated subscription for user ${userId}`);
            }
        }

        return NextResponse.json({ status: "success" });
    } catch (error: any) {
        console.error("Paystack Webhook Error:", error);
        return NextResponse.json({ error: "Webhook process failed" }, { status: 400 });
    }
}
