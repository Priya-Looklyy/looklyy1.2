import { Router } from 'express';
import { validateTrackPayload } from '../lib/validateTrackPayload.js';
import { mapPayloadToVisitorLogRow } from '../lib/mapRow.js';
import { isUniqueViolation } from '../lib/supabase.js';

/**
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 */
export function createTrackRouter(supabase) {
  const router = Router();

  router.post('/track', async (req, res, next) => {
    try {
      const parsed = validateTrackPayload(req.body);
      if (!parsed.ok) {
        return res.status(parsed.status || 400).json({
          success: false,
          error: parsed.error,
        });
      }

      const row = mapPayloadToVisitorLogRow(parsed.data, req);

      const { error } = await supabase.from('visitor_logs').insert(row);

      if (error && isUniqueViolation(error)) {
        return res.status(200).json({
          success: true,
          duplicate: true,
          message: 'Session already recorded',
        });
      }

      if (error) {
        console.error('[track] Supabase insert', error);
        return res.status(503).json({
          success: false,
          error: 'Database error',
          code: 'DB_INSERT_FAILED',
        });
      }

      return res.status(200).json({
        success: true,
        duplicate: false,
      });
    } catch (err) {
      next(err);
    }
  });

  return router;
}
