import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image, Modal, TextInput, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { ArrowUpLeft, Clock, MapPin, PhoneCall, MessageCircle, Navigation, X, Route, Send } from 'lucide-react-native';
import { DOGS, OWNERS, SHELTERS } from '../constants/mockData';

const { width, height } = Dimensions.get('window');

const LiveTrackingScreen = ({ navigation, route }) => {
  const dogId = route?.params?.dogId || 'dog-1';
  const initialPhase = route?.params?.phase || 'walk'; // 'pickup' or 'walk'

  const dog = DOGS.find(d => d.id === dogId) || DOGS[0];
  const dogLocation = OWNERS.find(o => o.id === dog.ownerId)?.location || SHELTERS.find(s => s.id === dog.shelterId)?.location || { latitude: 3.4422, longitude: -76.5391 };

  const [phase, setPhase] = useState(initialPhase);
  const [walkerPos, setWalkerPos] = useState(dogLocation);
  const [progress, setProgress] = useState(0.0);
  const [userLocation, setUserLocation] = useState(null);
  
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        let loc = await Location.getCurrentPositionAsync({});
        setUserLocation(loc.coords);
        if (initialPhase === 'pickup') {
          setWalkerPos(loc.coords);
        }
      }
    })();
  }, [initialPhase]);

  // Chat States
  const [showChat, setShowChat] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { id: '1', text: 'Hola, ya estoy cerca del punto de recogida.', sender: 'me', time: '10:00 AM' },
    { id: '2', text: '¡Perfecto! Te espero en la puerta.', sender: 'owner', time: '10:02 AM' },
  ]);
  const flatListRef = useRef(null);

  // Mock Route for Pickup (Real User Location -> Dog's House)
  const pickupCoordinates = [
    userLocation || walkerPos, 
    dogLocation, // Dog's House
  ];

  // Mock Route for Walk (Dog's House -> Park -> Dog's House)
  const walkCoordinates = [
    dogLocation, // Start (Dog's House)
    { latitude: dogLocation.latitude - 0.0015, longitude: dogLocation.longitude + 0.001 },
    { latitude: dogLocation.latitude - 0.003, longitude: dogLocation.longitude + 0.002 }, // Park
  ];

  const currentCoordinates = phase === 'pickup' ? pickupCoordinates : walkCoordinates;

  // Simulación de movimiento del paseador hacia el objetivo
  useEffect(() => {
    const interval = setInterval(() => {
      setWalkerPos(prev => {
        let targetLat = dogLocation.latitude;
        let targetLng = dogLocation.longitude;
        
        if (phase === 'walk') {
           // Si está en paseo, el objetivo es el parque simulado
           targetLat = dogLocation.latitude - 0.003; 
           targetLng = dogLocation.longitude + 0.002;
        }

        const latDiff = targetLat - prev.latitude;
        const lngDiff = targetLng - prev.longitude;
        
        // Moverse un 10% de la distancia restante por cada tick para simular desplazamiento rápido
        return {
          latitude: prev.latitude + (latDiff * 0.1) + (Math.random() - 0.5) * 0.00005,
          longitude: prev.longitude + (lngDiff * 0.1) + (Math.random() - 0.5) * 0.00005,
        };
      });
      
      if (phase === 'walk') {
        setProgress(p => Math.min(p + 0.02, 1));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [phase, dogLocation]);

  const INITIAL_REGION = {
    latitude: phase === 'pickup' ? 3.4410 : 3.4380,
    longitude: phase === 'pickup' ? -76.5380 : -76.5355,
    latitudeDelta: 0.015,
    longitudeDelta: 0.015,
  };

  const handleSendChat = () => {
    if (chatMessage.trim()) {
      setChatMessages(prev => [...prev, { id: Date.now().toString(), text: chatMessage, sender: 'me', time: 'Ahora' }]);
      setChatMessage('');
      setTimeout(() => {
        setChatMessages(prev => [...prev, { id: Date.now().toString(), text: '¡Entendido! Muchas gracias.', sender: 'owner', time: 'Ahora' }]);
      }, 1500);
    }
  };

  const handleAction = () => {
    if (phase === 'pickup') {
      setPhase('walk');
      setProgress(0); // reset progress for the actual walk
      setWalkerPos(walkCoordinates[0]); // Teleport walker to start of walk for mock
    } else {
      navigation.navigate('WalkSummary', {
        dogId: dog.id,
        duration: dog.currentRequest?.duration || 45,
        routeText: dog.currentRequest?.route || 'Parque del Perro → Parque Panamericano',
        distance: '1.2 km',
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* Map Implementation */}
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: dogLocation.latitude,
          longitude: dogLocation.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        <Polyline
          coordinates={currentCoordinates}
          strokeColor={phase === 'pickup' ? COLORS.primary : COLORS.aiPurple}
          strokeWidth={4}
          lineDashPattern={[1]}
        />
        <Marker coordinate={walkerPos} title="Tú (Paseador)">
          <View style={styles.walkerMarker}>
            <Navigation color={COLORS.white} size={16} style={{ transform: [{ rotate: '45deg' }] }} />
          </View>
        </Marker>
        <Marker coordinate={currentCoordinates[currentCoordinates.length - 1]} title="Destino">
          <View style={phase === 'pickup' ? styles.pickupMarker : styles.destinationMarker}>
            <MapPin color={COLORS.white} size={14} />
            <Text style={styles.destinationText}>
              {phase === 'pickup' ? 'Punto de recogida' : 'Parque Central'}
            </Text>
          </View>
        </Marker>
      </MapView>

      {/* Top Turn-by-Turn Navigation Overlay */}
      <SafeAreaView style={styles.topOverlay}>
        <View style={styles.topHeader}>
          <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.goBack()}>
            <X color={COLORS.text} size={20} />
          </TouchableOpacity>
        </View>

        <View style={[styles.navCard, SHADOWS.medium]}>
          <View style={styles.navInstruction}>
            <View style={[styles.directionIcon, phase === 'pickup' && { backgroundColor: COLORS.primaryLight }]}>
              {phase === 'pickup' ? (
                <Route color={COLORS.primary} size={24} />
              ) : (
                <ArrowUpLeft color={COLORS.aiPurple} size={24} />
              )}
            </View>
            <View style={styles.instructionTexts}>
              {phase === 'pickup' ? (
                <>
                  <Text style={styles.distanceText}>Fase de recogida</Text>
                  <Text style={styles.instructionText}>Dirígete al punto de recogida de {dog.name}</Text>
                </>
              ) : (
                <>
                  <Text style={styles.distanceText}>Paseo libre en curso</Text>
                  <Text style={styles.instructionText}>Recuerda volver a la casa del dueño al terminar</Text>
                </>
              )}
            </View>
          </View>
          <View style={styles.navBadges}>
            <View style={styles.navBadge}>
              <Clock color={COLORS.textSecondary} size={14} />
              <Text style={styles.badgeText}>{phase === 'pickup' ? '5 min' : '15 min'}</Text>
            </View>
            <View style={styles.navBadge}>
              <MapPin color={COLORS.textSecondary} size={14} />
              <Text style={styles.badgeText}>{phase === 'pickup' ? '400 m' : '1.2 km'}</Text>
            </View>
          </View>
        </View>
      </SafeAreaView>

      {/* Bottom Panel */}
      <View style={[styles.bottomPanel, SHADOWS.heavy]}>
        <View style={styles.dogInfoRow}>
          <Image source={{ uri: dog.photo }} style={styles.dogAvatar} />
          <View style={styles.dogInfoTexts}>
            <Text style={styles.dogName}>{dog.name}</Text>
            <Text style={styles.dogBreed}>
              {dog.breed} • {phase === 'pickup' ? 'Esperando recogida' : 'Paseo en curso'}
            </Text>
          </View>
          <View style={styles.contactIcons}>
            <TouchableOpacity style={styles.iconBtn}><PhoneCall color={COLORS.primary} size={20} /></TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn} onPress={() => setShowChat(true)}><MessageCircle color={COLORS.aiPurple} size={20} /></TouchableOpacity>
          </View>
        </View>

        {phase === 'walk' && (
          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Progreso del paseo</Text>
              <Text style={styles.progressPercent}>{Math.round(progress * 100)}% — ~{Math.max(1, Math.round((1 - progress) * (dog.currentRequest?.duration || 45)))} min</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
            </View>
          </View>
        )}

        <View style={styles.bottomActionRow}>
          <TouchableOpacity
            style={[styles.finishBtn, phase === 'pickup' && { backgroundColor: COLORS.success }, phase === 'walk' && progress < 1 && { backgroundColor: COLORS.textSecondary }]}
            onPress={handleAction}
            disabled={phase === 'walk' && progress < 1}
          >
            <Text style={styles.finishBtnText}>
              {phase === 'pickup' ? '✓ Marcar recogida' : progress < 1 ? 'Paseo en progreso...' : 'Finalizar Paseo'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sosBtn}>
            <Text style={styles.sosBtnText}>SOS</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Chat Modal */}
      <Modal visible={showChat} animationType="slide" transparent={true}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.chatModalOverlay}>
          <View style={styles.chatModalContent}>
            <View style={styles.chatHeader}>
              <View style={styles.chatHeaderLeft}>
                <Image source={{ uri: dog.photo }} style={styles.chatHeaderAvatar} />
                <View>
                  <Text style={styles.chatOwnerName}>Dueño de {dog.name}</Text>
                  <Text style={styles.chatOnline}>En línea</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.closeChatBtn} onPress={() => setShowChat(false)}>
                <X color={COLORS.textSecondary} size={24} />
              </TouchableOpacity>
            </View>

            <FlatList
              ref={flatListRef}
              data={chatMessages}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.chatList}
              onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
              renderItem={({ item }) => (
                <View style={[styles.chatBubble, item.sender === 'me' ? styles.myBubble : styles.ownerBubble]}>
                  <Text style={[styles.chatText, item.sender === 'me' && styles.myText]}>{item.text}</Text>
                  <Text style={[styles.chatTime, item.sender === 'me' && styles.myTime]}>{item.time}</Text>
                </View>
              )}
            />

            <View style={styles.chatInputContainer}>
              <TextInput
                style={styles.chatInput}
                placeholder="Escribe un mensaje..."
                value={chatMessage}
                onChangeText={setChatMessage}
              />
              <TouchableOpacity style={styles.chatSendBtn} onPress={handleSendChat}>
                <Send color={COLORS.white} size={18} />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width, height },

  walkerMarker: { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.text, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: COLORS.white, ...SHADOWS.light },
  destinationMarker: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.aiPurple, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, borderWidth: 2, borderColor: COLORS.white, ...SHADOWS.light },
  pickupMarker: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.primary, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, borderWidth: 2, borderColor: COLORS.white, ...SHADOWS.light },
  destinationText: { color: COLORS.white, fontSize: 12, fontWeight: '700', marginLeft: 4 },

  topOverlay: { position: 'absolute', top: 0, left: 0, right: 0, paddingHorizontal: 20 },
  topHeader: { flexDirection: 'row', justifyContent: 'flex-start', marginTop: 10, marginBottom: 10 },
  closeBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.white, justifyContent: 'center', alignItems: 'center', ...SHADOWS.light },

  navCard: { backgroundColor: COLORS.white, borderRadius: 25, padding: 20 },
  navInstruction: { flexDirection: 'row', alignItems: 'center' },
  directionIcon: { width: 46, height: 46, borderRadius: 23, backgroundColor: COLORS.aiPurpleLight, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  instructionTexts: { flex: 1 },
  distanceText: { fontSize: 12, color: COLORS.textSecondary, fontWeight: '600' },
  instructionText: { fontSize: 15, fontWeight: '800', color: COLORS.text, marginTop: 2 },
  navBadges: { flexDirection: 'row', gap: 15, marginTop: 15 },
  navBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.background, paddingHorizontal: 15, paddingVertical: 8, borderRadius: 15, gap: 6 },
  badgeText: { fontSize: 13, fontWeight: '700', color: COLORS.text },

  bottomPanel: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: COLORS.white, borderTopLeftRadius: 35, borderTopRightRadius: 35, padding: 25, paddingBottom: 40 },
  dogInfoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 25 },
  dogAvatar: { width: 55, height: 55, borderRadius: 27, backgroundColor: COLORS.greyLight },
  dogInfoTexts: { flex: 1, marginLeft: 15 },
  dogName: { fontSize: 18, fontWeight: '800', color: COLORS.text },
  dogBreed: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  contactIcons: { flexDirection: 'row', gap: 10 },
  iconBtn: { width: 45, height: 45, borderRadius: 22.5, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center' },

  progressSection: { marginBottom: 25 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  progressLabel: { fontSize: 12, fontWeight: '700', color: COLORS.textSecondary },
  progressPercent: { fontSize: 12, fontWeight: '800', color: COLORS.aiPurple },
  progressBarBg: { height: 6, backgroundColor: COLORS.aiPurpleLight, borderRadius: 3 },
  progressBarFill: { height: '100%', backgroundColor: COLORS.aiPurple, borderRadius: 3 },

  finishBtn: { flex: 1, backgroundColor: COLORS.aiPurple, paddingVertical: 18, borderRadius: 20, alignItems: 'center', ...SHADOWS.medium },
  finishBtnText: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
  bottomActionRow: { flexDirection: 'row', gap: 10, marginTop: 5 },
  sosBtn: { backgroundColor: '#FF3B30', width: 60, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  sosBtnText: { color: COLORS.white, fontWeight: '800', fontSize: 14 },

  chatModalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  chatModalContent: { backgroundColor: COLORS.white, borderTopLeftRadius: 30, borderTopRightRadius: 30, height: height * 0.7, paddingBottom: 30, ...SHADOWS.heavy },
  chatHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, borderBottomWidth: 1, borderBottomColor: COLORS.divider },
  chatHeaderLeft: { flexDirection: 'row', alignItems: 'center' },
  chatHeaderAvatar: { width: 40, height: 40, borderRadius: 20, marginRight: 15 },
  chatOwnerName: { fontSize: 16, fontWeight: '800', color: COLORS.text },
  chatOnline: { fontSize: 12, color: COLORS.success, fontWeight: '600' },
  closeChatBtn: { padding: 5 },
  chatList: { padding: 20 },
  chatBubble: { maxWidth: '80%', padding: 15, borderRadius: 20, marginBottom: 15 },
  myBubble: { alignSelf: 'flex-end', backgroundColor: COLORS.aiPurple, borderBottomRightRadius: 5 },
  ownerBubble: { alignSelf: 'flex-start', backgroundColor: COLORS.background, borderBottomLeftRadius: 5 },
  chatText: { fontSize: 15, color: COLORS.text, lineHeight: 22 },
  myText: { color: COLORS.white },
  chatTime: { fontSize: 11, color: COLORS.textSecondary, marginTop: 5, alignSelf: 'flex-end' },
  myTime: { color: 'rgba(255,255,255,0.7)' },
  chatInputContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10 },
  chatInput: { flex: 1, backgroundColor: COLORS.background, borderRadius: 25, paddingHorizontal: 20, paddingVertical: 12, fontSize: 15, marginRight: 10 },
  chatSendBtn: { width: 45, height: 45, borderRadius: 22.5, backgroundColor: COLORS.aiPurple, justifyContent: 'center', alignItems: 'center' },
});

export default LiveTrackingScreen;
