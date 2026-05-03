import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { ChevronLeft, Heart, Zap, ShieldCheck, Calendar, MapPin, Clock, Dog, PhoneCall, MessageCircle, Star, Share2 } from 'lucide-react-native';
import { DOGS, SHELTERS, OWNERS, CURRENT_USER } from '../constants/mockData';

const { width } = Dimensions.get('window');

const DogProfileScreen = ({ navigation, route }) => {
  const dogId = route?.params?.dogId || 'dog-1';
  const dog = DOGS.find(d => d.id === dogId) || DOGS[0];
  const shelter = SHELTERS.find(s => s.id === dog.shelterId);
  const owner = OWNERS.find(o => o.id === dog.ownerId) || OWNERS[0];

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Hero Header */}
        <View style={styles.heroSection}>
          {/* Decorative Elements */}
          <View style={styles.decorCircleTopRight} />
          <View style={styles.decorCircleBottomLeft} />

          {/* Back & Share */}
          <SafeAreaView style={styles.navRow}>
            <TouchableOpacity style={styles.navBtn} onPress={() => navigation.goBack()}>
              <ChevronLeft color={COLORS.text} size={22} />
            </TouchableOpacity>
            <Text style={styles.navTitle}>Pet Profile</Text>
            <TouchableOpacity style={styles.navBtn}>
              <Share2 color={COLORS.text} size={20} />
            </TouchableOpacity>
          </SafeAreaView>

          {/* Photo Circle */}
          <View style={styles.photoContainer}>
            <View style={styles.photoRingOuter}>
              <View style={styles.photoRingInner}>
                <Image source={{ uri: dog.photo }} style={styles.dogPhoto} />
              </View>
            </View>
          </View>
        </View>

        {/* Name & Basic */}
        <View style={styles.infoSection}>
          <Text style={styles.dogName}>{dog.name}</Text>
          <Text style={styles.dogMeta}>
            {dog.breed} | {dog.gender === 'Hembra' ? '♀' : '♂'}
          </Text>
          <View style={styles.locationRow}>
            <MapPin color={COLORS.aiPurple} size={16} />
            <Text style={styles.locationText}>
              {shelter?.address || owner?.address || 'Cali, Colombia'}
            </Text>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{dog.age} Años</Text>
            <Text style={styles.statLabel}>Edad</Text>
          </View>
          <View style={[styles.statCard, styles.statCardMiddle]}>
            <Text style={styles.statValue}>{dog.weight} Kg</Text>
            <Text style={styles.statLabel}>Peso</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{dog.totalWalks}</Text>
            <Text style={styles.statLabel}>Paseos</Text>
          </View>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sobre {dog.name}</Text>
          <Text style={styles.descriptionText}>{dog.description}</Text>
        </View>

        {/* Characteristics Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Características</Text>
          <View style={styles.chipsRow}>
            {dog.temperament.map((t, i) => (
              <View key={i} style={styles.chip}>
                <Text style={styles.chipText}>{t}</Text>
              </View>
            ))}
          </View>
          <View style={styles.detailGrid}>
            <DetailRow icon={<Zap color={COLORS.aiPurple} size={18} />} label="Energía" value={dog.energyLevel} />
            <DetailRow icon={<Dog color={COLORS.aiPurple} size={18} />} label="Tamaño" value={dog.size} />
            <DetailRow icon={<ShieldCheck color={COLORS.success} size={18} />} label="Salud" value={dog.healthStatus} />
            <DetailRow icon={<Calendar color={COLORS.primary} size={18} />} label="Vacunas" value={dog.vaccinationStatus} />
            <DetailRow icon={<Clock color={COLORS.secondary} size={18} />} label="Paseo preferido" value={`${dog.walkDurationPreferred} min`} />
            <DetailRow icon={<Heart color="#FF6B8A" size={18} />} label="Niños" value={dog.goodWithKids ? 'Sí ✓' : 'No'} />
            <DetailRow icon={<Dog color={COLORS.primary} size={18} />} label="Otros perros" value={dog.goodWithOtherDogs ? 'Sí ✓' : 'No'} />
          </View>

        </View>

        {/* Walk Preferences / Current Request */}
        {dog.currentRequest ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Solicitud de Paseo Actual</Text>
            <View style={styles.walkPrefCard}>
              <View style={styles.walkPrefItem}>
                <Calendar color={COLORS.primary} size={20} />
                <View style={styles.walkPrefText}>
                  <Text style={styles.walkPrefLabel}>Fecha y Hora</Text>
                  <Text style={styles.walkPrefValue}>{dog.currentRequest.date} • {dog.currentRequest.time}</Text>
                </View>
              </View>
              <View style={styles.walkPrefItem}>
                <Clock color={COLORS.secondary} size={20} />
                <View style={styles.walkPrefText}>
                  <Text style={styles.walkPrefLabel}>Duración solicitada</Text>
                  <Text style={styles.walkPrefValue}>{dog.currentRequest.duration} minutos</Text>
                </View>
              </View>
              <View style={[styles.walkPrefItem, { marginTop: 15 }]}>
                <Route color={COLORS.aiPurple} size={20} />
                <View style={styles.walkPrefText}>
                  <Text style={styles.walkPrefLabel}>Ruta sugerida por dueño</Text>
                  <Text style={styles.walkPrefValue}>{dog.currentRequest.route}</Text>
                </View>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preferencias de Paseo</Text>
            <View style={styles.walkPrefCard}>
              <View style={styles.walkPrefItem}>
                <Clock color={COLORS.aiPurple} size={20} />
                <View style={styles.walkPrefText}>
                  <Text style={styles.walkPrefLabel}>Horario preferido</Text>
                  <Text style={styles.walkPrefValue}>{dog.preferredWalkTime === 'mañana' ? ' Mañana' : dog.preferredWalkTime === 'tarde' ? '☀️ Tarde' : '🌙 Noche'}</Text>
                </View>
              </View>
              <View style={styles.walkPrefItem}>
                <MapPin color={COLORS.aiPurple} size={20} />
                <View style={styles.walkPrefText}>
                  <Text style={styles.walkPrefLabel}>Último paseo</Text>
                  <Text style={styles.walkPrefValue}>Hace {dog.daysSinceLastWalk} días</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Owner / Shelter Card */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{shelter ? 'Refugio' : 'Dueño'}</Text>
          <View style={[styles.ownerCard, SHADOWS.light]}>
            <View style={styles.ownerAvatarCircle}>
              <Text style={styles.ownerInitial}>{(shelter?.name || owner?.name || 'P').charAt(0)}</Text>
            </View>
            <View style={styles.ownerInfo}>
              <Text style={styles.ownerName}>{shelter?.name || owner?.name}</Text>
              <Text style={styles.ownerAddress}>{shelter?.address || owner?.address || 'Cali, Colombia'}</Text>
            </View>
            <View style={styles.ownerActions}>
              <TouchableOpacity style={styles.ownerActionBtn}>
                <PhoneCall color={COLORS.primary} size={18} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.ownerActionBtn}>
                <MessageCircle color={COLORS.aiPurple} size={18} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

      </ScrollView>

      {/* Footer */}
      <View style={[styles.footer, SHADOWS.heavy]}>
        <TouchableOpacity style={styles.favoriteBtn}>
          <Heart color={COLORS.aiPurple} size={22} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.adoptBtn}
          onPress={() => navigation.navigate('ScheduleWalk', { dogId: dog.id })}
        >
          <Text style={styles.adoptBtnText}>Agendar Paseo</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const DetailRow = ({ icon, label, value }) => (
  <View style={styles.detailRow}>
    <View style={styles.detailIcon}>{icon}</View>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },

  /* Hero */
  heroSection: { backgroundColor: '#F3F0FF', paddingBottom: 40, alignItems: 'center', overflow: 'hidden' },
  decorCircleTopRight: { position: 'absolute', top: -30, right: -30, width: 100, height: 100, borderRadius: 50, backgroundColor: '#42D7FF', opacity: 0.3 },
  decorCircleBottomLeft: { position: 'absolute', bottom: -20, left: -20, width: 80, height: 80, borderRadius: 40, backgroundColor: '#FFE600', opacity: 0.3 },

  navRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingHorizontal: 20, paddingTop: 10 },
  navBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.white, justifyContent: 'center', alignItems: 'center', ...SHADOWS.light },
  navTitle: { fontSize: 16, fontWeight: '800', color: COLORS.text },

  photoContainer: { marginTop: 20, alignItems: 'center' },
  photoRingOuter: { width: width * 0.55, height: width * 0.55, borderRadius: (width * 0.55) / 2, backgroundColor: '#E8E2FF', justifyContent: 'center', alignItems: 'center' },
  photoRingInner: { width: width * 0.48, height: width * 0.48, borderRadius: (width * 0.48) / 2, backgroundColor: COLORS.aiPurple, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  dogPhoto: { width: width * 0.44, height: width * 0.44, borderRadius: (width * 0.44) / 2 },

  /* Info */
  infoSection: { alignItems: 'center', paddingTop: 25, paddingHorizontal: 30 },
  dogName: { fontSize: 28, fontWeight: '900', color: COLORS.text },
  dogMeta: { fontSize: 15, color: COLORS.textSecondary, marginTop: 5 },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  locationText: { fontSize: 13, color: COLORS.textSecondary, marginLeft: 5 },

  /* Stats */
  statsRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 25, paddingHorizontal: 30, gap: 0 },
  statCard: { flex: 1, alignItems: 'center', paddingVertical: 15 },
  statCardMiddle: { borderLeftWidth: 1, borderRightWidth: 1, borderColor: COLORS.divider },
  statValue: { fontSize: 18, fontWeight: '900', color: COLORS.text },
  statLabel: { fontSize: 12, color: COLORS.textSecondary, marginTop: 4, fontWeight: '600' },

  /* Sections */
  section: { paddingHorizontal: 25, marginTop: 30 },
  sectionTitle: { fontSize: 20, fontWeight: '900', color: COLORS.text, marginBottom: 15 },
  descriptionText: { fontSize: 15, color: COLORS.textSecondary, lineHeight: 24 },

  /* Chips */
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  chip: { backgroundColor: '#F3F0FF', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  chipText: { fontSize: 13, fontWeight: '700', color: COLORS.aiPurple, textTransform: 'capitalize' },

  /* Detail Grid */
  detailGrid: { gap: 0 },
  detailRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: COLORS.divider },
  detailIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F3F0FF', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  detailLabel: { flex: 1, fontSize: 14, color: COLORS.textSecondary, fontWeight: '600' },
  detailValue: { fontSize: 14, fontWeight: '800', color: COLORS.text, textTransform: 'capitalize' },

  /* Special Needs */
  specialNeedsBox: { backgroundColor: '#FFF5F5', borderRadius: 16, padding: 15, marginTop: 15 },
  specialNeedsTitle: { fontSize: 14, fontWeight: '800', color: '#D32F2F', marginBottom: 8 },
  specialNeedsText: { fontSize: 13, color: '#D32F2F', lineHeight: 20 },

  /* Walk Preferences */
  walkPrefCard: { backgroundColor: COLORS.background, borderRadius: 20, padding: 20, gap: 15 },
  walkPrefItem: { flexDirection: 'row', alignItems: 'center' },
  walkPrefText: { marginLeft: 15 },
  walkPrefLabel: { fontSize: 12, color: COLORS.textSecondary, fontWeight: '600' },
  walkPrefValue: { fontSize: 15, fontWeight: '800', color: COLORS.text, marginTop: 2 },

  /* Owner Card */
  ownerCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: 20, padding: 15, borderWidth: 1, borderColor: COLORS.divider },
  ownerAvatarCircle: { width: 48, height: 48, borderRadius: 24, backgroundColor: COLORS.aiPurple, justifyContent: 'center', alignItems: 'center' },
  ownerInitial: { color: COLORS.white, fontSize: 20, fontWeight: '900' },
  ownerInfo: { flex: 1, marginLeft: 15 },
  ownerName: { fontSize: 15, fontWeight: '800', color: COLORS.text },
  ownerAddress: { fontSize: 12, color: COLORS.textSecondary, marginTop: 3 },
  ownerActions: { flexDirection: 'row', gap: 8 },
  ownerActionBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center' },

  /* Footer */
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', padding: 20, paddingBottom: 35, backgroundColor: COLORS.white, borderTopWidth: 1, borderTopColor: COLORS.divider, gap: 15 },
  favoriteBtn: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#F3F0FF', justifyContent: 'center', alignItems: 'center' },
  adoptBtn: { flex: 1, backgroundColor: COLORS.aiPurple, borderRadius: 28, justifyContent: 'center', alignItems: 'center', height: 56 },
  adoptBtnText: { color: COLORS.white, fontSize: 17, fontWeight: '800' },
});

export default DogProfileScreen;
