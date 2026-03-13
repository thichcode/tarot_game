# 🔮 Tarot Website

Website bói bài Tarot với phân tích AI. Người dùng chọn 3 lá bài Major Arcana và nhận được kết quả phân tích từ AI hoặc local.

## ✨ Tính năng

- **22 lá Major Arcana** với hình ảnh và màu sắc đặc trưng
- **Animation 3D mượt mà** khi chọn và lật bài
- **Phân tích AI** với OpenAI GPT hoặc Google Gemini
- **Giao diện Vintage Cổ điển** sang trọng
- **Hỗ trợ tiếng Việt** đầy đủ

## 🚀 Cách sử dụng

1. Mở `index.html` trong trình duyệt
2. Click **"Bắt Đầu"**
3. Nhập câu hỏi (hoặc bỏ qua)
4. Click **"Xáo Bài & Chọn"**
5. Click chọn **3 lá bài** bất kỳ
6. Click **"Xem Kết Quả"** để xem ý nghĩa
7. Click **"🤖 Phân Tích AI"** để nhận phân tích chi tiết

## ⚙️ Cài đặt AI

### Cách 1: Sử dụng Environment Variables (Khuyến nghị)

Đặt biến môi trường:
- `VITE_OPENAI_API_KEY` - OpenAI API key
- `VITE_GEMINI_API_KEY` - Google Gemini API key

### Cách 2: Nhập API Key thủ công

1. Click **"⚙️ Cài Đặt AI"**
2. Chọn provider (OpenAI hoặc Google Gemini)
3. Nhập API key của bạn
4. Click **"Lưu"**

## 🔒 Bảo mật

- API key được mã hóa khi hiển thị
- XSS protection cho AI response
- Khuyến nghị sử dụng Environment Variables
- Set API restrictions trong OpenAI/Google Console

## 📁 Cấu trúc

```
├── index.html       # Main HTML
├── style.css        # Styles + Animations
├── script.js        # Logic + AI Engine
├── tarot-data.js    # Card Data (22 Major Arcana)
├── DEPLOY.md       # Hướng dẫn deploy
└── README.md        # This file
```

## 🌐 Deploy

Xem chi tiết trong [DEPLOY.md](DEPLOY.md)

## 📝 Yêu cầu

- Trình duyệt hiện đại (Chrome, Firefox, Safari, Edge)
- Kết nối internet (để dùng AI analysis)

## 📄 License

MIT License - xem file [LICENSE](LICENSE)
