// Vercel API Route for Health Check
export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  // Return health status
  const response = {
    status: "healthy",
    service: "Looklyy API",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    platform: "Vercel Serverless"
  };

  res.status(200).json(response);
}
