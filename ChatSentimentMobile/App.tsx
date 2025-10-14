import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  Alert,
  StatusBar,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';

const { width, height } = Dimensions.get('window');

// API URLs - Task gereksinimlerine uygun
const BACKEND_API_URL = 'http://localhost:5102'; // .NET Core API
const AI_API_URL = 'https://your-huggingface-space.hf.space'; // Python AI Service

interface Message {
  id: number;
  userId: string;
  text: string;
  sentiment: string;
  timestamp: string;
}

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState('');
  const [nickname, setNickname] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Backend bağlantısını test et
  const testConnection = async () => {
    try {
      const response = await axios.get(`${BACKEND_API_URL}/messages`);
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
      const response = await axios.get(`${BACKEND_API_URL}/messages`);
      setMessages(response.data);
    } catch (error) {
      console.error('Mesajlar getirilemedi:', error.message);
    }
  };

  // AI ile duygu analizi yap - Task gereksinimlerine uygun
  const analyzeSentiment = async (text: string): Promise<string> => {
    try {
      // Python AI Servisi'ne istek at - Hugging Face Spaces
      const response = await axios.post(`${AI_API_URL}/api/predict`, {
        text: text
      });
      return response.data.sentiment || 'neutral';
    } catch (error) {
      console.error('AI analiz hatası:', error.message);
      // Fallback: Basit kural tabanlı analiz
      return analyzeSentimentFallback(text);
    }
  };

  // Fallback sentiment analizi - AI servisi çalışmazsa
  const analyzeSentimentFallback = (text: string): string => {
    const lowerText = text.toLowerCase();
    
    const positiveWords = [
      'good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'awesome',
      'love', 'like', 'happy', 'joy', 'smile', 'beautiful', 'perfect', 'best',
      'güzel', 'harika', 'mükemmel', 'süper', 'çok iyi', 'seviyorum', 'beğendim'
    ];
    
    const negativeWords = [
      'bad', 'terrible', 'awful', 'hate', 'dislike', 'angry', 'sad', 'disappointed',
      'horrible', 'worst', 'kötü', 'berbat', 'nefret', 'sinir', 'üzgün', 'hayal kırıklığı'
    ];
    
    const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
    const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;
    
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  };

  // Mesaj gönder - Task gereksinimlerine uygun
  const sendMessage = async () => {
    if (!message.trim() || !nickname.trim()) {
      Alert.alert('Hata', 'Lütfen nickname ve mesaj girin');
      return;
    }

    setIsLoading(true);
    
    try {
      // 1. AI ile duygu analizi yap (Python servisi)
      const sentiment = await analyzeSentiment(message);
      
      // 2. Backend'e mesaj gönder (.NET Core API)
      await axios.post(`${BACKEND_API_URL}/messages`, {
        userId: nickname,
        text: message,
        sentiment: sentiment
      });
      
      setMessage('');
      fetchMessages();
    } catch (error) {
      Alert.alert('Hata', 'Mesaj gönderilemedi: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Sentiment rengi
  const getSentimentColor = (sentiment: string): string => {
    switch (sentiment) {
      case 'positive': return '#4CAF50';
      case 'negative': return '#F44336';
      case 'neutral': return '#FF9800';
      default: return '#9E9E9E';
    }
  };

  // Sentiment emoji
  const getSentimentEmoji = (sentiment: string): string => {
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
    
    // Gerçek zamanlı güncelleme - Task gereksinimlerine uygun
    const interval = setInterval(fetchMessages, 2000);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    if (messages.length > 0) {
      // ScrollView otomatik scroll için
    }
  }, [messages]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#2196F3" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Chat Sentiment</Text>
        <View style={[
          styles.statusIndicator, 
          { backgroundColor: isConnected ? '#4CAF50' : '#F44336' }
        ]}>
          <Text style={styles.statusText}>
            {isConnected ? '🟢' : '🔴'}
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
      <ScrollView 
        style={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.messagesContent}
      >
        {messages.map((msg) => (
          <View key={msg.id} style={styles.messageItem}>
            <View style={[
              styles.messageHeader, 
              { borderLeftColor: getSentimentColor(msg.sentiment) }
            ]}>
              <Text style={styles.userName}>{msg.userId}</Text>
              <View style={styles.sentimentContainer}>
                <Text style={styles.sentimentEmoji}>
                  {getSentimentEmoji(msg.sentiment)}
                </Text>
                <Text style={[
                  styles.sentimentText, 
                  { color: getSentimentColor(msg.sentiment) }
                ]}>
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
          editable={!isLoading}
        />
        <TouchableOpacity 
          style={[
            styles.sendButton,
            isLoading && styles.sendButtonDisabled
          ]} 
          onPress={sendMessage}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text style={styles.sendButtonText}>📤</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

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
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 8,
    color: 'white',
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
    backgroundColor: 'white',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 20,
  },
  messageItem: {
    backgroundColor: 'white',
    marginBottom: 12,
    borderRadius: 12,
    padding: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    borderLeftWidth: 4,
    paddingLeft: 8,
  },
  userName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  sentimentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sentimentEmoji: {
    fontSize: 14,
    marginRight: 4,
  },
  sentimentText: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  messageText: {
    fontSize: 15,
    color: '#333',
    marginBottom: 6,
    lineHeight: 20,
  },
  timestamp: {
    fontSize: 11,
    color: '#666',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  messageInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    padding: 12,
    marginRight: 8,
    fontSize: 15,
    backgroundColor: 'white',
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#2196F3',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
  sendButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default App;
