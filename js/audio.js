let audioCtx=null,masterGainNode=null,trackSources={};

function getCtx(){
  if(!audioCtx){
    audioCtx=new(window.AudioContext||window.webkitAudioContext)();
    masterGainNode=audioCtx.createGain();
    masterGainNode.gain.value=.7;
    masterGainNode.connect(audioCtx.destination);
  }
  if(audioCtx.state==='suspended')audioCtx.resume();
  return audioCtx;
}

const SOUND_LIBRARY={
  rain:{label:'Mưa',icon:'🌧️',items:[
    {id:'light-rain',name:'Mưa nhẹ',icon:'🌧️'},
    {id:'heavy-rain',name:'Mưa to',icon:'⛈️'},
    {id:'thunder',name:'Sấm',icon:'⚡'},
    {id:'rain-on-leaves',name:'Mưa trên lá',icon:'🍃'},
    {id:'rain-on-window',name:'Mưa cửa sổ',icon:'🪟'},
    {id:'rain-on-tent',name:'Mưa trên lều',icon:'⛺'},
    {id:'rain-on-umbrella',name:'Mưa trên ô',icon:'☂️'},
    {id:'rain-on-car-roof',name:'Mưa nóc xe',icon:'🚗'},
  ]},
  nature:{label:'Thiên nhiên',icon:'🌿',items:[
    {id:'campfire',name:'Lửa trại',icon:'🔥'},
    {id:'waves',name:'Sóng biển',icon:'🌊'},
    {id:'river',name:'Suối',icon:'🏞️'},
    {id:'waterfall',name:'Thác',icon:'💧'},
    {id:'jungle',name:'Rừng',icon:'🌿'},
    {id:'wind',name:'Gió',icon:'💨'},
    {id:'wind-in-trees',name:'Gió cành cây',icon:'🌳'},
    {id:'howling-wind',name:'Gió hú',icon:'🌬️'},
    {id:'droplets',name:'Giọt nước',icon:'💦'},
    {id:'walk-in-snow',name:'Đi trên tuyết',icon:'❄️'},
    {id:'walk-on-gravel',name:'Đi trên sỏi',icon:'🪨'},
    {id:'walk-on-leaves',name:'Đi trên lá',icon:'🍂'},
  ]},
  noise:{label:'Noise',icon:'🔊',items:[
    {id:'white-noise',name:'White',icon:'🔊'},
    {id:'pink-noise',name:'Pink',icon:'🌸'},
    {id:'brown-noise',name:'Brown',icon:'🟫'},
  ]},
  animals:{label:'Động vật',icon:'🦉',items:[
    {id:'birds',name:'Chim hót',icon:'🐦'},
    {id:'crickets',name:'Dế',icon:'🦗'},
    {id:'frog',name:'Ếch',icon:'🐸'},
    {id:'owl',name:'Cú',icon:'🦉'},
    {id:'wolf',name:'Sói',icon:'🐺'},
    {id:'whale',name:'Cá voi',icon:'🐋'},
    {id:'cat-purring',name:'Mèo gầm gừ',icon:'🐱'},
    {id:'dog-barking',name:'Chó sủa',icon:'🐶'},
    {id:'cows',name:'Bò',icon:'🐄'},
    {id:'sheep',name:'Cừu',icon:'🐑'},
    {id:'chickens',name:'Gà',icon:'🐔'},
    {id:'crows',name:'Quạ',icon:'🦅'},
    {id:'seagulls',name:'Hải âu',icon:'🕊️'},
    {id:'horse-gallop',name:'Ngựa phi',icon:'🐎'},
    {id:'woodpecker',name:'Gõ kiến',icon:'🪶'},
    {id:'beehive',name:'Tổ ong',icon:'🐝'},
  ]},
  places:{label:'Địa điểm',icon:'🏙️',items:[
    {id:'cafe',name:'Cafe',icon:'☕'},
    {id:'library',name:'Thư viện',icon:'📚'},
    {id:'office',name:'Văn phòng',icon:'💼'},
    {id:'restaurant',name:'Nhà hàng',icon:'🍽️'},
    {id:'crowded-bar',name:'Quầy bar',icon:'🍻'},
    {id:'supermarket',name:'Siêu thị',icon:'🛒'},
    {id:'airport',name:'Sân bay',icon:'🛫'},
    {id:'subway-station',name:'Ga tàu điện',icon:'🚇'},
    {id:'church',name:'Nhà thờ',icon:'⛪'},
    {id:'temple',name:'Đền',icon:'🛕'},
    {id:'laboratory',name:'Phòng thí nghiệm',icon:'🧪'},
    {id:'laundry-room',name:'Phòng giặt',icon:'🧺'},
    {id:'construction-site',name:'Công trường',icon:'🚧'},
    {id:'carousel',name:'Đu quay',icon:'🎠'},
    {id:'underwater',name:'Dưới nước',icon:'🤿'},
    {id:'night-village',name:'Làng đêm',icon:'🏘️'},
  ]},
  things:{label:'Đồ vật',icon:'⏰',items:[
    {id:'clock',name:'Đồng hồ',icon:'⏰'},
    {id:'ceiling-fan',name:'Quạt trần',icon:'🌀'},
    {id:'wind-chimes',name:'Chuông gió',icon:'🎐'},
    {id:'singing-bowl',name:'Chuông xoay',icon:'🎵'},
    {id:'boiling-water',name:'Nước sôi',icon:'♨️'},
    {id:'bubbles',name:'Bong bóng',icon:'🫧'},
    {id:'keyboard',name:'Bàn phím',icon:'⌨️'},
    {id:'typewriter',name:'Máy chữ',icon:'📜'},
    {id:'paper',name:'Lật giấy',icon:'📄'},
    {id:'dryer',name:'Máy sấy',icon:'🧼'},
    {id:'washing-machine',name:'Máy giặt',icon:'🧺'},
    {id:'windshield-wipers',name:'Cần gạt nước',icon:'🚙'},
    {id:'slide-projector',name:'Máy chiếu slide',icon:'📽️'},
    {id:'tuning-radio',name:'Dò radio',icon:'📻'},
    {id:'morse-code',name:'Mã Morse',icon:'📡'},
    {id:'vinyl-effect',name:'Đĩa than',icon:'💿'},
  ]},
  transport:{label:'Phương tiện',icon:'✈️',items:[
    {id:'train',name:'Tàu hỏa',icon:'🚂'},
    {id:'inside-a-train',name:'Trong tàu hỏa',icon:'🚆'},
    {id:'airplane',name:'Máy bay',icon:'✈️'},
    {id:'sailboat',name:'Thuyền buồm',icon:'⛵'},
    {id:'rowing-boat',name:'Chèo thuyền',icon:'🛶'},
    {id:'submarine',name:'Tàu ngầm',icon:'🛳️'},
  ]},
  urban:{label:'Đô thị',icon:'🚦',items:[
    {id:'busy-street',name:'Phố đông',icon:'🛣️'},
    {id:'highway',name:'Cao tốc',icon:'🛣️'},
    {id:'road',name:'Đường',icon:'🚗'},
    {id:'traffic',name:'Giao thông',icon:'🚦'},
    {id:'crowd',name:'Đám đông',icon:'👥'},
    {id:'fireworks',name:'Pháo hoa',icon:'🎆'},
    {id:'ambulance-siren',name:'Còi cứu thương',icon:'🚑'},
  ]},
  binaural:{label:'Binaural',icon:'🧠',items:[
    {id:'binaural-delta',name:'Delta (ngủ)',icon:'😴'},
    {id:'binaural-theta',name:'Theta (thiền)',icon:'🧘'},
    {id:'binaural-alpha',name:'Alpha (thư giãn)',icon:'☯️'},
    {id:'binaural-beta',name:'Beta (tỉnh táo)',icon:'⚡'},
    {id:'binaural-gamma',name:'Gamma (tập trung)',icon:'🎯'},
  ]},
};

