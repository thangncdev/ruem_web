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

function makeNoiseBuffer(type){
  const ctx=getCtx(),len=ctx.sampleRate*4,buf=ctx.createBuffer(1,len,ctx.sampleRate),data=buf.getChannelData(0);
  let b0=0,b1=0,b2=0,b3=0,b4=0,b5=0,b6=0;
  for(let i=0;i<len;i++){
    const w=(Math.random()*2-1);
    if(type==='pink'){
      b0=.99886*b0+w*.0555179;b1=.99332*b1+w*.0750759;b2=.969*b2+w*.153852;
      b3=.8665*b3+w*.3104856;b4=.55*b4+w*.5329522;b5=-.7616*b5-w*.016898;
      data[i]=(b0+b1+b2+b3+b4+b5+b6+w*.5362)*.11;b6=w*.115926;
    } else {
      data[i]=w*(type==='soft'?.15:.3);
    }
  }
  return buf;
}

function startSoundNode(type,gainNode){
  const ctx=getCtx();
  let src=ctx.createBufferSource();

  if(type==='white'){
    src.buffer=makeNoiseBuffer('white');src.loop=true;
    src.connect(gainNode);gainNode.gain.value=.4;src.start();
  }
  else if(type==='pink'){
    src.buffer=makeNoiseBuffer('pink');src.loop=true;
    src.connect(gainNode);gainNode.gain.value=.4;src.start();
  }
  else if(type==='rain'){
    src.buffer=makeNoiseBuffer('white');src.loop=true;
    const f=ctx.createBiquadFilter();f.type='bandpass';f.frequency.value=450;f.Q.value=.9;
    src.connect(f);f.connect(gainNode);gainNode.gain.value=.55;src.start();
  }
  else if(type==='ocean'){
    src.buffer=makeNoiseBuffer('soft');src.loop=true;
    const f1=ctx.createBiquadFilter();f1.type='lowpass';f1.frequency.value=280;
    const wg=ctx.createGain();
    src.connect(f1);f1.connect(wg);wg.connect(gainNode);gainNode.gain.value=.65;
    src.start();
    (function wave(){
      if(!trackSources[type])return;
      const t=ctx.currentTime;
      wg.gain.setValueAtTime(.2,t);
      wg.gain.linearRampToValueAtTime(1,t+3.5);
      wg.gain.linearRampToValueAtTime(.2,t+7);
      setTimeout(wave,6800);
    })();
  }
  else if(type==='forest'){
    src.buffer=makeNoiseBuffer('pink');src.loop=true;
    const f=ctx.createBiquadFilter();f.type='highpass';f.frequency.value=900;
    src.connect(f);f.connect(gainNode);gainNode.gain.value=.3;src.start();
  }
  else if(type==='fire'){
    src.buffer=makeNoiseBuffer('pink');src.loop=true;
    const f=ctx.createBiquadFilter();f.type='lowpass';f.frequency.value=480;
    src.connect(f);f.connect(gainNode);gainNode.gain.value=.45;src.start();
  }
  else if(type==='thunder'){
    src.buffer=makeNoiseBuffer('pink');src.loop=true;
    const f=ctx.createBiquadFilter();f.type='lowpass';f.frequency.value=120;
    const g2=ctx.createGain();
    src.connect(f);f.connect(g2);g2.connect(gainNode);gainNode.gain.value=.5;
    src.start();
    (function rumble(){
      if(!trackSources[type])return;
      const t=ctx.currentTime;
      g2.gain.setValueAtTime(.1,t);
      g2.gain.linearRampToValueAtTime(.9,t+.4);
      g2.gain.linearRampToValueAtTime(.1,t+2);
      setTimeout(rumble,4000+Math.random()*6000);
    })();
  }
  else if(type==='wind'){
    src.buffer=makeNoiseBuffer('pink');src.loop=true;
    const f=ctx.createBiquadFilter();f.type='bandpass';f.frequency.value=200;f.Q.value=.3;
    const wg=ctx.createGain();
    src.connect(f);f.connect(wg);wg.connect(gainNode);gainNode.gain.value=.4;
    src.start();
    (function gust(){
      if(!trackSources[type])return;
      const t=ctx.currentTime;
      wg.gain.setValueAtTime(.3,t);
      wg.gain.linearRampToValueAtTime(1,t+2);
      wg.gain.linearRampToValueAtTime(.3,t+5);
      setTimeout(gust,4000+Math.random()*4000);
    })();
  }
  else if(type==='stream'){
    src.buffer=makeNoiseBuffer('white');src.loop=true;
    const f=ctx.createBiquadFilter();f.type='bandpass';f.frequency.value=700;f.Q.value=2;
    const f2=ctx.createBiquadFilter();f2.type='highshelf';f2.frequency.value=2000;f2.gain.value=-6;
    src.connect(f);f.connect(f2);f2.connect(gainNode);gainNode.gain.value=.5;src.start();
  }

  return src;
}
