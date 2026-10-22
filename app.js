'use strict';
/* ---------- Data ---------- */
const P = ['yo', 'tú', 'él/ella/usted', 'nosotros', 'vosotros', 'ellos/ustedes'];
const TN = { pres: 'Present', pret: 'Past (preterite)', imp: 'Past (imperfect)', fut: 'Future', cond: 'Conditional', perf: 'Present perfect' };
const TK = Object.keys(TN);
const END = {
  ar: { pr: 'o as a amos áis an', pt: 'é aste ó amos asteis aron', im: 'aba abas aba ábamos abais aban' },
  er: { pr: 'o es e emos éis en', pt: 'í iste ió imos isteis ieron', im: 'ía ías ía íamos íais ían' },
  ir: { pr: 'o es e imos ís en', pt: 'í iste ió imos isteis ieron', im: 'ía ías ía íamos íais ían' }
};
const FUT = 'é ás á emos éis án'.split(' '), CON = 'ía ías ía íamos íais ían'.split(' ');
const HAB = 'he has ha hemos habéis han'.split(' '), PS = 'e iste o imos isteis ieron'.split(' ');

const VOCAB = {
  pronouns: [['yo', 'I'], ['tú', 'you (informal)'], ['él', 'he'], ['ella', 'she'], ['usted', 'you (formal)'], ['nosotros', 'we'], ['vosotros', 'you all (Spain)'], ['ellos', 'they (masc.)'], ['ellas', 'they (fem.)'], ['ustedes', 'you all'], ['me', 'me / to me'], ['te', 'you / to you'], ['lo', 'him / it'], ['la', 'her / it'], ['nos', 'us'], ['mi', 'my'], ['tu', 'your (informal)'], ['su', 'his / her / their'], ['nuestro', 'our'], ['este', 'this'], ['eso', 'that']],
  connectors: [['y', 'and'], ['o', 'or'], ['pero', 'but'], ['porque', 'because'], ['que', 'that / which'], ['si', 'if'], ['cuando', 'when'], ['mientras', 'while'], ['aunque', 'although'], ['también', 'also'], ['además', 'besides'], ['entonces', 'then / so'], ['luego', 'later'], ['después', 'after'], ['antes', 'before'], ['sin embargo', 'however'], ['por eso', 'that’s why'], ['así que', 'so'], ['como', 'like / as'], ['para', 'for / in order to'], ['por', 'for / because of'], ['con', 'with'], ['sin', 'without'], ['de', 'of / from'], ['en', 'in / on'], ['a', 'to / at'], ['hasta', 'until'], ['desde', 'since / from'], ['sobre', 'about / on'], ['entre', 'between'], ['pues', 'well / since']],
  questions: [['qué', 'what'], ['quién', 'who'], ['dónde', 'where'], ['cuándo', 'when'], ['cómo', 'how'], ['por qué', 'why'], ['cuánto', 'how much'], ['cuál', 'which'], ['para qué', 'what for']],
  basics: [['sí', 'yes'], ['no', 'no / not'], ['hola', 'hello'], ['adiós', 'goodbye'], ['por favor', 'please'], ['gracias', 'thank you'], ['de nada', 'you’re welcome'], ['perdón', 'sorry / excuse me'], ['buenos días', 'good morning'], ['buenas noches', 'good night'], ['aquí', 'here'], ['allí', 'there'], ['hoy', 'today'], ['mañana', 'tomorrow'], ['ayer', 'yesterday'], ['ahora', 'now'], ['siempre', 'always'], ['nunca', 'never'], ['a veces', 'sometimes'], ['muy', 'very'], ['mucho', 'a lot'], ['poco', 'a little'], ['más', 'more'], ['menos', 'less'], ['bien', 'well'], ['mal', 'badly'], ['todo', 'everything'], ['nada', 'nothing'], ['algo', 'something'], ['todos', 'everyone'], ['hay', 'there is / there are'], ['bueno', 'good'], ['grande', 'big'], ['pequeño', 'small'], ['nuevo', 'new'], ['casa', 'house'], ['tiempo', 'time / weather'], ['día', 'day'], ['persona', 'person'], ['cosa', 'thing'], ['agua', 'water'], ['comida', 'food']]
};
const LAB = { pronouns: 'Pronouns', connectors: 'Connecting words', questions: 'Question words', basics: 'Essential words', verbs: 'Verb meanings', conj: 'Verb conjugations' };

