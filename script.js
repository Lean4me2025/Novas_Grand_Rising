// Nova core
const PAYHIP_URL = "https://payhip.com"; // TODO: set your exact product URL

const TRAITS = [
  "Adaptive",
  "Analytical",
  "Authentic",
  "Balanced",
  "Brave",
  "Collaborative",
  "Compassionate",
  "Creative",
  "Curious",
  "Decisive",
  "Dependable",
  "Determined",
  "Disciplined",
  "Empathetic",
  "Entrepreneurial",
  "Ethical",
  "Focused",
  "Generous",
  "Honest",
  "Humble",
  "Influential",
  "Innovative",
  "Insightful",
  "Intentional",
  "Kind",
  "Leader",
  "Learner",
  "Listener",
  "Logical",
  "Mindful",
  "Motivated",
  "Optimistic",
  "Organized",
  "Patient",
  "Persuasive",
  "Practical",
  "Proactive",
  "Purpose-driven",
  "Reliable",
  "Resilient",
  "Resourceful",
  "Self-aware",
  "Strategic",
  "Supportive",
  "Tenacious",
  "Thorough",
  "Visionary",
  "Willing",
  "Wise"
];
const DESCS = {
  "Adaptive": "You adjust quickly and thrive amid change.",
  "Analytical": "You break problems into parts and find patterns.",
  "Authentic": "You show up as your true self with integrity.",
  "Balanced": "You weigh options and keep perspective.",
  "Brave": "You face fear and act with courage.",
  "Collaborative": "You work well with others and build synergy.",
  "Compassionate": "You care deeply and act with kindness.",
  "Creative": "You generate fresh ideas and novel solutions.",
  "Curious": "You ask great questions and love to explore.",
  "Decisive": "You make clear choices and keep momentum.",
  "Dependable": "You do what you say, consistently.",
  "Determined": "You persevere until the goal is met.",
  "Disciplined": "You build habits and follow through.",
  "Empathetic": "You understand feelings and contexts.",
  "Entrepreneurial": "You spot opportunities and take initiative.",
  "Ethical": "You do the right thing, even when unseen.",
  "Focused": "You avoid distraction and finish the work.",
  "Generous": "You share time, attention, and resources.",
  "Honest": "You value truth and transparency.",
  "Humble": "You learn, listen, and give credit.",
  "Influential": "You inspire action in others.",
  "Innovative": "You push boundaries and reimagine what’s possible.",
  "Insightful": "You see beneath the surface to the core issue.",
  "Intentional": "You act on purpose with clear priorities.",
  "Kind": "You uplift others with words and deeds.",
  "Leader": "You set direction and bring people along.",
  "Learner": "You grow through study and experience.",
  "Listener": "You give full attention and reflect back.",
  "Logical": "You reason soundly from evidence.",
  "Mindful": "You are present and self-regulated.",
  "Motivated": "You bring energy and drive to goals.",
  "Optimistic": "You see possibilities and cultivate hope.",
  "Organized": "You structure tasks and time effectively.",
  "Patient": "You wait wisely and persist calmly.",
  "Persuasive": "You craft messages that land and move people.",
  "Practical": "You keep it workable and useful.",
  "Proactive": "You anticipate and move early.",
  "Purpose-driven": "You align actions with your calling.",
  "Reliable": "People can count on you, full stop.",
  "Resilient": "You bounce back stronger from setbacks.",
  "Resourceful": "You stretch what you have to go farther.",
  "Self-aware": "You know your strengths and edges.",
  "Strategic": "You map paths to outcomes.",
  "Supportive": "You encourage and equip others.",
  "Tenacious": "You hold on and finish the climb.",
  "Thorough": "You sweat details that matter.",
  "Visionary": "You see the future vividly.",
  "Willing": "You step up when needed.",
  "Wise": "You choose well from experience."
};

