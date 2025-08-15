/* Nova — Full Integrated v1.2.1 */
const PAYHIP_URL = "https://payhip.com/";      // <-- paste your product URL
const NAVI_URL   = "https://example.com/navi"; // <-- paste your Navi URL
const PLAUSIBLE_DOMAIN = "";                   // e.g., "gonovaway.com"
const ENABLE_INTERNAL_ANALYTICS = true;
const AUTO_SPEAK_ON_START = true;

const state = { selected:new Set() };

const TRAITS = [
 "Creative","Analytical","Empathic","Detail-oriented","Strategic",
 "Hands-on","Curious","Resilient","Collaborative","Independent",
 "Visionary","Organizer","Communicator","Problem-solver","Data-driven",
 "Results-focused","Innovative","Patient","Adaptable","Leadership",
 "Entrepreneurial","Service-minded","Process-improver","Quality-focused","Safety-minded",
 "Customer-centric","Growth-oriented","Time-disciplined","Integrity-first","Calm under pressure",
 "Learner","Mentor","Teacher","Technically savvy","Design thinker",
 "Listener","Persuasive","Storyteller","Numerate","Systems thinker",
 "Networker","Researcher","Planner","Executor","Owner-mindset",
 "Optimistic","Realistic","Thorough","Bold","Humble"
];

const ARCHETYPES = {
  "Creator":["Creative","Innovative","Visionary","Storyteller","Design thinker"],
  "Analyst":["Analytical","Data-driven","Numerate","Researcher","Detail-oriented"],
  "Healer":["Empathic","Patient","Listener","Service-minded","Calm under pressure"],
  "Builder":["Hands-on","Executor","Thorough","Quality-focused","Process-improver"],
  "Leader":["Leadership","Persuasive","Organizer","Owner-mindset","Strategic"],
  "Connector":["Communicator","Networker","Collaborative","Customer-centric","Persuasive"],
  "Guardian":["Safety-minded","Integrity-first","Realistic","Planner","Time-disciplined"],
  "Explorer":["Curious","Adaptable","Bold","Growth-oriented","Independent"],
  "Teacher":["Teacher","Mentor","Listener","Planner","Communicator"],
  "Architect":["Systems thinker","Strategic","Planner","Technically savvy","Problem-solver"]
};

const ARCHETYPE_ROLES = {
  "Creator":["Content creator","Designer","Brand storyteller","Product concept lead"],
  "Analyst":["Business analyst","Data analyst","Financial analyst","QA & metrics"],
  "Healer":["Counselor/coach","HR partner","Community support","Healthcare aide"],
  "Builder":["Operations specialist","Implementation tech","Manufacturing/field ops","QA lead"],
  "Leader":["Team lead","Project/program manager","Entrepreneur","Sales lead"],
  "Connector":["Account manager","Partnerships","Community/outreach","Customer success"],
  "Guardian":["Safety/Compliance officer","Risk analyst","Scheduler","Admin lead"],
  "Explorer":["R&D scout","Growth/BD","Field researcher","Startup generalist"],
  "Teacher":["Trainer","Workshop leader","Curriculum designer","Enablement"],
  "Architect":["System designer","Process architect","Solutions engineer","Product ops"]
};

function track(name, data={}){
  try {
    if(ENABLE_INTERNAL_ANALYTICS){
      const key = "nova_events";
      const arr = JSON.parse(localStorage.getItem(key)||"[]");
      arr.push({t:Date.now(), name, data});
      localStorage.setItem(key, JSON.stringify(arr).slice(0,200000));
    }
    if(PLAUSIBLE_DOMAIN && window.plausible) window.plausible(name, {props:data});
  } catch(e){}
}

function el(id){return document.getElementById(id);}

function renderTraits(filter=""){
  const grid = el("traitGrid"); grid.innerHTML = "";
  const q = filter.trim().toLowerCase();
  TRAITS.filter(t=>t.toLowerCase().includes(q)).forEach(t=>{
    const row = document.createElement("label");
    row.className = "trait";
    row.innerHTML = `<input type="checkbox"><div><strong>${t}</strong><div class="small">Tap to select</div></div>`;
    const input = row.querySelector("input");
    input.checked = state.selected.has(t);
    if(input.checked) row.classList.add("active");
    input.addEventListener("change", ()=>{
      input.checked ? state.selected.add(t) : state.selected.delete(t);
      row.classList.toggle("active", input.checked);
      track("trait_toggled",{trait:t, on:input.checked});
    });
    grid.appendChild(row);
  });
}

function speakIntro(){
  const text = "Grand rising! I am Nova. Pick the traits that fit you. I will translate them into your top archetypes and roles so you know what to do next.";
  if(!window.speechSynthesis){ alert("Speech not supported."); return; }
  const u = new SpeechSynthesisUtterance(text);
  u.rate = 1.03; u.pitch = 1.05;
  window.speechSynthesis.cancel(); window.speechSynthesis.speak(u);
  track("voice_intro_played");
}

function begin(){
  el("welcome").style.display="none";
  el("traits").style.display="block";
  renderTraits();
  track("flow_traits_enter");
  if(AUTO_SPEAK_ON_START) speakIntro();
}

function computeScore(){
  const n = state.selected.size;
  return Math.min(100, Math.max(0, Math.round(100 * (1/(1+Math.exp(-(n-12)/5))))));
}

