/**
 * Express error-handling middleware (4 args).
 */
export function errorHandler(err, _req, res, _next) {
  console.error('[server]', err);
  const status = typeof err.status === 'number' ? err.status : 500;
  const message =
    process.env.NODE_ENV === 'production' && status >= 500
      ? 'Internal server error'
      : err.message || 'Internal server error';

  res.status(status).json({
    success: false,
    error: message,
    code: err.code || 'INTERNAL_ERROR',
  });
}
