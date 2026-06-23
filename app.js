/* ============================================================
   TimeTravel Agency — logique front (JS vanilla)
   Destinations, quiz, modale, chatbot, reveal au scroll.
   ============================================================ */

/* ---------- DONNÉES ---------- */
const DESTINATIONS = {
  paris: {
    key:'paris', index:'01', tag:'Belle Époque', era:'Paris', year:'1889', reverse:false,
    img:'assets/Paris_expo_1889_16_9.png',
    hook:"Gravissez la Tour Eiffel le mois de son inauguration, parmi les premiers visiteurs d'une Exposition Universelle que tout Paris conteste encore.",
    price:'14 280', duration:'6 jours · 2 voyageurs',
    description:"Le 6 mai 1889, le Champ-de-Mars s'ouvre sur la plus vaste Exposition Universelle jamais organisée. La Tour Eiffel, achevée depuis quelques semaines, divise encore les peintres et les poètes. Vous logez boulevard des Capucines, dînez au Café Anglais et assistez aux premières projections d'images animées, dans une ville qui s'électrifie sous vos yeux.",
    highlights:[
      "Ascension privée de la Tour Eiffel avant l'ouverture au public",
      "Dîner sept services au Café Anglais, rue de Gramont",
      "Loge à l'Opéra Garnier pour une soirée Gounod",
      "Galerie des Machines : la fée Électricité en démonstration",
    ],
  },
  cretace:{
    key:'cretace', index:'02', tag:'Maastrichtien', era:'Crétacé', year:'−65 000 000', reverse:true,
    img:'assets/Cretace_16_9.png',
    hook:"Traversez une plaine de fougères géantes où les Triceratops broutent à l'ombre des séquoias, quelques millénaires avant l'impact de Chicxulub.",
    price:'38 640', duration:'4 jours · escorte armée',
    description:"Maastrichtien, −65 millions d'années. Votre capsule se pose dans une plaine alluviale d'Amérique du Nord, à l'aube de la grande extinction. L'air est dense, chargé d'oxygène et d'odeurs de magnolias primitifs. Sous escorte permanente, vous observez les troupeaux de Triceratops, les vols de Quetzalcoatlus et, à distance prudente, un Tyrannosaurus en chasse au crépuscule.",
    highlights:[
      "Affût surélevé face à un troupeau de Triceratops",
      "Survol silencieux d'une colonie de Quetzalcoatlus",
      "Relevé botanique des premières plantes à fleurs",
      "Veille nocturne sous un ciel sans pollution lumineuse",
    ],
  },
  florence:{
    key:'florence', index:'03', tag:'Renaissance', era:'Florence', year:'1504', reverse:false,
    img:'assets/Florence_renaissance_16_9.png',
    hook:"Assistez au dévoilement du David sous le ciseau encore actif de Michel-Ange, Piazza della Signoria, au cœur d'une République en effervescence.",
    price:'21 900', duration:'5 jours · 2 voyageurs',
    description:"Septembre 1504. La République de Florence hisse le David sur la Piazza della Signoria, après quatre jours de transport depuis l'atelier de l'Opera del Duomo. Michel-Ange a vingt-neuf ans. Dans les rues, Léonard de Vinci esquisse, les Médicis manœuvrent depuis l'exil, et les ateliers bruissent de pigments broyés et de poussière de marbre.",
    highlights:[
      "Présence au levage du David, Piazza della Signoria",
      "Visite de l'atelier de Léonard de Vinci",
      "Accès aux jardins de San Marco et leurs antiques",
      "Banquet chez un marchand de laine du Quartiere",
    ],
  },
};

const QUIZ = [
  { q:"Quel type d'expérience recherchez-vous ?", options:[
    {label:"Culturelle et artistique", v:'florence'},
    {label:"Aventure et nature", v:'cretace'},
    {label:"Élégance et raffinement", v:'paris'},
  ]},
  { q:"Votre période de prédilection ?", options:[
    {label:"L'histoire moderne", v:'paris'},
    {label:"Les temps anciens", v:'cretace'},
    {label:"La Renaissance", v:'florence'},
  ]},
  { q:"Vous êtes plutôt attiré par…", options:[
    {label:"L'effervescence urbaine", v:'paris'},
    {label:"La nature sauvage", v:'cretace'},
    {label:"L'art et l'architecture", v:'florence'},
  ]},
  { q:"Votre activité idéale sur place ?", options:[
    {label:"Visiter des monuments", v:'paris'},
    {label:"Observer la faune", v:'cretace'},
    {label:"Explorer des musées", v:'florence'},
  ]},
];

