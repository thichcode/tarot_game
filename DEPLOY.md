# Deploy Tarot Website lên Vercel

## ⚠️ Bảo mật - QUAN TRỌNG

### Khuyến nghị:
- **Sử dụng Environment Variables (SERVER-SIDE)** thay vì cho user nhập API key trực tiếp
- **KHÔNG commit** API key vào code
- **Set API restrictions** trong OpenAI/Google Cloud Console để giới hạn domain

> Lưu ý: Web chạy trên browser **không đọc được** secret env trực tiếp.
> Vì vậy repo đã thêm **Vercel Serverless Functions** (`/api/*`) để proxy gọi AI.
> API key nằm trong Vercel Environment Variables và **không lộ ra client**.

---

## Cách 1: Deploy nhanh (khuyên dùng)

1. **Vào [vercel.com](https://vercel.com)** → New Project → Import Git Repository

2. **Thêm Environment Variables:**
   - Vào Project Settings → Environment Variables
   - Thêm biến:
     - `OPENAI_API_KEY` = your-openai-key (nếu dùng OpenAI)
     - `GEMINI_API_KEY` = your-gemini-key (nếu dùng Google Gemini)
     - `OPENROUTER_API_KEY` = your-openrouter-key (nếu dùng OpenRouter)

3. **Deploy!** 

---

## Cách 2: Dùng Vercel CLI

```bash
# Cài đặt Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy với biến môi trường (server-side secrets)
vercel env add OPENAI_API_KEY production
vercel env add GEMINI_API_KEY production
vercel env add OPENROUTER_API_KEY production

# Deploy
vercel --prod
```

---

## Cách 3: Deploy thủ công (Drag & Drop)

1. User tự nhập API key trong app (đã lưu vào localStorage)
2. Kéo thả folder vào vercel.com
3. **Cảnh báo:** Cách này kém bảo mật hơn vì key lưu trong localStorage

---

## Bảo mật API Key

### OpenAI:
1. Vào [platform.openai.com](https://platform.openai.com)
2. API Keys → Chọn key → Edit restrictions
3. Set **Allowed domains**: `your-domain.vercel.app`
4. Set **Allowed IPs**: (tùy chọn)

### Google Gemini:
1. Vào [console.cloud.google.com](https://console.cloud.google.com)
2. APIs & Services → Credentials
3. Chọn API Key → Edit
4. Set **Website restrictions**: Thêm domain của bạn

---

## Kiểm tra

Sau khi deploy, test nhanh:
- Mở site → chọn provider OpenAI/Gemini/OpenRouter → bấm "Phân Tích AI".
- Nếu bạn **không nhập API key** trong UI mà vẫn chạy: proxy đã hoạt động đúng.

Debug thêm (trên Vercel → Functions Logs):
- `/api/analyze` sẽ báo thiếu env nào nếu bạn chưa set.
