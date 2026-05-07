const PHASE_CUES={inhale:'things/wind-chimes',hold:'things/singing-bowl',exhale:'nature/waves'};
let breathCueEnabled=localStorage.getItem('breathCueEnabled')!=='false';
let currentCueHandle=null;
function setBreathCueEnabled(v){
  breathCueEnabled=v;
  localStorage.setItem('breathCueEnabled',v);
  const btn=document.getElementById('breath-cue-toggle');
  if(btn)btn.textContent=v?'🔊':'🔇';
  if(!v&&currentCueHandle){currentCueHandle.stop();currentCueHandle=null;}
}
function toggleBreathCue(){setBreathCueEnabled(!breathCueEnabled)}

const METHODS={
  '478':{name:'Kỹ thuật 4-7-8',desc:'Hít 4 · Nín 7 · Thở ra 8',phases:[{l:'Hít vào',d:4},{l:'Nín thở',d:7},{l:'Thở ra',d:8}],cycles:4},
  'box':{name:'Box Breathing',desc:'Hít 4 · Nín 4 · Thở ra 4 · Nín 4',phases:[{l:'Hít vào',d:4},{l:'Nín',d:4},{l:'Thở ra',d:4},{l:'Nín',d:4}],cycles:4},
  'relax':{name:'Thở thư giãn',desc:'Hít 5 · Thở ra 7',phases:[{l:'Hít vào',d:5},{l:'Thở ra',d:7}],cycles:6}
};

let breathMethod='478',breathRunning=false,breathPhaseIdx=0,breathCyclesDone=0,breathTimer=null,breathCountTimer=null;

document.querySelectorAll('.breath-chip').forEach(btn=>{
  btn.addEventListener('click',function(){
    document.querySelectorAll('.breath-chip').forEach(b=>b.classList.remove('active'));
    this.classList.add('active');
    breathMethod=this.dataset.method;
    resetBreath();
    const m=METHODS[breathMethod];
    document.getElementById('method-name').textContent=m.name;
    document.getElementById('method-desc').textContent=m.desc;
  });
});

function toggleBreath(){breathRunning?pauseBreath():startBreath()}

function startBreath(){
  breathRunning=true;
  document.getElementById('breath-toggle').textContent='⏸';
  document.getElementById('cycle-counter').style.display='block';
  renderCycleDots();
  runBreathPhase();
}

function pauseBreath(){
  breathRunning=false;
  clearTimeout(breathTimer);
  clearInterval(breathCountTimer);
  document.getElementById('breath-toggle').textContent='▶';
  if(currentCueHandle){currentCueHandle.stop();currentCueHandle=null;}
}

function resetBreath(){
  pauseBreath();
  breathPhaseIdx=0;
  breathCyclesDone=0;
  const ring=document.getElementById('breath-ring'),inner=document.getElementById('breath-inner');
  ring.className='breath-ring';
  inner.className='breath-inner';
  document.getElementById('breath-phase').textContent='Sẵn sàng';
  document.getElementById('breath-count').textContent='—';
  document.getElementById('cycle-counter').style.display='none';
  document.getElementById('breath-toggle').textContent='▶';
}

function runBreathPhase(){
  if(!breathRunning)return;
  const m=METHODS[breathMethod],phase=m.phases[breathPhaseIdx],d=phase.d;
  document.getElementById('breath-phase').textContent=phase.l;
  const ring=document.getElementById('breath-ring'),inner=document.getElementById('breath-inner');
  ring.style.setProperty('--bd',d+'s');
  inner.style.setProperty('--bd',d+'s');
  ring.className='breath-ring';
  inner.className='breath-inner';
  void ring.offsetWidth;
  const isExpand=phase.l.includes('vào'),isHold=phase.l==='Nín'||phase.l==='Nín thở',isOut=phase.l.includes('ra');
  if(isExpand){ring.classList.add('expanding');inner.classList.add('expanding')}
  else if(isHold){ring.classList.add('holding');inner.classList.add('holding')}
  else if(isOut){ring.classList.add('contracting');inner.classList.add('contracting')}
  if(currentCueHandle){currentCueHandle.stop();currentCueHandle=null;}
  if(breathCueEnabled){
    const cueId=isExpand?PHASE_CUES.inhale:isHold?PHASE_CUES.hold:PHASE_CUES.exhale;
    currentCueHandle=playCue(cueId,d);
  }
  let remaining=d;
  document.getElementById('breath-count').textContent=remaining;
  clearInterval(breathCountTimer);
  breathCountTimer=setInterval(()=>{remaining--;if(remaining>=0)document.getElementById('breath-count').textContent=remaining},1000);
  breathTimer=setTimeout(()=>{
    clearInterval(breathCountTimer);
    breathPhaseIdx++;
    if(breathPhaseIdx>=m.phases.length){
      breathPhaseIdx=0;
      breathCyclesDone++;
      renderCycleDots();
      if(breathCyclesDone>=m.cycles){
        if(currentCueHandle){currentCueHandle.stop();currentCueHandle=null;}
        resetBreath();
        document.getElementById('breath-phase').textContent='✓ Hoàn thành';
        document.getElementById('breath-count').textContent='';
        return;
      }
    }
    runBreathPhase();
  },d*1000);
}

function renderCycleDots(){
  const m=METHODS[breathMethod],wrap=document.getElementById('cycle-dots');
  wrap.innerHTML='';
  for(let i=0;i<m.cycles;i++){
    const dot=document.createElement('div');
    dot.className='cycle-dot'+(i<breathCyclesDone?' done':'');
    wrap.appendChild(dot);
  }
  document.getElementById('cycle-text').textContent=`Chu kỳ ${breathCyclesDone+1} / ${m.cycles}`;
}