// [infinitive, meaning, overrides]  pr=present, pt=preterite, ps=preterite stem, im=imperfect, fs=future stem, pp=participle
const V = [
  ['hablar', 'to speak'], ['comer', 'to eat'], ['vivir', 'to live'], ['trabajar', 'to work'], ['estudiar', 'to study'], ['necesitar', 'to need'], ['beber', 'to drink'],
  ['escribir', 'to write', { pp: 'escrito' }],
  ['ser', 'to be (identity)', { pr: 'soy eres es somos sois son', pt: 'fui fuiste fue fuimos fuisteis fueron', im: 'era eras era éramos erais eran' }],
  ['estar', 'to be (state / place)', { pr: 'estoy estás está estamos estáis están', ps: 'estuv' }],
  ['tener', 'to have', { pr: 'tengo tienes tiene tenemos tenéis tienen', ps: 'tuv', fs: 'tendr' }],
  ['ir', 'to go', { pr: 'voy vas va vamos vais van', pt: 'fui fuiste fue fuimos fuisteis fueron', im: 'iba ibas iba íbamos ibais iban' }],
  ['hacer', 'to do / make', { pr: 'hago haces hace hacemos hacéis hacen', pt: 'hice hiciste hizo hicimos hicisteis hicieron', fs: 'har', pp: 'hecho' }],
  ['poder', 'to be able to', { pr: 'puedo puedes puede podemos podéis pueden', ps: 'pud', fs: 'podr' }],
  ['querer', 'to want', { pr: 'quiero quieres quiere queremos queréis quieren', ps: 'quis', fs: 'querr' }],
  ['decir', 'to say / tell', { pr: 'digo dices dice decimos decís dicen', pt: 'dije dijiste dijo dijimos dijisteis dijeron', fs: 'dir', pp: 'dicho' }],
  ['ver', 'to see', { pr: 'veo ves ve vemos veis ven', pt: 'vi viste vio vimos visteis vieron', im: 'veía veías veía veíamos veíais veían', pp: 'visto' }],
  ['dar', 'to give', { pr: 'doy das da damos dais dan', pt: 'di diste dio dimos disteis dieron' }],
  ['saber', 'to know (facts)', { pr: 'sé sabes sabe sabemos sabéis saben', ps: 'sup', fs: 'sabr' }],
  ['venir', 'to come', { pr: 'vengo vienes viene venimos venís vienen', ps: 'vin', fs: 'vendr' }],
  ['poner', 'to put', { pr: 'pongo pones pone ponemos ponéis ponen', ps: 'pus', fs: 'pondr', pp: 'puesto' }],
  ['salir', 'to leave / go out', { pr: 'salgo sales sale salimos salís salen', fs: 'saldr' }],
  ['pensar', 'to think', { pr: 'pienso piensas piensa pensamos pensáis piensan' }],
  ['volver', 'to return', { pr: 'vuelvo vuelves vuelve volvemos volvéis vuelven', pp: 'vuelto' }]
];

function conj(v, t) {
  const [inf, , o = {}] = v, k = inf.slice(-2), st = inf.slice(0, -2), E = END[k];
  const reg = key => E[key].split(' ').map(e => st + e);
  if (t === 'pres') return o.pr ? o.pr.split(' ') : reg('pr');
  if (t === 'pret') return o.pt ? o.pt.split(' ') : o.ps ? PS.map(e => o.ps + e) : reg('pt');
  if (t === 'imp') return o.im ? o.im.split(' ') : reg('im');
  if (t === 'fut') return FUT.map(e => (o.fs || inf) + e);
  if (t === 'cond') return CON.map(e => (o.fs || inf) + e);
  const pp = o.pp || st + (k === 'ar' ? 'ado' : 'ido');
  return HAB.map(h => h + ' ' + pp);
}

