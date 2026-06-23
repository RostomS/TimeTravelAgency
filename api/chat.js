// Fonction serverless (Vercel) — proxy vers l'API Groq.
// La clé GROQ_API_KEY reste côté serveur, jamais exposée au navigateur.

export const SYSTEM_PROMPT = `Tu es le conseiller-historien de TimeTravel Agency, une maison de voyage temporel de luxe (univers fictif). Ton ton est élégant, chaleureux, confiant, sans jamais en faire trop : phrases courtes et précises, aucun superlatif creux, aucun emoji.

Tu connais exactement TROIS destinations, et UNIQUEMENT celles-ci :

1. PARIS 1889 (Belle Époque) — 14 280 crédits temporels, 6 jours, 2 voyageurs.
   Exposition Universelle, Tour Eiffel fraîchement inaugurée, boulevard des Capucines, Café Anglais, Opéra Garnier, Galerie des Machines.

2. CRÉTACÉ −65 millions d'années (Maastrichtien) — 38 640 crédits temporels, 4 jours, escorte armée.
   Plaine alluviale d'Amérique du Nord, Triceratops, Quetzalcoatlus, Tyrannosaurus à distance, juste avant l'impact de Chicxulub.

3. FLORENCE 1504 (Renaissance) — 21 900 crédits temporels, 5 jours, 2 voyageurs.
   Levage du David sur la Piazza della Signoria, Michel-Ange, atelier de Léonard de Vinci, jardins de San Marco.

RÈGLES :
- La monnaie est le « crédit temporel ». Les voyages, capsules et tarifs sont fictifs.
- Le protocole : observation sans interaction, aucune empreinte, capsule isolée du fil causal, historien-escorte, assurance paradoxe incluse.
- Réservation : on choisit une époque sur le site, un conseiller recontacte sous 48 h.
- Reste TOUJOURS dans cet univers. Si on te demande une autre époque, explique avec courtoisie que seules ces trois destinations sont ouvertes cette saison.
- Réponses concises : 2 à 4 phrases maximum.
- Tu n'es pas un assistant IA générique : tu ne mentionnes jamais que tu es une IA, ni de marque de modèle.`;

// Logique partagée (réutilisée par le serveur de dev local).
// Retourne { status, payload }.
export async function getGroqReply(messages, key){
  if(!key) return { status:500, payload:{error:'GROQ_API_KEY manquante'} };

  // On ne garde que les 12 derniers tours pour limiter les tokens.
  const trimmed = (messages || []).slice(-12).map(m=>({
    role: m.role === 'assistant' ? 'assistant' : 'user',
    content: String(m.content || '').slice(0, 2000),
  }));

  const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method:'POST',
    headers:{ 'Content-Type':'application/json', 'Authorization':`Bearer ${key}` },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 400,
      messages: [{role:'system', content:SYSTEM_PROMPT}, ...trimmed],
    }),
  });

  if(!groqRes.ok){
    const detail = await groqRes.text();
    return { status:502, payload:{error:'Groq error', detail} };
  }
  const data = await groqRes.json();
  const reply = data?.choices?.[0]?.message?.content?.trim() || '';
  return { status:200, payload:{ reply } };
}

export default async function handler(req, res){
  if(req.method !== 'POST'){ res.status(405).json({error:'Method not allowed'}); return; }
  try{
    const { messages = [] } = req.body || {};
    const { status, payload } = await getGroqReply(messages, process.env.GROQ_API_KEY);
    res.status(status).json(payload);
  }catch(err){
    res.status(500).json({error:'server', detail:String(err)});
  }
}
