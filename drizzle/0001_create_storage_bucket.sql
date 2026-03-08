-- Create the bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('skillbridge-bucket', 'skillbridge-bucket', true)
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

-- Allow public access to read files
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'skillbridge-bucket' );
--> statement-breakpoint

-- Allow authenticated users to upload files
CREATE POLICY "Authenticated Upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'skillbridge-bucket' );
--> statement-breakpoint

-- Allow authenticated users to update their own files
CREATE POLICY "Authenticated Update Own Objects"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'skillbridge-bucket' AND auth.uid() = owner );
--> statement-breakpoint

-- Allow authenticated users to delete their own files
CREATE POLICY "Authenticated Delete Own Objects"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'skillbridge-bucket' AND auth.uid() = owner );