/* ---------- State & helpers ---------- */
const $ = s => document.querySelector(s);
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
const MODES = [['flash', 'Flashcards'], ['type', 'Type it'], ['choice', 'Multiple choice'], ['listen', 'Listening'], ['speak', 'Speaking']];
const DESC = {
  flash: 'See the English, recall the Spanish, then rate how easily it came.',
  type: 'Type the Spanish. Missing accents are accepted but flagged.',
  choice: 'Pick the right form from four. Best for first exposure.',
  listen: 'Hear Spanish and type what you heard. Trains your ear and spelling.',
  speak: 'Say the Spanish aloud. The browser checks what it heard.'
};
const INT = [0, 6e5, 864e5, 3 * 864e5, 7 * 864e5, 21 * 864e5]; // review gaps by box: now, 10 min, 1d, 3d, 7d, 21d
const KEY = 'es-rapido-v1';
let S = null;
try { S = JSON.parse(localStorage.getItem(KEY)); } catch (e) { /* storage unavailable */ }
S = S || {};
S.cards = S.cards || {}; S.streak = S.streak || 0; S.last = S.last || '';
S.set = S.set || { mode: 'flash', cats: ['pronouns', 'connectors', 'conj'], tenses: ['pres'], voice: true, n: 10 };
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* ignore */ } };
const shuf = a => a.map(x => [Math.random(), x]).sort((p, q) => p[0] - q[0]).map(x => x[1]);
const esc = s => s.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
const norm = s => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[¿?¡!.,]/g, '').trim();
const hit = (s, it) => [it.es, it.say].some(a => norm(a) === norm(s));
const view = id => ['setup', 'session', 'tbl'].forEach(s => { $('#' + s).hidden = s !== id; });
const chips = (id, list, type, on) => { $('#' + id).innerHTML = list.map(([k, l]) => `<label class="chip"><input type="${type}" name="${id}" value="${k}"${on.includes(k) ? ' checked' : ''}><span>${l}</span></label>`).join(''); };
const sel = id => [...document.querySelectorAll(`#${id} input:checked`)].map(i => i.value);

function voice(txt, rate = 1) {
  if (!('speechSynthesis' in window)) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(txt);
  u.lang = 'es-ES'; u.rate = rate;
  const v = speechSynthesis.getVoices().find(x => x.lang.startsWith('es'));
  if (v) u.voice = v;
  speechSynthesis.speak(u);
}

function stats() {
  const c = Object.values(S.cards), now = Date.now();
  $('#stats').innerHTML = `<span>🔥 ${S.streak} day streak</span><span>${c.length} items seen</span><span>${c.filter(x => x.b >= 4).length} strong</span><span>${c.filter(x => x.due <= now).length} due for review</span>`;
}

/* ---------- Items ---------- */
function pool() {
  const out = [], tn = sel('tenses');
  sel('cats').forEach(c => {
    if (VOCAB[c]) VOCAB[c].forEach(([es, en]) => out.push({ id: c + ':' + es, t: c, es, say: es, pr: en, lab: 'Say it in Spanish' }));
    else if (c === 'verbs') V.forEach(v => out.push({ id: 'v:' + v[0], t: c, es: v[0], say: v[0], pr: v[1], lab: 'Say it in Spanish' }));
    else if (c === 'conj') V.forEach(v => tn.forEach(t => conj(v, t).forEach((f, i) =>
      out.push({ id: `c:${v[0]}:${t}:${i}`, t: c, vb: v[0] + t, es: f, say: P[i].split('/')[0] + ' ' + f, pr: `${P[i]} + ${v[0]} (${v[1]})`, lab: TN[t] }))));
  });
  return out;
}

/* ---------- Session ---------- */
let ALL = [], Q = [], cur = null, tot = 0, done = 0, first = 0, answered = false;

function tick() {
  const d = n => new Date(n).toDateString(), t = d(Date.now());
  if (S.last === t) return;
  S.streak = S.last === d(Date.now() - 864e5) ? S.streak + 1 : 1; S.last = t;
}

