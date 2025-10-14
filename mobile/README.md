# Mobile App - React Native CLI

Chat Sentiment Analysis mobil uygulaması (React Native CLI ile geliştirilmiştir).

## 🚀 Özellikler

- **Native performans** - React Native CLI
- **Gerçek zamanlı mesajlaşma**
- **AI duygu analizi**
- **Offline çalışma**
- **Touch gesture desteği**

## 📱 Kurulum

### Gereksinimler
- Node.js 18+
- React Native CLI
- Android Studio (Android için)
- Xcode (iOS için)

### Adımlar

1. **Dependencies yükle:**
```bash
npm install
```

2. **iOS için (macOS gerekli):**
```bash
cd ios && pod install && cd ..
npx react-native run-ios
```

3. **Android için:**
```bash
npx react-native run-android
```

## 🔧 Konfigürasyon

### API URL'leri
`App.tsx` dosyasında API URL'lerini güncelleyin:

```typescript
const API_URL = 'https://your-backend-url.com';
const AI_URL = 'https://your-huggingface-space.hf.space';
```

### Android Permissions
`android/app/src/main/AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
```

## 📦 Build

### Android APK
```bash
cd android
./gradlew assembleRelease
```

### iOS IPA
```bash
npx react-native run-ios --configuration Release
```

## 🐛 Hata Ayıklama

### Metro bundler
```bash
npx react-native start --reset-cache
```

### Android log
```bash
npx react-native log-android
```

### iOS log
```bash
npx react-native log-ios
```

## 📊 Performans

- **Bundle size:** < 10MB
- **Startup time:** < 3s
- **Memory usage:** < 100MB
- **Battery impact:** Minimal

