// Serveur de développement local — sert le site statique + l'endpoint /api/chat.
// Usage : node dev-server.mjs   (lit la clé depuis .env.local)
// Pour la prod, c'est api/chat.js (Vercel) qui prend le relais — même logique.

import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { existsSync, readFileSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import { getGroqReply } from './api/chat.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = 3000;

// Charge .env.local → process.env
if(existsSync(join(__dirname, '.env.local'))){
  for(const line of readFileSync(join(__dirname, '.env.local'), 'utf8').split('\n')){
    const m = line.match(/^\s*([\w.]+)\s*=\s*(.*)\s*$/);
    if(m) process.env[m[1]] = m[2].trim();
  }
}

const MIME = {
  '.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8',
  '.js':'text/javascript; charset=utf-8', '.mjs':'text/javascript; charset=utf-8',
  '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg',
  '.webp':'image/webp', '.svg':'image/svg+xml', '.json':'application/json',
};

const server = createServer(async (req, res)=>{
  // ---- API ----
  if(req.url === '/api/chat' && req.method === 'POST'){
    let body = '';
    req.on('data', c => body += c);
    req.on('end', async ()=>{
      try{
        const { messages = [] } = JSON.parse(body || '{}');
        const { status, payload } = await getGroqReply(messages, process.env.GROQ_API_KEY);
        res.writeHead(status, {'Content-Type':'application/json'});
        res.end(JSON.stringify(payload));
      }catch(err){
        res.writeHead(500, {'Content-Type':'application/json'});
        res.end(JSON.stringify({error:'server', detail:String(err)}));
      }
    });
    return;
  }

  // ---- Fichiers statiques ----
  let path = decodeURIComponent(req.url.split('?')[0]);
  if(path === '/') path = '/index.html';
  const filePath = normalize(join(__dirname, path));
  if(!filePath.startsWith(__dirname)){ res.writeHead(403); res.end('Forbidden'); return; }
  try{
    const data = await readFile(filePath);
    res.writeHead(200, {'Content-Type': MIME[extname(filePath)] || 'application/octet-stream'});
    res.end(data);
  }catch{
    res.writeHead(404); res.end('Not found');
  }
});

server.listen(PORT, ()=>{
  const hasKey = !!process.env.GROQ_API_KEY && process.env.GROQ_API_KEY.startsWith('gsk_');
  console.log(`\n  TimeTravel Agency — http://localhost:${PORT}`);
  console.log(`  Clé Groq : ${hasKey ? 'détectée ✓' : 'MANQUANTE (le chatbot utilisera le repli local)'}\n`);
});
