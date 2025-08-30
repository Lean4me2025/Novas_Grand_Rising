// Optional helper: un-mute/resume audio on first pointer/keyboard interaction if needed
(function(){
  const a = document.getElementById('intro-audio');
  if(!a) return;
  function tryPlay(){
    a.muted = false;
    a.play().catch(()=>{});
    window.removeEventListener('pointerdown', tryPlay);
    window.removeEventListener('keydown', tryPlay);
  }
  window.addEventListener('pointerdown', tryPlay, {once:true});
  window.addEventListener('keydown', tryPlay, {once:true});
})();