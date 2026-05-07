# Ngủ Ngon — Sleep Support Web App
## Product Requirements Document (PRD) v1.0

> **Mục tiêu:** Đây là tài liệu đặc tả đầy đủ để build lại toàn bộ ứng dụng hỗ trợ giấc ngủ "Ngủ Ngon" dưới dạng single-page web app (HTML/CSS/JS thuần, không framework, không build step). App phải deploy được lên GitHub Pages chỉ bằng một file `index.html`.

---

## 1. Tổng quan dự án

### 1.1 Mô tả
"Ngủ Ngon" là ứng dụng web hỗ trợ giấc ngủ dành cho người Việt, áp dụng các phương pháp khoa học từ cuốn sách *Sleep* của Nick Littlehales (R90 Method), kỹ thuật thở 4-7-8 của Dr. Andrew Weil, và Cognitive Shuffle của Dr. Luc Beaulieu-Prévost.

### 1.2 Lý do tồn tại
- Calm và BetterSleep — hai app ngủ lớn nhất thế giới — **không có nội dung tiếng Việt**
- Giá subscription quá cao (~$70/năm) cho người dùng Việt Nam
- Cần một app đơn giản, dùng được ngay, không cần đăng ký tài khoản

### 1.3 Stack kỹ thuật
- **Ngôn ngữ:** HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Âm thanh:** Web Audio API (tạo âm thanh trực tiếp trong trình duyệt, không cần file audio)
- **Font:** Google Fonts — `Cormorant Garamond` (display/serif) + `Nunito` (body/UI)
- **Deploy:** GitHub Pages (single `index.html`)
- **Không dùng:** React, Vue, Angular, npm, webpack, bất kỳ framework nào

---

## 2. Design System

### 2.1 Màu sắc (CSS Variables)
```css
:root {
  --bg: #060b14;           /* Nền chính — xanh đêm rất tối */
  --bg2: #0c1424;          /* Nền thứ cấp — cho input, select */
  --bg3: #111d30;          /* Nền thứ ba */

  --surface: rgba(255,255,255,0.05);   /* Card surface */
  --surface2: rgba(255,255,255,0.09);  /* Card hover / button */
  --surface3: rgba(255,255,255,0.13);  /* Card active */

  --border: rgba(255,255,255,0.08);    /* Border mặc định */
  --border2: rgba(255,255,255,0.14);   /* Border nhấn mạnh */

  --accent: #7eb8d4;       /* Xanh dương nhạt — màu chính */
  --accent2: #e8c97a;      /* Vàng ấm — badge, highlight */
  --accent3: #a8d4a0;      /* Xanh lá nhạt — success, done */

  --text: #dde4f0;         /* Chữ chính */
  --muted: rgba(221,228,240,0.45);  /* Chữ phụ / muted */

  --radius: 20px;          /* Border radius card */
  --nav-h: 70px;           /* Chiều cao bottom nav */
}
```

### 2.2 Typography
- **Display font:** `Cormorant Garamond` — dùng cho tiêu đề lớn, số thời gian, các element "dreamy"
  - H1: 36px, weight 300 (light)
  - H2: 26px, weight 300
  - Số thời gian lớn: 64px, weight 300
- **Body font:** `Nunito` — dùng cho tất cả text UI
  - Body: 14px, weight 400
  - Label: 13px, weight 400
  - Caption: 11–12px, weight 400
  - Bold UI: weight 600–700

### 2.3 Aesthetic direction
- **Mood:** Không gian đêm tối, yên tĩnh, có sao trời
- **Texture:** Glassmorphism nhẹ — `backdrop-filter: blur(10px)` trên cards
- **Không dùng:** gradient sặc sỡ, màu tím/hồng AI-generic, shadow nặng

### 2.4 Background — Hiệu ứng sao
Canvas `<canvas id="stars-canvas">` fixed full-screen, z-index 0, pointer-events none.  
Vẽ 160 ngôi sao nhỏ (radius 0.2–1.4px), opacity dao động (twinkle), màu `rgba(200,218,240,opacity*0.7)`.

```javascript
// Mỗi star object:
{ x, y, r, a (opacity), da (delta opacity), dir (1 hoặc -1) }
// Star twinkle: a += da * dir; if a>1 || a<0: dir *= -1
```

### 2.5 Components tái sử dụng

