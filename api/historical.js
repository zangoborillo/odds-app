export default async function handler(req, res) {
  const API_KEY = '0c5e0ff04f517eb0bcf5b8ace74d54d7';
  const { sport } = req.query;

  if (!sport) {
    return res.status(400).json({ error: 'Parametro sport mancante' });
  }

  try {
    // Calcola timestamp in secondi (non ISO string!)
    const now = Math.floor(Date.now() / 1000);
    const threeDaysAgo = now - (3 * 24 * 60 * 60); // 3 giorni fa in secondi
    
    // URL corretto con timestamp in secondi
    const url = `https://api.the-odds-api.com/v4/historical/sports/${sport}/odds?apiKey=${API_KEY}&regions=eu&markets=h2h&oddsFormat=decimal&date=${threeDaysAgo}&bookmakers=pinnacle`;
    
    console.log('Chiamata API Historical con timestamp:', threeDaysAgo);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Errore API:', response.status, errorText);
      throw new Error(`API Error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    
    console.log('Dati ricevuti:', data.length || 0, 'eventi');
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    return res.status(200).json(data);
    
  } catch (error) {
    console.error('Errore server:', error);
    return res.status(500).json({ 
      error: error.message,
      details: 'Problema con endpoint historical - potrebbe richiedere un piano API specifico'
    });
  }
}
