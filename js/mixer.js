let mixTracks={};

function addToMix(type,icon,name){
  if(mixTracks[type]){removeFromMix(type);return}
  const ctx=getCtx(),gainNode=ctx.createGain();
  gainNode.connect(masterGainNode);
  const src=startSoundNode(type,gainNode);
  trackSources[type]=src;
  mixTracks[type]={src,gainNode,icon,name,vol:70};
  document.querySelector(`[data-sound="${type}"]`).classList.add('in-mix');
  renderMixTracks();
}

function removeFromMix(type){
  if(!mixTracks[type])return;
  try{mixTracks[type].src.stop()}catch(e){}
  mixTracks[type].gainNode.disconnect();
  delete mixTracks[type];
  delete trackSources[type];
  document.querySelector(`[data-sound="${type}"]`).classList.remove('in-mix');
  renderMixTracks();
}

function renderMixTracks(){
  const wrap=document.getElementById('mix-tracks'),ctrl=document.getElementById('mixer-controls');
  const keys=Object.keys(mixTracks);
  if(keys.length===0){
    wrap.innerHTML='<div class="empty-mix" id="empty-mix">Chưa có âm thanh nào.<br/>Chọn từ thư viện phía trên để bắt đầu ✦</div>';
    ctrl.style.display='none';
    return;
  }
  ctrl.style.display='flex';
  wrap.innerHTML=keys.map(type=>{
    const t=mixTracks[type];
    return`<div class="track-card" id="track-${type}">
      <div class="track-header">
        <span class="track-icon">${t.icon}</span>
        <span class="track-name">${t.name}</span>
        <button class="track-remove" onclick="removeFromMix('${type}')">✕</button>
      </div>
      <div class="track-vol-row">
        <input type="range" class="mini" min="0" max="100" value="${t.vol}" oninput="setTrackVol('${type}',this.value)"/>
        <span id="tvol-${type}">${t.vol}</span>
      </div>
    </div>`;
  }).join('');
}

function setTrackVol(type,v){
  if(!mixTracks[type])return;
  mixTracks[type].vol=parseInt(v);
  mixTracks[type].gainNode.gain.setTargetAtTime(v/100*.8,getCtx().currentTime,.1);
  document.getElementById('tvol-'+type).textContent=v;
}

function setMasterVol(v){
  document.getElementById('master-vol-val').textContent=v;
  if(masterGainNode)masterGainNode.gain.setTargetAtTime(v/100,getCtx().currentTime,.1);
}

const PRESETS={
  'rain-night':[['rain','🌧️','Mưa nhẹ'],['thunder','⚡','Sấm xa']],
  'deep-sleep':[['ocean','🌊','Sóng biển'],['pink','🌸','Pink Noise']],
  'forest-fire':[['forest','🌿','Rừng đêm'],['fire','🔥','Lửa trại'],['wind','💨','Gió nhẹ']],
  'focus':[['white','🔊','White Noise'],['stream','🏞️','Suối chảy']]
};

function loadPreset(name){
  Object.keys(mixTracks).forEach(removeFromMix);
  PRESETS[name].forEach(([type,icon,n])=>setTimeout(()=>addToMix(type,icon,n),100));
}

let mixTimer=null;

function setMixTimer(min,el){
  document.querySelectorAll('.timer-chip').forEach(c=>c.classList.remove('active'));
  el.classList.add('active');
  if(mixTimer)clearInterval(mixTimer);
  const disp=document.getElementById('mix-timer-display');
  disp.style.display='block';
  let rem=min*60;
  function tick(){
    const m=Math.floor(rem/60),s=rem%60;
    disp.textContent=`⏱ Tắt sau ${m}:${String(s).padStart(2,'0')}`;
    if(rem<=0){
      if(masterGainNode)masterGainNode.gain.setTargetAtTime(0,audioCtx.currentTime,3);
      setTimeout(()=>{
        Object.keys(mixTracks).forEach(removeFromMix);
        disp.style.display='none';
        document.querySelectorAll('.timer-chip').forEach(c=>c.classList.remove('active'));
      },4000);
      return;
    }
    rem--;
    mixTimer=setTimeout(tick,1000);
  }
  tick();
}

function stopMixTimer(){
  if(mixTimer){clearTimeout(mixTimer);mixTimer=null}
  document.getElementById('mix-timer-display').style.display='none';
  document.querySelectorAll('.timer-chip').forEach(c=>c.classList.remove('active'));
}
