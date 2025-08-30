(() => {
  const $ = (sel, ctx=document) => ctx.querySelector(sel);
  const $$ = (sel, ctx=document) => [...ctx.querySelectorAll(sel)];

  const screens = {
    intro: $("#intro"),
    traits: $("#traits"),
    report: $("#report")
  };

  const audioEl = $("#intro-audio");
  const startBtn = $("#start-btn");
  const backToIntro = $("#back-to-intro");
  const toReport = $("#to-report");
  const backToTraits = $("#back-to-traits");
  const grid = $("#traits-grid");
  const chosenList = $("#chosen-list");

  const state = {
    traits: [],
    chosen: new Set()
  };

  function show(id){
    Object.values(screens).forEach(s => s.classList.remove("active"));
    screens[id].classList.add("active");
    window.scrollTo({top:0, behavior:"instant"});
  }

  async function loadTraits(){
    try{
      const res = await fetch("traits.json", {cache: "no-store"});
      const data = await res.json();
      // Normalize to array of strings
      state.traits = (Array.isArray(data) ? data : data.traits || []).map(x => typeof x === "string" ? x : (x.name || ""))
        .filter(Boolean);
      renderTraits();
    }catch(e){
      console.error("Failed to load traits.json", e);
      grid.innerHTML = `<div class="trait">Could not load traits. Check traits.json</div>`;
    }
  }

  function renderTraits(){
    grid.innerHTML = "";
    state.traits.forEach((name, idx) => {
      const item = document.createElement("button");
      item.type = "button";
      item.className = "trait";
      item.setAttribute("data-idx", idx);
      item.textContent = name;
      item.addEventListener("click", () => {
        if(state.chosen.has(name)){
          state.chosen.delete(name);
          item.classList.remove("selected");
        }else{
          state.chosen.add(name);
          item.classList.add("selected");
        }
      });
      grid.appendChild(item);
    });
  }

  function renderReport(){
    chosenList.innerHTML = "";
    [...state.chosen].sort().forEach(name => {
      const li = document.createElement("li");
      li.textContent = name;
      chosenList.appendChild(li);
    });
  }

  // Audio: play on user gesture to satisfy autoplay policies
  startBtn.addEventListener("click", async () => {
    try{
      await audioEl.play();
    }catch(e){
      // If blocked, reveal controls for manual play
      audioEl.setAttribute("controls", "controls");
    }
    show("traits");
  });

  backToIntro?.addEventListener("click", () => show("intro"));

  toReport?.addEventListener("click", () => {
    renderReport();
    show("report");
  });

  backToTraits?.addEventListener("click", () => show("traits"));

  // Email capture graceful degrade
  $("#email-form")?.addEventListener("submit", (e) => {
    // Let Formspree handle it normally; could add fetch hook if desired
  });

  // Init
  loadTraits();
})();