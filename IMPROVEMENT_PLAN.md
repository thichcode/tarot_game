# Tarot Game — Improvement Plan

Đây là bản tóm tắt những gì ba vai trò đánh giá (Product/UX, Technical/Backend, Security/QA) đã nhận diện và những bước tiếp theo cần triển khai. Ghi chú thêm tại README để các thành viên trong team coder có thể theo dõi.

## 1. Product / UX Review

**Tình hình hiện tại:** Flow chọn 3 lá → xem kết quả → gọi AI đã hoạt động, giao diện vintage/3D gây ấn tượng, nhưng chưa có hướng dẫn onboarding đủ rõ và thiếu dấu hiệu xác nhận ai đang tạo ra phân tích.

**Hướng xử lý:**
- Thêm modal “Cách Dùng” (các bước 1-7 từ README) + gợi ý mẫu câu hỏi để người dùng lần đầu không bị lúng túng.
- Hiển thị badge/provider đang dùng ngay trong UI (trên nút `Analyze` hoặc header) cùng với loading skeleton khi chờ AI.
- Trước phần kết quả AI, hiển thị summary “3 lá bạn chọn” bằng copy ngắn; bổ sung phần “Lưu lần bói gần nhất / favorite draw” để tăng retention.
- Chạy test manual tại `http://tarot-game-mu.vercel.app` để kiểm tra flow, animation, CTA; ghi lại feedback QA.

## 2. Technical / Backend Review

**Tình hình hiện tại:** Frontend gọi `/api/analyze` (Vercel) để proxy tới OpenAI/Google/OpenRouter. README chưa nói về file `.env`, logs/observability chưa đủ, fallback giữa provider chưa rõ.

**Hướng xử lý:**
- Tạo và duy trì `.env.example` với `OPENAI_API_KEY`, `GEMINI_API_KEY`, `OPENROUTER_API_KEY` (đã thêm trong repo). Đảm bảo README/DEPLOY nhắc cách copy file này.
- Bổ sung logging trong `api/analyze.js` (provider, status code, response time) và implement fallback: khi OpenAI bị 429/500 thì tự động thử OpenRouter (hoặc ngược lại). Xem xét `TAROT_GAME_LOG_LEVEL=debug` env.
- Tạo test script (curl + `jq`) để xác định endpoint `/api/analyze` trả `{ "text": "..." }` với từng provider. Lưu output cho debugging.
- Document QA steps và link test `http://tarot-game-mu.vercel.app` trong README (done) để coder dễ lặp.

## 3. Security / QA Review

**Tình hình hiện tại:** Frontend đã có `sanitizeAIResponse`, nhưng chưa rõ liệu toàn bộ response (cả error) đều an toàn. Đang thiếu rate limiting và feedback khi API trả code lỗi.

**Hướng xử lý:**
- Confirm UI luôn render output bằng `sanitizeAIResponse` / `textContent` và hiển thị toast khi API lỗi. QA nên thử prompt chứa `<script>`/html tags.
- Thêm rate limiting/timeout trong serverless `api/analyze.js` hoặc middleware (ví dụ track IP + limit 10 req/min). Nếu giới hạn, trả 429 với message hướng dẫn.
- QA checklist: (1) Chạy `http://tarot-game-mu.vercel.app` 3 lần với các provider; (2) Gọi trực tiếp `/api/analyze` với `curl` và `jq`; (3) Phân tích log Vercel (có `TAROT_GAME_LOG_LEVEL=debug`).
- Document results (logs/screenshots) và cập nhật file này sau mỗi vòng test.

## 4. Next Steps / Ownership

| Role | Task | Owner | Status |
| --- | --- | --- | --- |
| Product/UX | Modal onboarding, provider badge, history | BA / Product | Todo |
| Technical | Logging + fallback + `.env` story | Dev lead | In-progress |
| Security | Rate limit + sanitized QA flow | QA / Security | Todo |

## 5. Testing Reference

- Live preview cho tester: `http://tarot-game-mu.vercel.app`.
- API test command: `curl -X POST http://localhost:3000/api/analyze -H 'Content-Type: application/json' -d '{"provider":"openai","prompt":"x"}'`.
- QA verify: (a) AI output sanitized, (b) fallback when provider fails, (c) UI toast when `api/analyze` trả 4xx/5xx.

Cập nhật file này mỗi khi hoàn thành phần nào để các bot/team coder biết tiến độ.