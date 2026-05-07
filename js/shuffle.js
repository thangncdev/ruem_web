const WORDS=['trăng','mây','biển','rừng','đêm','sao','hoa','gió','suối','núi','cánh','chim','lá','nước','mưa','bướm','cỏ','ánh','trời','ngọn','tre','mèo','bóng','rêu','đá','hồ','gương','sương','nến','cây','lửa','ao','tàu','mầm','bến','rễ','đồng','hương','giọt','sông','nắng','con','lụa','ấm','thuyền','bờ','ruộng','đèn','hạt','gối','sỏi','nụ','cát','áng','tổ','màn','búp','rương','đỉnh','hộp','góc','sáo','lối','nai','hươu','rồng','bánh','tách','mật','nồi'];
const OBJECTS={
  't':['trăng tròn','tủ gỗ','thuyền giấy','tách trà','tàu hỏa','tổ chim','táo đỏ','thác nước','thảm len','tre xanh','tuyết rơi','trống đồng','trái dừa','tượng đá','tổ ong'],
  'm':['mây trắng','mèo ngủ','mặt trời','máy bay','mưa phùn','mặt hồ','mầm cây','mật ong','mũ rơm','màn cửa','mâm cỗ','mỏ neo','mảnh trăng','mạng nhện','môi cười'],
  'b':['bướm vàng','bóng bay','biển xanh','bánh ngọt','bình hoa','bụi tre','bến đò','bồ câu','bậc thềm','bầu trời','bóng đèn','bãi cát','búp sen','bậu cửa','bờ suối'],
  'r':['rừng thông','rùa biển','rổ hoa','rồng nhỏ','rêu xanh','rễ cây','ruộng lúa','rặng tre','rương gỗ','ráng chiều','rạn san hô','rổ cá','rán bánh','rắn lục','rương báu'],
  'đ':['đám mây','đèn lồng','đồng lúa','đá cuội','đầm sen','đôi guốc','đường mòn','đỉnh núi','đàn cá','đèo cao','đôi cánh','đầm lầy','đuốc sáng','đồi cỏ','đêm sao'],
  'h':['hoa hồng','hồ nước','hươu cao cổ','hạt mưa','hồ sen','hang động','hòn đảo','hoa cúc','hộp gỗ','hàng cây','hạt sương','hoa sen','hộp diêm','hươu sao','hoa mai'],
  'g':['gió nhẹ','gương tròn','giọt sương','gà con','gối êm','gốc cây','giếng làng','gấu bông','ghế mây','gánh hàng','gò đất','góc bếp','giàn hoa','giấc mơ','giấy gió'],
  's':['sóng biển','sương mù','sao trời','suối nhỏ','sông quê','sân đình','sỏi trắng','sườn đồi','san hô','sáo diều','sách cũ','sợi tóc','sườn núi','sảnh đường','sương sớm'],
  'n':['núi cao','ngôi sao','nến sáng','ngọn đèn','nước trong','nắng vàng','ngói đỏ','nụ hoa','nai vàng','nồi đất','nhịp cầu','ngọn cỏ','nương rẫy','ngõ nhỏ','nóc nhà'],
  'c':['cây xanh','cánh chim','con mèo','cỏ non','cánh đồng','cầu vồng','con thuyền','cối xay','cây cau','chòi tranh','cánh diều','con đường','cát trắng','chú nai','cánh hoa'],
  'l':['lá vàng','lửa nhỏ','làn sóng','lông thú','lũy tre','lá sen','lồng đèn','lưng đồi','lúa chín','lối mòn','lá phong','lưới cá','lá tre','lông chim','lát gỗ'],
  'a':['ánh sáng','ao cá','ảnh cũ','âm nhạc','áng mây','ấm trà','ánh trăng','ao sen','áo lụa','ánh nến','ánh chớp','ấm nước','áng văn','áo gấm','ánh đèn']
};

let shuffleRunning=false,shuffleWordIdx=0,shuffleWordList=[];

function startShuffle(){
  shuffleRunning=true;
  shuffleWordList=[...WORDS].sort(()=>Math.random()-.5);
  shuffleWordIdx=0;
  document.getElementById('shuffle-btn').style.display='none';
  document.getElementById('shuffle-next').style.display='inline-flex';
  showShuffleWord();
}

function showShuffleWord(){
  if(shuffleWordIdx>=shuffleWordList.length)shuffleWordIdx=0;
  const word=shuffleWordList[shuffleWordIdx];
  const wEl=document.getElementById('shuffle-word');
  wEl.style.opacity=0;
  setTimeout(()=>{wEl.textContent=word.toUpperCase();wEl.style.opacity=1;showObject(word[0])},300);
  document.getElementById('shuffle-progress').style.width=(((shuffleWordIdx+1)/shuffleWordList.length)*100)+'%';
}

function showObject(letter){
  const arr=OBJECTS[letter]||['một vật ngẫu nhiên'];
  const obj=arr[Math.floor(Math.random()*arr.length)];
  const pEl=document.getElementById('shuffle-prompt');
  pEl.style.opacity=0;
  setTimeout(()=>{
    pEl.innerHTML=`🌙 Hình dung: <strong>${obj}</strong><br/><span style="color:var(--muted);font-size:13px">Nhìn thật kỹ — màu sắc, kích thước, kết cấu... Chỉ thấy ${obj}, không nghĩ gì khác.</span>`;
    pEl.style.opacity=1;
  },250);
  document.getElementById('shuffle-hint').textContent=`Hình ảnh bắt đầu bằng chữ "${letter.toUpperCase()}"`;
}

function nextShuffleWord(){shuffleWordIdx++;showShuffleWord()}
