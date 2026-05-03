import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { PhoneCall, MessageCircle, MapPin, CheckCircle2, Clock, Calendar, Route, AlertTriangle, Check } from 'lucide-react-native';
import { DOGS, OWNERS, SHELTERS, GLOBAL_REQUESTS } from '../constants/mockData';

const ActivityScreen = ({ navigation }) => {
  // Consistent data: Use specific dogs and link them to owners
  const canela = DOGS[2]; // Canela - Labrador mix, ownerId: owner-1
  const luna = DOGS[0];   // Luna - Criolla mestiza
  const rocky = DOGS[1];  // Rocky - Pitbull mix

  const [pendingRequests, setPendingRequests] = useState([
    {
      ...canela,
      id: 'req-1',
      distance: '1.2 km',
      location: 'Parque del Perro, San Fernando',
      pickup: 'Calle 5 #34-21, San Fernando',
      owner: OWNERS[0],
      walkDate: canela.currentRequest?.date || 'Hoy, 2 de mayo',
      walkTime: canela.currentRequest?.time || '3:00 PM - 4:00 PM',
      walkRoute: canela.currentRequest?.route || 'Parque del Perro → Av. San Fernando → Parque Panamericano',
    }
  ]);

  useFocusEffect(
    useCallback(() => {
      if (GLOBAL_REQUESTS.pending.length > 0) {
        setPendingRequests(prev => {
          const newRequests = GLOBAL_REQUESTS.pending.filter(
            globalReq => !prev.find(r => r.id === globalReq.id)
          );
          return [...newRequests, ...prev];
        });
      }
    }, [])
  );

  const [activeRequests, setActiveRequests] = useState([
    {
      ...luna,
      id: luna.id,
      status: 'esperando',
      owner: OWNERS[0],
      pickup: 'Calle 5 #40-12, San Fernando',
      walkDate: 'Hoy, 2 de mayo',
      walkTime: '4:30 PM - 5:30 PM',
      walkRoute: 'Punto de recogida → Parque Central → Río Cali → Regreso',
    }
  ]);

  const [completedRequests, setCompletedRequests] = useState([
    {
      ...rocky,
      id: 'req-3',
      earned: '$25.000 COP',
      completedDate: '1 de mayo, 2:00 PM',
      walkRoute: 'Parque del Acueducto → Capilla San Antonio',
      duration: '50 min',
    }
  ]);

  const [actionModal, setActionModal] = useState({ visible: false, type: '', request: null });

  const handleAction = () => {
    const { type, request } = actionModal;
    if (type === 'accept') {
      setPendingRequests(prev => prev.filter(req => req.id !== request.id));
      setActiveRequests(prev => [...prev, request]);
    } else if (type === 'reject') {
      setPendingRequests(prev => prev.filter(req => req.id !== request.id));
    }
    setActionModal({ visible: false, type: '', request: null });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Actividad</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Solicitudes Pendientes */}
        {pendingRequests.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionSubtitle}>SOLICITUDES PENDIENTES</Text>
            {pendingRequests.map(req => (
              <View key={req.id} style={[styles.card, SHADOWS.medium]}>
                <TouchableOpacity
                  style={styles.cardHeader}
                  onPress={() => navigation.navigate('DogProfile', { dogId: req.id })}
                >
                  <Image source={{ uri: req.photo }} style={styles.dogAvatar} />
                  <View style={styles.dogInfo}>
                    <Text style={styles.dogName}>{req.name}</Text>
                    <Text style={styles.dogBreed}>{req.breed} • {req.age} Años</Text>
                    <View style={styles.locationRow}>
                      <MapPin color={COLORS.textSecondary} size={12} />
                      <Text style={styles.locationText}>
                        {typeof req.location === 'object' ? 'Ver en el mapa' : req.location} • {req.distance || 'Cerca de ti'}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>

                {/* Owner/Shelter info */}
                <View style={styles.ownerBriefContainer}>
                  <View style={styles.ownerBriefAvatar}>
                    <Text style={styles.ownerBriefInitial}>
                      {(OWNERS.find(o => o.id === req.ownerId)?.name || SHELTERS.find(s => s.id === req.shelterId)?.name || 'D').charAt(0)}
                    </Text>
                  </View>
                  <Text style={styles.ownerBriefText}>
                    {req.ownerId ? 'Dueño:' : 'Refugio:'} {OWNERS.find(o => o.id === req.ownerId)?.name || SHELTERS.find(s => s.id === req.shelterId)?.name || 'Desconocido'}
                  </Text>
                  <View style={styles.ownerContactMini}>
                      <TouchableOpacity style={styles.miniIconBtn}><PhoneCall color={COLORS.primary} size={14} /></TouchableOpacity>
                      <TouchableOpacity style={styles.miniIconBtn}><MessageCircle color={COLORS.aiPurple} size={14} /></TouchableOpacity>
                    </View>
                  </View>

                {/* Walk Details */}
                <View style={styles.walkDetailsBox}>
                  <View style={styles.walkDetailRow}>
                    <Calendar color={COLORS.aiPurple} size={14} />
                    <Text style={styles.walkDetailText}>{req.walkDate} • {req.walkTime}</Text>
                  </View>
                  <View style={styles.walkDetailRow}>
                    <Route color={COLORS.aiPurple} size={14} />
                    <Text style={styles.walkDetailText}>{req.walkRoute}</Text>
                  </View>
                </View>

                <View style={styles.actionRow}>
                  <TouchableOpacity
                    style={styles.rejectBtn}
                    onPress={() => setActionModal({ visible: true, type: 'reject', request: req })}
                  >
                    <Text style={styles.rejectBtnText}>✕ Rechazar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.acceptBtn}
                    onPress={() => setActionModal({ visible: true, type: 'accept', request: req })}
                  >
                    <Text style={styles.acceptBtnText}>✓ Aceptar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Activos / En camino */}
        {activeRequests.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionSubtitle}>ACEPTADOS - LISTO PARA RECOGER</Text>
            {activeRequests.map(req => (
              <View key={req.id} style={[styles.cardHighlight, SHADOWS.medium]}>
                <TouchableOpacity
                  style={styles.cardHeader}
                  onPress={() => navigation.navigate('DogProfile', { dogId: req.id })}
                >
                  <Image source={{ uri: req.photo }} style={styles.dogAvatar} />
                  <View style={styles.dogInfo}>
                    <Text style={styles.dogName}>{req.name}</Text>
                    <Text style={styles.ownerText}>{req.ownerId ? 'Dueño:' : 'Refugio:'} {OWNERS.find(o => o.id === req.ownerId)?.name || SHELTERS.find(s => s.id === req.shelterId)?.name || 'Desconocido'}</Text>
                    <View style={styles.statusRow}>
                      <View style={styles.statusDotBlue} />
                      <Text style={styles.statusTextBlue}>Esperando recogida</Text>
                    </View>
                  </View>
                  <View style={styles.contactIcons}>
                    <TouchableOpacity style={styles.iconBtn}><PhoneCall color={COLORS.primary} size={18} /></TouchableOpacity>
                    <TouchableOpacity style={styles.iconBtn}><MessageCircle color={COLORS.aiPurple} size={18} /></TouchableOpacity>
                  </View>
                </TouchableOpacity>

                {/* Walk Details */}
                <View style={styles.walkDetailsBox}>
                  <View style={styles.walkDetailRow}>
                    <Calendar color={COLORS.primary} size={14} />
                    <Text style={styles.walkDetailText}>{req.walkDate} • {req.walkTime}</Text>
                  </View>
                  <View style={styles.walkDetailRow}>
                    <Route color={COLORS.primary} size={14} />
                    <Text style={styles.walkDetailText}>{req.walkRoute}</Text>
                  </View>
                </View>

                <View style={styles.pickupBox}>
                  <MapPin color={COLORS.textSecondary} size={16} />
                  <Text style={styles.pickupText}>
                    📍 Punto de recogida: {typeof req.pickup === 'object' ? 'Ver en el mapa' : req.pickup}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.pickupBtn}
                  onPress={() => navigation.navigate('LiveTracking', { dogId: req.id, phase: 'pickup' })}
                >
                  <Text style={styles.pickupBtnText}>Ir a recoger mascota</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* Completados */}
        {completedRequests.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionSubtitle}>COMPLETADOS</Text>
            {completedRequests.map(req => (
              <TouchableOpacity
                key={req.id}
                style={[styles.completedCard, SHADOWS.light]}
                onPress={() => navigation.navigate('DogProfile', { dogId: req.id })}
              >
                <Image source={{ uri: req.photo }} style={styles.completedAvatar} />
                <View style={styles.completedInfo}>
                  <Text style={styles.completedName}>{req.name}</Text>
                  <Text style={styles.completedDetails}>{req.completedDate} • {req.duration}</Text>
                  <Text style={styles.completedRoute}>{req.walkRoute}</Text>
                </View>
                <View style={styles.completedBadge}>
                  <CheckCircle2 color={COLORS.success} size={20} />
                  <Text style={styles.earnedText}>{req.earned}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Action Modal */}
      <Modal
        visible={actionModal.visible}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {actionModal.type === 'accept' ? (
              <CheckCircle2 color={COLORS.success} size={50} />
            ) : (
              <AlertTriangle color={COLORS.error} size={50} />
            )}
            <Text style={styles.modalTitle}>
              {actionModal.type === 'accept' ? '¿Aceptar paseo?' : '¿Rechazar paseo?'}
            </Text>
            <Text style={styles.modalText}>
              {actionModal.type === 'accept'
                ? `Confirmas que puedes realizar el paseo de ${actionModal.request?.name} en el horario establecido.`
                : `Esta acción removerá la solicitud de ${actionModal.request?.name} de tu lista.`}
            </Text>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setActionModal({ visible: false, type: '', request: null })}
              >
                <Text style={styles.modalCancelBtnText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalConfirmBtn, actionModal.type === 'reject' && { backgroundColor: COLORS.error }]}
                onPress={handleAction}
              >
                <Text style={styles.modalConfirmBtnText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { paddingHorizontal: 25, paddingVertical: 15 },
  headerTitle: { fontSize: 28, fontWeight: '900', color: COLORS.text },
  content: { paddingHorizontal: 20 },
  section: { marginBottom: 25 },
  sectionSubtitle: { fontSize: 13, fontWeight: '800', color: COLORS.textSecondary, letterSpacing: 0.5, marginBottom: 15 },

  card: { backgroundColor: COLORS.white, borderRadius: 25, padding: 20, marginBottom: 15 },
  cardHighlight: { backgroundColor: COLORS.white, borderRadius: 25, padding: 20, marginBottom: 15, borderLeftWidth: 4, borderLeftColor: COLORS.primary },

  cardHeader: { flexDirection: 'row', alignItems: 'center' },
  dogAvatar: { width: 60, height: 60, borderRadius: 18, backgroundColor: COLORS.greyLight },
  dogInfo: { flex: 1, marginLeft: 15 },
  dogName: { fontSize: 17, fontWeight: '800', color: COLORS.text },
  dogBreed: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  locationText: { fontSize: 11, color: COLORS.textSecondary, marginLeft: 4 },

  ownerBriefContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 15, paddingHorizontal: 5 },
  ownerBriefAvatar: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#F3F0FF', justifyContent: 'center', alignItems: 'center', marginRight: 8 },
  ownerBriefInitial: { fontSize: 10, fontWeight: '800', color: COLORS.aiPurple },
  ownerBriefText: { fontSize: 13, color: COLORS.textSecondary, fontWeight: '600', flex: 1 },
  ownerContactMini: { flexDirection: 'row', gap: 5 },
  miniIconBtn: { width: 28, height: 28, borderRadius: 14, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center' },

  walkDetailsBox: { backgroundColor: '#F8F6FF', borderRadius: 15, padding: 12, marginTop: 12, gap: 8 },
  walkDetailRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  walkDetailText: { fontSize: 12, color: COLORS.text, fontWeight: '600', flex: 1, lineHeight: 18 },

  actionRow: { flexDirection: 'row', gap: 15, marginTop: 15 },
  rejectBtn: { flex: 1, paddingVertical: 14, borderRadius: 20, borderWidth: 1.5, borderColor: COLORS.divider, alignItems: 'center' },
  rejectBtnText: { color: COLORS.textSecondary, fontWeight: '700', fontSize: 14 },
  acceptBtn: { flex: 1, backgroundColor: COLORS.aiPurple, paddingVertical: 14, borderRadius: 20, alignItems: 'center', ...SHADOWS.light },
  acceptBtnText: { color: COLORS.white, fontWeight: '700', fontSize: 14 },

  ownerText: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  statusRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  statusDotBlue: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.primary, marginRight: 5 },
  statusTextBlue: { fontSize: 12, color: COLORS.primary, fontWeight: '700' },
  contactIcons: { gap: 8 },
  iconBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center' },

  pickupBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.background, padding: 12, borderRadius: 15, marginTop: 12 },
  pickupText: { fontSize: 13, color: COLORS.text, marginLeft: 8, fontWeight: '600', flex: 1 },
  pickupBtn: { backgroundColor: COLORS.primary, paddingVertical: 16, borderRadius: 20, alignItems: 'center', marginTop: 15, ...SHADOWS.light },
  pickupBtnText: { color: COLORS.white, fontWeight: '800', fontSize: 15 },

  completedCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: 20, padding: 15, marginBottom: 10 },
  completedAvatar: { width: 50, height: 50, borderRadius: 15, backgroundColor: COLORS.greyLight },
  completedInfo: { flex: 1, marginLeft: 15 },
  completedName: { fontSize: 15, fontWeight: '800', color: COLORS.text },
  completedDetails: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  completedRoute: { fontSize: 11, color: COLORS.aiPurple, marginTop: 3, fontWeight: '600' },
  completedBadge: { alignItems: 'flex-end' },
  earnedText: { fontSize: 13, fontWeight: '800', color: COLORS.success, marginTop: 4 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '85%', backgroundColor: COLORS.white, borderRadius: 24, padding: 25, alignItems: 'center', ...SHADOWS.heavy },
  modalTitle: { fontSize: 20, fontWeight: '800', color: COLORS.text, marginTop: 15, marginBottom: 10 },
  modalText: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: 25 },
  modalActions: { flexDirection: 'row', gap: 12, width: '100%' },
  modalCancelBtn: { flex: 1, paddingVertical: 14, borderRadius: 20, backgroundColor: COLORS.background, alignItems: 'center' },
  modalCancelBtnText: { color: COLORS.text, fontWeight: '700', fontSize: 15 },
  modalConfirmBtn: { flex: 1, backgroundColor: COLORS.success, paddingVertical: 14, borderRadius: 20, alignItems: 'center' },
  modalConfirmBtnText: { color: COLORS.white, fontWeight: '700', fontSize: 15 },
});

export default ActivityScreen;
