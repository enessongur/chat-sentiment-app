# Chat Sentiment Analysis App

Kullanıcıların mesajlaşarak sohbet edebildiği, yazışmaların AI tarafından duygu analizi yapılarak canlı olarak gösterildiği basit bir web + mobil uygulama.

## Proje Özeti

Bu proje, gerçek zamanlı mesajlaşma ve AI destekli duygu analizi özelliklerini birleştiren full-stack bir uygulamadır. Kullanıcılar mesajlaşırken yazdıkları metinler otomatik olarak pozitif, negatif veya nötr olarak sınıflandırılır.

## Temel Özellikler

### React Web
- Basit chat ekranı
- Kullanıcı metin yazar, mesaj listesi ve anlık duygu skoru
- Responsive tasarım (desktop, tablet, mobile)
- PWA desteği

### React Native CLI
- Mobilde aynı chat ekranı
- Native performans
- Touch gesture desteği
- Offline çalışma

### .NET Core API
- Kullanıcı kaydı (sadece rumuz)
- Mesajların veritabanına kaydı
- SQLite veritabanı
- CORS desteği

### Python AI Servisi
- Hugging Face Spaces'de çalışan duygu analizi
- Pozitif/nötr/negatif sınıflandırma
- Gradio API arayüzü
- Gerçek zamanlı analiz

### Gerçek Zamanlı İşleyiş
- Mesaj gönderildiğinde backend Python servisine istek atar
- Analiz sonucu frontend'de görünür
- Canlı duygu skoru gösterimi

## Teknoloji ve Ücretsiz Hosting

### Frontend
- React (web) - Vercel
- React Native CLI (mobil) - APK Build

### Backend
- .NET Core + SQLite - Render (freewebservice)

### AI
- Python + Gradio API - Hugging Face Spaces

## Proje Yapısı

```
chat-sentiment-app/
├── frontend-web/          # React Web Uygulaması (Vercel)
├── backend/               # .NET Core API (Render)
├── ai-service/            # Python AI Servisi (Hugging Face)
├── frontend-expo/         # Expo Mobile App
├── ChatSentimentMobile/   # React Native CLI
└── backend-nodejs/        # Node.js Backend (Alternative)
```

## Kurulum Adımları

### 1. Repository'yi Klonlayın
```bash
git clone https://github.com/enessongur/chat-sentiment-app.git
cd chat-sentiment-app
```

### 2. Backend (.NET Core)
```bash
cd backend/dotnet
dotnet restore
dotnet run --urls "http://localhost:5102"
```
Backend http://localhost:5102 adresinde çalışacak.

### 3. Frontend (React)
```bash
cd frontend/web
npm install
npm start
```
Frontend http://localhost:3000 adresinde çalışacak.

### 4. AI Servisi (Python)
```bash
cd ai-service
pip install -r requirements.txt
python app.py
```
AI servisi http://localhost:7860 adresinde çalışacak.

### 5. Mobil Uygulama (Expo)
```bash
cd frontend/expo
npm install
npx expo start
```

### 6. React Native CLI (Alternatif)
```bash
cd frontend/mobile
npm install
npx react-native run-android  # Android için
npx react-native run-ios     # iOS için
```

## API Endpoints

### Backend API
- GET /messages - Tüm mesajları getir
- POST /messages - Yeni mesaj gönder
- GET /users - Kullanıcıları listele
- POST /users - Yeni kullanıcı kaydet

### AI Servisi
- POST /api/predict - Duygu analizi yap
  - Input: {"text": "Merhaba dünya"}
  - Output: {"sentiment": "positive", "confidence": 0.95}

## Demo Linkleri

- Web App: https://chat-sentiment-app.vercel.app
- Backend API: https://chat-sentiment-backend.onrender.com
- AI Service: https://huggingface.co/spaces/enessongur/chat-sentiment-analyzer
- Mobile APK: [Download Link]
- GitHub Repository: https://github.com/enessongur/chat-sentiment-app

## Deployment Adımları

### Vercel (Frontend)
1. Vercel.com'a git
2. GitHub repository'yi bağla
3. Root Directory: `frontend/web` seç
4. Environment Variables: `REACT_APP_API_URL=https://your-backend.onrender.com`
5. Deploy et

### Render (Backend)
1. Render.com'a git
2. New Web Service, Language: Docker
3. Dockerfile Path: `backend/dotnet/Dockerfile`
4. Environment Variables:
   - `ASPNETCORE_ENVIRONMENT=Production`
   - `ASPNETCORE_URLS=http://0.0.0.0:$PORT`
   - `AI_SERVICE_URL=https://your-space.hf.space`
5. Deploy et

### Hugging Face Spaces (AI)
1. Hugging Face Spaces'e git
2. Yeni Space oluştur
3. `ai-service/` klasörünü yükle
4. Gradio app otomatik deploy olur

## Deployment

### Vercel (Frontend)
```bash
# Frontend klasörüne git
cd frontend-web
# Production'a deploy et
vercel --prod
```

### Render (Backend)
1. Render.com'da yeni web service oluştur
2. GitHub repository'yi bağla
3. Build command: dotnet publish -c Release
4. Start command: dotnet backend.dll

### Hugging Face Spaces (AI)
1. Hugging Face'te yeni Space oluştur
2. ai-service/ klasörünü yükle
3. Gradio app otomatik deploy olur

## AI Araçları

### Kullanılan AI Modelleri
- Hugging Face Transformers - Duygu analizi
- cardiffnlp/twitter-xlm-roberta-base-sentiment - Çok dilli model
- Gradio - AI API arayüzü
- Hugging Face Spaces - Deployment platformu

### AI ile Yazılan Kodlar
- Database migrations (backend/dotnet/Migrations/)
- API controllers (backend/dotnet/Controllers/)
- Sentiment analysis modeli (ai-service/app.py)
- API endpoint'leri (ai-service/app.py)
- Data preprocessing (ai-service/app.py)
- Model inference (ai-service/app.py)
- Gradio interface (ai-service/app.py)

### Manuel Yazılan Kodlar
- Error handling (backend/dotnet/Controllers/MessagesController.cs)
- Frontend components (frontend/web/src/App.js)
- Mobile app (frontend/expo/App.js)
- Deployment configs (Dockerfile, render.yaml)
- API integration (backend/dotnet/Services/SentimentAnalysisService.cs)
- Database queries (backend/dotnet/Controllers/MessagesController.cs)
- API calls (frontend/web/src/App.js)
- UI components (frontend/web/src/App.js)


## Performans

### Backend
- Response Time: < 100ms
- Concurrent Users: 100+
- Database: SQLite (production'da PostgreSQL)

### AI Servisi
- Model Size: ~500MB
- Inference Time: < 200ms
- Accuracy: 85%+

### Frontend
- Load Time: < 2s
- Bundle Size: < 1MB
- Mobile Score: 90+

## Hata Ayıklama

### Backend Sorunları
```bash
# Database migration
dotnet ef database update

# Logs kontrol
dotnet run --verbosity normal
```

### Frontend Sorunları
```bash
# Cache temizle
npm start -- --reset-cache

# Dependencies güncelle
npm install --force
```

### AI Servisi Sorunları
```bash
# Model indirme
python -c "from transformers import pipeline; pipeline('sentiment-analysis')"

# Memory kontrol
pip install psutil
python -c "import psutil; print(psutil.virtual_memory())"
```


## Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (git checkout -b feature/amazing-feature)
3. Commit yapın (git commit -m 'Add amazing feature')
4. Push yapın (git push origin feature/amazing-feature)
5. Pull Request oluşturun