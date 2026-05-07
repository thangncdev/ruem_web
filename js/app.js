(function() {
  const hour = new Date().getHours();
  const g = document.getElementById('greeting-text');
  const d = document.getElementById('display-text');

  const contentMap = [
    { limit: 5,  greet: 'Ngủ ngon nhé ✦', msg: 'Suỵt... hãy để cơ thể được nghỉ ngơi và phục hồi.' },
    { limit: 9,  greet: 'Chào buổi sáng', msg: 'Một đêm ngon giấc là khởi đầu cho ngày mới rạng rỡ.' },
    { limit: 12, greet: 'Ngày mới năng lượng', msg: 'Chúc bạn có một buổi sáng làm việc thật hiệu quả.' },
    { limit: 14, greet: 'Nghỉ trưa thôi', msg: 'Một giấc ngủ ngắn sẽ giúp bạn nạp đầy năng lượng cho chiều nay.' },
    { limit: 18, greet: 'Chiều thư thái', msg: 'Hít thở sâu và giữ tâm trí thật nhẹ nhàng bạn nhé.' },
    { limit: 21, greet: 'Buổi tối an yên', msg: 'Gác lại âu lo, hãy tận hưởng không gian dành riêng cho mình.' },
    { limit: 24, greet: 'Sẵn sàng đi ngủ ✦', msg: 'Đã đến lúc rời xa màn hình và đi vào giấc nồng rồi.' }
  ];

  const content = contentMap.find(item => hour < item.limit) || contentMap[contentMap.length - 1];

  if (g) g.textContent = content.greet;
  if (d) d.innerHTML = content.msg;

  // sync breath cue toggle icon with saved preference
  const cueBtn=document.getElementById('breath-cue-toggle');
  if(cueBtn)cueBtn.textContent=localStorage.getItem('breathCueEnabled')==='false'?'🔇':'🔊';
})();