// Simple router between sections
const screens = {}
function show(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function initWelcome(){
  const playBtn = document.getElementById('playVoice');
  playBtn.addEventListener('click', speakGreeting);
  document.getElementById('beginBtn').addEventListener('click', ()=>show('traits'));
}

function speakGreeting(){
  if (!('speechSynthesis' in window)) {
    alert("Voice not supported on this device. You can continue!");
    return;
  }
  const msg = new SpeechSynthesisUtterance("Hi, I’m Nova. I’m here to help you discover your unique traits and align them with your purpose.");
  msg.rate = 1.02;
  msg.pitch = 1.1;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(msg);
}

let selected = new Set();

function initTraits(){
  const grid = document.getElementById('traitsGrid');
  grid.innerHTML = '';
  TRAITS.forEach(name => {
    const card = document.createElement('button');
    card.className = 'trait';
    card.type = 'button';
    card.setAttribute('aria-pressed','false');

    const wrap = document.createElement('div');
    const title = document.createElement('div');
    title.className = 'name';
    title.textContent = name;
    const desc = document.createElement('div');
    desc.className = 'desc';
    desc.textContent = DESCS[name] || '';

    wrap.appendChild(title);
    wrap.appendChild(desc);
    const check = document.createElement('input');
    check.type = 'checkbox';
    check.tabIndex = -1;

    card.appendChild(wrap);
    card.appendChild(check);

    card.addEventListener('click', ()=>{
      if (selected.has(name)) {
        selected.delete(name);
        card.classList.remove('active');
        card.setAttribute('aria-pressed','false');
        check.checked = false;
      } else {
        selected.add(name);
        card.classList.add('active');
        card.setAttribute('aria-pressed','true');
        check.checked = true;
      }
      updateCount();
    });

    grid.appendChild(card);
  });

  document.getElementById('toWelcome').addEventListener('click', ()=>show('welcome'));
  document.getElementById('toResults').addEventListener('click', ()=>{
    if (selected.size === 0) {
      alert('Choose at least one trait to continue.');
      return;
    }
    buildSummary();
    show('results');
  });

  updateCount();
}

function updateCount(){
  const c = document.getElementById('count');
  c.textContent = `${selected.size} selected`;
}

function buildSummary(){
  const area = document.getElementById('summary');
  const list = Array.from(selected);
  const insights = list.map(trait => `• ${trait} — ${DESCS[trait] || ''}`).join('\n');
  const top3 = list.slice(0,3);

  area.innerHTML = `
    <div class="card">
      <h3>Hello!</h3>
      <p>Based on your selections, here are your highlighted traits:</p>
      <ul>${list.map(t => `<li><strong>${t}</strong>: ${DESCS[t] || ''}</li>`).join('')}</ul>
      <p><em>Signature blend:</em> ${top3.join(' · ')}</p>
    </div>
  `;
}

function initResults(){
  document.getElementById('toTraits').addEventListener('click', ()=>show('traits'));

  document.getElementById('downloadTxt').addEventListener('click', ()=>{
    const blob = new Blob([buildPlainText()], {type:'text/plain'});
    const url = URL.createObjectURL(blob);
    triggerDownload(url, 'Nova_Report.txt');
  });

  document.getElementById('downloadPdf').addEventListener('click', ()=>{
    // Use a print-friendly popup so user can "Save as PDF"
    const w = window.open('', '_blank');
    const html = buildPrintableHTML();
    w.document.open();
    w.document.write(html);
    w.document.close();
    w.focus();
    w.print();
  });

  document.getElementById('saveEmail').addEventListener('click', ()=>{
    const email = document.getElementById('emailInput').value.trim();
    if(!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      alert('Enter a valid email.');
      return;
    }
    localStorage.setItem('nova_email', email);
    alert('Got it! (Demo) Your report is ready to email once integrated.');
  });

  const payhip = document.getElementById('payhipLink');
  payhip.href = PAYHIP_URL;
}

function buildPlainText(){
  const list = Array.from(selected);
  const lines = [
    'Nova Report',
    '==============',
    '',
    'Selected Traits:'
  ];
  list.forEach(t => lines.push(`- ${t}: ${DESCS[t] || ''}`));
  return lines.join('\n');
}

function buildPrintableHTML(){
  const list = Array.from(selected).map(t => `<li><strong>${t}</strong>: ${DESCS[t] || ''}</li>`).join('');
  return `<!doctype html>
  <html><head><meta charset='utf-8'><title>Nova Report</title>
  <style>
  body{font-family:Arial,Helvetica,sans-serif; margin:40px; line-height:1.5;}
  h1{margin:0 0 8px;}
  .muted{color:#555;}
  ul{padding-left:20px;}
  </style>
  </head>
  <body>
    <h1>Nova Report</h1>
    <div class='muted'>Saved via print-to-PDF</div>
    <h3>Your Selected Traits</h3>
    <ul><class 'list'></ul>
    <p><em>Thank you for using Nova.</em></p>
  </body></html>`;
}

function triggerDownload(url, filename){
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(()=>URL.revokeObjectURL(url), 5000);
}

window.addEventListener('DOMContentLoaded', () => {
  initWelcome();
  initTraits();
  initResults();
});
