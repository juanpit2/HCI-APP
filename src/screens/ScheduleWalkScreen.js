import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Alert, TextInput, ActivityIndicator } from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { ChevronLeft, Calendar as CalendarIcon, Clock, MapPin, Plus, Brain, Sparkles, Navigation, Search, CheckCircle2 } from 'lucide-react-native';
import { DOGS } from '../constants/mockData';
import { useAppContext } from '../context/AppContext';
import { suggestWalkRoute } from '../services/geminiService';

const ScheduleWalkScreen = ({ navigation, route: navRoute }) => {
  const { setWalkRequests } = useAppContext();
  const dogId = navRoute?.params?.dogId || 'dog-1';
  const dog = DOGS.find(d => d.id === dogId) || DOGS[0];

  const [selectedDate, setSelectedDate] = useState('2026-05-01');
  const [selectedTime, setSelectedTime] = useState('10:00');
  const [address, setAddress] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestedRoutes, setSuggestedRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);

  const handleGenerateRoutes = async () => {
    if (!address.trim()) {
      Alert.alert('Ubicación requerida', 'Por favor ingresa un barrio o dirección en Cali.');
      return;
    }

    setIsGenerating(true);
    const response = await suggestWalkRoute(address);
    setIsGenerating(false);

    if (response.success) {
      setSuggestedRoutes(response.data.routes);
    }
  };

  const handleConfirm = () => {
    if (!selectedRoute) {
      Alert.alert('Ruta requerida', 'Por favor selecciona una de las rutas sugeridas por la IA.');
      return;
    }

    const newRequest = {
      id: `req-${Date.now()}`,
      dogId: dog.id,
      dogName: dog.name,
      date: selectedDate,
      time: selectedTime,
      address: address,
      routeName: selectedRoute.name,
      routePoints: selectedRoute.points,
      status: 'PENDING',
      walker: null,
    };

    setWalkRequests(prev => [...prev, newRequest]);

    Alert.alert(
      '✅ Solicitud Enviada',
      `Buscando el mejor paseador para ${dog.name}. La IA ha fijado la ruta: ${selectedRoute.name}.`,
      [
        { text: 'Ver estado', onPress: () => navigation.navigate('WalkStatus', { requestId: newRequest.id }) },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronLeft color={COLORS.text} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Agendar Paseo Inteligente</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.dogHeader}>
          <View style={styles.dogAvatar}>
            <Text style={{ fontSize: 30 }}>🐕</Text>
          </View>
          <View style={{ marginLeft: 15 }}>
            <Text style={styles.dogName}>{dog.name}</Text>
            <Text style={styles.dogBreed}>{dog.breed}</Text>
          </View>
        </View>

        {/* Date & Time */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fecha y Hora</Text>
          <View style={styles.row}>
            <TouchableOpacity style={styles.dateTimeBtn}>
              <CalendarIcon color={COLORS.primary} size={18} />
              <Text style={styles.dateTimeText}>{selectedDate}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dateTimeBtn}>
              <Clock color={COLORS.primary} size={18} />
              <Text style={styles.dateTimeText}>{selectedTime} AM</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* AI Route Planner */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Planificador de Ruta IA</Text>
            <Brain color={COLORS.aiPurple} size={20} />
          </View>
          <Text style={styles.aiInfo}>Ingresa tu barrio para que la IA sugiera zonas verdes:</Text>

          <View style={styles.searchRow}>
            <TextInput
              style={styles.searchInput}
              placeholder="Ej. San Antonio, El Peñón, Pance..."
              value={address}
              onChangeText={setAddress}
            />
            <TouchableOpacity style={styles.searchBtn} onPress={handleGenerateRoutes}>
              {isGenerating ? <ActivityIndicator color={COLORS.white} /> : <Search color={COLORS.white} size={20} />}
            </TouchableOpacity>
          </View>

          {suggestedRoutes.length > 0 && (
            <View style={styles.routesContainer}>
              <Text style={styles.subtitle}>Rutas recomendadas:</Text>
              {suggestedRoutes.map((route, i) => (
                <TouchableOpacity
                  key={i}
                  style={[
                    styles.routeCard,
                    selectedRoute?.name === route.name && styles.selectedRouteCard
                  ]}
                  onPress={() => setSelectedRoute(route)}
                >
                  <View style={styles.routeHeader}>
                    <View style={styles.routeTitleRow}>
                      <Navigation color={selectedRoute?.name === route.name ? COLORS.white : COLORS.aiPurple} size={18} />
                      <Text style={[styles.routeName, selectedRoute?.name === route.name && styles.selectedText]}>{route.name}</Text>
                    </View>
                    {selectedRoute?.name === route.name && <CheckCircle2 color={COLORS.white} size={20} />}
                  </View>
                  <Text style={[styles.routeDesc, selectedRoute?.name === route.name && styles.selectedText]}>{route.desc}</Text>
                  <View style={styles.pointsList}>
                    {route.points.map((p, j) => (
                      <View key={j} style={styles.pointTag}>
                        <Text style={styles.pointText}>{p}</Text>
                      </View>
                    ))}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <TouchableOpacity
          style={[styles.confirmBtn, !selectedRoute && styles.disabledBtn]}
          onPress={handleConfirm}
          disabled={!selectedRoute}
        >
          <Text style={styles.confirmBtnText}>Confirmar Paseo</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: COLORS.white },
  headerTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text },
  content: { padding: 20 },
  dogHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 25 },
  dogAvatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: COLORS.primaryLight, justifyContent: 'center', alignItems: 'center' },
  dogName: { fontSize: 20, fontWeight: '800', color: COLORS.text },
  dogBreed: { fontSize: 14, color: COLORS.textSecondary },
  section: { marginBottom: 25 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: 12 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 },
  row: { flexDirection: 'row', gap: 10 },
  dateTimeBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, padding: 15, borderRadius: 12, ...SHADOWS.light },
  dateTimeText: { marginLeft: 10, fontSize: 14, fontWeight: '600', color: COLORS.text },
  aiInfo: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 15 },
  searchRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  searchInput: { flex: 1, backgroundColor: COLORS.white, padding: 15, borderRadius: 15, ...SHADOWS.light },
  searchBtn: { width: 55, height: 55, backgroundColor: COLORS.aiPurple, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  routesContainer: { gap: 15 },
  subtitle: { fontSize: 14, fontWeight: '700', color: COLORS.text, marginBottom: 5 },
  routeCard: { backgroundColor: COLORS.white, borderRadius: 20, padding: 15, ...SHADOWS.light, borderWidth: 1, borderColor: COLORS.divider },
  selectedRouteCard: { backgroundColor: COLORS.aiPurple, borderColor: COLORS.aiPurple },
  routeHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  routeTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  routeName: { fontSize: 15, fontWeight: '800', color: COLORS.text },
  routeDesc: { fontSize: 12, color: COLORS.textSecondary, marginBottom: 12, lineHeight: 18 },
  selectedText: { color: COLORS.white },
  pointsList: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  pointTag: { backgroundColor: COLORS.background, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  pointText: { fontSize: 10, fontWeight: '600', color: COLORS.textSecondary },
  confirmBtn: { backgroundColor: COLORS.primary, padding: 18, borderRadius: 15, alignItems: 'center', ...SHADOWS.medium, marginTop: 20 },
  confirmBtnText: { color: COLORS.primaryLight, fontSize: 16, fontWeight: '800' },
  disabledBtn: { backgroundColor: COLORS.greyLight, opacity: 0.6 },
});

export default ScheduleWalkScreen;
