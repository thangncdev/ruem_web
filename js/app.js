(function(){
  const h=new Date().getHours(),g=document.getElementById('greeting-text');
  if(h<6)g.textContent='Đêm khuya rồi ✦';
  else if(h<12)g.textContent='Chào buổi sáng ✦';
  else if(h<18)g.textContent='Chào buổi chiều ✦';
  else g.textContent='Chào buổi tối ✦';
})();
