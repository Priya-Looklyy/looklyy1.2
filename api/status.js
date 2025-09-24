export default function handler(req, res) {
  res.status(200).json({ 
    status: 'working',
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url,
    framework: 'no framework detected but functions work'
  })
}
