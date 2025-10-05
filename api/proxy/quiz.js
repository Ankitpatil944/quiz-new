// Vercel API route to proxy requests to zettanix.in
export default async function handler(req, res) {
  // Enable CORS for your frontend domain
  res.setHeader('Access-Control-Allow-Origin', 'https://quiz-new-j3wl.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { method, body } = req;
    const { path } = req.query;
    
    // Forward the request to the actual API
    const response = await fetch(`https://zettanix.in${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: method !== 'GET' ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
