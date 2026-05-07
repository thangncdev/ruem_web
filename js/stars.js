(function(){
  const canvas=document.getElementById('stars-canvas'),ctx=canvas.getContext('2d');
  let W,H,stars=[],fireflies=[],shootingStar=null,nextShootAt=0,t=0;

  const COOL=[126,184,212],WARM=[232,201,122];

  function resize(){
    W=canvas.width=window.innerWidth;
    H=canvas.height=window.innerHeight;
    initStars();initFireflies();
  }

  function initStars(){
    stars=[];
    // 3 depth layers: far / mid / near
    [
      {count:70,rMin:.12,rMax:.4,aMax:.4,spd:.0008},
      {count:80,rMin:.28,rMax:.75,aMax:.62,spd:.0014},
      {count:40,rMin:.5,rMax:1.2,aMax:.82,spd:.0024},
    ].forEach(l=>{
      for(let i=0;i<l.count;i++){
        stars.push({
          x:Math.random()*W,y:Math.random()*H,
          r:l.rMin+Math.random()*(l.rMax-l.rMin),
          baseA:l.aMax*(.4+Math.random()*.6),
          phase:Math.random()*Math.PI*2,
          spd:l.spd*(.7+Math.random()*.6),
        });
      }
    });
  }

  function initFireflies(){
    fireflies=[];
    for(let i=0;i<25;i++) fireflies.push(mkFirefly(true));
  }

  function mkFirefly(scatter){
    const warm=Math.random()>.5;
    return{
      x:Math.random()*W,
      y:scatter?Math.random()*H:H+10+Math.random()*40,
      vy:-(0.14+Math.random()*.22),
      vxPhase:Math.random()*Math.PI*2,
      vxAmp:.3+Math.random()*.5,
      r:.7+Math.random()*1.1,
      color:warm?WARM:COOL,
      alpha:0,
      target:.45+Math.random()*.45,
      fade:.007+Math.random()*.009,
    };
  }

  function spawnShoot(){
    const angle=Math.PI/6+Math.random()*(Math.PI/9);
    const spd=5+Math.random()*4;
    shootingStar={
      x:Math.random()*W*.65,y:Math.random()*H*.28,
      vx:Math.cos(angle)*spd,vy:Math.sin(angle)*spd,
      life:0,maxLife:65+Math.random()*15,
      tailLen:70+Math.random()*60,
    };
  }

  function scheduleShoot(){
    nextShootAt=t+(18+Math.random()*17)*60;
  }

  function drawStars(){
    stars.forEach(s=>{
      const a=s.baseA*(.55+.45*Math.sin(s.phase+t*s.spd));
      ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
      ctx.fillStyle=`rgba(200,218,240,${a})`;ctx.fill();
    });
  }

  function drawFireflies(){
    fireflies.forEach((f,i)=>{
      f.x+=Math.sin(f.vxPhase+t*.018)*f.vxAmp*.09;
      f.y+=f.vy;
      f.alpha=f.alpha<f.target?Math.min(f.alpha+f.fade,f.target):f.alpha-f.fade*.3;
      if(f.y<-20||f.alpha<0){fireflies[i]=mkFirefly(false);return;}
      const[r,g,b]=f.color;
      const g2=ctx.createRadialGradient(f.x,f.y,0,f.x,f.y,f.r*5);
      g2.addColorStop(0,`rgba(${r},${g},${b},${f.alpha})`);
      g2.addColorStop(1,`rgba(${r},${g},${b},0)`);
      ctx.beginPath();ctx.arc(f.x,f.y,f.r*5,0,Math.PI*2);
      ctx.fillStyle=g2;ctx.fill();
      ctx.beginPath();ctx.arc(f.x,f.y,f.r,0,Math.PI*2);
      ctx.fillStyle=`rgba(${r},${g},${b},${f.alpha})`;ctx.fill();
    });
  }

  function drawShoot(){
    if(!shootingStar)return;
    const s=shootingStar;
    s.x+=s.vx;s.y+=s.vy;s.life++;
    const p=s.life/s.maxLife;
    const ease=p<.5?p*2:1-(p-.5)*2;
    const alpha=ease*.85;
    const dist=Math.sqrt(s.vx*s.vx+s.vy*s.vy);
    const tx=s.x-s.vx*(s.tailLen/dist);
    const ty=s.y-s.vy*(s.tailLen/dist);
    const g2=ctx.createLinearGradient(tx,ty,s.x,s.y);
    g2.addColorStop(0,`rgba(200,218,240,0)`);
    g2.addColorStop(.7,`rgba(200,218,240,${alpha*.28})`);
    g2.addColorStop(1,`rgba(220,235,255,${alpha})`);
    ctx.beginPath();ctx.moveTo(tx,ty);ctx.lineTo(s.x,s.y);
    ctx.strokeStyle=g2;ctx.lineWidth=1.4;ctx.stroke();
    const hg=ctx.createRadialGradient(s.x,s.y,0,s.x,s.y,4);
    hg.addColorStop(0,`rgba(235,245,255,${alpha})`);
    hg.addColorStop(1,`rgba(200,218,240,0)`);
    ctx.beginPath();ctx.arc(s.x,s.y,4,0,Math.PI*2);
    ctx.fillStyle=hg;ctx.fill();
    if(s.life>=s.maxLife)shootingStar=null;
  }

  function loop(){
    ctx.clearRect(0,0,W,H);
    drawStars();
    drawFireflies();
    if(t>=nextShootAt){if(!shootingStar)spawnShoot();scheduleShoot();}
    drawShoot();
    t++;requestAnimationFrame(loop);
  }

  window.addEventListener('resize',resize);
  resize();scheduleShoot();loop();
})();
