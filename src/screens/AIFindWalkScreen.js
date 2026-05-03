import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  TextInput, FlatList, KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { ChevronLeft, Send, Brain, Sparkles, Bot, MapPin } from 'lucide-react-native';
import { askGemini } from '../services/geminiService';
import { DOGS, SHELTERS, OWNERS } from '../constants/mockData';
import { Image } from 'react-native';

const SUGGESTIONS = [
  'Busco paseos por el Parque del Perro',
  'Quiero un perro activo para correr',
  '¿Hay urgencias cerca de mí hoy?',
];

const AIFindWalkScreen = ({ navigation }) => {
  const [messages, setMessages] = useState([
    {
      id: 'init',
      role: 'model',
      text: '¡Hola! Soy tu asistente IA de PetTrust. 🐾 ¿En qué zona buscas paseos hoy y qué nivel de energía prefieres para el perrito?'
    }
  ]);
  const [conversationHistory, setConversationHistory] = useState([
    { role: 'model', parts: [{ text: '¡Hola! Soy tu asistente IA de PetTrust. 🐾 ¿En qué zona buscas paseos hoy y qué nivel de energía prefieres para el perrito?' }] }
  ]);
  
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef(null);

  const sendMessage = async (text) => {
    const userMsgText = text || input;
    if (!userMsgText.trim() || isLoading) return;

    const newUserMsg = { id: Date.now().toString(), role: 'user', text: userMsgText };
    setMessages(prev => [...prev, newUserMsg]);
    setInput('');
    setIsLoading(true);

    const updatedHistory = [
      ...conversationHistory,
      { role: 'user', parts: [{ text: userMsgText }] },
    ];

    const response = await askGemini(userMsgText, conversationHistory);

    let responseText = response.message;
    let recommendedDogIds = [];
    let recommendedZona = null;

    // Check if the AI returned a ZONA
    const zonaMatch = responseText.match(/\|\|\|ZONA:\s*(.+)/);
    if (zonaMatch) {
      recommendedZona = zonaMatch[1].trim();
      responseText = responseText.replace(/\|\|\|ZONA:\s*.+/g, '').trim();
    }

    // Check if the AI returned a dog ID or multiple DOG_IDS
    const multiMatch = responseText.match(/\|\|\|DOG_IDS:\s*([\w\-,]+)/);
    const singleMatch = responseText.match(/\|\|\|ID_PERRO:\s*(dog-\d+)/);

    if (multiMatch) {
      recommendedDogIds = multiMatch[1].split(',').map(id => id.trim());
      responseText = responseText.replace(/\|\|\|DOG_IDS:\s*[\w\-,]+/g, '').trim();
    } else if (singleMatch) {
      recommendedDogIds = [singleMatch[1]];
      responseText = responseText.replace(/\|\|\|ID_PERRO:\s*dog-\d+/g, '').trim();
    }

    const aiMsg = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText,
    };

    let newMessages = [aiMsg];

    // Show card if the AI returned IDs
    if (recommendedDogIds.length > 0) {
      const dogs = recommendedDogIds.map(id => DOGS.find(d => d.id === id)).filter(Boolean);
      
      if (dogs.length > 0) {
        // Resolve address if zona is not provided
        const shelter = SHELTERS.find(s => s.id === dogs[0].shelterId);
        const owner = OWNERS.find(o => o.id === dogs[0].ownerId);
        const address = recommendedZona || shelter?.address || owner?.address || 'Cali, Colombia';

        const cardMsg = {
          id: (Date.now() + 2).toString(),
          role: 'model',
          type: 'card',
          dogs: dogs, // Store multiple dogs
          address: address,
          zona: recommendedZona,
        };
        newMessages.push(cardMsg);
      }
    }

    setMessages(prev => [...prev, ...newMessages]);
    setConversationHistory([
      ...updatedHistory,
      { role: 'model', parts: [{ text: response.message }] },
    ]);
    setIsLoading(false);
  };

  const renderMessage = ({ item }) => {
    const isUser = item.role === 'user';
    
    if (item.type === 'card') {
      const isMultiDog = item.dogs && item.dogs.length > 1;
      const primaryDog = item.dogs[0];

      return (
        <View style={styles.cardContainer}>
          <Image source={{ uri: primaryDog.photo }} style={styles.cardImage} />
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle}>{isMultiDog ? 'Paseos encontrados' : 'Paseo recomendado'}</Text>
            
            {isMultiDog ? (
              <Text style={styles.cardDogName}>{item.dogs.length} paseos disponibles</Text>
            ) : (
              <Text style={styles.cardDogName}>{primaryDog.name} • {primaryDog.breed}</Text>
            )}

            <View style={styles.cardLocation}>
              <MapPin color={COLORS.textSecondary} size={14} />
              <Text style={styles.cardLocationText}>{item.zona ? `En ${item.zona}` : item.address}</Text>
            </View>
            <TouchableOpacity 
              style={styles.cardButton}
              onPress={() => navigation.navigate('Main', { 
                screen: 'Explorar', 
                params: { 
                  dogIds: item.dogs.map(d => d.id), 
                  zona: item.zona 
                } 
              })}
            >
              <Text style={styles.cardButtonText}>{isMultiDog ? 'Ver paseos' : 'Ver en Mapa'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return (
      <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.aiBubble]}>
        {!isUser && (
          <View style={styles.aiAvatar}>
            <Bot color={COLORS.white} size={14} />
          </View>
        )}
        <View style={[styles.messageContent, isUser ? styles.userContent : styles.aiContent]}>
          <Text style={[styles.messageText, isUser && styles.userText]}>{item.text}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ChevronLeft color={COLORS.text} size={24} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <View style={styles.headerIcon}>
            <Brain color={COLORS.white} size={18} />
          </View>
          <View>
            <Text style={styles.headerTitle}>PetTrust AI Rutas</Text>
            <Text style={styles.headerSubtitle}>Encuentra tu paseo ideal</Text>
          </View>
        </View>
        <View style={{ width: 40 }} />
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        ListFooterComponent={
          isLoading ? (
            <View style={[styles.messageBubble, styles.aiBubble]}>
              <View style={styles.aiAvatar}>
                <Bot color={COLORS.white} size={14} />
              </View>
              <View style={[styles.messageContent, styles.aiContent]}>
                <View style={styles.typingIndicator}>
                  <ActivityIndicator size="small" color={COLORS.aiPurple} />
                  <Text style={styles.typingText}>Buscando paseos...</Text>
                </View>
              </View>
            </View>
          ) : null
        }
      />

      {/* Suggestions */}
      {messages.length <= 1 && (
        <View style={styles.suggestionsContainer}>
          <Text style={styles.suggestionsTitle}>Ideas de búsqueda:</Text>
          {SUGGESTIONS.map((suggestion, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.suggestionChip, SHADOWS.light]}
              onPress={() => sendMessage(suggestion)}
            >
              <Sparkles color={COLORS.aiPurple} size={14} />
              <Text style={styles.suggestionText}>{suggestion}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Input Bar */}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={[styles.inputBar, SHADOWS.medium]}>
          <TextInput
            style={styles.textInput}
            value={input}
            onChangeText={setInput}
            placeholder="¿Qué paseo buscas hoy?"
            placeholderTextColor={COLORS.textLight}
            multiline
            maxLength={500}
            editable={!isLoading}
          />
          <TouchableOpacity
            style={[styles.sendButton, (!input.trim() || isLoading) && styles.sendButtonDisabled]}
            onPress={() => sendMessage()}
            disabled={!input.trim() || isLoading}
          >
            <Send color={COLORS.white} size={18} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 15, backgroundColor: COLORS.white, borderBottomWidth: 1, borderBottomColor: COLORS.divider },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center' },
  headerCenter: { flexDirection: 'row', alignItems: 'center' },
  headerIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.aiPurple, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  headerTitle: { fontSize: 16, fontWeight: '800', color: COLORS.text },
  headerSubtitle: { fontSize: 11, color: COLORS.textSecondary, marginTop: 2 },
  messagesList: { padding: 20, paddingBottom: 40 },
  messageBubble: { flexDirection: 'row', marginBottom: 20, maxWidth: '85%' },
  userBubble: { alignSelf: 'flex-end', justifyContent: 'flex-end' },
  aiBubble: { alignSelf: 'flex-start' },
  aiAvatar: { width: 28, height: 28, borderRadius: 14, backgroundColor: COLORS.aiPurple, justifyContent: 'center', alignItems: 'center', marginRight: 10, marginTop: 5 },
  messageContent: { padding: 15, borderRadius: 20 },
  userContent: { backgroundColor: COLORS.primary, borderBottomRightRadius: 5 },
  aiContent: { backgroundColor: COLORS.white, borderBottomLeftRadius: 5, ...SHADOWS.light },
  messageText: { fontSize: 15, lineHeight: 22, color: COLORS.text },
  userText: { color: COLORS.white },
  
  cardContainer: { backgroundColor: COLORS.white, borderRadius: 20, width: '80%', alignSelf: 'flex-start', marginLeft: 38, marginBottom: 20, overflow: 'hidden', ...SHADOWS.medium },
  cardImage: { width: '100%', height: 120 },
  cardInfo: { padding: 15 },
  cardTitle: { fontSize: 12, color: COLORS.aiPurple, fontWeight: '800', marginBottom: 4 },
  cardDogName: { fontSize: 16, fontWeight: '800', color: COLORS.text, marginBottom: 8 },
  cardLocation: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  cardLocationText: { fontSize: 13, color: COLORS.textSecondary, marginLeft: 4 },
  cardButton: { backgroundColor: COLORS.primary, paddingVertical: 12, borderRadius: 15, alignItems: 'center' },
  cardButtonText: { color: COLORS.white, fontWeight: '700', fontSize: 14 },

  typingIndicator: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  typingText: { color: COLORS.textSecondary, fontSize: 14, fontStyle: 'italic' },
  suggestionsContainer: { paddingHorizontal: 20, paddingBottom: 10 },
  suggestionsTitle: { fontSize: 13, fontWeight: '700', color: COLORS.textSecondary, marginBottom: 10, marginLeft: 5 },
  suggestionChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, paddingHorizontal: 15, paddingVertical: 12, borderRadius: 20, marginBottom: 10 },
  suggestionText: { fontSize: 14, color: COLORS.text, marginLeft: 10, flex: 1 },
  inputBar: { flexDirection: 'row', alignItems: 'flex-end', padding: 15, backgroundColor: COLORS.white, borderTopWidth: 1, borderTopColor: COLORS.divider },
  textInput: { flex: 1, backgroundColor: COLORS.background, borderRadius: 20, paddingHorizontal: 20, paddingTop: 15, paddingBottom: 15, minHeight: 50, maxHeight: 120, fontSize: 15, color: COLORS.text, marginRight: 15 },
  sendButton: { width: 50, height: 50, borderRadius: 25, backgroundColor: COLORS.aiPurple, justifyContent: 'center', alignItems: 'center' },
  sendButtonDisabled: { backgroundColor: COLORS.grey },
});

export default AIFindWalkScreen;