const SOUND_EXT={
  rain:'mp3',nature:'mp3',noise:'wav',animals:'mp3',
  places:'mp3',things:'mp3',transport:'mp3',urban:'mp3',binaural:'wav'
};

function soundUrl(id){const[cat,name]=id.split('/');return`sounds/${cat}/${name}.${SOUND_EXT[cat]}`}
function soundMeta(id){const[cat,name]=id.split('/');const c=SOUND_LIBRARY[cat];return c&&c.items.find(x=>x.id===name)}

const bufferCache={};
function loadBuffer(id){
  if(bufferCache[id])return bufferCache[id];
  const ctx=getCtx();
  bufferCache[id]=fetch(soundUrl(id))
    .then(r=>{if(!r.ok)throw new Error('HTTP '+r.status+' for '+id);return r.arrayBuffer()})
    .then(ab=>new Promise((res,rej)=>ctx.decodeAudioData(ab,res,rej)))
    .catch(e=>{delete bufferCache[id];throw e});
  return bufferCache[id];
}

function startSoundNode(id,gainNode){
  const ctx=getCtx();
  gainNode.gain.value=.7;
  const handle={_src:null,_cancelled:false,stop(){this._cancelled=true;if(this._src){try{this._src.stop()}catch(e){}}}};
  loadBuffer(id).then(buf=>{
    if(handle._cancelled)return;
    const src=ctx.createBufferSource();
    src.buffer=buf;src.loop=true;src.connect(gainNode);src.start();
    handle._src=src;
  }).catch(err=>console.error('startSoundNode failed',id,err));
  return handle;
}
