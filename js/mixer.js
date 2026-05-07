let mixTracks={};

function renderSoundLibrary(){
  const root=document.getElementById('sound-library');
  if(!root)return;
  root.innerHTML=Object.keys(SOUND_LIBRARY).map(cat=>{
    const c=SOUND_LIBRARY[cat];
    const tiles=c.items.map(it=>{
      const id=`${cat}/${it.id}`;
      return`<div class="sound-lib-item" data-sound-id="${id}"><div class="s-icon">${it.icon}</div><div class="s-name">${it.name}</div><div class="s-add">+ Thêm</div></div>`;
    }).join('');
    return`<div class="sound-cat"><div class="sound-cat-head"><span>${c.icon}</span><span>${c.label}</span></div><div class="sound-row">${tiles}</div></div>`;
  }).join('');
  root.querySelectorAll('.sound-lib-item').forEach(el=>{
    el.addEventListener('click',()=>addToMix(el.dataset.soundId));
  });
}

function addToMix(id,vol=70){
  if(mixTracks[id]){removeFromMix(id);return}
  const meta=soundMeta(id);
  if(!meta)return;
  const ctx=getCtx(),gainNode=ctx.createGain();
  gainNode.gain.setTargetAtTime(vol/100*.8,ctx.currentTime,.1);
  gainNode.connect(masterGainNode);
  const src=startSoundNode(id,gainNode);
  trackSources[id]=src;
  const el=document.querySelector(`[data-sound-id="${CSS.escape(id)}"]`);
  mixTracks[id]={src,gainNode,icon:meta.icon,name:meta.name,vol,el};
  if(el)el.classList.add('in-mix');
  renderMixTracks();
}

function removeFromMix(id){
  if(!mixTracks[id])return;
  try{mixTracks[id].src.stop()}catch(e){}
  mixTracks[id].gainNode.disconnect();
  if(mixTracks[id].el)mixTracks[id].el.classList.remove('in-mix');
  delete mixTracks[id];
  delete trackSources[id];
  renderMixTracks();
}

function trackKey(id){return id.replace(/\//g,'_')}

function renderMixTracks(){
  const wrap=document.getElementById('mix-tracks'),ctrl=document.getElementById('mixer-controls');
  const keys=Object.keys(mixTracks);
  if(keys.length===0){
    wrap.innerHTML='<div class="empty-mix" id="empty-mix">Chưa có âm thanh nào.<br/>Chọn từ thư viện phía trên để bắt đầu ✦</div>';
    ctrl.style.display='none';
    return;
  }
  ctrl.style.display='flex';
  wrap.innerHTML=keys.map(id=>{
    const t=mixTracks[id],k=trackKey(id);
    return`<div class="track-card" id="track-${k}">
      <div class="track-header">
        <span class="track-icon">${t.icon}</span>
        <span class="track-name">${t.name}</span>
        <button class="track-remove" onclick="removeFromMix('${id}')">✕</button>
      </div>
      <div class="track-vol-row">
        <input type="range" class="mini" min="0" max="100" value="${t.vol}" oninput="setTrackVol('${id}',this.value)"/>
        <span id="tvol-${k}">${t.vol}</span>
      </div>
    </div>`;
  }).join('');
}

function setTrackVol(id,v){
  if(!mixTracks[id])return;
  mixTracks[id].vol=parseInt(v);
  mixTracks[id].gainNode.gain.setTargetAtTime(v/100*.8,getCtx().currentTime,.1);
  document.getElementById('tvol-'+trackKey(id)).textContent=v;
}

function setMasterVol(v){
  document.getElementById('master-vol-val').textContent=v;
  if(masterGainNode)masterGainNode.gain.setTargetAtTime(v/100,getCtx().currentTime,.1);
}

const PRESETS={
  'ngu-sau':    {label:'Ngủ sâu',    icon:'😴',tracks:[{id:'nature/waves',vol:50},{id:'noise/brown-noise',vol:60},{id:'binaural/binaural-delta',vol:30}]},
  'tap-trung':  {label:'Tập trung',  icon:'🎯',tracks:[{id:'noise/white-noise',vol:60},{id:'nature/river',vol:35},{id:'binaural/binaural-beta',vol:40}]},
  'hoc-bai':    {label:'Học bài',    icon:'📚',tracks:[{id:'places/cafe',vol:55},{id:'rain/light-rain',vol:40},{id:'binaural/binaural-alpha',vol:35}]},
  'thien-dinh': {label:'Thiền định', icon:'🧘',tracks:[{id:'things/singing-bowl',vol:65},{id:'binaural/binaural-theta',vol:45},{id:'nature/wind',vol:25}]},
  'thu-gian':   {label:'Thư giãn',   icon:'🌿',tracks:[{id:'nature/waves',vol:55},{id:'animals/birds',vol:50},{id:'nature/wind-in-trees',vol:30}]},
  'ca-phe':     {label:'Cà phê',     icon:'☕',tracks:[{id:'places/cafe',vol:70},{id:'rain/light-rain',vol:35},{id:'things/keyboard',vol:25}]},
  'sang-tao':   {label:'Sáng tạo',   icon:'✨',tracks:[{id:'rain/light-rain',vol:45},{id:'things/wind-chimes',vol:55},{id:'binaural/binaural-alpha',vol:35}]},
  'mua-dem':    {label:'Mưa đêm',    icon:'🌧️',tracks:[{id:'rain/light-rain',vol:70},{id:'rain/thunder',vol:40},{id:'animals/crickets',vol:50}]},
  'rung-dem':   {label:'Rừng đêm',   icon:'🔥',tracks:[{id:'nature/jungle',vol:60},{id:'nature/campfire',vol:70},{id:'animals/owl',vol:40}]},
};

let activePreset=null;

function loadPreset(name){
  Object.keys(mixTracks).forEach(removeFromMix);
  PRESETS[name].tracks.forEach(({id,vol})=>setTimeout(()=>addToMix(id,vol),100));
  activePreset=name;
  document.querySelectorAll('.preset-card').forEach(c=>
    c.classList.toggle('active',c.dataset.preset===name));
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

if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded',renderSoundLibrary);
} else {
  renderSoundLibrary();
}
