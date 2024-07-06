const PARAMS = Object.freeze({
    SUPABASE_JWT_LIFETIME: 3600,
    SUPABASE_ROLE: "claim_role",
    SUPABASE_USERS_TABLE: "users",
    SUPABASE_SCHEMA: "custom_schema",
    REDIS_LOCK_TIME: 600
});

module.exports = {
    PARAMS
}