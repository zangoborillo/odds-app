export default async function handler(req, res) {
  const API_KEY = '0c5e0ff04f517eb0bcf5b8ace74d54d7';
  const { sport } = req.query;

  if (!sport) {
    return res.status(400).json({ error: 'Parametro sport mancante' });
  }

  try {
    // Data da 3 giorni fa per storico
    const date = new Date();
    date.setDate(date.getDate() - 3);
    const dateFrom = date.toISOString();
    
    // URL endpoint historical
    const url = `https://api.the-odds-api.com/v4/historical/sports/${sport}/odds?apiKey=${API_KEY}&regions=eu&markets=h2h&oddsFormat=decimal&dateFrom=${dateFrom}&bookmakers=pinnacle`;
    
    console.log('Chiamata API Historical:', url);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Errore API:', response.status, errorText);
      throw new Error(`API Error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    
    console.log('Dati ricevuti:', data.length, 'partite');
    
    // Headers CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    return res.status(200).json(data);
    
  } catch (error) {
    console.error('Errore server:', error);
    return res.status(500).json({ 
      error: error.message,
      details: 'Verifica che l\'API key abbia accesso all\'endpoint historical'
    });
  }
}
