import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
  SafeAreaView,
  StatusBar
} from 'react-native';
import axios from 'axios';

const API_URL = 'http://localhost:5102';

export default function App() {
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
      Alert.alert('Hata', 'Lütfen nickname ve mesaj girin');
      return;
    }

    try {
      await axios.post(`${API_URL}/messages`, {
        userId: nickname,
        text: message,
        sentiment: '' // Backend'de otomatik analiz edilecek
      });
      
      setMessage('');
      fetchMessages();
    } catch (error) {
      Alert.alert('Hata', 'Mesaj gönderilemedi: ' + error.message);
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Chat Sentiment App</Text>
        <View style={[styles.statusIndicator, { backgroundColor: isConnected ? '#4CAF50' : '#F44336' }]}>
          <Text style={styles.statusText}>
            {isConnected ? '🟢 Bağlı' : '🔴 Bağlantı Yok'}
          </Text>
        </View>
      </View>

      {/* Nickname Input */}
      <View style={styles.nicknameContainer}>
        <TextInput
          style={styles.nicknameInput}
          placeholder="Nickname girin..."
          value={nickname}
          onChangeText={setNickname}
          placeholderTextColor="#666"
        />
      </View>

      {/* Messages */}
      <ScrollView style={styles.messagesContainer}>
        {messages.map((msg) => (
          <View key={msg.id} style={styles.messageItem}>
            <View style={[styles.messageHeader, { borderLeftColor: getSentimentColor(msg.sentiment) }]}>
              <Text style={styles.userName}>{msg.userId}</Text>
              <View style={styles.sentimentContainer}>
                <Text style={styles.sentimentEmoji}>{getSentimentEmoji(msg.sentiment)}</Text>
                <Text style={[styles.sentimentText, { color: getSentimentColor(msg.sentiment) }]}>
                  {msg.sentiment}
                </Text>
              </View>
            </View>
            <Text style={styles.messageText}>{msg.text}</Text>
            <Text style={styles.timestamp}>
              {new Date(msg.timestamp).toLocaleString('tr-TR')}
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* Message Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.messageInput}
          placeholder="Mesajınızı yazın..."
          value={message}
          onChangeText={setMessage}
          multiline
          placeholderTextColor="#666"
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Gönder</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2196F3',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  statusIndicator: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  nicknameContainer: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  nicknameInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
  },
  messageItem: {
    backgroundColor: 'white',
    marginBottom: 12,
    borderRadius: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    borderLeftWidth: 4,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  sentimentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sentimentEmoji: {
    fontSize: 16,
    marginRight: 4,
  },
  sentimentText: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  messageText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  messageInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginRight: 12,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
  },
  sendButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