#### Card
```css
.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 20px;
  backdrop-filter: blur(10px);
}
```

#### Buttons
```css
/* Primary — nền accent, chữ đen */
.btn-primary { background: var(--accent); color: var(--bg); padding: 14px 32px; border-radius: 50px; font-size: 15px; font-weight: 600; }

/* Ghost — nền trong suốt, border */
.btn-ghost { background: var(--surface2); color: var(--text); border: 1px solid var(--border); padding: 12px 24px; border-radius: 50px; }

/* Icon — tròn, 52x52 */
.btn-icon { width: 52px; height: 52px; border-radius: 50%; background: var(--surface2); border: 1px solid var(--border); }

/* Small */
.btn-sm { padding: 8px 16px; font-size: 13px; border-radius: 50px; background: var(--surface2); border: 1px solid var(--border); }
```

#### Section label
```css
.section-label {
  font-size: 11px; font-weight: 700;
  letter-spacing: 2px; text-transform: uppercase;
  color: var(--muted); margin-bottom: 14px;
}
```

#### Range input
```css
input[type=range] {
  -webkit-appearance: none; height: 4px;
  background: var(--border); border-radius: 2px;
}
input[type=range]::-webkit-slider-thumb {
  -webkit-appearance: none; width: 16px; height: 16px;
  border-radius: 50%; background: var(--accent);
}
```

---

## 3. Cấu trúc Navigation

### 3.1 Bottom Navigation Bar
Fixed bottom, 5 tabs, height 70px, `background: rgba(6,11,20,0.92)`, `backdrop-filter: blur(20px)`, `border-top: 1px solid var(--border)`.

| Tab | Icon (SVG inline) | Label | View ID |
|-----|------------------|-------|---------|
| Trang chủ | house icon | Trang chủ | `view-home` |
| Thở | smile/face icon | Thở | `view-breathing` |
| Mixer | sliders/equalizer icon | Mixer | `view-mixer` |
| Giấc ngủ | clock icon | Giấc ngủ | `view-sleep` |
| Shuffle | shuffle arrows icon | Shuffle | `view-shuffle` |

- Tab active: `color: var(--accent)`
- Tab inactive: `color: var(--muted)`
- Chuyển view: hide tất cả `.view`, show `.view#view-{name}`, update active state nav

### 3.2 View layout
```css
.view {
  display: none;
  padding: 24px 20px 0;
  max-width: 480px;
  margin: 0 auto;
}
.view.active {
  display: block;
  animation: fadeIn 0.3s ease;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

Padding bottom của `#app`: `calc(70px + 16px)` để tránh bị nav che.

---

## 4. Tính năng chi tiết

---

### 4.1 VIEW: Trang chủ (`view-home`)

#### 4.1.1 Header
```html
<p class="greeting" id="greeting-text">...</p>
<h1 class="display">Chúc ngủ ngon,<br/><em>hãy để cơ thể nghỉ ngơi.</em></h1>
```
Logic greeting theo giờ:
- 0–5h: "Đêm khuya rồi ✦"
- 6–11h: "Chào buổi sáng ✦"
- 12–17h: "Chào buổi chiều ✦"
- 18–23h: "Chào buổi tối ✦"

#### 4.1.2 Sleep Readiness Card
Card hiển thị điểm Sleep Readiness (0–100) đồng bộ từ Thư giãn Routine.

```
[Card]
  [Trái] Label "Sleep Readiness"
         Score lớn (Cormorant Garamond, 32px) — ví dụ: "60"
         Sub text — ví dụ: "Đang tiến triển tốt 👍"
  [Phải] Icon 🌙 (40px, opacity 0.6)
  [Full width] Progress bar (height 8px, gradient accent → accent3)
  [Button] "Bắt đầu Thư giãn →" → navigate đến view-sleep, tab winddown
```

Progress bar fill: `width: {score}%`, `background: linear-gradient(90deg, var(--accent), var(--accent3))`, `transition: width 0.8s ease`.

Sub text theo score:
- 0: "Hãy bắt đầu wind-down routine"
- 1–24: "Bắt đầu rồi, tiếp tục nào!"
- 25–49: "Đang tiến triển tốt 👍"
- 50–74: "Gần xong rồi!"
- 75–100: "Sẵn sàng để ngủ ngon! 🌙"

