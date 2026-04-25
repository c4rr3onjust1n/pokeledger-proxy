export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { path, ...params } = req.query;
    const queryString = new URLSearchParams(params).toString();
    const url = `https://api.tcgapi.dev/v1/${path}?${queryString}`;

    const response = await fetch(url, {
      headers: {
        'X-API-Key': 'tcg_live_ae57dcf8f02d7e9742d392b9c36e4c62e9591a08'
      }
    });

    const text = await response.text();

    // Try to parse as JSON, fallback to wrapping the error
    let body;
    try {
      body = JSON.parse(text);
    } catch {
      body = { error: { message: text, code: 'PARSE_ERROR' } };
    }

    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({
      status: response.status,
      url_called: url,
      body: JSON.stringify(body)
    });

  } catch (err) {
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({
      status: 500,
      url_called: 'unknown',
      body: JSON.stringify({ error: { message: err.message, code: 'PROXY_ERROR' } })
    });
  }
}
