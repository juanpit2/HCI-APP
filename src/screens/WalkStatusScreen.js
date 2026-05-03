import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { ChevronLeft, Clock, MapPin, CheckCircle2, User, PhoneCall, MessageSquare, Brain, Sparkles, Navigation, Calendar as CalendarIcon } from 'lucide-react-native';
import { useAppContext } from '../context/AppContext';

const WalkStatusScreen = ({ navigation, route }) => {
  const { walkRequests, setWalkRequests } = useAppContext();
  const requestId = route?.params?.requestId;
  const request = walkRequests.find(r => r.id === requestId) || walkRequests[0];

  const [currentStatus, setCurrentStatus] = useState(request?.status || 'PENDING');
  const [simulationActive, setSimulationActive] = useState(true);

  // SIMULADOR DE FLUJO (Happy Path)
  useEffect(() => {
    if (simulationActive && currentStatus === 'PENDING') {
      const timer = setTimeout(() => {
        setCurrentStatus('ACCEPTED');
        // Actualizar el estado global para reflejar la aceptación
        setWalkRequests(prev => prev.map(r => 
          r.id === request.id ? { ...r, status: 'ACCEPTED', walker: { name: 'Carlos Arboleda', rating: 4.9 } } : r
        ));
      }, 3000);
      return () => clearTimeout(timer);
    }

    if (simulationActive && currentStatus === 'ACCEPTED') {
      const timer = setTimeout(() => {
        setCurrentStatus('IN_PROGRESS');
        setWalkRequests(prev => prev.map(r => 
          r.id === request.id ? { ...r, status: 'IN_PROGRESS' } : r
        ));
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [currentStatus, simulationActive]);

  const getStatusInfo = (status) => {
    switch (status) {
      case 'PENDING':
        return { title: 'Buscando Paseador', desc: 'La IA está contactando a los mejores paseadores cerca de ti...', step: 1, icon: <ActivityIndicator color={COLORS.primary} /> };
      case 'ACCEPTED':
        return { title: 'Paseador Asignado', desc: '¡Carlos ha aceptado! Está preparando su equipo para Bruno.', step: 2, icon: <Sparkles color={COLORS.secondary} size={24} /> };
      case 'IN_PROGRESS':
        return { title: 'Paseo en Curso', desc: '¡Bruno ya está en camino! Puedes rastrearlo en tiempo real.', step: 4, icon: <MapPin color={COLORS.success} size={24} /> };
      default:
        return { title: 'Estado Desconocido', desc: '...', step: 0, icon: <Clock color={COLORS.grey} size={24} /> };
    }
  };

  const statusInfo = getStatusInfo(currentStatus);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronLeft color={COLORS.text} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Estado del Paseo</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.statusCard, SHADOWS.medium]}>
          <View style={styles.statusBadge}>
            {statusInfo.icon}
            <Text style={styles.statusText}>{statusInfo.title}</Text>
          </View>
          <Text style={styles.statusDesc}>{statusInfo.desc}</Text>
        </View>

        {/* Progress Bar UI */}
        <View style={styles.progressContainer}>
          {[1, 2, 3, 4].map((step) => (
            <View key={step} style={styles.stepItem}>
              <View style={[
                styles.stepDot,
                statusInfo.step >= step ? styles.stepDotActive : null
              ]}>
                {statusInfo.step > step ? <CheckCircle2 color={COLORS.white} size={14} /> : <Text style={[styles.stepNum, statusInfo.step >= step && styles.stepNumActive]}>{step}</Text>}
              </View>
              <Text style={[styles.stepLabel, statusInfo.step >= step && styles.stepLabelActive]}>
                {step === 1 ? 'Solicitud' : step === 2 ? 'Aceptado' : step === 3 ? 'Recogida' : 'En Vivo'}
              </Text>
            </View>
          ))}
        </View>

        {currentStatus !== 'PENDING' && (
          <View style={[styles.walkerCard, SHADOWS.light]}>
            <View style={styles.walkerHeader}>
              <View style={styles.avatar}>
                <User color={COLORS.primary} size={30} />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.walkerName}>Carlos Arboleda</Text>
                <Text style={styles.walkerMeta}>Paseador Verificado • ⭐ 4.9</Text>
              </View>
              <TouchableOpacity style={styles.phoneBtn}>
                <PhoneCall color={COLORS.white} size={18} />
              </TouchableOpacity>
            </View>
            <View style={styles.aiBadge}>
              <Brain color={COLORS.aiPurple} size={14} />
              <Text style={styles.aiBadgeText}>Carlos sigue la ruta optimizada por IA</Text>
            </View>
          </View>
        )}

        <View style={styles.detailsCard}>
          <Text style={styles.detailTitle}>Detalles del Paseo</Text>
          <View style={styles.detailRow}>
            <CalendarIcon color={COLORS.textLight} size={16} />
            <Text style={styles.detailText}>{request.date} • {request.time} AM</Text>
          </View>
          <View style={styles.detailRow}>
            <Navigation color={COLORS.textLight} size={16} />
            <Text style={styles.detailText}>Ruta: {request.routeName || 'Personalizada'}</Text>
          </View>
        </View>

        {currentStatus === 'IN_PROGRESS' && (
          <TouchableOpacity 
            style={[styles.liveBtn, SHADOWS.medium]}
            onPress={() => navigation.navigate('LiveTracking', { requestId: request.id })}
          >
            <MapPin color={COLORS.white} size={20} />
            <Text style={styles.liveBtnText}>Rastrear en Tiempo Real</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

// ... Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: COLORS.white },
  headerTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text },
  content: { padding: 20 },
  statusCard: { backgroundColor: COLORS.white, borderRadius: 25, padding: 25, marginBottom: 20, alignItems: 'center' },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  statusText: { fontSize: 22, fontWeight: '800', color: COLORS.primary },
  statusDesc: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 20 },
  progressContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30, paddingHorizontal: 10 },
  stepItem: { alignItems: 'center', flex: 1 },
  stepDot: { width: 32, height: 32, borderRadius: 16, backgroundColor: COLORS.white, borderWidth: 2, borderColor: COLORS.divider, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  stepDotActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  stepNum: { fontSize: 12, fontWeight: '700', color: COLORS.textLight },
  stepNumActive: { color: COLORS.white },
  stepLabel: { fontSize: 10, fontWeight: '600', color: COLORS.textLight },
  stepLabelActive: { color: COLORS.text },
  walkerCard: { backgroundColor: COLORS.white, borderRadius: 20, padding: 15, marginBottom: 20 },
  walkerHeader: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: COLORS.primaryLight, justifyContent: 'center', alignItems: 'center' },
  walkerName: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  walkerMeta: { fontSize: 12, color: COLORS.textSecondary },
  phoneBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.success, justifyContent: 'center', alignItems: 'center', marginLeft: 10 },
  aiBadge: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 15, backgroundColor: COLORS.aiPurpleLight, padding: 10, borderRadius: 12 },
  aiBadgeText: { color: COLORS.aiPurple, fontSize: 12, fontWeight: '700' },
  detailsCard: { backgroundColor: COLORS.white, borderRadius: 20, padding: 20, marginBottom: 30 },
  detailTitle: { fontSize: 14, fontWeight: '800', color: COLORS.text, marginBottom: 15 },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  detailText: { fontSize: 14, color: COLORS.textSecondary },
  liveBtn: { backgroundColor: COLORS.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 20, borderRadius: 20, gap: 10 },
  liveBtnText: { color: COLORS.white, fontSize: 16, fontWeight: '800' },
});

export default WalkStatusScreen;