#### 4.1.3 R90 Strip
```
[Strip — gradient background rgba(126,184,212,.12)]
  Badge "R90 Method" (vàng, pill)
  H3: "Bạn nên ngủ lúc mấy giờ?"
  P: "Tính chu kỳ ngủ tối ưu theo phương pháp 90 phút"
  Button "Tính ngay →" → view-sleep tab r90
```

#### 4.1.4 Quick Actions Grid
2×2 grid, mỗi card:
```
[Icon lớn 26px]
[Title 14px bold]
[Desc 12px muted]
```

| Icon | Title | Desc | Action |
|------|-------|------|--------|
| 🫁 | Thở 4-7-8 | Thư giãn hệ thần kinh, ngủ trong 2 phút | navigate('breathing') |
| 🎚️ | Sound Mixer | Trộn âm thanh yêu thích của bạn | navigate('mixer') |
| 🌀 | Cognitive Shuffle | Ngắt vòng suy nghĩ, ngủ nhanh hơn | navigate('shuffle') |
| 🌅 | Thư giãn | Chuẩn bị cơ thể và tinh thần trước khi ngủ | navigate('sleep') + tab winddown |

---

### 4.2 VIEW: Hướng dẫn thở (`view-breathing`)

#### 4.2.1 Method Selector
3 chip buttons:
| Label | data-method | Tên | Mô tả | Phases | Cycles |
|-------|------------|-----|-------|--------|--------|
| 4-7-8 | `478` | Kỹ thuật 4-7-8 | Hít 4 · Nín 7 · Thở ra 8 | [{Hít vào, 4s}, {Nín thở, 7s}, {Thở ra, 8s}] | 4 |
| Box Breathing | `box` | Box Breathing | Hít 4 · Nín 4 · Thở ra 4 · Nín 4 | [{Hít vào, 4s}, {Nín, 4s}, {Thở ra, 4s}, {Nín, 4s}] | 4 |
| Thư giãn | `relax` | Thở thư giãn | Hít 5 · Thở ra 7 | [{Hít vào, 5s}, {Thở ra, 7s}] | 6 |

Chip active: `background: var(--accent); color: var(--bg)`

#### 4.2.2 Animation Ring
```
[Outer ring — 200×200px, circle, border 2px rgba(126,184,212,.25)]
  ::before pseudo — radial gradient glow, scale animation
  [Inner circle — 120×120px, border 1px rgba(126,184,212,.4)]
    [Phase text — 13px bold, color accent]
    [Count number — 28px Cormorant Garamond]
```

**Animation states** (class toggle trên `#breath-ring` và `#breath-inner`):

| Phase | Class | CSS transition |
|-------|-------|----------------|
| Hít vào | `.expanding` | scale 0.7 → 1.15, duration = phase duration (s) |
| Nín | `.holding` | giữ scale 1.15 |
| Thở ra | `.contracting` | scale 1.15 → 0.7, duration = phase duration (s) |
| Reset | (no class) | scale 0.7, transition: none |

CSS dùng CSS variable `--bd` (breath duration) để set duration động:
```css
.breath-inner.expanding {
  transform: scale(1.15);
  transition: transform var(--bd, 4s) ease-in-out;
}
```

Trước khi add class mới: `void ring.offsetWidth` (force reflow để restart animation).

#### 4.2.3 Controls
- Button ▶/⏸ toggle start/pause
- Button "Đặt lại" → reset về trạng thái ban đầu
- Cycle counter: hiển thị "Chu kỳ X / Y" + dot indicators

#### 4.2.4 Logic flow
```
toggleBreath() → startBreath() hoặc pauseBreath()

startBreath():
  breathRunning = true
  hiển thị cycle counter
  render cycle dots
  gọi runBreathPhase()

runBreathPhase():
  lấy phase hiện tại (breathPhaseIdx)
  set CSS variable --bd = phase.d + 's'
  xóa class animation cũ, force reflow
  add class animation mới (expanding/holding/contracting)
  đếm ngược từ phase.d xuống 0 (setInterval 1s)
  sau phase.d * 1000ms: tăng breathPhaseIdx
  nếu hết tất cả phases: tăng breathCyclesDone, reset breathPhaseIdx về 0
  nếu đủ cycles: kết thúc (hiển thị "✓ Hoàn thành")
  ngược lại: gọi lại runBreathPhase()
```

#### 4.2.5 Info card
Card cuối giải thích tại sao kỹ thuật hiệu quả (text tĩnh).

