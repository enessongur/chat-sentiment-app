# Hugging Face Spaces Deployment

Bu dosya Hugging Face Spaces'de deploy etmek için gerekli konfigürasyonları içerir.

## 🚀 Deployment Adımları

### 1. Hugging Face'te Space Oluştur
1. [Hugging Face Spaces](https://huggingface.co/spaces) sayfasına git
2. "Create new Space" butonuna tıkla
3. Space adı: `chat-sentiment-analyzer`
4. SDK: `Gradio`
5. Visibility: `Public`

### 2. Dosyaları Yükle
Bu klasördeki tüm dosyaları Hugging Face Space'e yükle:
- `app.py`
- `requirements.txt`
- `README.md`

### 3. Konfigürasyon
Space ayarlarında:
- **Hardware:** CPU Basic (ücretsiz)
- **Sleep timeout:** 1 saat
- **Custom runtime:** Gradio

### 4. Environment Variables
Space settings'de environment variables ekle:
```
HF_TOKEN=your_huggingface_token
```

## 📡 API Kullanımı

Deploy edildikten sonra API endpoint:
```
https://your-username-chat-sentiment-analyzer.hf.space/api/predict
```

### Örnek Kullanım
```python
import requests

response = requests.post(
    "https://your-username-chat-sentiment-analyzer.hf.space/api/predict",
    json={"text": "Merhaba dünya!"}
)

result = response.json()
print(result)  # {"sentiment": "positive", "confidence": 0.95}
```

## 🔧 Troubleshooting

### Model Yükleme Hatası
```python
# app.py'de model cache'i temizle
import torch
torch.hub.set_dir('/tmp/torch_cache')
```

### Memory Hatası
```python
# Daha küçük model kullan
sentiment_analyzer = pipeline(
    "sentiment-analysis",
    model="distilbert-base-uncased-finetuned-sst-2-english",
    return_all_scores=True
)
```

### Timeout Hatası
```python
# Gradio timeout ayarla
interface.launch(
    server_name="0.0.0.0",
    server_port=7860,
    share=True,
    show_error=True,
    inbrowser=False,
    quiet=True
)
```

