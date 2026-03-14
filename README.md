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

## 🔍 Evaluation & Improvement Plan

Xem thêm chi tiết trong [IMPROVEMENT_PLAN.md](IMPROVEMENT_PLAN.md).

### Product / UX
- Giới thiệu modal “Cách dùng” + ví dụ câu hỏi để onboarding người chơi mới.
- Hiển thị badge/provider đang sử dụng, cải thiện loading skeleton & tin nhắn “3 lá bạn chọn” trước phần AI chi tiết.
- Có tính năng lưu lại lần bói gần nhất/favorite draw để tăng retention.

### Technical / Backend
- Dùng `.env.example` (nội dung bên dưới) để ghi rõ các biến `OPENAI_API_KEY`, `GEMINI_API_KEY`, `OPENROUTER_API_KEY` và bật chế độ debug (`TAROT_GAME_LOG_LEVEL=debug`).
- Ghi log provider & status code trong `api/analyze.js`, rồi thêm retry/fallback giữa các provider khi có lỗi (ví dụ: OpenAI 429 -> OpenRouter).
- Tạo checklist test curl endpoint `/api/analyze` với các provider, mock prompt & quan sát response.

### Security / QA
- Đảm bảo rendering kết quả AI dùng `sanitizeAIResponse`/`textContent`; QA thử payload chứa `<script>` để xác định không bị XSS.
- Thêm rate limiting/timeout trong `analyze.js` hoặc một lớp middleware, đồng thời kiểm tra UI hiển thị toast khi backend trả lỗi HTTP >= 400.
- Lưu central QA checklist và quay lại `http://tarot-game-mu.vercel.app` để kiểm tra tất cả provider, cùng với mẫu prompt chứa đoạn text dài.

## ✅ QA Testing Checklist

1. Mở `http://tarot-game-mu.vercel.app` trên trình duyệt hiện đại.
2. Chọn 3 lá bài, nhập (hoặc bỏ qua) câu hỏi, rồi click “Xáo Bài & Chọn” → “Xem Kết Quả”.
3. Với từng provider (`OpenAI`, `Google Gemini Flash`, `OpenRouter`), ấn “Phân Tích AI” và kiểm tra:
   - Có toast loading/on-error.
   - Câu trả lời được render an toàn (không có `<script>`). Data nên hiển thị “3 lá bài” + “header phân tích”.
   - Trong trường hợp provider lỗi (429 / 401), UI báo lỗi rõ ràng và gợi ý thử lại.
4. Gọi trực tiếp API (local hoặc staging) để kiểm thử: `curl -X POST http://localhost:3000/api/analyze -H 'Content-Type: application/json' -d '{"provider":"openai","prompt":"x"}'`.
5. Ghi lại kết quả test (screenshot/log) ra sao & update `IMPROVEMENT_PLAN.md` nếu cần.

## 📄 License

MIT License - xem file [LICENSE](LICENSE)
