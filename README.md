# Supabase Custom Claims for NodeJS

This repo hosts demo code that you can use to set up and use [Supabase](https://supabase.com/) custom claims for your project.

## Setup

You need to create an account on [Supabase](https://supabase.com/) and set up a new project. You also need to have [Node](https://nodejs.org/en/download/package-manager) installed on your machine.

## Supabase SQL Script

After you create your Supabase project, you can go to the SQL Editor and run the script under `sql/create-table.sql` to create a table which can be modified using custom claims. If you also want a bucket that you can access using custom claims, run the script under `sql/create-bucket.sql`.

## Run the Test Code

You can add a new user in the `users` table by running:

```
npm install
npm run
```