import 'dotenv/config';

function required(name) {
  const v = process.env[name];
  if (!v || !String(v).trim()) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return v.trim();
}

export function loadEnv() {
  const port = Number.parseInt(process.env.PORT || '4000', 10);
  const supabaseUrl = required('SUPABASE_URL');
  const supabaseServiceKey = required('SUPABASE_SERVICE_ROLE_KEY');
  const nodeEnv = process.env.NODE_ENV || 'development';
  const corsOrigin = process.env.CORS_ORIGIN || '*';

  return {
    port: Number.isFinite(port) && port > 0 ? port : 4000,
    nodeEnv,
    supabaseUrl,
    supabaseServiceKey,
    corsOrigin,
  };
}
