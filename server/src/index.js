import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { loadEnv } from './lib/env.js';
import { createSupabaseAdmin } from './lib/supabase.js';
import { createTrackRouter } from './routes/track.js';
import { errorHandler } from './middleware/errorHandler.js';

let env;
try {
  env = loadEnv();
} catch (e) {
  console.error(e.message);
  process.exit(1);
}

const app = express();

app.disable('x-powered-by');
app.use(helmet());
app.use(
  cors({
    origin:
      env.corsOrigin === '*'
        ? true
        : env.corsOrigin.split(',').map((o) => o.trim()),
    methods: ['POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
    maxAge: 86400,
  }),
);
app.use(express.json({ limit: '32kb' }));

const supabase = createSupabaseAdmin({
  supabaseUrl: env.supabaseUrl,
  supabaseServiceKey: env.supabaseServiceKey,
});

app.use(createTrackRouter(supabase));

app.get('/health', (_req, res) => {
  res.status(200).json({ ok: true, service: 'looklyy-track-api' });
});

app.use((_req, res) => {
  res.status(404).json({ success: false, error: 'Not found' });
});

app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`Looklyy track API listening on port ${env.port} (${env.nodeEnv})`);
});
