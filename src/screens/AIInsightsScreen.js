import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { ChevronLeft, Brain, Sparkles, TrendingUp, Target, Zap, Heart, Dog, Smile, Activity, Users, Home } from 'lucide-react-native';
import { CURRENT_USER, DOGS } from '../constants/mockData';
import { generateAIInsights, getRecommendedDogs, getRadarData, predictWalkImpact } from '../services/aiMatchingEngine';
import RadarChart from '../components/RadarChart';

const AIInsightsScreen = ({ navigation }) => {
  const insights = generateAIInsights(CURRENT_USER);
  const recommendations = getRecommendedDogs(CURRENT_USER);
  const topDog = recommendations[0];
  const radarData = topDog ? getRadarData(CURRENT_USER, topDog) : [];
  const impact = topDog ? predictWalkImpact(topDog) : null;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <ChevronLeft color={COLORS.text} size={24} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Brain color={COLORS.aiPurple} size={20} />
            <Text style={styles.headerTitle}>Análisis de IA</Text>
          </View>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.content}>
          {/* AI Status */}
          <View style={styles.aiStatusHeader}>
            <View style={styles.aiStatusBadge}>
              <Sparkles color={COLORS.aiPurple} size={16} />
              <Text style={styles.aiStatusText}>IA Activa</Text>
            </View>
            <Text style={styles.aiStatusDesc}>Analizando {DOGS.length} perfiles en tiempo real</Text>
          </View>

          {/* Top Match Radar */}
          {topDog && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Target color={COLORS.primary} size={18} />
                <Text style={styles.sectionTitle}>Tu mejor compatibilidad</Text>
              </View>

              <View style={[styles.radarCard, SHADOWS.light]}>
                <View style={styles.topMatchInfo}>
                  <View style={styles.topMatchAvatar}>
                    <Dog color={COLORS.primary} size={36} />
                  </View>
                  <View style={{ flex: 1, marginLeft: SIZES.medium }}>
                    <Text style={styles.topMatchName}>{topDog.name}</Text>
                    <Text style={styles.topMatchBreed}>{topDog.breed}</Text>
                    <View style={styles.topMatchScore}>
                      <Text style={styles.topMatchScoreValue}>{topDog.matchScore}%</Text>
                      <Text style={styles.topMatchScoreLabel}> compatibilidad</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.radarContainer}>
                  <RadarChart data={radarData} size={220} color={COLORS.primary} />
                </View>

                {/* Match Breakdown */}
                <View style={styles.breakdownContainer}>
                  <Text style={styles.breakdownTitle}>Desglose del score</Text>
                  {Object.values(topDog.matchBreakdown).map((factor, i) => (
                    <View key={i} style={styles.breakdownItem}>
                      <Text style={styles.breakdownLabel}>{factor.label}</Text>
                      <View style={styles.breakdownBarBg}>
                        <View style={[styles.breakdownBarFill, { 
                          width: `${factor.score}%`,
                          backgroundColor: factor.score >= 70 ? COLORS.primary : factor.score >= 40 ? COLORS.warning : COLORS.error 
                        }]} />
                      </View>
                      <Text style={styles.breakdownValue}>{factor.score}%</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          )}

          {/* Predicted Impact */}
          {impact && topDog && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <TrendingUp color={COLORS.success} size={18} />
                <Text style={styles.sectionTitle}>Impacto predicho</Text>
              </View>
              <Text style={styles.predictionSubtitle}>
                Si paseas a {topDog.name} hoy, la IA predice:
              </Text>

              <View style={styles.cleanImpactList}>
                <View style={styles.cleanImpactRow}>
                  <Smile color={COLORS.textSecondary} size={20} />
                  <Text style={styles.cleanImpactText}>Reduce el estrés un <Text style={{color: COLORS.success, fontWeight: '700'}}>{impact.stressReduction}%</Text></Text>
                </View>
                <View style={styles.cleanImpactRow}>
                  <Activity color={COLORS.textSecondary} size={20} />
                  <Text style={styles.cleanImpactText}>Mejora salud en <Text style={{color: COLORS.info, fontWeight: '700'}}>{impact.healthImprovement}%</Text></Text>
                </View>
                <View style={styles.cleanImpactRow}>
                  <Users color={COLORS.textSecondary} size={20} />
                  <Text style={styles.cleanImpactText}>Aumenta socialización en <Text style={{color: COLORS.secondary, fontWeight: '700'}}>{impact.socializationBoost}%</Text></Text>
                </View>
                <View style={styles.cleanImpactRow}>
                  <Home color={COLORS.textSecondary} size={20} />
                  <Text style={styles.cleanImpactText}>Sube chance adopción un <Text style={{color: COLORS.warning, fontWeight: '700'}}>{impact.adoptionChanceIncrease}%</Text></Text>
                </View>
              </View>
            </View>
          )}

          {/* How AI Works */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Zap color={COLORS.aiPurple} size={18} />
              <Text style={styles.sectionTitle}>¿Cómo funciona la IA?</Text>
            </View>
            
            <View style={[styles.howItWorksCard, SHADOWS.light]}>
              {[
                { step: '1', title: 'Analiza tu perfil', desc: 'Experiencia, horarios, preferencias de tamaño y energía.' },
                { step: '2', title: 'Evalúa a cada perro', desc: 'Necesidades, urgencia, historial de paseos y comportamiento.' },
                { step: '3', title: 'Calcula compatibilidad', desc: '6 factores ponderados generan un score de 0-100%.' },
                { step: '4', title: 'Predice impacto', desc: 'Estima cómo tu paseo mejorará la vida del perro.' },
              ].map((item, i) => (
                <View key={i} style={styles.stepItem}>
                  <View style={styles.stepCircle}>
                    <Text style={styles.stepNumber}>{item.step}</Text>
                  </View>
                  <View style={styles.stepInfo}>
                    <Text style={styles.stepTitle}>{item.title}</Text>
                    <Text style={styles.stepDesc}>{item.desc}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Action Button */}
          <TouchableOpacity 
            style={[styles.actionButton, SHADOWS.medium]}
            onPress={() => topDog && navigation.navigate('DogProfile', { dogId: topDog.id })}
          >
            <Heart color={COLORS.white} size={20} />
            <Text style={styles.actionButtonText}>
              Pasear a {topDog?.name || 'tu match'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.large,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginLeft: 6,
  },
  content: {
    padding: SIZES.large,
    paddingBottom: SIZES.xxl * 2,
  },
  aiStatusCard: {
    backgroundColor: COLORS.secondary,
    borderRadius: SIZES.radiusLarge,
    padding: SIZES.extraLarge,
    alignItems: 'center',
    marginBottom: SIZES.extraLarge,
  },
  aiStatusIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.medium,
  },
  aiStatusTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.white,
  },
  aiStatusSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
    textAlign: 'center',
  },
  aiStatusDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: SIZES.large,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: SIZES.radius,
    padding: SIZES.medium,
  },
  aiStatusItem: {
    flex: 1,
    alignItems: 'center',
  },
  aiStatusNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.white,
  },
  aiStatusLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
    textAlign: 'center',
  },
  aiStatusDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  section: {
    marginBottom: SIZES.extraLarge,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.medium,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.text,
    marginLeft: 6,
  },
  radarCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusLarge,
    padding: SIZES.large,
  },
  topMatchInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.large,
  },
  topMatchAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topMatchName: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
  },
  topMatchBreed: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  topMatchScore: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 4,
  },
  topMatchScoreValue: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.primary,
  },
  topMatchScoreLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  radarContainer: {
    alignItems: 'center',
    marginVertical: SIZES.medium,
  },
  breakdownContainer: {
    marginTop: SIZES.medium,
  },
  breakdownTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SIZES.medium,
  },
  breakdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.sm,
  },
  breakdownLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    width: 90,
  },
  breakdownBarBg: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.greyLight,
    marginHorizontal: SIZES.sm,
    overflow: 'hidden',
  },
  breakdownBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  breakdownValue: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.text,
    width: 35,
    textAlign: 'right',
  },
  predictionSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: SIZES.medium,
  },
  cleanImpactList: {
    gap: SIZES.sm,
  },
  cleanImpactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: SIZES.medium,
    borderRadius: SIZES.radius,
  },
  cleanImpactText: {
    fontSize: 14,
    color: COLORS.text,
    marginLeft: SIZES.medium,
  },
  howItWorksCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: SIZES.large,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SIZES.medium,
  },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.aiPurpleLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumber: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.aiPurple,
  },
  stepInfo: {
    flex: 1,
    marginLeft: SIZES.small,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },
  stepDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
    lineHeight: 17,
  },
  actionButton: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radiusMedium,
    padding: SIZES.large,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SIZES.medium,
  },
  actionButtonText: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: '700',
    marginLeft: SIZES.sm,
  },
});

export default AIInsightsScreen;
