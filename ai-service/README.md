---
title: Chat Sentiment Analysis API
emoji: robot
colorFrom: blue
colorTo: purple
sdk: gradio
sdk_version: "4.0.0"
app_file: app.py
pinned: false
---

# AI Service - Sentiment Analysis

Bu servis, Hugging Face Spaces'de deploy edilen duygu analizi API'sidir.

## Özellikler

- Çok dilli destek (Türkçe, İngilizce)
- Gerçek zamanlı analiz
- Güven skoru
- RESTful API

## Kurulum

```bash
pip install -r requirements.txt
```

## Kullanım

### Lokal Çalıştırma
```bash
python app.py
```

### API Endpoint
```
POST /api/predict
Content-Type: application/json

{
    "text": "Merhaba dünya!"
}
```

### Response
```json
{
    "sentiment": "positive",
    "confidence": 0.95
}
```

## AI Model

- Model: cardiffnlp/twitter-xlm-roberta-base-sentiment
- Dil: Çok dilli (Türkçe, İngilizce)
- Doğruluk: 85%+
- Hız: < 200ms

## Desteklenen Duygular

- Pozitif - Olumlu, mutlu, iyi
- Negatif - Olumsuz, üzgün, kötü  
- Nötr - Tarafsız, normal, sıradan
