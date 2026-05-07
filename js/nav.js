function navigate(view){
  document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
  document.getElementById('view-'+view).classList.add('active');
  const btn=document.querySelector(`.nav-item[data-view="${view}"]`);
  if(btn)btn.classList.add('active');
  window.scrollTo(0,0);
}
