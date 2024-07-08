-- Enable RLS on the storage.objects table
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

-- Create custom-bucket bucket
INSERT INTO storage.buckets (id, name, file_size_limit, allowed_mime_types)
VALUES (
  'custom-bucket', 
  'custom-bucket', 
  5368709120, -- 5 GB in bytes
  ARRAY['video/mp4', 'video/webm', 'video/quicktime']
)
ON CONFLICT (id) DO UPDATE
SET 
  file_size_limit = 5368709120,
  allowed_mime_types = ARRAY['video/mp4', 'video/webm', 'video/quicktime'];

  -- Policies for custom-bucket bucket
CREATE POLICY "INSERTs on custom-bucket #1"
ON storage.buckets
FOR INSERT
WITH CHECK (
    name = 'custom-bucket'
    AND auth.jwt() ->> 'app_role' = 'main_role'
);

CREATE POLICY "SELECTs on custom-bucket #1"
ON storage.buckets
FOR SELECT
USING (
    name = 'custom-bucket'
    AND (
        auth.jwt() ->> 'app_role' = 'main_role'
        OR auth.jwt() ->> 'app_role' = 'secondary_role'
    )
);

CREATE POLICY "INSERTs on custom-bucket #2"
ON storage.objects
FOR INSERT
WITH CHECK (
    bucket_id = 'custom-bucket'
    AND auth.jwt() ->> 'app_role' = 'main_role'
);

CREATE POLICY "SELECTs on custom-bucket #2"
ON storage.objects
FOR SELECT
USING (
    bucket_id = 'custom-bucket'
    AND (
        auth.jwt() ->> 'app_role' = 'main_role'
        OR auth.jwt() ->> 'app_role' = 'secondary_role'
    )
);