function grade(ok, easy) {
  if (answered) return; answered = true;
  const c = S.cards[cur.id] || (S.cards[cur.id] = { b: 0, due: 0, n: 0 });
  c.n++; c.b = ok ? Math.min(5, c.b + (easy ? 2 : 1)) : 0; c.due = Date.now() + INT[c.b];
  Q.shift();
  if (ok) { done++; if (!cur.miss) first++; } else { cur.miss = 1; Q.splice(Math.min(3, Q.length), 0, cur); }
  tick(); save(); stats();
}

function result(ok, msg) {
  if (answered) return;
  grade(ok);
  document.querySelectorAll('#area input,#area .opt,#chk,#mic,#skip').forEach(e => { e.disabled = true; });
  const f = $('#fb');
  f.className = ok ? 'ok' : 'bad';
  f.innerHTML = `${ok ? '✓' : '✗'} ${msg} <b>${cur.es}</b><div class="row"><button id="nx" class="primary">Next</button><button id="hear">Hear it</button></div>`;
  $('#nx').onclick = next; $('#hear').onclick = () => voice(cur.say); $('#nx').focus();
  if (S.set.voice) voice(cur.say);
}

function next() {
  if (!Q.length) return end();
  cur = Q[0]; answered = false; render();
}

function end() {
  $('#bar').style.width = '100%';
  $('#lab').textContent = 'Session complete';
  $('#prompt').textContent = `${first} of ${tot} right first time`;
  $('#area').innerHTML = '<button id="home" class="primary">Back to setup</button>';
  $('#fb').className = ''; $('#fb').textContent = 'Everything you practised is scheduled for review. Come back tomorrow to lock it in.';
  $('#home').onclick = () => { view('setup'); stats(); };
}

function render() {
  const m = S.set.mode, A = $('#area');
  $('#bar').style.width = (done / tot * 100) + '%';
  $('#count').textContent = `${done} of ${tot}`;
  $('#fb').innerHTML = ''; $('#fb').className = '';
  $('#lab').textContent = cur.lab;
  $('#prompt').textContent = m === 'listen' ? '🔊 Listen closely' : cur.pr;

  if (m === 'flash' || (m === 'speak' && !SR)) {
    A.innerHTML = (m === 'speak' ? '<p class="mut">Speech recognition isn’t available in this browser (try Chrome or Edge). Say it out loud, then check yourself.</p>' : '') + '<button id="show" class="primary">Show answer</button>';
    $('#show').onclick = () => {
      if (S.set.voice) voice(cur.say);
      A.innerHTML = `<div class="ans">${cur.es}</div><div class="row"><button data-g="0">Again</button><button data-g="1">Good</button><button data-g="2" class="primary">Easy</button><button id="hear">Hear it</button></div>`;
      $('#hear').onclick = () => voice(cur.say);
      A.querySelectorAll('[data-g]').forEach(b => { b.onclick = () => { grade(+b.dataset.g > 0, b.dataset.g === '2'); next(); }; });
    };
  } else if (m === 'type' || m === 'listen') {
    A.innerHTML = `<input id="inp" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Type the Spanish"><div class="row"><button id="chk" class="primary">Check</button>${m === 'listen' ? '<button id="rep">Replay</button><button id="slow">Slow</button>' : ''}</div>`;
    const go = () => {
      const v = $('#inp').value.trim(); if (!v) return;
      const ok = hit(v, cur), exact = [cur.es, cur.say].includes(v.toLowerCase());
      result(ok, ok ? (exact ? 'Correct:' : 'Correct, but watch the accents:') : 'Not quite. Answer:');
    };
    $('#chk').onclick = go; $('#inp').onkeydown = e => { if (e.key === 'Enter') go(); }; $('#inp').focus();
    if (m === 'listen') { $('#rep').onclick = () => voice(cur.say); $('#slow').onclick = () => voice(cur.say, .5); setTimeout(() => voice(cur.say), 250); }
  } else if (m === 'choice') {
    const g = f => [...new Set(shuf(ALL.filter(f)).map(i => i.es))].filter(e => e !== cur.es);
    let d = g(i => cur.t === 'conj' ? i.vb === cur.vb : i.t === cur.t);
    if (d.length < 3) d = g(() => true);
    A.innerHTML = '<div class="opts">' + shuf([cur.es, ...d.slice(0, 3)]).map(o => `<button class="opt">${o}</button>`).join('') + '</div>';
    A.querySelectorAll('.opt').forEach(b => {
      b.onclick = () => {
        const ok = b.textContent === cur.es;
        A.querySelectorAll('.opt').forEach(x => { if (x.textContent === cur.es) x.classList.add('good'); });
        if (!ok) b.classList.add('no');
        result(ok, ok ? 'Correct:' : 'Answer:');
      };
    });
  } else { // speak
    A.innerHTML = '<div class="row"><button id="mic" class="primary">🎤 Tap and speak</button><button id="skip">Show answer</button></div>';
    $('#skip').onclick = () => result(false, 'Answer:');
    $('#mic').onclick = () => {
      const r = new SR(); r.lang = 'es-ES'; r.maxAlternatives = 5;
      $('#mic').textContent = 'Listening…';
      r.onresult = e => {
        const a = [...e.results[0]].map(x => x.transcript);
        const ok = a.some(x => hit(x, cur) || norm(x).endsWith(' ' + norm(cur.es)));
        result(ok, ok ? 'Great pronunciation:' : `I heard “${esc(a[0])}”. Answer:`);
      };
      r.onerror = () => { if (!answered) $('#mic').textContent = 'Mic blocked or no speech. Tap to retry'; };
      r.onend = () => { if (!answered && $('#mic').textContent === 'Listening…') $('#mic').textContent = 'Didn’t catch that. Tap to retry'; };
      r.start();
    };
  }
}

