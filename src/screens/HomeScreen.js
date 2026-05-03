import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { Brain, AlertTriangle, MapPin, Sparkles, TrendingUp, ChevronRight, Clock, MessageCircle, Lightbulb, Star, Bell, Plus, X, Building2, User, Navigation, Search, Heart } from 'lucide-react-native';
import { Modal, TextInput, Image } from 'react-native';
import { CURRENT_USER } from '../constants/mockData';
import { getRecommendedDogs, getUrgentDogs, generateAIInsights } from '../services/aiMatchingEngine';
import MatchScoreCard from '../components/MatchScoreCard';
import { useAppContext } from '../context/AppContext';
import { DOGS } from '../constants/mockData';

const HomeScreen = ({ navigation }) => {
  const { userRole, myDogs, setMyDogs } = useAppContext();
  const [recommendations, setRecommendations] = useState([]);
  const [urgentDogs, setUrgentDogs] = useState([]);
  const [insights, setInsights] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddPetModalVisible, setIsAddPetModalVisible] = useState(false);
  const [newPetName, setNewPetName] = useState('');
  const [newPetBreed, setNewPetBreed] = useState('');

  // Owner data


  useEffect(() => {
    // Simular "carga de IA" para que se vea que el motor está procesando
    const timer = setTimeout(() => {
      const recs = getRecommendedDogs(CURRENT_USER);
      const urgent = getUrgentDogs();
      const aiInsights = generateAIInsights(CURRENT_USER);
      setRecommendations(recs);
      setUrgentDogs(urgent);
      setInsights(aiInsights);
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  const handleAddPet = () => {
    if (!newPetName || !newPetBreed) return;
    const newPet = {
      id: `my-dog-${Date.now()}`,
      name: newPetName,
      breed: newPetBreed,
      age: 1,
      weight: 10,
      energyLevel: 'medio',
      temperament: ['juguetón'],
      photo: null,
      status: 'En casa'
    };
    setMyDogs([...myDogs, newPet]);
    setIsAddPetModalVisible(false);
    setNewPetName('');
    setNewPetBreed('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{getTimeGreeting()},</Text>
            <Text style={styles.userName}>{CURRENT_USER?.name || 'Usuario'} 👋</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.headerIcon}
              onPress={() => navigation.navigate('Notifications')}
            >
              <Bell color={COLORS.text} size={24} />
              <View style={styles.notificationBadge} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.aiHeaderBadge}
              onPress={() => navigation.navigate('AIChat')}
            >
              <Brain color={COLORS.aiPurple} size={20} />
            </TouchableOpacity>
          </View>
        </View>

        {userRole === 'dueño' ? (
          <View style={styles.ownerDashboard}>
            {/* AI Companion Card */}
            <TouchableOpacity
              style={[styles.aiCompanionCard, SHADOWS.medium]}
              onPress={() => navigation.navigate('AIChat')}
            >
              <View style={styles.aiCompanionHeader}>
                <View style={styles.aiCompanionIcon}>
                  <Brain color={COLORS.white} size={24} />
                </View>
                <View>
                  <Text style={styles.aiCompanionTitle}>PetTrust Companion</Text>

                </View>
              </View>
              <Text style={styles.aiCompanionText}>
                "Hoy hace un día perfecto en Cali para un paseo largo. ¿Quieres que busque una ruta fresca para Bruno?"
              </Text>
              <View style={styles.aiCompanionAction}>
                <Text style={styles.aiCompanionActionText}>Planear paseo con IA</Text>
                <ChevronRight color={COLORS.aiPurple} size={18} />
              </View>
            </TouchableOpacity>


            {/* Owner Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Mis Mascotas</Text>
                <TouchableOpacity
                  style={styles.addPetBtn}
                  onPress={() => setIsAddPetModalVisible(true)}
                >
                  <Plus color={COLORS.primary} size={20} />
                  <Text style={styles.addPetBtnText}>Añadir</Text>
                </TouchableOpacity>
              </View>
              {myDogs.map(dog => (
                <TouchableOpacity
                  key={dog.id}
                  style={[styles.myDogCard, SHADOWS.light]}
                  onPress={() => navigation.navigate('DogProfile', { dogId: dog.id })}
                >
                  <View style={styles.myDogHeader}>
                    <View style={styles.dogInfoMain}>
                      <View style={styles.dogIconBg}>
                        <Text style={{ fontSize: 24 }}>🐕</Text>
                      </View>
                      <View>
                        <Text style={styles.myDogName}>{dog.name}</Text>
                        <Text style={styles.myDogBreed}>{dog.breed}</Text>
                      </View>
                    </View>
                    <View style={styles.statusBadge}>
                      <Text style={styles.statusBadgeText}>Saludable</Text>
                    </View>
                  </View>

                  <View style={styles.walkHistoryBrief}>
                    <Clock color={COLORS.textLight} size={14} />
                    <Text style={styles.myDogInfo}>Último paseo: hace {dog.daysSinceLastWalk} días</Text>
                  </View>

                  <TouchableOpacity
                    style={styles.requestWalkBtn}
                    onPress={() => navigation.navigate('ScheduleWalk', { dogId: dog.id })}
                  >
                    <Navigation color={COLORS.white} size={16} />
                    <Text style={styles.requestWalkText}>Agendar Paseo Inteligente</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ) : (
          <>
            {/* Search Bar */}
            <View style={styles.searchContainer}>
              <Search color={COLORS.textSecondary} size={20} />
              <TextInput 
                style={styles.searchInput} 
                placeholder="Search here..." 
                placeholderTextColor={COLORS.textSecondary}
              />
            </View>

            {/* AI Assistant Banner */}
            <View style={styles.aiBannerContainer}>
              <View style={styles.aiBannerContent}>
                <Text style={styles.aiBannerTitle}>Encuentra tu paseo ideal</Text>
                <Text style={styles.aiBannerSubtitle}>Usa la vista interactiva para ver los paseos disponibles cerca de ti.</Text>
                <TouchableOpacity 
                  style={styles.aiBannerButton}
                  onPress={() => navigation.navigate('Explorar')}
                >
                  <MapPin color={COLORS.aiPurple} size={16} />
                  <Text style={styles.aiBannerBtnText}>Encuentra paseos rápidamente</Text>
                </TouchableOpacity>
              </View>
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=500&q=60' }} 
                style={styles.aiBannerImage} 
              />
            </View>

            {/* Urgencias Section */}
            {urgentDogs.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Urgencias: cerca de ti</Text>
                  <TouchableOpacity>
                    <Text style={styles.viewAll}>Ver más</Text>
                  </TouchableOpacity>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.urgentScroll}>
                  {urgentDogs.map(dog => (
                    <TouchableOpacity
                      key={dog.id}
                      style={[styles.urgentCard, SHADOWS.light]}
                      onPress={() => navigation.navigate('DogProfile', { dogId: dog.id })}
                    >
                      <Image source={{ uri: dog.photo || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=500&q=60' }} style={styles.urgentDogImage} />
                      <View style={styles.urgentBadge}>
                        <Text style={styles.urgentBadgeText}>Urgente</Text>
                      </View>
                      <View style={styles.urgentInfoContainer}>
                        <View style={styles.urgentRow}>
                          <Text style={styles.urgentDogName}>{dog.name}</Text>
                          <Heart color={COLORS.textSecondary} size={16} />
                        </View>
                        <Text style={styles.urgentDogDetails}>{dog.age} Años</Text>
                        <View style={styles.urgentLocationRow}>
                          <MapPin color={COLORS.textSecondary} size={12} />
                          <Text style={styles.urgentDogLocation}>0.5 Km - San Antonio</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Recomendaciones Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recomendaciones para ti</Text>
              </View>

              {isLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
              ) : (
                recommendations.map(dog => (
                  <TouchableOpacity
                    key={dog.id}
                    style={[styles.recCard, SHADOWS.light]}
                    onPress={() => navigation.navigate('DogProfile', { dogId: dog.id })}
                  >
                    <Image source={{ uri: dog.photo || 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=500&q=60' }} style={styles.recImage} />
                    <View style={styles.recInfo}>
                      <Text style={styles.recName}>{dog.name}</Text>
                      <Text style={styles.recDetails}>{dog.breed} - {dog.age} Años</Text>
                      <View style={styles.recLocationRow}>
                        <MapPin color={COLORS.textSecondary} size={12} />
                        <Text style={styles.recLocation}>1.2 Km - Ciudad Jardín</Text>
                      </View>
                    </View>
                    <View style={styles.recActionBtn}>
                      <Navigation color={COLORS.textSecondary} size={18} />
                    </View>
                  </TouchableOpacity>
                ))
              )}
            </View>
          </>
        )}

      </ScrollView>

      {/* Add Pet Modal */}
      <Modal
        visible={isAddPetModalVisible}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Añadir Mascota</Text>
              <TouchableOpacity onPress={() => setIsAddPetModalVisible(false)}>
                <X color={COLORS.text} size={24} />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nombre</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej. Bruno"
                value={newPetName}
                onChangeText={setNewPetName}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Raza</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej. Golden Retriever"
                value={newPetBreed}
                onChangeText={setNewPetBreed}
              />
            </View>

            <TouchableOpacity style={styles.saveBtn} onPress={handleAddPet}>
              <Text style={styles.saveBtnText}>Guardar Mascota</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { padding: SIZES.xl, paddingBottom: SIZES.xxl * 2 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.large,
  },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  headerIcon: { marginRight: 15, position: 'relative' },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.error,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  aiHeaderBadge: {
    backgroundColor: COLORS.aiPurpleLight,
    padding: 8,
    borderRadius: 12,
    ...SHADOWS.light,
  },
  greeting: { fontSize: SIZES.font, color: COLORS.textSecondary },
  userName: { fontSize: 26, fontWeight: '800', color: COLORS.text },

  ownerDashboard: { paddingBottom: SIZES.large },
  section: { marginBottom: SIZES.extraLarge },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.medium,
  },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: COLORS.text },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center' },

  addPetBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.primaryLight, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  addPetBtnText: { color: COLORS.primary, fontWeight: '700', marginLeft: 4, fontSize: 12 },

  myDogCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    ...SHADOWS.light,
  },
  myDogHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  myDogName: { fontSize: 20, fontWeight: '800', color: COLORS.text },
  statusBadge: { backgroundColor: COLORS.successLight, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusBadgeText: { fontSize: 12, fontWeight: '700', color: COLORS.success },
  myDogInfo: { fontSize: 14, color: COLORS.textSecondary, marginTop: 5 },
  requestWalkBtn: { backgroundColor: COLORS.primary, padding: 12, borderRadius: 12, alignItems: 'center', marginTop: 15 },
  requestWalkText: { color: COLORS.white, fontWeight: '700' },

  requestCard: { backgroundColor: COLORS.white, borderRadius: 20, padding: 20, ...SHADOWS.light },
  requestName: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  requestTime: { fontSize: 13, color: COLORS.textSecondary, marginTop: 4 },
  requestActions: { flexDirection: 'row', gap: 10, marginTop: 15 },
  acceptBtn: { flex: 1, backgroundColor: COLORS.primary, padding: 12, borderRadius: 10, alignItems: 'center' },
  acceptBtnText: { color: COLORS.white, fontWeight: '700' },
  rejectBtn: { flex: 1, backgroundColor: COLORS.greyLight, padding: 12, borderRadius: 10, alignItems: 'center' },
  rejectBtnText: { color: COLORS.textSecondary, fontWeight: '700' },

  insightsBanner: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    ...SHADOWS.medium,
  },
  insightsLeft: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  insightsIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  insightsText: { flex: 1, marginLeft: 15 },
  insightsTitle: { fontSize: 14, fontWeight: '700', color: COLORS.white },
  insightsSubtitle: { fontSize: 12, color: 'rgba(255,255,255,0.9)', marginTop: 2 },

  chatButton: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
    ...SHADOWS.light,
    borderWidth: 1,
    borderColor: COLORS.primaryLight,
  },
  chatButtonIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  chatButtonTitle: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  chatButtonSubtitle: { fontSize: 12, color: COLORS.textSecondary },

  cleanUrgentCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 15,
    marginRight: 15,
    width: 160,
    ...SHADOWS.light,
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  // Walker specific styles
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: 25, paddingHorizontal: 20, paddingVertical: 12, marginBottom: 20, ...SHADOWS.light },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 15, color: COLORS.text },
  
  aiBannerContainer: { backgroundColor: COLORS.aiPurpleLight, borderRadius: 25, flexDirection: 'row', overflow: 'hidden', marginBottom: 25 },
  aiBannerContent: { flex: 1, padding: 20, justifyContent: 'center' },
  aiBannerTitle: { fontSize: 18, fontWeight: '800', color: COLORS.aiPurple, marginBottom: 5 },
  aiBannerSubtitle: { fontSize: 13, color: COLORS.text, opacity: 0.8, marginBottom: 15 },
  aiBannerButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, alignSelf: 'flex-start' },
  aiBannerBtnText: { color: COLORS.aiPurple, fontWeight: '700', marginLeft: 6, fontSize: 13 },
  aiBannerImage: { width: 120, height: '100%', resizeMode: 'cover' },
  
  viewAll: { color: COLORS.primary, fontWeight: '700', fontSize: 14 },
  urgentScroll: { overflow: 'visible' },
  urgentCard: { width: 160, backgroundColor: COLORS.white, borderRadius: 20, marginRight: 15, overflow: 'hidden', paddingBottom: 15 },
  urgentDogImage: { width: '100%', height: 140, resizeMode: 'cover' },
  urgentBadge: { position: 'absolute', top: 10, left: 10, backgroundColor: COLORS.warning, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  urgentBadgeText: { color: COLORS.white, fontSize: 10, fontWeight: '800' },
  urgentInfoContainer: { paddingHorizontal: 15, paddingTop: 10 },
  urgentRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  urgentDogName: { fontSize: 16, fontWeight: '800', color: COLORS.text },
  urgentDogDetails: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  urgentLocationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  urgentDogLocation: { fontSize: 10, color: COLORS.textSecondary, marginLeft: 4 },

  recCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: 20, padding: 15, marginBottom: 15 },
  recImage: { width: 60, height: 60, borderRadius: 15, resizeMode: 'cover' },
  recInfo: { flex: 1, marginLeft: 15 },
  recName: { fontSize: 16, fontWeight: '800', color: COLORS.text },
  recDetails: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  recLocationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  recLocation: { fontSize: 11, color: COLORS.textSecondary, marginLeft: 4 },
  recActionBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center' },

  loadingContainer: { alignItems: 'center', padding: 40, backgroundColor: COLORS.white, borderRadius: 20 },
  loadingText: { fontSize: 16, fontWeight: '700', color: COLORS.primary, marginTop: 15 },

  // Owner Dashboard Styles
  aiCompanionCard: { backgroundColor: COLORS.white, borderRadius: 25, padding: 20, marginBottom: 25, borderLeftWidth: 6, borderLeftColor: COLORS.aiPurple },
  aiCompanionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  aiCompanionIcon: { width: 45, height: 45, borderRadius: 15, backgroundColor: COLORS.aiPurple, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  aiCompanionTitle: { fontSize: 16, fontWeight: '800', color: COLORS.text },
  aiCompanionStatus: { fontSize: 12, color: COLORS.aiPurple, fontWeight: '600' },
  aiCompanionText: { fontSize: 14, color: COLORS.textSecondary, lineHeight: 20, fontStyle: 'italic' },
  aiCompanionAction: { flexDirection: 'row', alignItems: 'center', marginTop: 15, gap: 5 },
  aiCompanionActionText: { color: COLORS.aiPurple, fontWeight: '700', fontSize: 13 },

  statsSummary: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  statCard: { flex: 1, backgroundColor: COLORS.white, borderRadius: 20, padding: 15, alignItems: 'center', marginHorizontal: 5 },
  statValue: { fontSize: 18, fontWeight: '800', color: COLORS.text, marginTop: 8 },
  statLabel: { fontSize: 10, color: COLORS.textSecondary, marginTop: 2, textTransform: 'uppercase' },

  myDogCard: { backgroundColor: COLORS.white, borderRadius: 25, padding: 20, marginBottom: 15 },
  myDogHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'start', marginBottom: 15 },
  dogInfoMain: { flexDirection: 'row', alignItems: 'center' },
  dogIconBg: { width: 50, height: 50, borderRadius: 15, backgroundColor: COLORS.primaryLight, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  myDogName: { fontSize: 18, fontWeight: '800', color: COLORS.text },
  myDogBreed: { fontSize: 12, color: COLORS.textSecondary },
  statusBadge: { backgroundColor: COLORS.successLight, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  statusBadgeText: { color: COLORS.success, fontSize: 10, fontWeight: '700' },
  walkHistoryBrief: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 20 },
  requestWalkBtn: { backgroundColor: COLORS.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 15, borderRadius: 15, gap: 10 },
  requestWalkText: { color: COLORS.white, fontWeight: '700', fontSize: 14 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: COLORS.white, borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 30 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  modalTitle: { fontSize: 22, fontWeight: '800', color: COLORS.text },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '700', color: COLORS.textSecondary, marginBottom: 8 },
  input: { backgroundColor: COLORS.background, borderRadius: 12, padding: 15, fontSize: 16, color: COLORS.text },
  saveBtn: { backgroundColor: COLORS.primary, padding: 16, borderRadius: 15, alignItems: 'center', marginTop: 10 },
  saveBtnText: { color: COLORS.white, fontSize: 16, fontWeight: '800' },
});

export default HomeScreen;
