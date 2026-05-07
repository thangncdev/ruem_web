# 🌙 Ngủ Ngon — Sleep Support App

Ứng dụng hỗ trợ giấc ngủ dựa trên khoa học, áp dụng phương pháp từ cuốn **"Ngủ ít vẫn khỏe"** (R90 Method).

## ✨ Tính năng

| Tính năng | Mô tả |
|---|---|
| 🫁 **Hướng dẫn thở** | 4-7-8, Box Breathing, Thở thư giãn với animation |
| 🌧️ **Âm thanh ngủ** | Mưa, sóng biển, white noise, rừng đêm, lửa trại, pink noise |
| 🌙 **Máy tính R90** | Tính giờ ngủ tối ưu theo chu kỳ 90 phút |
| 🌀 **Cognitive Shuffle** | Kỹ thuật ngắt vòng lặp suy nghĩ để ngủ nhanh |
| ⏱️ **Hẹn giờ tắt âm thanh** | Tự tắt sau 15/30/45/60 phút |

## 🚀 Deploy lên GitHub Pages

### Bước 1 — Tạo repository
```bash
git init
git add .
git commit -m "🌙 Initial sleep app"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/ngu-ngon.git
git push -u origin main
```

### Bước 2 — Bật GitHub Pages
1. Vào **Settings** → **Pages**
2. Source: **GitHub Actions**
3. Chờ vài phút → App sẽ live tại `https://YOUR_USERNAME.github.io/ngu-ngon`

File `.github/workflows/deploy.yml` đã được tạo sẵn để tự động deploy mỗi khi bạn push code.

## 🛠 Tech Stack

- **Vanilla HTML/CSS/JS** — Không cần build, không cần framework
- **Web Audio API** — Tạo âm thanh ngay trong trình duyệt (không cần file âm thanh)
- **CSS Animations** — Animation thở mượt mà
- **Google Fonts** — Cormorant Garamond + Nunito

## 📁 Cấu trúc

```
ngu-ngon/
├── index.html          # Toàn bộ app
├── README.md
└── .github/
    └── workflows/
        └── deploy.yml  # Tự động deploy GitHub Pages
```

## 🔮 Roadmap tương lai

- [ ] Kết nối Apple Health / Google Fit API
- [ ] Giọng Việt cho thiền hướng dẫn
- [ ] Smart Alarm theo chu kỳ ngủ
- [ ] Biểu đồ theo dõi giấc ngủ theo tuần
- [ ] PWA (Progressive Web App) — Thêm vào màn hình điện thoại

## 📖 Tham khảo

- *Sleep* by Nick Littlehales (R90 Method)
- Kỹ thuật 4-7-8 của Dr. Andrew Weil
- Cognitive Shuffle của Dr. Luc Beaulieu-Prévost
---
Made with 🌙 for better sleep
