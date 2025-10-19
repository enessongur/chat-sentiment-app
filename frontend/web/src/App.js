import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5102';

function App() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [nickname, setNickname] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  // Backend bağlantısını test et
  const testConnection = async () => {
    try {
      const response = await axios.get(`${API_URL}/messages`);
      setIsConnected(true);
      console.log('✅ Backend bağlantısı başarılı');
    } catch (error) {
      setIsConnected(false);
      console.log('❌ Backend bağlantısı başarısız:', error.message);
    }
  };

  // Mesajları getir
  const fetchMessages = async () => {
    try {
      // Backend'den tüm mesajları çek
      const response = await axios.get(`${API_URL}/messages`);
      setMessages(response.data);
    } catch (error) {
      console.error('Mesajlar getirilemedi:', error.message);
    }
  };

  // Mesaj gönder
  const sendMessage = async () => {
    // Input validasyonu
    if (!message.trim() || !nickname.trim()) {
      alert('Lütfen nickname ve mesaj girin');
      return;
    }

    try {
      // Backend'e mesaj gönder
      await axios.post(`${API_URL}/messages`, {
        userId: nickname,
        text: message,
        sentiment: '' // Backend'de otomatik analiz edilecek
      });
      
      // UI'yi temizle ve mesajları yenile
      setMessage('');
      fetchMessages();
    } catch (error) {
      alert('Mesaj gönderilemedi: ' + error.message);
    }
  };

  // Sentiment rengi
  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive': return '#4CAF50';
      case 'negative': return '#F44336';
      case 'neutral': return '#FF9800';
      default: return '#9E9E9E';
    }
  };

  // Sentiment emoji
  const getSentimentEmoji = (sentiment) => {
    switch (sentiment) {
      case 'positive': return '😊';
      case 'negative': return '😞';
      case 'neutral': return '😐';
      default: return '❓';
    }
  };

  useEffect(() => {
    testConnection();
    fetchMessages();
    
    // Her 2 saniyede bir mesajları güncelle
    const interval = setInterval(fetchMessages, 2000);
    return () => clearInterval(interval);
  }, []);

  // Mobile keyboard handling
  useEffect(() => {
    const handleResize = () => {
      // Scroll to bottom when keyboard appears
      setTimeout(() => {
        const messagesContainer = document.querySelector('.messages-container');
        if (messagesContainer) {
          messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
      }, 100);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    const messagesContainer = document.querySelector('.messages-container');
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }, [messages]);

  // Touch gesture for message input
  const handleTouchStart = (e) => {
    e.target.style.transform = 'scale(0.98)';
  };

  const handleTouchEnd = (e) => {
    e.target.style.transform = 'scale(1)';
  };

  return (
    <div className="app">
      {/* Header */}
      <div className="header">
        <h1 className="title">Chat Sentiment App</h1>
        <div className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}>
          {isConnected ? '🟢 Bağlı' : '🔴 Bağlantı Yok'}
        </div>
      </div>

      {/* Nickname Input */}
      <div className="nickname-container">
        <input
          type="text"
          className="nickname-input"
          placeholder="Nickname girin..."
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
      </div>

      {/* Messages */}
      <div className="messages-container">
        {messages.map((msg) => (
          <div key={msg.id} className="message-item">
            <div 
              className="message-header" 
              style={{ borderLeftColor: getSentimentColor(msg.sentiment) }}
            >
              <span className="user-name">{msg.userId}</span>
              <div className="sentiment-container">
                <span className="sentiment-emoji">{getSentimentEmoji(msg.sentiment)}</span>
                <span 
                  className="sentiment-text" 
                  style={{ color: getSentimentColor(msg.sentiment) }}
                >
                  {msg.sentiment}
                </span>
              </div>
            </div>
            <div className="message-text">{msg.text}</div>
            <div className="timestamp">
              {new Date(msg.timestamp).toLocaleString('tr-TR')}
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="input-container">
        <input
          type="text"
          className="message-input"
          placeholder="Mesajınızı yazın..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        />
        <button 
          className="send-button" 
          onClick={sendMessage}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          Gönder
        </button>
      </div>
    </div>
  );
}

export default App;
