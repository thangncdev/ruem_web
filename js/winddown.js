const WD_TASKS = [
  { min: 60, title: 'Ngừng caffeine & rượu', score: 25 },
  { min: 50, title: 'Giảm độ sáng đèn', score: 20 },
  { min: 30, title: 'Tắt màn hình', score: 25 },
  { min: 15, title: 'Bài thở thư giãn', score: 20 },
  { min: 5, title: 'Cognitive Shuffle', score: 10 }
];

let wdDone = [], wdInterval = null, wdBedtime = null;

function toggleTask(idx) {
  const i = wdDone.indexOf(idx);
  if (i > -1) wdDone.splice(i, 1); else wdDone.push(idx);
  updateReadiness();
  const item = document.querySelector(`.timeline-item[data-idx="${idx}"]`);
  const check = document.getElementById('check-' + idx);
  item.classList.toggle('done', wdDone.includes(idx));
  check.textContent = wdDone.includes(idx) ? '✓' : '';
}

function updateReadiness() {
  const score = wdDone.reduce((sum, i) => sum + WD_TASKS[i].score, 0);
  const scoreEl = document.getElementById('wd-score');
  scoreEl.textContent = score;
  scoreEl.classList.remove('bumping'); void scoreEl.offsetWidth; scoreEl.classList.add('bumping');
  document.getElementById('wd-bar').style.width = score + '%';
  document.getElementById('home-readiness-score').textContent = score;
  document.getElementById('home-bar').style.width = score + '%';
  const labels = ['Hãy bắt đầu wind-down routine', 'Bắt đầu rồi, tiếp tục nào!', 'Đang tiến triển tốt 👍', 'Gần xong rồi!', 'Sẵn sàng để ngủ ngon! 🌙'];
  const idx = Math.floor(score / 25);
  const label = labels[Math.min(idx, labels.length - 1)];
  document.getElementById('wd-status-text').textContent = label;
  document.getElementById('home-readiness-label').textContent = label;
}

function startWinddown() {
  const h = parseInt(document.getElementById('wd-hour').value), m = parseInt(document.getElementById('wd-min').value);
  wdBedtime = h * 60 + m;
  if (wdInterval) clearInterval(wdInterval);
  wdInterval = setInterval(updateCountdowns, 30000);
  updateCountdowns();
}

function updateCountdowns() {
  if (wdBedtime === null) return;
  const now = new Date(), nowMin = now.getHours() * 60 + now.getMinutes();
  let diff = wdBedtime - nowMin;
  if (diff < 0) diff += 1440;
  WD_TASKS.forEach((task, i) => {
    const el = document.getElementById('cd-' + i);
    if (!el) return;
    const taskDiff = diff - task.min;
    if (taskDiff <= 0 && taskDiff > -10) {
      el.textContent = '⏰ Đây rồi!';
      document.querySelector(`.timeline-item[data-idx="${i}"]`).classList.add('active-now');
    } else if (taskDiff > 0) {
      const h = Math.floor(taskDiff / 60), m = taskDiff % 60;
      el.textContent = h > 0 ? `Còn ${h}h ${m}p` : `Còn ${m} phút`;
      document.querySelector(`.timeline-item[data-idx="${i}"]`).classList.remove('active-now');
    } else {
      el.textContent = '';
      document.querySelector(`.timeline-item[data-idx="${i}"]`).classList.remove('active-now');
    }
  });
}

function resetWinddown() {
  wdDone = [];
  if (wdInterval) { clearInterval(wdInterval); wdInterval = null }
  wdBedtime = null;
  WD_TASKS.forEach((_, i) => {
    document.querySelector(`.timeline-item[data-idx="${i}"]`).classList.remove('done', 'active-now');
    document.getElementById('check-' + i).textContent = '';
    document.getElementById('cd-' + i).textContent = '';
  });
  updateReadiness();
}
