import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity,
  TextInput, FlatList, KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { ChevronLeft, Send, Brain, Sparkles, Bot, User } from 'lucide-react-native';
import { askGemini } from '../services/geminiService';
import { useAppContext } from '../context/AppContext';

const SUGGESTIONS = [
  'Busco un perro tranquilo para pasear 20 minutos',
  'Quiero ayudar al perro que mas lo necesite',
  'Tengo experiencia con perros grandes',
  'Soy principiante, que perro me recomiendas?',
];

const AIChatScreen = ({ navigation }) => {
  const { chatMessages: messages, setChatMessages: setMessages, chatHistory: conversationHistory, setChatHistory: setConversationHistory } = useAppContext();
  
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef(null);

  const sendMessage = async (text) => {
    const userMsg = text || input;
    if (!userMsg.trim() || isLoading) return;

    const newUserMsg = { id: Date.now().toString(), role: 'user', text: userMsg };
    setMessages(prev => [...prev, newUserMsg]);
    setInput('');
    setIsLoading(true);

    // Actualizar historial para contexto
    const updatedHistory = [
      ...conversationHistory,
      { role: 'user', parts: [{ text: userMsg }] },
    ];

    const response = await askGemini(userMsg, conversationHistory);

    const aiMsg = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: response.message,
    };

    setMessages(prev => [...prev, aiMsg]);
    setConversationHistory([
      ...updatedHistory,
      { role: 'model', parts: [{ text: response.message }] },
    ]);
    setIsLoading(false);
  };

  const renderMessage = ({ item }) => {
    const isUser = item.role === 'user';
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
            <Text style={styles.headerTitle}>PetTrust AI</Text>
            <Text style={styles.headerSubtitle}>Powered by Google Gemini</Text>
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
                  <Text style={styles.typingText}>Analizando...</Text>
                </View>
              </View>
            </View>
          ) : null
        }
      />

      {/* Suggestions */}
      {messages.length <= 1 && (
        <View style={styles.suggestionsContainer}>
          <Text style={styles.suggestionsTitle}>Prueba preguntando:</Text>
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
            placeholder="Describe que perro buscas..."
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
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: SIZES.medium, backgroundColor: COLORS.white,
    borderBottomWidth: 1, borderBottomColor: COLORS.divider,
  },
  backButton: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center',
  },
  headerCenter: { flexDirection: 'row', alignItems: 'center' },
  headerIcon: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: COLORS.aiPurple, justifyContent: 'center', alignItems: 'center', marginRight: 10,
  },
  headerTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  headerSubtitle: { fontSize: 11, color: COLORS.textSecondary },
  messagesList: { padding: SIZES.medium, paddingBottom: SIZES.large },
  messageBubble: {
    flexDirection: 'row', marginBottom: SIZES.medium, alignItems: 'flex-end',
  },
  userBubble: { justifyContent: 'flex-end' },
  aiBubble: { justifyContent: 'flex-start' },
  aiAvatar: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: COLORS.aiPurple, justifyContent: 'center', alignItems: 'center',
    marginRight: 8, marginBottom: 2,
  },
  messageContent: {
    maxWidth: '78%', borderRadius: SIZES.radius, padding: SIZES.medium,
  },
  userContent: {
    backgroundColor: COLORS.secondary, borderBottomRightRadius: 4, marginLeft: 'auto',
  },
  aiContent: {
    backgroundColor: COLORS.white, borderBottomLeftRadius: 4,
    borderWidth: 1, borderColor: COLORS.divider,
  },
  messageText: { fontSize: 14, color: COLORS.text, lineHeight: 20 },
  userText: { color: COLORS.white },
  typingIndicator: { flexDirection: 'row', alignItems: 'center' },
  typingText: { fontSize: 13, color: COLORS.aiPurple, marginLeft: 8, fontStyle: 'italic' },
  suggestionsContainer: { paddingHorizontal: SIZES.medium, paddingBottom: SIZES.sm },
  suggestionsTitle: { fontSize: 13, color: COLORS.textSecondary, fontWeight: '600', marginBottom: SIZES.sm },
  suggestionChip: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.white, paddingHorizontal: SIZES.medium, paddingVertical: 10,
    borderRadius: SIZES.radius, marginBottom: SIZES.sm,
  },
  suggestionText: { fontSize: 13, color: COLORS.text, marginLeft: 8, flex: 1 },
  inputBar: {
    flexDirection: 'row', alignItems: 'flex-end',
    backgroundColor: COLORS.white, padding: SIZES.sm,
    paddingHorizontal: SIZES.medium, borderTopWidth: 1, borderTopColor: COLORS.divider,
  },
  textInput: {
    flex: 1, backgroundColor: COLORS.background,
    borderRadius: SIZES.radiusMedium, paddingHorizontal: SIZES.medium,
    paddingVertical: 10, fontSize: 14, color: COLORS.text,
    maxHeight: 100, marginRight: SIZES.sm,
  },
  sendButton: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: COLORS.secondary, justifyContent: 'center', alignItems: 'center',
  },
  sendButtonDisabled: { backgroundColor: COLORS.grey, opacity: 0.5 },
});

export default AIChatScreen;