/* ---------- Setup, tables, wiring ---------- */
chips('modes', MODES, 'radio', [S.set.mode]);
chips('cats', Object.entries(LAB), 'checkbox', S.set.cats);
chips('tenses', TK.map(k => [k, TN[k]]), 'checkbox', S.set.tenses);
$('#voice').checked = S.set.voice; $('#n').value = S.set.n;
const mdesc = () => { $('#mdesc').textContent = DESC[sel('modes')[0]]; };
$('#modes').onchange = mdesc; mdesc();

$('#start').onclick = () => {
  const set = { mode: sel('modes')[0], cats: sel('cats'), tenses: sel('tenses'), voice: $('#voice').checked, n: +$('#n').value };
  if (!set.cats.length) return void ($('#msg').textContent = 'Pick at least one thing to learn.');
  if (set.cats.includes('conj') && !set.tenses.length) return void ($('#msg').textContent = 'Pick at least one tense for conjugations.');
  $('#msg').textContent = ''; S.set = set; save();
  ALL = pool();
  const now = Date.now();
  const due = shuf(ALL.filter(i => S.cards[i.id] && S.cards[i.id].due <= now));
  const fresh = shuf(ALL.filter(i => !S.cards[i.id]));
  Q = [...due.slice(0, 20), ...fresh.slice(0, set.n)];
  if (!Q.length) Q = shuf(ALL).slice(0, set.n); // nothing due or new: extra practice
  tot = Q.length; done = 0; first = 0;
  view('session'); next();
};
$('#quit').onclick = () => { speechSynthesis && speechSynthesis.cancel(); view('setup'); stats(); };
$('#reset').onclick = () => { if (confirm('Erase all progress and your streak?')) { S.cards = {}; S.streak = 0; S.last = ''; save(); stats(); } };

$('#vsel').innerHTML = V.map((v, i) => `<option value="${i}">${v[0]} (${v[1]})</option>`).join('');
function table() {
  const v = V[$('#vsel').value];
  let h = '<table><tr><th></th>' + TK.map(t => `<th>${TN[t]}</th>`).join('') + '</tr>';
  P.forEach((p, i) => { h += `<tr><th>${p}</th>` + TK.map(t => `<td>${conj(v, t)[i]}</td>`).join('') + '</tr>'; });
  $('#tout').innerHTML = h + '</table>';
}
$('#vsel').onchange = table;
$('#tablesBtn').onclick = () => { table(); view('tbl'); };
$('#tback').onclick = () => view('setup');
if ('speechSynthesis' in window) speechSynthesis.getVoices();
stats();