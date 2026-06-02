declare namespace NodeJS {
  interface ProcessEnv {
    JWT_SECRET: string;
    NEXT_PUBLIC_SUPABASE_URL: string;
    SUPABASE_SERVICE_ROLE_KEY: string;
    NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
  }
}