---

### 4.3 VIEW: Sound Mixer (`view-mixer`)

Đây là tính năng phức tạp nhất. Người dùng có thể chọn nhiều âm thanh và trộn chúng với volume độc lập.

#### 4.3.1 Preset chips
4 preset: "🌧️ Mưa đêm" | "🌊 Ngủ sâu" | "🔥 Rừng đêm" | "🎵 Tập trung"

| Preset | Sounds |
|--------|--------|
| Mưa đêm | rain + thunder |
| Ngủ sâu | ocean + pink |
| Rừng đêm | forest + fire + wind |
| Tập trung | white + stream |

Khi click preset: xóa tất cả track hiện tại → thêm các sound của preset.

#### 4.3.2 Sound Library Grid
3 cột, 9 âm thanh:

| Sound ID | Icon | Tên |
|----------|------|-----|
| `rain` | 🌧️ | Mưa nhẹ |
| `ocean` | 🌊 | Sóng biển |
| `white` | 🔊 | White Noise |
| `forest` | 🌿 | Rừng đêm |
| `fire` | 🔥 | Lửa trại |
| `pink` | 🌸 | Pink Noise |
| `thunder` | ⚡ | Sấm xa |
| `wind` | 💨 | Gió nhẹ |
| `stream` | 🏞️ | Suối chảy |

Mỗi item: icon lớn + tên nhỏ + text "+ Thêm".  
Khi sound đang trong mix: class `.in-mix`, border đổi sang `rgba(126,184,212,.35)`, background `rgba(126,184,212,.12)`.  
Click item: nếu đang trong mix → xóa khỏi mix; nếu chưa → thêm vào mix.

#### 4.3.3 Mix Tracks (active sounds)
Mỗi sound đang phát hiển thị một "track card":
```
[Track Card]
  [Header row]
    [Icon] [Tên sound] [Nút X để xóa]
  [Volume row]
    [Range slider 0–100] [số volume]
```

Khi chưa có sound nào: hiển thị empty state "Chưa có âm thanh nào. Chọn từ thư viện phía trên để bắt đầu ✦"

#### 4.3.4 Master Volume
Range slider 0–100, mặc định 70. Điều chỉnh `masterGainNode.gain`.

#### 4.3.5 Timer tắt
4 chips: 15p | 30p | 45p | 60p. Thêm chip "Tắt hẹn giờ".  
Khi đặt timer: hiển thị đếm ngược "⏱ Tắt sau M:SS".  
Khi hết giờ: fade out masterGain trong 3 giây, sau đó xóa tất cả tracks.

#### 4.3.6 Web Audio Engine — Chi tiết kỹ thuật

**Khởi tạo:**
```javascript
let audioCtx = null, masterGainNode = null, mixTracks = {};

function getCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    masterGainNode = audioCtx.createGain();
    masterGainNode.gain.value = 0.7;
    masterGainNode.connect(audioCtx.destination);
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}
```

**Tạo noise buffer:**
```javascript
function makeNoiseBuffer(type) {
  const ctx = getCtx();
  const len = ctx.sampleRate * 4; // 4 giây, loop
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buf.getChannelData(0);
  
  if (type === 'pink') {
    // Pink noise: Voss-McCartney algorithm
    let b0=0, b1=0, b2=0, b3=0, b4=0, b5=0, b6=0;
    for (let i = 0; i < len; i++) {
      const w = Math.random() * 2 - 1;
      b0 = 0.99886*b0 + w*0.0555179; b1 = 0.99332*b1 + w*0.0750759;
      b2 = 0.969*b2 + w*0.153852;   b3 = 0.8665*b3 + w*0.3104856;
      b4 = 0.55*b4 + w*0.5329522;   b5 = -0.7616*b5 - w*0.016898;
      data[i] = (b0+b1+b2+b3+b4+b5+b6+w*0.5362) * 0.11;
      b6 = w * 0.115926;
    }
  } else {
    // White noise hoặc soft noise
    const amp = type === 'soft' ? 0.15 : 0.3;
    for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * amp;
  }
  return buf;
}
```

**Tạo sound node cho từng loại âm thanh:**

