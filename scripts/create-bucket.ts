import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load env vars
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createBucket() {
    const bucketName = 'services';

    console.log(`Checking if bucket '${bucketName}' exists...`);
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();

    if (listError) {
        console.error("Error listing buckets:", listError);
        process.exit(1);
    }

    const bucketExists = buckets.some(b => b.name === bucketName);

    if (bucketExists) {
        console.log(`Bucket '${bucketName}' already exists. Making sure it's public...`);
        const { data: updateData, error: updateError } = await supabase.storage.updateBucket(bucketName, {
            public: true,
            allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp', 'image/gif'],
            fileSizeLimit: 5242880 // 5MB
        });

        if (updateError) {
            console.error("Error updating bucket:", updateError);
            process.exit(1);
        }
        console.log("Bucket updated successfully.");

    } else {
        console.log(`Creating public bucket '${bucketName}'...`);
        const { data, error } = await supabase.storage.createBucket(bucketName, {
            public: true,
            allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp', 'image/gif'],
            fileSizeLimit: 5242880 // 5MB
        });

        if (error) {
            console.error("Error creating bucket:", error);
            process.exit(1);
        }

        console.log("Bucket created successfully:", data);
    }
}

createBucket();
