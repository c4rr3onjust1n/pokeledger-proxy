export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { path, ...params } = req.query;
  params['api_key'] = 'tcg_live_ae57dcf8f02d7e9742d392b9c36e4c62e9591a08';
  const queryString = new URLSearchParams(params).toString();
  const url = `https://api.tcgapi.dev/v1/${path}?${queryString}`;

  const response = await fetch(url);
  const text = await response.text();
  res.setHeader('Content-Type', 'application/json');
  return res.status(response.status).send(JSON.stringify({
    status: response.status,
    url_called: url,
    body: text
  }));
}