| Sound | Cách tạo | Gain |
|-------|----------|------|
| `white` | White noise buffer → gainNode | 0.4 |
| `pink` | Pink noise buffer → gainNode | 0.4 |
| `rain` | White noise → BandpassFilter (freq 450, Q 0.9) → gainNode | 0.55 |
| `ocean` | Soft noise → LowpassFilter (freq 280) → wavingGain (oscillate 0.2→1→0.2 mỗi 7s) → gainNode | 0.65 |
| `forest` | Pink noise → HighpassFilter (freq 900) → gainNode | 0.3 |
| `fire` | Pink noise → LowpassFilter (freq 480) → gainNode | 0.45 |
| `thunder` | Pink noise → LowpassFilter (freq 120) → rumbleGain (occasional burst 0.1→0.9→0.1) → gainNode | 0.5 |
| `wind` | Pink noise → BandpassFilter (freq 200, Q 0.3) → gustGain (oscillate với random interval) → gainNode | 0.4 |
| `stream` | White noise → BandpassFilter (freq 700, Q 2) → HighshelfFilter (freq 2000, gain -6) → gainNode | 0.5 |

**Ocean wave oscillation:**
```javascript
// Gọi đệ quy với setTimeout
function wave() {
  if (!mixTracks['ocean']) return; // stop nếu track bị xóa
  const t = ctx.currentTime;
  waveGain.gain.setValueAtTime(0.2, t);
  waveGain.gain.linearRampToValueAtTime(1, t + 3.5);
  waveGain.gain.linearRampToValueAtTime(0.2, t + 7);
  setTimeout(wave, 6800);
}
wave(); // bắt đầu
```

**Thunder rumble:**
```javascript
function rumble() {
  if (!mixTracks['thunder']) return;
  const t = ctx.currentTime;
  rumbleGain.gain.setValueAtTime(0.1, t);
  rumbleGain.gain.linearRampToValueAtTime(0.9, t + 0.4);
  rumbleGain.gain.linearRampToValueAtTime(0.1, t + 2);
  setTimeout(rumble, 4000 + Math.random() * 6000); // mỗi 4–10 giây
}
```

**Add/Remove track:**
```javascript
function addToMix(type, icon, name) {
  if (mixTracks[type]) { removeFromMix(type); return; } // toggle
  const ctx = getCtx();
  const gainNode = ctx.createGain();
  gainNode.connect(masterGainNode);
  const src = startSoundNode(type, gainNode); // trả về BufferSourceNode
  mixTracks[type] = { src, gainNode, icon, name, vol: 70 };
  // update UI
}

function removeFromMix(type) {
  if (!mixTracks[type]) return;
  try { mixTracks[type].src.stop(); } catch(e) {}
  mixTracks[type].gainNode.disconnect();
  delete mixTracks[type];
  // update UI
}
```

**Set individual track volume:**
```javascript
function setTrackVol(type, v) {
  mixTracks[type].vol = parseInt(v);
  mixTracks[type].gainNode.gain.setTargetAtTime(v / 100 * 0.8, audioCtx.currentTime, 0.1);
}
```

---

### 4.4 VIEW: Giấc ngủ (`view-sleep`)

View này có 2 tab lồng bên trong: **R90** và **Thư giãn**.

#### 4.4.1 Tab switcher
```html
<div class="sleep-tabs">
  <button class="sleep-tab active" onclick="switchSleepTab('r90')">🌙 Chu kỳ R90</button>
  <button class="sleep-tab" onclick="switchSleepTab('winddown')">🌅 Thư giãn</button>
</div>
```
CSS: flex, background `var(--surface)`, border radius 50px, padding 4px. Active tab: `background: var(--accent); color: var(--bg)`.

#### 4.4.2 Panel R90

**Giới thiệu:** Mỗi chu kỳ ngủ = 90 phút. Tỉnh đúng cuối chu kỳ = tỉnh táo hơn.

**Input giờ thức dậy:**
```
Label: "🔔 Tôi cần thức dậy lúc:"
[Select giờ: 04–11] : [Select phút: 00, 15, 30, 45]
```
Select dùng font Cormorant Garamond 22px, `background: var(--bg2)`.

**Chọn số chu kỳ:** 4 options: 3 (4.5h) | 4 (6h) | 5 (7.5h) — mặc định | 6 (9h)

**Nút tính:** "Tính giờ ngủ →" (btn-primary, full width)

**Kết quả:** Hiển thị 3 options xung quanh số chu kỳ được chọn:

