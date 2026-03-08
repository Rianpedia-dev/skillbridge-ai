export interface MayarPaymentRequest {
    name: string;
    email: string;
    amount: number;
    mobile: string;
    description: string;
    redirectUrl: string;
    expiredAt?: string; // ISO 8601
    extraData?: Record<string, string>; // Meta data to identify order
}

export interface MayarPaymentResponse {
    id: string;
    transactionId: string;
    link: string;
}

const MAYAR_API_KEY = process.env.MAYAR_API_KEY;
const MAYAR_BASE_URL = "https://api.mayar.id/hl/v1";

export const mayar = {
    /**
     * Create a single payment request via Mayar Headless API.
     * Docs: https://docs.mayar.id/api-reference/reqpayment/create
     */
    async createPaymentLink(params: MayarPaymentRequest): Promise<MayarPaymentResponse> {
        if (!MAYAR_API_KEY) {
            throw new Error("MAYAR_API_KEY is not configured");
        }

        try {
            console.log("Mayar: Creating payment for", params.email, "amount", params.amount);

            const response = await fetch(`${MAYAR_BASE_URL}/payment/create`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${MAYAR_API_KEY}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: params.name,
                    email: params.email,
                    amount: params.amount,
                    mobile: params.mobile || "081234567890",
                    description: params.description,
                    redirectUrl: params.redirectUrl,
                    expiredAt: params.expiredAt || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                    extraData: params.extraData || {},
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                console.error("Mayar API Error Response:", JSON.stringify(data, null, 2));
                throw new Error(data.message || `Mayar API error: ${response.status} ${response.statusText}`);
            }

            console.log("Mayar: Payment link created successfully, txId:", data.data?.transactionId);
            return {
                id: data.data.id,
                transactionId: data.data.transactionId || data.data.transaction_id,
                link: data.data.link,
            };
        } catch (error: any) {
            console.error("Mayar Utility Error Details:", error);
            throw new Error(`Integrasi Mayar Gagal: ${error.message}`);
        }
    },
};
