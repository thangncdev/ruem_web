let selectedCycles=5;

function selectCycle(n,el){
  selectedCycles=n;
  document.querySelectorAll('.cycle-opt').forEach(c=>c.classList.remove('active'));
  el.classList.add('active');
}

function calcR90(){
  const wh=parseInt(document.getElementById('wake-hour').value),wm=parseInt(document.getElementById('wake-min').value);
  const results=[];
  for(let offset=0;offset<=2;offset++){
    const c=selectedCycles+offset-1;
    if(c<2)continue;
    let t=wh*60+wm-(c*90+14);
    while(t<0)t+=1440;
    const sh=Math.floor(t/60)%24,sm=t%60;
    results.push({time:`${String(sh).padStart(2,'0')}:${String(sm).padStart(2,'0')}`,cycles:c,hours:(c*1.5).toFixed(1),recommended:c===selectedCycles});
  }
  const container=document.getElementById('r90-results');
  container.innerHTML='<p class="section-label">Giờ nên đi ngủ</p>';
  results.forEach(r=>{
    const div=document.createElement('div');
    div.className='result-item'+(r.recommended?' recommended':'');
    div.innerHTML=`<div><div class="r-time">${r.time}</div></div><div class="r-meta"><div class="r-cycles">${r.cycles} chu kỳ</div><div class="r-hours">${r.hours} giờ</div>${r.recommended?'<span class="r-tag">✓ Khuyến nghị</span>':''}</div>`;
    container.appendChild(div);
  });
}

function switchSleepTab(tab){
  document.getElementById('panel-r90').style.display=tab==='r90'?'block':'none';
  document.getElementById('panel-winddown').style.display=tab==='winddown'?'block':'none';
  document.getElementById('tab-r90').classList.toggle('active',tab==='r90');
  document.getElementById('tab-winddown').classList.toggle('active',tab==='winddown');
}

window.addEventListener('load',()=>setTimeout(calcR90,100));
document.addEventListener('DOMContentLoaded',()=>{
  document.getElementById('wake-hour').addEventListener('change',calcR90);
  document.getElementById('wake-min').addEventListener('change',calcR90);
});
