const WORDS=['trăng','mây','biển','rừng','đêm','sao','hoa','gió','suối','núi','cánh','chim','lá','nước','mưa','bướm','cỏ','ánh','trời','ngọn'];
const OBJECTS={
  't':['trăng tròn','tủ gỗ','thuyền giấy','tách trà'],
  'm':['mây trắng','mèo ngủ','mặt trời','máy bay'],
  'b':['bướm vàng','bóng bay','biển xanh','bánh ngọt'],
  'r':['rừng thông','rùa biển','rổ hoa','rồng nhỏ'],
  'đ':['đám mây','đèn lồng','đồng lúa','đá cuội'],
  'h':['hoa hồng','hồ nước','hươu cao cổ','hạt mưa'],
  'g':['gió nhẹ','gương tròn','giọt sương','gà con'],
  's':['sóng biển','sương mù','sao trời','suối nhỏ'],
  'n':['núi cao','ngôi sao','nến sáng','ngọn đèn'],
  'c':['cây xanh','cánh chim','con mèo','cỏ non'],
  'l':['lá vàng','lửa nhỏ','làn sóng','lông thú'],
  'a':['ánh sáng','ao cá','ảnh cũ','âm nhạc']
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