```javascript
function calcR90() {
  const wh = parseInt(document.getElementById('wake-hour').value);
  const wm = parseInt(document.getElementById('wake-min').value);
  const fallAsleepMins = 14; // thời gian chìm vào giấc ngủ trung bình

  for (let offset = 0; offset <= 2; offset++) {
    const cycles = selectedCycles + offset - 1;
    if (cycles < 2) continue;
    const totalMins = cycles * 90 + fallAsleepMins;
    let t = wh * 60 + wm - totalMins;
    while (t < 0) t += 1440; // wrap qua đêm
    const sh = Math.floor(t / 60) % 24;
    const sm = t % 60;
    // render result item
  }
}
```

Mỗi result item:
```
[Giờ ngủ lớn — Cormorant 24px]    [X chu kỳ — accent]
                                    [X.X giờ — muted]
                                    [Badge "✓ Khuyến nghị" nếu là lựa chọn chính]
```

Item khuyến nghị: background gradient accent nhạt, border accent.

Auto tính khi load và khi thay đổi select.

#### 4.4.3 Panel Thư giãn

**Sleep Readiness Score (trung tâm):**
```
[Số lớn 64px Cormorant Garamond — color accent]
[Label "Sleep Readiness Score" — muted]
[Progress bar mỏng — 6px]
[Sub text theo score]
```

**Đặt giờ ngủ:**
```
Label "🛏 Dự định ngủ lúc:"
[Select giờ: 20–01] [Select phút: 00, 30]
[Button "Bắt đầu"]
```
Khi bấm "Bắt đầu": lưu giờ ngủ, bắt đầu interval 30s để cập nhật countdown.

**Timeline 6 tasks:**

| Idx | Trước bao lâu | Title | Desc | Score | Action button |
|-----|--------------|-------|------|-------|---------------|
| 0 | 60 phút | ☕ Ngừng caffeine & rượu | Caffeine tồn tại 6–8 giờ. Uống trà thảo mộc hoặc nước ấm. | 15 | — |
| 1 | 50 phút | 💡 Giảm độ sáng đèn | Ánh sáng mạnh ức chế melatonin. Dùng đèn vàng ấm. | 20 | — |
| 2 | 40 phút | 🛁 Tắm nước ấm | Nhiệt độ cơ thể giảm sau tắm là tín hiệu sinh học để ngủ. | 20 | — |
| 3 | 30 phút | 📵 Tắt màn hình | Đặt điện thoại sang phòng khác. Ánh sáng xanh phá vỡ nhịp sinh học. | 20 | "🎚️ Bật âm thanh ngủ →" → navigate mixer |
| 4 | 15 phút | 🫁 Bài thở thư giãn | 5 phút thở 4-7-8 để kích hoạt hệ thần kinh phó giao cảm. | 15 | "🫁 Mở hướng dẫn thở →" → navigate breathing |
| 5 | 5 phút | 🌀 Cognitive Shuffle | Nằm xuống, nhắm mắt, thực hành Cognitive Shuffle. | 10 | "🌀 Bắt đầu Shuffle →" → navigate shuffle |

**States của mỗi task item:**
- Mặc định: border `var(--border)`, background `var(--surface)`
- Done (đã tick): border `rgba(168,212,160,.25)`, background `rgba(168,212,160,.07)`; check circle hiển thị "✓" màu xanh lá
- Active now (đến giờ rồi): border `rgba(126,184,212,.4)`, background `rgba(126,184,212,.08)`

**Countdown:**  
Khi đã đặt giờ ngủ, mỗi task hiển thị: "Còn X giờ Yp" hoặc "Còn Y phút" hoặc "⏰ Đây rồi!" (khi trong vòng 10 phút của task đó).

**Toggle task:**
```javascript
function toggleTask(idx) {
  // toggle trong mảng wdDone
  // update class .done trên .timeline-item
  // update check text
  // gọi updateReadiness()
}

function updateReadiness() {
  const score = wdDone.reduce((sum, i) => sum + WD_TASKS[i].score, 0);
  // cập nhật #wd-score, #wd-bar, #home-readiness-score, #home-bar
  // cập nhật sub text theo score
}
```

**Reset button:** "↺ Đặt lại hôm nay" — xóa tất cả done tasks, reset score về 0.

---

### 4.5 VIEW: Cognitive Shuffle (`view-shuffle`)

