// nexaOS demo frontend script
(function(){
  // utilities
  const $ = sel => document.querySelector(sel);
  const $$ = sel => Array.from(document.querySelectorAll(sel));

  // Clock
  function updateClock(){
    const c = $('#clock');
    if(!c) return;
    const now = new Date();
    c.textContent = now.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
  }
  setInterval(updateClock, 1000);
  updateClock();

  // Stars generation
  function makeStars(count = 120){
    const container = $('#stars');
    const w = window.innerWidth;
    const h = window.innerHeight;
    for(let i=0;i<count;i++){
      const s = document.createElement('div');
      s.className = 'star';
      const size = Math.random()*2.8 + 0.6;
      s.style.width = `${size}px`;
      s.style.height = `${size}px`;
      s.style.left = `${Math.random()*100}%`;
      s.style.top = `${Math.random()*60}%`;
      s.style.opacity = (Math.random()*0.7 + 0.3).toString();
      s.style.animationDuration = `${2 + Math.random()*4}s`;
      s.style.animationDelay = `${Math.random()*3}s`;
      container.appendChild(s);
    }
  }
  makeStars(160);

  // Start menu toggle
  const startBtn = $('#start-button');
  const startMenu = $('#start-menu');
  startBtn && startBtn.addEventListener('click', () => {
    const expanded = startBtn.getAttribute('aria-expanded') === 'true';
    startBtn.setAttribute('aria-expanded', String(!expanded));
    if(startMenu.hasAttribute('hidden')){
      startMenu.removeAttribute('hidden');
    } else {
      startMenu.setAttribute('hidden', '');
    }
  });

  // App opening
  function openApp(app){
    if(app === 'terminal') openTerminal();
    if(app === 'files') openFiles();
    if(app === 'browser') alert('This is a fake demo browser. Replace with your own app.');
  }

  $$('#icons .icon, .dock-item, #start-menu button').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const app = btn.dataset.app;
      openApp(app);
    });
  });

  // Windows helpers (drag)
  function makeDraggable(win){
    const title = win.querySelector('.titlebar');
    let offsetX=0, offsetY=0, dragging=false;
    title.addEventListener('mousedown', (ev)=>{
      dragging = true;
      win.style.transition = 'none';
      const rect = win.getBoundingClientRect();
      offsetX = ev.clientX - rect.left;
      offsetY = ev.clientY - rect.top;
      title.style.cursor = 'grabbing';
    });
    window.addEventListener('mouseup', ()=>{
      dragging = false;
      win.style.transition = '';
      title.style.cursor = 'grab';
    });
    window.addEventListener('mousemove', (ev)=>{
      if(!dragging) return;
      win.style.left = `${ev.clientX - offsetX}px`;
      win.style.top = `${ev.clientY - offsetY}px`;
      win.style.transform = `translate(0,0)`;
    });
  }

  // Close / minimize controls
  function wireControls(win){
    win.querySelectorAll('.close').forEach(b=>{
      b.addEventListener('click', ()=> win.hidden = true);
    });
    win.querySelectorAll('.minimize').forEach(b=>{
      b.addEventListener('click', ()=> win.style.display = 'none');
    });
  }

  // Terminal behavior
  const terminalWindow = $('#terminal-window');
  const termOutput = $('#term-output');
  const termInputBox = $('#term-input-box');

  function openTerminal(){
    terminalWindow.hidden = false;
    terminalWindow.style.display = '';
    terminalWindow.style.left = '50%';
    terminalWindow.style.top = '50%';
    terminalWindow.style.transform = 'translate(-50%,-50%)';
    terminalWindow.style.zIndex = 20;
    termOutput.textContent = '';
    fakeBootSequence(termOutput);
  }

  function fakeBootSequence(outEl){
    const lines = [
      "nexaOS 0.1-night booting...",
      "Initializing kernel modules... OK",
      "Loading night-mode renderer... OK",
      "Mounting virtual filesystem... OK",
      "Starting system services: netd, ui, logger... OK",
      "Welcome to nexaOS — Night Edition",
      "",
      "Type 'help' to see a small list of demo commands."
    ];
    let i=0;
    outEl.textContent = '';
    const iv = setInterval(()=>{
      if(i>=lines.length){
        clearInterval(iv);
        outEl.scrollTop = outEl.scrollHeight;
        return;
      }
      outEl.textContent += lines[i] + '\n';
      outEl.scrollTop = outEl.scrollHeight;
      i++;
    }, 420);
  }

  if(terminalWindow){
    makeDraggable(terminalWindow);
    wireControls(terminalWindow);
  }

  // Files window
  const filesWindow = $('#files-window');
  function openFiles(){
    filesWindow.hidden = false;
    filesWindow.style.display = '';
    filesWindow.style.left = '55%';
    filesWindow.style.top = '55%';
    filesWindow.style.transform = 'translate(-50%,-50%)';
  }
  if(filesWindow){
    makeDraggable(filesWindow);
    wireControls(filesWindow);
  }

  // Terminal input handling (very small demo commands)
  if(termInputBox){
    termInputBox.addEventListener('keydown', (e)=>{
      if(e.key !== 'Enter') return;
      const v = termInputBox.value.trim();
      const out = termOutput;
      if(v === '') return;
      out.textContent += `guest@nexaOS:~$ ${v}\n`;
      if(v === 'help'){
        out.textContent += "Available commands: help, whoami, clear, echo [text]\n";
      } else if(v === 'whoami'){
        out.textContent += "guest\n";
      } else if(v.startsWith('echo ')){
        out.textContent += v.slice(5) + "\n";
      } else if(v === 'clear'){
        out.textContent = '';
      } else {
        out.textContent += `Command not found: ${v}\n`;
      }
      out.scrollTop = out.scrollHeight;
      termInputBox.value = '';
    });
  }

  // Accessibility: close start-menu if click outside
  document.addEventListener('click', (e)=>{
    if(!startMenu) return;
    if(startMenu.hasAttribute('hidden')) return;
    const path = e.composedPath ? e.composedPath() : (e.path || []);
    if(!path.includes(startMenu) && !path.includes(startBtn)){
      startMenu.setAttribute('hidden','');
      startBtn.setAttribute('aria-expanded','false');
    }
  });

  // initial welcome terminal
  setTimeout(()=>openTerminal(), 600);

})();
