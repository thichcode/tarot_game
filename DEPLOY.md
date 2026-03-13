# Deploy Tarot Website lên Vercel

## ⚠️ Bảo mật - QUAN TRỌNG

### Khuyến nghị:
- **Sử dụng Environment Variables** thay vì cho user nhập API key trực tiếp
- **KHÔNG commit** API key vào code
- **Set API restrictions** trong OpenAI/Google Cloud Console để giới hạn domain

---

## Cách 1: Deploy nhanh (khuyên dùng)

1. **Vào [vercel.com](https://vercel.com)** → New Project → Import Git Repository

2. **Thêm Environment Variables:**
   - Vào Project Settings → Environment Variables
   - Thêm biến:
     - `VITE_OPENAI_API_KEY` = your-openai-key
     - `VITE_GEMINI_API_KEY` = your-gemini-key

3. **Deploy!** 

---

## Cách 2: Dùng Vercel CLI

```bash
# Cài đặt Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy với biến môi trường
vercel env add VITE_OPENAI_API_KEY production
# Nhập API key

vercel env add VITE_GEMINI_API_KEY production  
# Nhập API key

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

Sau khi deploy, verify bằng cách:
```javascript
// Trong console browser
console.log(import.meta.env.VITE_OPENAI_API_KEY);
```

Nếu undefined → Kiểm tra lại tên biến trong Vercel Dashboard.