// Texte de secours si l'IA n'est pas joignable
const FALLBACK_COPY = {
  paris:"Vos réponses dessinent un voyageur d'élégance, sensible à l'effervescence d'une grande ville en pleine mue. Paris 1889 vous tend ses boulevards éclairés au gaz et sa Tour toute neuve.",
  cretace:"Vous cherchez l'ailleurs absolu, le silence d'un monde sans humains. Le Crétacé répond à cet appel : une nature démesurée, observée depuis l'abri d'une capsule.",
  florence:"L'art et le geste de création vous attirent plus que tout. Florence 1504 vous place au plus près des ateliers, le jour où la Renaissance se met debout sur une place publique.",
};

/* ---------- ÉTAT ---------- */
const state = { activeKey:null, reserved:false, quizStep:-1, quizAnswers:[], quizResult:null };

/* ---------- UTIL ---------- */
const $ = (s,el=document)=>el.querySelector(s);
const esc = (s)=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

/* ---------- DESTINATIONS ---------- */
function renderDestinations(){
  const list = $('#dest-list');
  list.innerHTML = Object.values(DESTINATIONS).map(d=>`
    <article class="reveal">
      <div class="dest-row${d.reverse?' reverse':''}">
        <button class="dest-media" data-open="${d.key}" aria-label="Explorer ${esc(d.era)} ${esc(d.year)}">
          <img src="${d.img}" alt="${esc(d.era)} ${esc(d.year)}" loading="lazy">
          <span class="dest-scrim"></span>
          <span class="dest-num">${d.index}</span>
          <span class="dest-tag">${esc(d.tag)}</span>
        </button>
        <div class="dest-body">
          <div class="dest-year">${esc(d.year)}</div>
          <h3>${esc(d.era)}</h3>
          <p class="dest-hook">${esc(d.hook)}</p>
          <div class="dest-foot">
            <button class="dest-explore" data-open="${d.key}">Explorer cette époque <span aria-hidden="true">&rarr;</span></button>
            <div class="dest-price"><b>${esc(d.price)}</b> crédits temporels</div>
          </div>
        </div>
      </div>
    </article>`).join('');
  observeReveals();
}

