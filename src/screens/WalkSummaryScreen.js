import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Polyline, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { CheckCircle2, Clock, MapPin, Activity, Heart, Star } from 'lucide-react-native';

import { DOGS } from '../constants/mockData';

const WalkSummaryScreen = ({ navigation, route }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const dogId = route?.params?.dogId;
  const dog = DOGS.find(d => d.id === dogId) || DOGS[0];
  const duration = route?.params?.duration || 45;
  const distance = route?.params?.distance || '1.2 km';

  // Mock Route for the mini map
  const routeCoordinates = [
    { latitude: 3.4422, longitude: -76.5391 }, // Inicio
    { latitude: 3.4435, longitude: -76.5400 },
    { latitude: 3.4452, longitude: -76.5421 }, // Fin
  ];

  const mapRegion = {
    latitude: 3.4437,
    longitude: -76.5406,
    latitudeDelta: 0.015,
    longitudeDelta: 0.015,
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Header Success */}
        <View style={styles.header}>
          <View style={styles.successIconBg}>
            <CheckCircle2 color={COLORS.white} size={40} />
          </View>
          <Text style={styles.title}>¡Paseo Completado!</Text>
          <Text style={styles.subtitle}>{dog.name} tuvo un día increíble</Text>
        </View>

        {/* Resumen del Recorrido */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <Activity color={COLORS.aiPurple} size={18} />
            <Text style={styles.sectionTitle}>Resumen del Recorrido</Text>
          </View>

          <View style={[styles.statsGrid, SHADOWS.light]}>
            <View style={styles.statBox}>
              <Clock color={COLORS.primary} size={24} />
              <Text style={styles.statValue}>{duration}:00</Text>
              <Text style={styles.statLabel}>TIEMPO</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <MapPin color={COLORS.success} size={24} />
              <Text style={styles.statValue}>{distance}</Text>
              <Text style={styles.statLabel}>DISTANCIA</Text>
            </View>
            <View style={styles.statDividerHorizontal} />
            <View style={styles.statDividerHorizontal2} />
            <View style={styles.statBox}>
              <Activity color={COLORS.warning} size={24} />
              <Text style={styles.statValue}>24 m/km</Text>
              <Text style={styles.statLabel}>RITMO</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Heart color={COLORS.error} size={24} />
              <Text style={styles.statValue}>82 lpm</Text>
              <Text style={styles.statLabel}>SALUD</Text>
            </View>
          </View>
        </View>

        {/* Ruta Recorrida (Mini Mapa Real) */}
        <View style={[styles.mapSection, SHADOWS.light]}>
          <View style={styles.sectionTitleRow}>
            <MapPin color={COLORS.aiPurple} size={18} />
            <Text style={styles.sectionTitle}>Ruta Recorrida</Text>
          </View>
          
          <View style={styles.miniMapContainer}>
            <MapView
              provider={PROVIDER_GOOGLE}
              style={styles.map}
              initialRegion={mapRegion}
              scrollEnabled={false}
              zoomEnabled={false}
            >
              <Polyline 
                coordinates={routeCoordinates}
                strokeColor={COLORS.aiPurple}
                strokeWidth={4}
                lineDashPattern={[1]}
              />
              <Marker coordinate={routeCoordinates[0]}>
                <View style={[styles.mapDot, { backgroundColor: COLORS.success }]} />
              </Marker>
              <Marker coordinate={routeCoordinates[2]}>
                <View style={[styles.mapDot, { backgroundColor: COLORS.primary }]} />
              </Marker>
            </MapView>
          </View>
          
          <View style={styles.mapLabels}>
            <Text style={styles.mapLabelText}>Inicio: Casa</Text>
            <Text style={styles.mapLabelText}>Fin: Parque Central</Text>
          </View>
        </View>

        {/* Calificación */}
        <View style={[styles.ratingSection, SHADOWS.light]}>
          <Text style={styles.ratingTitle}>Califica tu experiencia</Text>
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map(star => (
              <TouchableOpacity key={star} onPress={() => setRating(star)}>
                <Star 
                  color={star <= rating ? "#FFD700" : COLORS.divider} 
                  fill={star <= rating ? "#FFD700" : "transparent"} 
                  size={32} 
                />
              </TouchableOpacity>
            ))}
          </View>
          <TextInput 
            style={styles.commentInput}
            placeholder="Comparte tus comentarios... (opcional)"
            placeholderTextColor={COLORS.textSecondary}
            multiline
            value={comment}
            onChangeText={setComment}
          />
        </View>

      </ScrollView>

      {/* Volver al inicio Btn */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.homeBtn}
          onPress={() => navigation.navigate('Main')}
        >
          <Text style={styles.homeBtnText}>✓ Volver al inicio</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 20, paddingBottom: 100 },
  
  header: { alignItems: 'center', marginTop: 30, marginBottom: 40 },
  successIconBg: { width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.success, justifyContent: 'center', alignItems: 'center', marginBottom: 20, ...SHADOWS.medium },
  title: { fontSize: 24, fontWeight: '800', color: COLORS.text, marginBottom: 5 },
  subtitle: { fontSize: 14, color: COLORS.textSecondary },

  section: { marginBottom: 30 },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15, gap: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: COLORS.text },

  statsGrid: { backgroundColor: COLORS.white, borderRadius: 25, padding: 20, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', position: 'relative' },
  statBox: { width: '48%', alignItems: 'center', paddingVertical: 15 },
  statValue: { fontSize: 18, fontWeight: '800', color: COLORS.text, marginTop: 10 },
  statLabel: { fontSize: 10, color: COLORS.textSecondary, marginTop: 4, letterSpacing: 1 },
  statDivider: { position: 'absolute', left: '50%', top: 20, bottom: 20, width: 1, backgroundColor: COLORS.divider },
  statDividerHorizontal: { width: '100%', height: 1, backgroundColor: COLORS.divider, marginVertical: 5 },
  statDividerHorizontal2: { position: 'absolute', top: '50%', left: 20, right: 20, height: 1, backgroundColor: COLORS.divider }, // For visual centering

  mapSection: { backgroundColor: COLORS.white, borderRadius: 25, padding: 20, marginBottom: 30 },
  miniMapContainer: { width: '100%', height: 120, borderRadius: 15, overflow: 'hidden', marginBottom: 15 },
  map: { width: '100%', height: '100%' },
  mapDot: { width: 14, height: 14, borderRadius: 7, borderWidth: 2, borderColor: COLORS.white, ...SHADOWS.light },
  mapLabels: { flexDirection: 'row', justifyContent: 'space-between' },
  mapLabelText: { fontSize: 12, color: COLORS.textSecondary, fontWeight: '600' },

  ratingSection: { backgroundColor: COLORS.white, borderRadius: 25, padding: 20, marginBottom: 20 },
  ratingTitle: { fontSize: 16, fontWeight: '800', color: COLORS.text, marginBottom: 15 },
  starsRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  commentInput: { backgroundColor: COLORS.background, borderRadius: 15, padding: 15, height: 100, textAlignVertical: 'top', color: COLORS.text },

  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: COLORS.background, padding: 20, paddingTop: 10 },
  homeBtn: { backgroundColor: COLORS.aiPurple, paddingVertical: 18, borderRadius: 20, alignItems: 'center', ...SHADOWS.medium },
  homeBtnText: { color: COLORS.white, fontSize: 16, fontWeight: '800' },
});

export default WalkSummaryScreen;
