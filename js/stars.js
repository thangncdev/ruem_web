(function(){
  const c=document.getElementById('stars-canvas'),ctx=c.getContext('2d');let stars=[];
  function resize(){c.width=window.innerWidth;c.height=window.innerHeight;init()}
  function init(){stars=[];for(let i=0;i<160;i++)stars.push({x:Math.random()*c.width,y:Math.random()*c.height,r:Math.random()*1.2+.2,a:Math.random(),da:Math.random()*.004+.001,dir:Math.random()<.5?1:-1})}
  function draw(){ctx.clearRect(0,0,c.width,c.height);stars.forEach(s=>{s.a+=s.da*s.dir;if(s.a>1||s.a<0)s.dir*=-1;ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.fillStyle=`rgba(200,218,240,${s.a*.7})`;ctx.fill()});requestAnimationFrame(draw)}
  window.addEventListener('resize',resize);resize();draw();
})();