/* ---------- MODALE ---------- */
function openModal(key){
  state.activeKey = key; state.reserved = false;
  const d = DESTINATIONS[key];
  $('#modal-card').innerHTML = `
    <div class="modal-hero">
      <img src="${d.img}" alt="${esc(d.era)} ${esc(d.year)}">
      <span class="scrim"></span>
      <button class="modal-close" data-close aria-label="Fermer">&times;</button>
      <div class="modal-titlebar">
        <span class="modal-tag">${esc(d.tag)}</span>
        <div class="ttl"><h3>${esc(d.era)}</h3><span class="yr">${esc(d.year)}</span></div>
      </div>
    </div>
    <div class="modal-body">
      <p class="desc">${esc(d.description)}</p>
      <div class="modal-sub">Au programme</div>
      <div class="modal-highlights">
        ${d.highlights.map(h=>`<div class="modal-hl"><span class="di">&#9670;</span><span>${esc(h)}</span></div>`).join('')}
      </div>
      <div class="modal-foot">
        <div class="modal-price">
          <div><span class="p">${esc(d.price)}</span><span class="u">crédits temporels</span></div>
          <div class="d">${esc(d.duration)} · assurance paradoxe incluse</div>
        </div>
        <button class="btn btn-gold" data-reserve>Réserver ce voyage</button>
      </div>
      <div id="reserve-panel"></div>
    </div>`;
  $('#modal').hidden = false;
  document.body.style.overflow = 'hidden';
}
function closeModal(){ state.activeKey=null; $('#modal').hidden=true; document.body.style.overflow=''; }

// Affiche le formulaire de réservation dans la modale
function reserve(){
  const d = DESTINATIONS[state.activeKey];
  const btn = $('#modal-card [data-reserve]');
  if(btn) btn.disabled = true;
  const today = new Date().toISOString().split('T')[0];
  $('#reserve-panel').innerHTML = `
    <form id="reserve-form" class="reserve-form" novalidate>
      <div class="reserve-title">Demande de calibrage — ${esc(d.era)} ${esc(d.year)}</div>
      <div class="reserve-grid">
        <label class="reserve-field">
          <span>Destination</span>
          <input type="text" value="${esc(d.era)} · ${esc(d.year)}" readonly>
        </label>
        <label class="reserve-field">
          <span>Date de départ souhaitée</span>
          <input type="date" name="date" min="${today}" required>
        </label>
        <label class="reserve-field">
          <span>Voyageurs</span>
          <select name="travelers" required>
            <option value="1">1 voyageur</option>
            <option value="2" selected>2 voyageurs</option>
            <option value="3">3 voyageurs</option>
            <option value="4">4 voyageurs</option>
          </select>
        </label>
        <label class="reserve-field">
          <span>E-mail de contact</span>
          <input type="email" name="email" placeholder="vous@exemple.fr" required>
        </label>
      </div>
      <div class="reserve-actions">
        <span class="reserve-note">Sans engagement — un conseiller-historien valide la disponibilité de la capsule.</span>
        <button type="submit" class="btn btn-gold">Envoyer ma demande</button>
      </div>
    </form>`;
  $('#reserve-panel').scrollIntoView({behavior:'smooth', block:'nearest'});
}

// Valide et confirme la réservation
function submitReserve(e){
  e.preventDefault();
  const form = e.target;
  if(!form.reportValidity()) return;
  state.reserved = true;
  const d = DESTINATIONS[state.activeKey];
  const data = new FormData(form);
  const date = new Date(data.get('date')).toLocaleDateString('fr-FR', {day:'numeric', month:'long', year:'numeric'});
  const foot = $('#modal-card .modal-foot');
  if(foot) foot.style.display = 'none';
  $('#reserve-panel').innerHTML = `
    <div class="reserve-confirm">
      <div class="reserve-check" aria-hidden="true">&#10003;</div>
      <div class="reserve-title">Demande transmise</div>
      <p>Votre départ pour <strong>${esc(d.era)} ${esc(d.year)}</strong>, le <strong>${esc(date)}</strong> (${esc(data.get('travelers'))} voyageur·s), a bien été enregistré. Un conseiller-historien vous écrit à <strong>${esc(data.get('email'))}</strong> sous 48 h pour le calibrage de la capsule.</p>
    </div>`;
  $('#reserve-panel').scrollIntoView({behavior:'smooth', block:'nearest'});
}

/* ---------- QUIZ ---------- */
function renderQuiz(){
  const card = $('#quiz-card');
  const step = state.quizStep;
  if(step < 0){
    card.innerHTML = `
      <div class="quiz-intro">
        <div class="t">Prêt à partir ?</div>
        <p>Répondez sans réfléchir. La première impression dit souvent vers quelle époque penche votre désir de voyage.</p>
        <button class="btn btn-gold" data-quiz="start">Commencer le quiz</button>
      </div>`;
  } else if(step < QUIZ.length){
    const q = QUIZ[step];
    const progress = Math.round((step / QUIZ.length) * 100);
    card.innerHTML = `
      <div class="quiz-progress-row"><span class="quiz-step">Question ${step+1} / ${QUIZ.length}</span></div>
      <div class="quiz-bar"><i style="width:${progress}%"></i></div>
      <div class="quiz-q">
        <h3>${esc(q.q)}</h3>
        <div class="quiz-options">
          ${q.options.map((o,i)=>`<button class="quiz-opt" data-pick="${o.v}" data-i="${i}"><span class="pip"></span>${esc(o.label)}</button>`).join('')}
        </div>
      </div>`;
  } else {
    const d = DESTINATIONS[state.quizResult];
    card.innerHTML = `
      <div class="quiz-result">
        <div class="label">Votre époque idéale</div>
        <div class="year">${esc(d.year)}</div>
        <h3>${esc(d.era)}</h3>
        <p class="copy loading" id="quiz-copy">Notre conseiller rédige votre recommandation…</p>
        <div class="quiz-result-actions">
          <button class="btn btn-gold" data-quiz="reserve">Voir cette destination</button>
          <button class="btn btn-ghost" data-quiz="reset">Refaire le quiz</button>
        </div>
      </div>`;
    fetchQuizCopy(state.quizResult, state.quizAnswers);
  }
}
function startQuiz(){ state.quizStep=0; state.quizAnswers=[]; state.quizResult=null; renderQuiz(); }
function resetQuiz(){ startQuiz(); }
function pickAnswer(v){
  state.quizAnswers.push(v);
  if(state.quizAnswers.length >= QUIZ.length){
    const tally={};
    state.quizAnswers.forEach(a=>tally[a]=(tally[a]||0)+1);
    let best=state.quizAnswers[0], bestN=0;
    ['paris','cretace','florence'].forEach(k=>{ if((tally[k]||0)>bestN){bestN=tally[k];best=k;} });
    state.quizResult=best; state.quizStep=QUIZ.length;
  } else {
    state.quizStep=state.quizAnswers.length;
  }
  renderQuiz();
}

// Recommandation personnalisée rédigée par l'IA (avec repli statique)
async function fetchQuizCopy(resultKey, answers){
  const el = $('#quiz-copy');
  const labels = answers.map((v,i)=>QUIZ[i].options.find(o=>o.v===v)?.label).filter(Boolean);
  const d = DESTINATIONS[resultKey];
  try{
    const res = await fetch('/api/chat',{
      method:'POST', headers:{'Content-Type':'application/json'},
      body:JSON.stringify({ messages:[{
        role:'user',
        content:`Un voyageur a répondu à notre quiz. Ses réponses : ${labels.join(', ')}. La destination recommandée est ${d.era} (${d.year}). Rédige une recommandation personnalisée de 2 phrases, élégante et évocatrice, qui relie ses réponses à cette époque. Sans superlatif creux, sans emoji. Réponds uniquement par le texte.`
      }]})
    });
    if(!res.ok) throw new Error('api');
    const data = await res.json();
    const txt = (data.reply||'').trim();
    if(txt){ el.textContent = txt; el.classList.remove('loading'); return; }
    throw new Error('empty');
  }catch(e){
    el.textContent = FALLBACK_COPY[resultKey];
    el.classList.remove('loading');
  }
}

/* ---------- CHATBOT ---------- */
const chat = { open:false, history:[] };
function toggleChat(){
  chat.open = !chat.open;
  $('#chat-panel').hidden = !chat.open;
  $('#chat-toggle span').textContent = chat.open ? '×' : '⏳';
  if(chat.open) setTimeout(()=>$('#chat-input').focus(), 60);
}
function appendMsg(role, text){
  const scroll = $('#chat-scroll');
  const div = document.createElement('div');
  div.className = 'msg ' + (role==='user'?'user':'bot');
  div.innerHTML = role==='user'
    ? `<div class="bubble user">${esc(text)}</div>`
    : `<span class="msg-avatar">⏳</span><div class="bubble bot">${esc(text)}</div>`;
  scroll.appendChild(div);
  scroll.scrollTop = scroll.scrollHeight;
  return div;
}
async function sendChat(e){
  e.preventDefault();
  const input = $('#chat-input');
  const text = input.value.trim();
  if(!text) return;
  input.value='';
  appendMsg('user', text);
  chat.history.push({role:'user', content:text});

  const typing = appendMsg('bot', '…');
  typing.querySelector('.bubble').classList.add('typing');

  try{
    const res = await fetch('/api/chat',{
      method:'POST', headers:{'Content-Type':'application/json'},
      body:JSON.stringify({ messages: chat.history })
    });
    if(!res.ok) throw new Error('api');
    const data = await res.json();
    const reply = (data.reply||'').trim() || localReply(text);
    typing.remove();
    appendMsg('bot', reply);
    chat.history.push({role:'assistant', content:reply});
  }catch(err){
    const reply = localReply(text);
    typing.remove();
    appendMsg('bot', reply);
    chat.history.push({role:'assistant', content:reply});
  }
}
// Repli local par mots-clés (fonctionne même sans API / ouvert en file://)
function localReply(text){
  const t = text.toLowerCase();
  if(/bonjour|salut|bonsoir|hello|coucou/.test(t)) return "Bonjour, et bienvenue chez TimeTravel Agency. Trois époques vous attendent : la Belle Époque parisienne, le Crétacé sauvage ou la Renaissance florentine. Laquelle éveille votre curiosité ?";
  if(/paris|eiffel|1889|belle.?époque|capucines/.test(t)) return "Paris 1889 ravit les amateurs d'élégance : vous logez boulevard des Capucines et gravissez la Tour Eiffel le mois de son inauguration. Six jours, à partir de 14 280 crédits temporels pour deux voyageurs.";
  if(/crétac|cretac|dinosaure|triceratops|t.?rex|tyranno|préhist|prehist/.test(t)) return "Le Crétacé est notre expédition la plus engagée : −65 millions d'années, troupeaux de Triceratops et vols de Quetzalcoatlus, sous escorte permanente. Comptez 38 640 crédits temporels, capsule d'observation comprise.";
  if(/florence|david|michel|renaissance|vinci|1504/.test(t)) return "Florence 1504, c'est assister au levage du David sur la Piazza della Signoria, Michel-Ange encore à l'œuvre. Cinq jours à 21 900 crédits temporels, visite de l'atelier de Léonard incluse.";
  if(/prix|tarif|crédit|credit|coût|cout|combien|euros?/.test(t)) return "Nos voyages s'échelonnent de 14 280 crédits (Paris 1889) à 38 640 crédits (Crétacé). Florence 1504 se situe à 21 900. Le crédit temporel se règle avant le calibrage de la capsule.";
  if(/sécur|secur|paradoxe|danger|risque|empreinte|protocole/.test(t)) return "Aucune empreinte laissée : vous observez sans interagir. Chaque capsule est isolée du fil causal, un historien-escorte veille au protocole et l'assurance paradoxe est toujours incluse.";
  if(/réserv|reserv|book|partir|inscri/.test(t)) return "Pour réserver, choisissez une époque dans nos destinations puis validez depuis sa fiche. Un conseiller-historien vous recontacte sous 48 heures pour le calibrage de la capsule.";
  if(/quiz|époque idéale|epoque ideale|conseil|recommand/.test(t)) return "Notre quiz « Trouvez votre époque idéale » vous oriente en quatre questions. Vous le trouverez plus haut sur cette page — dites-m'en plus sur vos envies, je peux aussi vous guider directement.";
  return "Je suis l'assistant de TimeTravel Agency. Interrogez-moi sur Paris 1889, le Crétacé ou Florence 1504 — durée, tarifs en crédits temporels, protocole de sécurité — et je vous oriente vers l'époque qui vous ressemble.";
}

/* ---------- SCROLL & REVEAL ---------- */
let io;
function observeReveals(){
  if(!io){
    io = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
    }, {threshold:0.16});
  }
  document.querySelectorAll('.reveal:not(.in)').forEach(el=>io.observe(el));
}
function scrollToId(id){
  if(id==='home'){ window.scrollTo({top:0,behavior:'smooth'}); return; }
  const el = document.getElementById(id);
  if(el) window.scrollTo({top:el.getBoundingClientRect().top+window.scrollY-70, behavior:'smooth'});
}

/* ---------- INIT ---------- */
function init(){
  renderDestinations();
  renderQuiz();
  observeReveals();

  // header au scroll
  const header = $('#site-header');
  const onScroll = ()=>header.classList.toggle('scrolled', window.scrollY>28);
  window.addEventListener('scroll', onScroll, {passive:true}); onScroll();

  // délégation de clics
  document.addEventListener('click', (e)=>{
    const t = e.target.closest('[data-scroll],[data-open],[data-close],[data-reserve],[data-quiz],[data-pick]');
    if(!t) return;
    if(t.dataset.scroll!==undefined) scrollToId(t.dataset.scroll);
    else if(t.dataset.open) openModal(t.dataset.open);
    else if(t.dataset.close!==undefined) closeModal();
    else if(t.dataset.reserve!==undefined) reserve();
    else if(t.dataset.pick) pickAnswer(t.dataset.pick);
    else if(t.dataset.quiz==='start') startQuiz();
    else if(t.dataset.quiz==='reset') resetQuiz();
    else if(t.dataset.quiz==='reserve' && state.quizResult) openModal(state.quizResult);
  });
  // fermer la modale en cliquant le fond
  $('#modal').addEventListener('click', (e)=>{ if(e.target.id==='modal') closeModal(); });
  // soumission du formulaire de réservation (contenu injecté)
  $('#modal').addEventListener('submit', (e)=>{ if(e.target.id==='reserve-form') submitReserve(e); });
  document.addEventListener('keydown', (e)=>{ if(e.key==='Escape' && state.activeKey) closeModal(); });

  // chat
  $('#chat-toggle').addEventListener('click', toggleChat);
  $('#chat-min').addEventListener('click', toggleChat);
  $('#chat-form').addEventListener('submit', sendChat);
}
document.addEventListener('DOMContentLoaded', init);
