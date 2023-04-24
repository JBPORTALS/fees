/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  env: {
    SUPABASE_SECRETE_KEY: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
        .eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmeXJlZGpkdW5zd3hreG16eXdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODIyNTY5ODcsImV4cCI6MTk5NzgzMjk4N30
        .Kn3L9_7YYmCJKfZpOVgLYnasMcTxGOKWZVLTNgSrkAo`,
  },
};

module.exports = nextConfig;
