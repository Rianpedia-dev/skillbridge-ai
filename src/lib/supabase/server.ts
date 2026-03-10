import { createClient } from "@supabase/supabase-js";

// Validate env vars
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.warn("Supabase credentials not found in environment variables");
}

let supabase: ReturnType<typeof createClient> | null = null;

if (supabaseUrl && supabaseServiceKey) {
    supabase = createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    });
}

/**
 * Uploads a file to a specified Supabase storage bucket
 * @param bucket Name of the bucket (e.g., 'services')
 * @param path Path and filename inside the bucket
 * @param file The File object to upload
 * @returns Object with error or publicUrl
 */
export async function uploadToSupabaseStorage(
    bucket: string,
    path: string,
    file: File
): Promise<{ publicUrl: string | null; error: Error | null }> {
    if (!supabase) {
        return {
            publicUrl: null,
            error: new Error("Supabase client is not initialized. Please check your environment variables."),
        };
    }

    try {
        const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
            upsert: true,
            contentType: file.type || "application/octet-stream",
        });

        if (error) {
            console.error("Supabase Storage upload error:", error);
            return { publicUrl: null, error };
        }

        // Get public URL
        const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(path);

        return {
            publicUrl: publicUrlData.publicUrl,
            error: null,
        };
    } catch (error) {
        console.error("Unknown error uploading to Supabase:", error);
        return { publicUrl: null, error: error as Error };
    }
}