function characterize(){
  const counts = {}; for(const a in ARCHETYPES){ counts[a] = 0; }
  state.selected.forEach(t => { for(const [a, list] of Object.entries(ARCHETYPES)){ if(list.includes(t)) counts[a]++; } });
  return Object.entries(counts).sort((a,b)=>b[1]-a[1]).slice(0,3);
}

function renderReport(){
  el("traits").style.display="none"; el("report").style.display="block";
  const sel = Array.from(state.selected);
  const score = computeScore();
  el("scoreFill").style.width = score+"%";
  el("summary").textContent = sel.length
    ? `You chose ${sel.length} strengths. Here’s how they map to your purpose mix — and where to aim next.`
    : "Select some traits and regenerate to see your purpose mix.";
  const arch = characterize();
  const archList = el("archetypes"); archList.innerHTML = "";
  arch.forEach(([name,val])=>{
    const li = document.createElement("li");
    li.innerHTML = `<strong>${name}</strong> — signal strength ${val}`;
    archList.appendChild(li);
  });
  const rolesList = el("roles"); rolesList.innerHTML = "";
  arch.forEach(([name])=> (ARCHETYPE_ROLES[name]||[]).forEach(r=>{
    const li = document.createElement("li"); li.textContent = `${name}: ${r}`; rolesList.appendChild(li);
  }));
  track("flow_report_view",{score, count: sel.length, arch: arch.map(a=>a[0])});
}

function exportTxt(){
  const arch = characterize();
  const lines = [];
  lines.push("Nova — Personal Snapshot");
  lines.push("========================");
  lines.push(`Selected traits (${state.selected.size}): ${Array.from(state.selected).join(", ")}`);
  lines.push(""); lines.push("Top archetypes:");
  arch.forEach(([n,v],i)=>lines.push(`${i+1}. ${n} — ${v}`));
  lines.push(""); lines.push("Suggested roles:");
  arch.forEach(([n])=> (ARCHETYPE_ROLES[n]||[]).forEach(r=>lines.push(`- ${n}: ${r}`)));
  const blob = new Blob([lines.join("\n")], {type:"text/plain"});
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download="Nova_Snapshot.txt"; a.click();
  URL.revokeObjectURL(a.href);
  track("export_txt");
}

function saveEmail(){
  const email = el("emailInput").value.trim();
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){ alert("Please enter a valid email."); return; }
  const list = JSON.parse(localStorage.getItem("nova_emails")||"[]"); list.push({email, t:Date.now()});
  localStorage.setItem("nova_emails", JSON.stringify(list));
  alert("Saved. Thank you!");
  track("email_saved");
}

function setupRecorder(){
  const recBtn = el("recBtn"), stopBtn = el("stopRecBtn"), a = el("downloadRec"), audio = el("playback");
  let chunks=[], media, rec;
  if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia){ return; }
  recBtn.onclick = async ()=>{
    try{
      media = await navigator.mediaDevices.getUserMedia({audio:true});
      rec = new MediaRecorder(media);
      chunks=[];
      rec.ondataavailable = e=>chunks.push(e.data);
      rec.onstop = ()=>{
        const blob = new Blob(chunks, {type: chunks[0]?.type || "audio/webm"});
        const url = URL.createObjectURL(blob);
        audio.src = url; audio.style.display="block";
        a.href = url; a.download = "nova_note.webm"; a.style.display="inline-flex";
      };
      rec.start(); recBtn.disabled = true; stopBtn.disabled = false;
      track("rec_start");
    }catch(e){ alert("Microphone access denied."); }
  };
  stopBtn.onclick = ()=>{ try{ rec && rec.stop(); media && media.getTracks().forEach(t=>t.stop()); }catch(e){} recBtn.disabled = false; stopBtn.disabled = true; track("rec_stop"); };
}

function restart(){
  state.selected.clear();
  el("report").style.display="none";
  el("welcome").style.display="block";
  track("restart");
}

function init(){
  const y = document.createElement('span'); y.id='year'; y.textContent = new Date().getFullYear(); document.querySelector('footer span')?.replaceWith(y);
  document.title = "Nova — Grand Rising";
  // Welcome handlers
  el("beginBtn").onclick = begin;
  el("speakBtn").onclick = speakIntro;
  el("payhipBtn").onclick = ()=>{ window.open(PAYHIP_URL, "_blank"); track("payhip_open_welcome"); };
  // Traits handlers
  el("toReportBtn").onclick = renderReport;
  el("clearBtn").onclick = ()=>{ state.selected.clear(); renderTraits(el("search").value); };
  el("search").oninput = (e)=>renderTraits(e.target.value);
  // Report handlers
  el("printBtn").onclick = ()=>{ window.print(); track("download_pdf"); };
  el("exportTxtBtn").onclick = exportTxt;
  el("saveEmailBtn").onclick = saveEmail;
  el("payhipCta").onclick = ()=>{ window.open(PAYHIP_URL, "_blank"); track("payhip_open_report"); };
  el("naviCta").onclick = ()=>{ window.open(NAVI_URL, "_blank"); track("navi_open"); };
  el("restartBtn").onclick = restart;

  renderTraits();
  setupRecorder();

  if(PLAUSIBLE_DOMAIN){
    const s = document.createElement("script");
    s.defer = true; s.setAttribute("data-domain", PLAUSIBLE_DOMAIN);
    s.src = "https://plausible.io/js/script.js";
    document.head.appendChild(s);
  }
}
document.addEventListener("DOMContentLoaded", init);
