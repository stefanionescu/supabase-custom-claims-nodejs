# Supabase Custom Claims for NodeJS

This repo hosts demo code that you can use to set up and use [Supabase](https://supabase.com/) custom claims for your project.

## Setup

You need to create an account on [Supabase](https://supabase.com/) and set up a new project. You also need to have [Node](https://nodejs.org/en/download/package-manager) installed on your machine.

## Supabase SQL Script

After you create your Supabase project, you can go to the SQL Editor and run this script:

```sql
-- Ensure the extension for UUID generation is enabled if it is used in your tables
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create a new schema if it does not exist
CREATE SCHEMA IF NOT EXISTS custom_schema;

-- Create table within the schema if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'custom_schema' AND table_name = 'users') THEN
        CREATE TABLE custom_schema.users (
            user_id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
            username text NOT NULL
        );
    END IF;
END $$;

-- Grant usage on the schema to authenticated role only
GRANT USAGE ON SCHEMA custom_schema TO authenticated;

-- Grant permissions on tables to authenticated role only
GRANT ALL ON custom_schema.users TO authenticated;

-- Grant usage on all sequences in the schema
GRANT USAGE ON ALL SEQUENCES IN SCHEMA custom_schema TO authenticated;

-- Enable Row Level Security (RLS) for both tables
ALTER TABLE custom_schema.users ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Allow select for claim_role" ON custom_schema.users
    FOR SELECT USING (auth.jwt() ->> 'app_role' = 'claim_role');

CREATE POLICY "Allow insert for claim_role" ON custom_schema.users
    FOR INSERT WITH CHECK (auth.jwt() ->> 'app_role' = 'claim_role');
```

## Run the Test Code

You can add a new user in the `users` table by running:

```
npm install
npm run
```