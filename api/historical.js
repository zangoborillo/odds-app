export default async function handler(req, res) {
  const API_KEY = '0c5e0ff04f517eb0bcf5b8ace74d54d7';
  const { sport } = req.query;

  if (!sport) {
    return res.status(400).json({ error: 'Sport parameter required' });
  }

  try {
    // Endpoint per dati storici (ultimi 3 giorni)
    const date = new Date();
    date.setDate(date.getDate() - 3); // 3 giorni fa
    const dateFrom = date.toISOString();
    
    const url = `https://api.the-odds-api.com/v4/historical/sports/${sport}/odds?apiKey=${API_KEY}&regions=eu&markets=h2h&oddsFormat=decimal&dateFrom=${dateFrom}&bookmakers=pinnacle`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    
    return res.status(200).json(data);
    
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