#### 4.5.1 Giới thiệu
Text giải thích ngắn: kỹ thuật làm não "bận rộn" với hình ảnh ngẫu nhiên, phá vỡ vòng lặp suy nghĩ.

#### 4.5.2 Game area

**Word display:**
```
[Từ hiện tại — 52px Cormorant Garamond, màu accent, letter-spacing 2px]
[Gợi ý chữ cái — 14px muted]
[Prompt hình dung — card, 15px, có fade transition]
[Controls: Button "Bắt đầu" / "Từ tiếp →"]
[Progress bar — 3px, fill theo % từ đã qua]
```

#### 4.5.3 Word list (20 từ ngẫu nhiên tiếng Việt)
```javascript
const WORDS = ['trăng','mây','biển','rừng','đêm','sao','hoa','gió',
               'suối','núi','cánh','chim','lá','nước','mưa','bướm',
               'cỏ','ánh','trời','ngọn'];
```

Shuffle ngẫu nhiên khi bắt đầu.

#### 4.5.4 Object mapping (chữ cái → danh sách vật)
```javascript
const OBJECTS = {
  't': ['trăng tròn','tủ gỗ','thuyền giấy','tách trà'],
  'm': ['mây trắng','mèo ngủ','mặt trời','máy bay'],
  'b': ['bướm vàng','bóng bay','biển xanh','bánh ngọt'],
  'r': ['rừng thông','rùa biển','rổ hoa','rồng nhỏ'],
  'đ': ['đám mây','đèn lồng','đồng lúa','đá cuội'],
  'h': ['hoa hồng','hồ nước','hươu cao cổ','hạt mưa'],
  'g': ['gió nhẹ','gương tròn','giọt sương','gà con'],
  's': ['sóng biển','sương mù','sao trời','suối nhỏ'],
  'n': ['núi cao','ngôi sao','nến sáng','ngọn đèn'],
  'c': ['cây xanh','cánh chim','con mèo','cỏ non'],
  'l': ['lá vàng','lửa nhỏ','làn sóng','lông thú'],
  'a': ['ánh sáng','ao cá','ảnh cũ','âm nhạc'],
};
```

#### 4.5.5 Logic
```javascript
function startShuffle() {
  shuffleWordList = [...WORDS].sort(() => Math.random() - 0.5);
  shuffleWordIdx = 0;
  // ẩn nút "Bắt đầu", hiện nút "Từ tiếp →"
  showShuffleWord();
}

function showShuffleWord() {
  const word = shuffleWordList[shuffleWordIdx];
  // fade out → set text → fade in
  // cập nhật gợi ý chữ cái
  // gọi showObject(word[0])
  // cập nhật progress bar = (idx+1)/total * 100%
}

function showObject(letter) {
  const arr = OBJECTS[letter] || ['một vật ngẫu nhiên'];
  const obj = arr[Math.floor(Math.random() * arr.length)];
  // fade out → set prompt HTML → fade in
  // prompt: "🌙 Hình dung: <strong>{obj}</strong>"
  //         + muted text hướng dẫn tập trung vào vật đó
}
```

#### 4.5.6 Info card
Giải thích khoa học đằng sau Cognitive Shuffle.

---

## 5. Responsive & Mobile

- Max width content: **480px**, center trên desktop
- Bottom nav: full width, fixed
- Font scale: giữ nguyên (đã compact cho mobile)
- Touch targets: tất cả buttons tối thiểu 44px height
- Không có horizontal scroll
- Safe area: `padding-bottom: calc(var(--nav-h) + 16px)` trong `#app`

---

## 6. GitHub Pages Deploy

### 6.1 File structure
```
ngu-ngon/
├── index.html           ← Toàn bộ app (HTML + CSS + JS)
├── README.md
└── .github/
    └── workflows/
        └── deploy.yml   ← Tự động deploy GitHub Pages
```

### 6.2 `deploy.yml`
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Pages
        uses: actions/configure-pages@v4
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: '.'
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### 6.3 Hướng dẫn deploy
```bash
git init
git add .
git commit -m "🌙 Initial release"
git branch -M main
git remote add origin https://github.com/USERNAME/ngu-ngon.git
git push -u origin main
# Vào Settings → Pages → Source: GitHub Actions
# App sẽ live tại: https://USERNAME.github.io/ngu-ngon
```

---

## 7. State Management

Tất cả state là JavaScript variables trong-memory. Không dùng localStorage, không có backend.

