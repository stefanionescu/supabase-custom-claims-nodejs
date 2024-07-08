const PARAMS = Object.freeze({
    SUPABASE_JWT_LIFETIME: 3600,
    SUPABASE_ROLE: "claim_role",
    SUPABASE_USERS_TABLE: "users",
    SUPABASE_SCHEMA: "custom_schema",
    SUPABASE_BUCKET: "custom-bucket",
    SUPABASE_PRIMARY_BUCKET_ROLE: "main_role",
    SUPABASE_SECONDARY_BUCKET_ROLE: "secondary_role"
});

module.exports = {
    PARAMS
}