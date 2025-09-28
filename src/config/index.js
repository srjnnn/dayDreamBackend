const config = {
    serverHost: process.env.SERVER_HOST,
    port: process.env.PORT,
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseKey: process.env.SERVICE_ROLE,
};

console.log('config:', config);

export default config;