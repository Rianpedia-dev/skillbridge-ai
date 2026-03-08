import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { order as orderTable } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

/**
 * POST /api/webhooks/mayar
 * 
 * Handles Mayar payment webhook notifications.
 * 
 * Mayar webhook format:
 * - Top-level has `event`, `data` fields
 * - OR a nested JSON string in `payload` field
 * - Event type: "payment.received" means payment successful
 * - We use `extraData` sent during payment creation to identify the orderId
 */
export async function POST(request: NextRequest) {
    try {
        const rawBody = await request.text();
        console.log("Mayar Webhook Raw Body:", rawBody);

        let body: any;
        try {
            body = JSON.parse(rawBody);
        } catch {
            console.error("Mayar Webhook: Failed to parse body as JSON");
            return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
        }

        // Mayar can send the payload in different formats:
        // Format 1: { event: "payment.received", data: { ... } }
        // Format 2: { payload: "{\"event\":\"payment.received\",\"data\":{...}}" }
        let event: string = "";
        let data: any = {};

        if (body.event && body.data) {
            // Format 1: direct fields
            event = body.event;
            data = body.data;
        } else if (body.payload) {
            // Format 2: payload is a JSON string
            try {
                const parsed = typeof body.payload === "string"
                    ? JSON.parse(body.payload)
                    : body.payload;
                event = parsed.event || body.type || "";
                data = parsed.data || {};
            } catch (e) {
                console.error("Mayar Webhook: Failed to parse payload field:", e);
                return NextResponse.json({ error: "Invalid payload format" }, { status: 400 });
            }
        } else if (body.type) {
            // Format 3: using 'type' field instead of 'event'
            event = body.type;
            data = body;
        }

        console.log("Mayar Webhook Event:", event);
        console.log("Mayar Webhook Data ID:", data.id);
        console.log("Mayar Webhook Status:", data.status);

        if (event === "payment.received") {
            // Extract orderId from extraData that we sent during payment creation
            let orderId = "";
            const transactionId = data.transactionId || data.id || "";

            // Try to get orderId from extraData (sent during payment creation)
            if (data.extraData) {
                const extraData = typeof data.extraData === "string"
                    ? JSON.parse(data.extraData)
                    : data.extraData;
                orderId = extraData.orderId || "";
            }

            // Fallback: try custom_field or payload field
            if (!orderId && data.payload) {
                try {
                    const payloadData = typeof data.payload === "string"
                        ? JSON.parse(data.payload)
                        : data.payload;
                    orderId = payloadData.orderId || "";
                } catch {
                    // ignore parsing errors
                }
            }

            if (orderId) {
                console.log(`Mayar Webhook: Updating order ${orderId} to accepted/escrow, txId: ${transactionId}`);

                const updateData: Record<string, any> = {
                    status: "accepted",
                    paymentStatus: "escrow",
                    updatedAt: new Date(),
                };

                if (transactionId) {
                    updateData.mayarTransactionId = transactionId;
                }

                await db
                    .update(orderTable)
                    .set(updateData)
                    .where(eq(orderTable.id, orderId));

                console.log(`Mayar Webhook: Order ${orderId} updated successfully`);
                return NextResponse.json({ message: "Order updated successfully" });
            } else {
                console.warn("Mayar Webhook: No orderId found in webhook data");
                console.warn("Full webhook data:", JSON.stringify(data, null, 2));
            }
        } else if (event === "payment.reminder") {
            console.log("Mayar Webhook: Payment reminder received, no action taken");
        } else {
            console.log("Mayar Webhook: Unhandled event type:", event);
        }

        return NextResponse.json({ message: "Webhook received" });
    } catch (error) {
        console.error("Mayar Webhook Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
