import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TextInput, TouchableOpacity, Image, Modal, ScrollView, Animated } from 'react-native';
import MapView, { Marker, Circle, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { Search, Sparkles, MapPin, Clock, DollarSign, X, Star, TrendingUp, PhoneCall, MessageCircle, CheckCircle2 } from 'lucide-react-native';
import { DOGS, OWNERS, SHELTERS, addPendingRequest } from '../constants/mockData';

const { width, height } = Dimensions.get('window');

const ExploreScreen = ({ navigation, route }) => {
  const [selectedDog, setSelectedDog] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const mapRef = React.useRef(null);

  // Pedir permisos de ubicación al inicio
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permiso de ubicación denegado');
        return;
      }
      // Opcional: centrar el mapa en el usuario si no hay zona sugerida
      if (!route?.params?.selectedDogId && !route?.params?.dogIds) {
        let location = await Location.getCurrentPositionAsync({});
        if (mapRef.current) {
          mapRef.current.animateToRegion({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }, 1000);
        }
      }
    })();
  }, []);

  // Usar ubicaciones reales de los dueños/refugios
  const [mapDogs] = useState(() => 
    DOGS.map((dog) => {
      const shelter = SHELTERS.find(s => s.id === dog.shelterId);
      const owner = OWNERS.find(o => o.id === dog.ownerId);
      // Pequeña variación si hay varios en el mismo refugio para que no se solapen exactamente los pines
      const randomOffsetLat = (Math.random() - 0.5) * 0.001; 
      const randomOffsetLng = (Math.random() - 0.5) * 0.001;
      
      const baseLocation = shelter?.location || owner?.location || { latitude: 3.4516, longitude: -76.5320 };
      
      return {
        ...dog,
        location: {
          latitude: baseLocation.latitude + randomOffsetLat,
          longitude: baseLocation.longitude + randomOffsetLng
        }
      };
    })
  );

  const recommendedZona = route?.params?.zona;
  const recommendedDogIds = route?.params?.dogIds;

  // Render a specific zone or select a dog on load
  useEffect(() => {
    if (recommendedDogIds && recommendedDogIds.length > 0) {
      const firstDog = mapDogs.find(d => d.id === recommendedDogIds[0]);

      if (firstDog) {
        // If there's only 1 dog and no explicit multi-zone logic was asked, select the dog.
        // But if there's a zone or multiple dogs, we just zoom to the zone.
        if (recommendedDogIds.length === 1 && !recommendedZona) {
          setSelectedDog(firstDog);
          setTimeout(() => {
            if (mapRef.current) {
              mapRef.current.animateToRegion({
                latitude: firstDog.location.latitude - 0.005,
                longitude: firstDog.location.longitude,
                latitudeDelta: 0.02,
                longitudeDelta: 0.02,
              }, 1500);
            }
          }, 500);
        } else {
          // It's a zone with multiple dogs. Center the map but don't select a dog.
          setTimeout(() => {
            if (mapRef.current) {
              mapRef.current.animateToRegion({
                latitude: firstDog.location.latitude,
                longitude: firstDog.location.longitude,
                latitudeDelta: 0.025,
                longitudeDelta: 0.025,
              }, 1500);
            }
          }, 500); // give the map time to render
        }
      }
    }
  }, [recommendedDogIds, recommendedZona]);

  const handleRequestWalk = () => {
    if (selectedDog) {
      const ownerOrShelterAddress = OWNERS.find(o => o.id === selectedDog.ownerId)?.address || SHELTERS.find(s => s.id === selectedDog.shelterId)?.address || 'Cali';
      const finalZona = recommendedZona || ownerOrShelterAddress;
      
      addPendingRequest({
        ...selectedDog,
        requestId: `req-${Date.now()}`, // unique ID for the request
        walkDate: selectedDog.currentRequest?.date || 'Hoy',
        walkTime: selectedDog.currentRequest?.time || 'Flexible',
        walkRoute: selectedDog.currentRequest?.route || `Ruta sugerida por ${finalZona}`,
        pickup: finalZona, // Real text string for pickup
      });
    }
    setSelectedDog(null);
    setShowSuccessModal(true);
  };

  const initialRegion = {
    latitude: 3.4516,
    longitude: -76.5320,
    latitudeDelta: 0.06,
    longitudeDelta: 0.06,
  };

  return (
    <View style={styles.container}>
      {/* Full Screen Map */}
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {/* Draw a highlighted zone if recommended by AI */}
        {recommendedZona && recommendedDogIds?.length > 0 && mapDogs.find(d => d.id === recommendedDogIds[0]) && (
          <Circle
            center={mapDogs.find(d => d.id === recommendedDogIds[0]).location}
            radius={1000} // 1000 meters radius
            fillColor={`${COLORS.aiPurple}33`} // 20% opacity purple
            strokeColor={COLORS.aiPurple}
            strokeWidth={2}
          />
        )}
        {mapDogs.map(dog => (
          <Marker
            key={dog.id}
            coordinate={dog.location}
            onPress={() => setSelectedDog(dog)}
          >
            <View style={styles.markerContainer}>
              <Image source={{ uri: dog.photo }} style={styles.markerImage} />
              {dog.daysSinceLastWalk >= 3 && <View style={styles.urgentDot} />}
            </View>
            <Text style={styles.markerName}>{dog.name}</Text>
          </Marker>
        ))}
      </MapView>

      {/* Top Search Bar */}
      <View style={styles.topContainer}>
        <View style={styles.searchBar}>
          <Search color={COLORS.textSecondary} size={20} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar zona..."
            placeholderTextColor={COLORS.textSecondary}
          />
        </View>
      </View>

      {/* Bottom AI Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.aiButton}
          onPress={() => navigation.navigate('AIFindWalk')}
        >
          <Sparkles color={COLORS.white} size={20} />
          <Text style={styles.aiButtonText}>Encontrar paseos con IA</Text>
        </TouchableOpacity>
      </View>

      {/* Dog Detail Bottom Sheet (Modal) */}
      <Modal
        visible={!!selectedDog}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          {selectedDog && (
            <View style={styles.bottomSheet}>
              {/* Image Header */}
              <View style={styles.sheetHeaderImageContainer}>
                <Image source={{ uri: selectedDog.photo }} style={styles.sheetImage} />
                <TouchableOpacity style={styles.closeBtn} onPress={() => setSelectedDog(null)}>
                  <X color={COLORS.white} size={20} />
                </TouchableOpacity>
                <View style={styles.sheetImageOverlay}>
                  <Text style={styles.sheetDogName}>{selectedDog.name}</Text>
                  <Text style={styles.sheetDogBreed}>{selectedDog.breed} • {selectedDog.age} años</Text>
                </View>
              </View>

              <ScrollView contentContainerStyle={styles.sheetContent}>
                {/* Compatibility Card */}
                <View style={styles.compatibilityCard}>
                  <View style={styles.compLeft}>
                    <View style={styles.compIconBg}>
                      <TrendingUp color={COLORS.aiPurple} size={20} />
                    </View>
                    <View>
                      <Text style={styles.compTitle}>Compatibilidad</Text>
                      <Text style={styles.compValue}>95%</Text>
                    </View>
                  </View>
                  <View style={styles.starsRow}>
                    {[1, 2, 3, 4, 5].map(i => <Star key={i} color="#FFD700" fill="#FFD700" size={16} />)}
                  </View>
                </View>

                {/* Details Grid */}
                <View style={styles.detailsList}>
                  <View style={styles.detailItem}>
                    <MapPin color={COLORS.primary} size={20} />
                    <View style={styles.detailTextContainer}>
                      <Text style={styles.detailLabel}>Ubicación y ruta</Text>
                      <Text style={styles.detailValue}>{selectedDog.currentRequest?.route || 'Ruta libre por el barrio'}</Text>
                    </View>
                  </View>
                  <View style={styles.detailItem}>
                    <Clock color={COLORS.success} size={20} />
                    <View style={styles.detailTextContainer}>
                      <Text style={styles.detailLabel}>Fecha y Hora</Text>
                      <Text style={styles.detailValue}>{selectedDog.currentRequest?.date || 'Hoy'} • {selectedDog.currentRequest?.time || 'Flexible'}</Text>
                    </View>
                  </View>
                  <View style={styles.detailItem}>
                    <DollarSign color={COLORS.aiPurple} size={20} />
                    <View style={styles.detailTextContainer}>
                      <Text style={styles.detailLabel}>Duración / Pago</Text>
                      <Text style={styles.detailValue}>{selectedDog.currentRequest?.duration || selectedDog.walkDurationPreferred || 45} min • $15.000</Text>
                    </View>
                  </View>
                </View>

                {/* Owner Info */}
                <View style={styles.ownerCard}>
                  <View style={styles.ownerAvatar}>
                    <Text style={styles.ownerInitial}>
                      {(OWNERS.find(o => o.id === selectedDog?.ownerId)?.name || SHELTERS.find(s => s.id === selectedDog?.shelterId)?.name || 'D').charAt(0)}
                    </Text>
                  </View>
                  <View style={styles.ownerInfoText}>
                    <Text style={styles.ownerLabel}>{selectedDog?.ownerId ? 'Dueño' : 'Refugio'}</Text>
                    <Text style={styles.ownerName}>
                      {OWNERS.find(o => o.id === selectedDog?.ownerId)?.name || SHELTERS.find(s => s.id === selectedDog?.shelterId)?.name || 'Desconocido'}
                    </Text>
                  </View>
                  <View style={styles.ownerContactRow}>
                    <TouchableOpacity style={styles.iconBtn}><PhoneCall color={COLORS.primary} size={18} /></TouchableOpacity>
                    <TouchableOpacity style={styles.iconBtn}><MessageCircle color={COLORS.aiPurple} size={18} /></TouchableOpacity>
                  </View>
                </View>

                {/* View Full Profile */}
                <TouchableOpacity
                  style={styles.viewProfileBtn}
                  onPress={() => {
                    const dogId = selectedDog.id;
                    setSelectedDog(null);
                    navigation.navigate('DogProfile', { dogId });
                  }}
                >
                  <Text style={styles.viewProfileText}>Ver perfil completo →</Text>
                </TouchableOpacity>

                {/* Actions */}
                <View style={styles.sheetActions}>
                  <TouchableOpacity style={styles.cancelBtn} onPress={() => setSelectedDog(null)}>
                    <Text style={styles.cancelBtnText}>Cancelar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.requestBtn} onPress={handleRequestWalk}>
                    <Text style={styles.requestBtnText}>Solicitar paseo</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          )}
        </View>
      </Modal>

      {/* Success Modal */}
      <Modal visible={showSuccessModal} transparent animationType="fade">
        <View style={styles.successModalOverlay}>
          <View style={[styles.successModalContent, SHADOWS.medium]}>
            <View style={styles.successIconBg}>
              <CheckCircle2 color={COLORS.white} size={40} />
            </View>
            <Text style={styles.successModalTitle}>¡Solicitud Enviada!</Text>
            <Text style={styles.successModalText}>El dueño recibirá tu solicitud en breve. Puedes darle seguimiento desde la pestaña Actividad.</Text>

            <TouchableOpacity
              style={styles.successModalBtnPrimary}
              onPress={() => {
                setShowSuccessModal(false);
                navigation.navigate('Actividad');
              }}
            >
              <Text style={styles.successModalBtnText}>Ir a Actividad</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.successModalBtnSecondary}
              onPress={() => setShowSuccessModal(false)}
            >
              <Text style={styles.successModalBtnTextSecondary}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width, height },

  markerContainer: { width: 50, height: 50, borderRadius: 25, borderWidth: 3, borderColor: COLORS.white, overflow: 'hidden', ...SHADOWS.medium },
  markerImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  urgentDot: { position: 'absolute', top: 0, right: 0, width: 12, height: 12, borderRadius: 6, backgroundColor: COLORS.warning, borderWidth: 2, borderColor: COLORS.white },
  markerName: { backgroundColor: COLORS.white, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, fontSize: 10, fontWeight: '700', marginTop: 5, overflow: 'hidden', textAlign: 'center' },

  topContainer: { position: 'absolute', top: 50, left: 20, right: 20, zIndex: 10 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: 25, paddingHorizontal: 20, paddingVertical: 12, ...SHADOWS.medium },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 15, color: COLORS.text },

  bottomContainer: { position: 'absolute', bottom: 100, left: 20, right: 20, zIndex: 10 },
  aiButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.aiPurple, paddingVertical: 18, borderRadius: 25, ...SHADOWS.heavy },
  aiButtonText: { color: COLORS.white, fontSize: 16, fontWeight: '800', marginLeft: 10 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  bottomSheet: { backgroundColor: COLORS.background, borderTopLeftRadius: 30, borderTopRightRadius: 30, overflow: 'hidden', height: height * 0.8 },

  sheetHeaderImageContainer: { height: 250, position: 'relative' },
  sheetImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  closeBtn: { position: 'absolute', top: 20, right: 20, width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  sheetImageOverlay: { position: 'absolute', bottom: 20, left: 20 },
  sheetDogName: { color: COLORS.white, fontSize: 28, fontWeight: '800', textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 4 },
  sheetDogBreed: { color: COLORS.white, fontSize: 14, fontWeight: '600', marginTop: 5, textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 },

  sheetContent: { padding: 20, paddingBottom: 40 },

  compatibilityCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: 20, padding: 20, marginBottom: 20, ...SHADOWS.light },
  compLeft: { flexDirection: 'row', alignItems: 'center' },
  compIconBg: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.aiPurpleLight, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  compTitle: { fontSize: 12, color: COLORS.textSecondary },
  compValue: { fontSize: 18, fontWeight: '800', color: COLORS.aiPurple },
  starsRow: { flexDirection: 'row', gap: 4 },

  detailsList: { marginBottom: 20 },
  detailItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  detailTextContainer: { marginLeft: 15 },
  detailLabel: { fontSize: 12, color: COLORS.textSecondary },
  detailValue: { fontSize: 14, fontWeight: '700', color: COLORS.text, marginTop: 2 },

  ownerCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: 20, padding: 15, marginBottom: 30, ...SHADOWS.light },
  ownerAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.aiPurple, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  ownerInitial: { color: COLORS.white, fontSize: 18, fontWeight: '800' },
  ownerInfoText: { flex: 1 },
  ownerLabel: { fontSize: 12, color: COLORS.textSecondary },
  ownerName: { fontSize: 15, fontWeight: '800', color: COLORS.text, marginTop: 2 },
  ownerContactRow: { flexDirection: 'row', gap: 8 },
  iconBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center' },

  viewProfileBtn: { alignItems: 'center', paddingVertical: 12 },
  viewProfileText: { fontSize: 14, fontWeight: '700', color: COLORS.aiPurple },

  sheetActions: { flexDirection: 'row', gap: 15 },
  cancelBtn: { flex: 1, backgroundColor: COLORS.white, paddingVertical: 18, borderRadius: 20, alignItems: 'center', ...SHADOWS.light },
  cancelBtnText: { color: COLORS.text, fontSize: 16, fontWeight: '700' },
  requestBtn: { flex: 1, backgroundColor: COLORS.aiPurple, paddingVertical: 18, borderRadius: 20, alignItems: 'center', ...SHADOWS.light },
  requestBtnText: { color: COLORS.white, fontSize: 16, fontWeight: '800' },

  successModalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  successModalContent: { backgroundColor: COLORS.white, borderRadius: 30, padding: 30, alignItems: 'center', width: '100%' },
  successIconBg: { width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.success, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  successModalTitle: { fontSize: 22, fontWeight: '800', color: COLORS.text, marginBottom: 10 },
  successModalText: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', marginBottom: 30, lineHeight: 20 },
  successModalBtnPrimary: { backgroundColor: COLORS.aiPurple, width: '100%', paddingVertical: 18, borderRadius: 20, alignItems: 'center', marginBottom: 15 },
  successModalBtnText: { color: COLORS.white, fontSize: 16, fontWeight: '800' },
  successModalBtnSecondary: { width: '100%', paddingVertical: 15, borderRadius: 20, alignItems: 'center' },
  successModalBtnTextSecondary: { color: COLORS.textSecondary, fontSize: 16, fontWeight: '700' },
});

export default ExploreScreen;