### 7.1 Breathing state
```javascript
let breathMethod = '478';      // method đang chọn
let breathRunning = false;     // đang chạy hay không
let breathPhaseIdx = 0;        // index phase hiện tại
let breathCyclesDone = 0;      // số chu kỳ đã hoàn thành
let breathTimer = null;        // setTimeout cho phase
let breathCountTimer = null;   // setInterval đếm ngược
```

### 7.2 Audio state
```javascript
let audioCtx = null;           // AudioContext
let masterGainNode = null;     // master gain
let mixTracks = {};            // { [soundId]: { src, gainNode, icon, name, vol } }
let mixTimer = null;           // setTimeout cho sleep timer
```

### 7.3 Thư giãn state
```javascript
let wdDone = [];               // mảng index các task đã done
let wdInterval = null;         // setInterval 30s cập nhật countdown
let wdBedtime = null;          // giờ ngủ dự định (phút từ 0:00)
```

### 7.4 R90 state
```javascript
let selectedCycles = 5;        // số chu kỳ được chọn
```

### 7.5 Shuffle state
```javascript
let shuffleWordList = [];      // danh sách từ đã shuffle
let shuffleWordIdx = 0;        // index từ hiện tại
```

---

## 8. Performance & UX Notes

- **AudioContext:** Chỉ khởi tạo khi user tương tác lần đầu (click/touch). Không khởi tạo khi load page để tránh browser warning.
- **BufferSource:** `loop = true` để âm thanh lặp vô hạn. Stop bằng `src.stop()` wrapped trong try/catch.
- **Animation:** Dùng CSS transition thay vì JS animation cho breathing ring để tránh jank.
- **Stars canvas:** `requestAnimationFrame` loop. Resize lại khi window resize.
- **Scroll:** `window.scrollTo(0,0)` khi chuyển tab để về đầu trang.
- **Web Audio cleanup:** Khi xóa track, `gainNode.disconnect()` trước để tránh memory leak.

---

## 9. Roadmap tương lai (Giai đoạn 2–3)

Những tính năng này **chưa cần build ngay**, ghi lại để tham khảo:

| Giai đoạn | Tính năng | Ghi chú |
|-----------|-----------|---------|
| 2 | Sleep Stories tiếng Việt | Audio narrated, cần hosting file MP3 |
| 2 | Thiền hướng dẫn tiếng Việt | AI TTS hoặc recording thật |
| 2 | SleepMoves — giãn cơ | Audio guide + animation minh họa |
| 2 | Chronotype quiz | 5 câu hỏi → gợi ý lịch ngủ |
| 2 | Smart Alarm | Báo thức cuối chu kỳ ngủ |
| 3 | Apple HealthKit integration | Sync giờ ngủ, nhịp tim |
| 3 | Google Fit API | Tương tự HealthKit phía Android |
| 3 | Sleep Score tuần/tháng | Cần backend + database |
| 3 | Âm thanh Việt Nam đặc trưng | Mưa Sài Gòn, tiếng chợ sớm... |
| 3 | Freemium monetization | ~49.000đ/tháng cho premium |

---

## 10. Checklist kiểm tra trước khi ship

- [ ] Tất cả 5 tab điều hướng đúng
- [ ] Breathing animation mượt, không giật
- [ ] Sound mixer: thêm/xóa/volume hoạt động
- [ ] Presets load đúng sounds
- [ ] Sleep timer fade out mượt
- [ ] R90 tính đúng giờ (test: thức 6:00, 5 chu kỳ → ngủ 21:46)
- [ ] Thư giãn score cộng đúng (tổng 5 task = 100 điểm)
- [ ] Thư giãn countdown cập nhật khi đặt giờ ngủ
- [ ] Action buttons trong wind-down navigate đúng view
- [ ] Score đồng bộ về trang chủ
- [ ] Cognitive shuffle: từ ngẫu nhiên, prompt có fade
- [ ] Stars canvas hoạt động, resize đúng
- [ ] Greeting đúng theo giờ
- [ ] Không có horizontal scroll
- [ ] Test trên mobile (iOS Safari + Android Chrome)
- [ ] Deploy lên GitHub Pages thành công

---

*Tài liệu này đủ đầy đủ để build lại toàn bộ app từ đầu. Tổng cộng khoảng 800–1000 dòng HTML/CSS/JS.*
