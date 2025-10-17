const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5102;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// SQLite veritabanı bağlantısı
const db = new sqlite3.Database('./chat.db');

// Veritabanı tablolarını oluştur
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId TEXT NOT NULL,
    text TEXT NOT NULL,
    sentiment TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
  
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nickname TEXT NOT NULL
  )`);
});

// Sentiment analizi fonksiyonu
function analyzeSentiment(text) {
  // Boş metin kontrolü
  if (!text || text.trim() === '') return 'neutral';
  
  const lowerText = text.toLowerCase();
  
  // Pozitif kelimeler (Türkçe ve İngilizce)
  const positiveWords = [
    'good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'awesome', 
    'love', 'like', 'happy', 'joy', 'smile', 'beautiful', 'perfect', 'best',
    'güzel', 'harika', 'mükemmel', 'süper', 'çok iyi', 'seviyorum', 'beğendim',
    'muhteşem', 'harika', 'müthiş', 'süper', 'güzel', 'iyi', 'pozitif'
  ];
  
  // Negatif kelimeler (Türkçe ve İngilizce)
  const negativeWords = [
    'bad', 'terrible', 'awful', 'hate', 'dislike', 'angry', 'sad', 'disappointed', 
    'horrible', 'worst', 'kötü', 'berbat', 'nefret', 'sinir', 'üzgün', 'hayal kırıklığı',
    'korkunç', 'en kötü', 'çirkin', 'kötü', 'negatif', 'berbat', 'korkunç'
  ];
  
  // Kelime sayılarını hesapla
  const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
  const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;
  
  // Sentiment belirle
  if (positiveCount > negativeCount) return 'positive';
  if (negativeCount > positiveCount) return 'negative';
  return 'neutral';
}

// API Routes

// Tüm mesajları getir
app.get('/messages', (req, res) => {
  // Veritabanından mesajları çek
  db.all('SELECT * FROM messages ORDER BY timestamp ASC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Yeni mesaj gönder
app.post('/messages', (req, res) => {
  const { userId, text } = req.body;
  
  // Input validasyonu
  if (!userId || !text) {
    res.status(400).json({ error: 'userId ve text gerekli' });
    return;
  }
  
  // Sentiment analizi yap
  const sentiment = analyzeSentiment(text);
  const timestamp = new Date().toISOString();
  
  db.run(
    'INSERT INTO messages (userId, text, sentiment, timestamp) VALUES (?, ?, ?, ?)',
    [userId, text, sentiment, timestamp],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      
      res.json({
        id: this.lastID,
        userId,
        text,
        sentiment,
        timestamp
      });
    }
  );
});

// Kullanıcı kaydet
app.post('/users', (req, res) => {
  const { nickname } = req.body;
  
  if (!nickname) {
    res.status(400).json({ error: 'nickname gerekli' });
    return;
  }
  
  db.run('INSERT INTO users (nickname) VALUES (?)', [nickname], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    res.json({
      id: this.lastID,
      nickname
    });
  });
});

// Tüm kullanıcıları getir
app.get('/users', (req, res) => {
  db.all('SELECT * FROM users', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Sunucuyu başlat
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Backend server ${PORT} portunda çalışıyor`);
  console.log(`📱 API Endpoints:`);
  console.log(`   GET  http://localhost:${PORT}/messages`);
  console.log(`   POST http://localhost:${PORT}/messages`);
  console.log(`   GET  http://localhost:${PORT}/users`);
  console.log(`   POST http://localhost:${PORT}/users`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Server kapatılıyor...');
  db.close((err) => {
    if (err) {
      console.error('Veritabanı kapatılırken hata:', err.message);
    } else {
      console.log('✅ Veritabanı bağlantısı kapatıldı');
    }
    process.exit(0);
  });
});

