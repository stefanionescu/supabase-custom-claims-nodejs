const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const { PARAMS } = require("./constants.js");
const { createClient } = require('@supabase/supabase-js');

dotenv.config();

// Function to generate a JWT that Supabase can recognize
function generateJWT() {
    const payload = {
        aud: "authenticated",
        role: "authenticated",
        app_role: PARAMS.SUPABASE_ROLE,
        exp: Math.floor(Date.now() / 1000) + PARAMS.SUPABASE_JWT_LIFETIME
      };
    return jwt.sign(payload, process.env.SUPABASE_JWT_SECRET, { algorithm: 'HS256' });
}

// Function to check if a token is valid
function isTokenValid(token) {
    try {
        const decoded = jwt.verify(token, process.env.SUPABASE_JWT_SECRET);
        
        // Check if token is expired
        if (decoded.exp <= Math.floor(Date.now() / 1000)) {
            console.log("SUPABASE: Token has expired");
            return false;
        }
        
        // Check if the token has the correct audience and roles
        if (decoded.aud !== "authenticated" || 
            decoded.role !== "authenticated" || 
            decoded.app_role !== PARAMS.SUPABASE_ROLE) {
            console.log("SUPABASE: Token has invalid claims");
            return false;
        }
        
        return true;
    } catch (error) {
        console.error("SUPABASE: Error verifying token:", error.message);
        return false;
    }
}

async function createUserIfNotExists(token, username) {
    if (!token) {
        console.log("SUPABASE: Null JWT.");
        return;
    }

    if (!isTokenValid(token)) {
        return;
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabase = createClient(supabaseUrl, process.env.SUPABASE_ANON_KEY, {
        db: { schema: PARAMS.SUPABASE_SCHEMA },
        global: {
            headers: { 'Authorization': `Bearer ${token}` },
        },
    });

    // Check if the user already exists
    let { data: user, error: userError } = await supabase
        .from(PARAMS.SUPABASE_USERS_TABLE)
        .select('username')
        .eq('username', username)
        .maybeSingle();

    if (userError && userError.message !== 'No rows found') {
        console.error('SUPABASE: Error checking for existing user:', userError);
        return;
    }

    // If the user exists, return the existing data
    if (user) {
        console.log('SUPABASE: User already exists:', user.username);
        return user;
    }

    // If the user does not exist, create a new user
    let { data, error } = await supabase
        .from(PARAMS.SUPABASE_USERS_TABLE)
        .insert([
            { username: username }
        ])
        .select();

    if (error) {
        console.error('SUPABASE: Error creating new user:', error);
        return;
    }

    // Supabase insert returns an array, take the first element to get the created user object
    if (data && data.length == 1) {
        console.log('SUPABASE: New user created:', data[0].username);
        return data[0].username; // Return the username
    }

    console.log('SUPABASE: No user was created.');
}

const token = generateJWT();
const user  = await createUserIfNotExists(token, "newUsername")