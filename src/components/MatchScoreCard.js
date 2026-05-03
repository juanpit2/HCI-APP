import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { Brain, ChevronRight, MapPin, Dog } from 'lucide-react-native';

const MatchScoreCard = ({ dog, onPress }) => {
  return (
    <TouchableOpacity style={[styles.card, SHADOWS.light]} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.content}>
        <View style={styles.topRow}>
          <View style={styles.dogAvatar}>
            <Dog color={COLORS.primary} size={28} />
          </View>
          <View style={styles.dogInfo}>
            <Text style={styles.dogName}>{dog.name}</Text>
            <Text style={styles.dogBreed}>{dog.breed} • {dog.age} años</Text>
            <View style={styles.shelterRow}>
              <MapPin color={COLORS.textSecondary} size={12} />
              <Text style={styles.shelterText}>{dog.shelterName} • {dog.shelterDistance} km</Text>
            </View>
          </View>
          
          <View style={styles.scoreBadge}>
            <Brain color={COLORS.aiPurple} size={12} />
            <Text style={styles.scoreText}>{dog.matchScore}%</Text>
          </View>
        </View>

        <View style={styles.tagsRow}>
          {dog.temperament.slice(0, 3).map((t, i) => (
            <View key={i} style={styles.tag}>
              <Text style={styles.tagText}>{t}</Text>
            </View>
          ))}
          <View style={[styles.tag, { backgroundColor: COLORS.primaryLight }]}>
            <Text style={[styles.tagText, { color: COLORS.primary }]}>{dog.energyLevel}</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.actionText}>Ver detalles del perro</Text>
          <ChevronRight color={COLORS.primary} size={16} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    marginBottom: 15,
    ...SHADOWS.light,
  },
  content: { padding: 15 },
  topRow: { flexDirection: 'row', alignItems: 'center' },
  dogAvatar: { width: 50, height: 50, borderRadius: 15, backgroundColor: COLORS.primaryLight, justifyContent: 'center', alignItems: 'center' },
  dogInfo: { flex: 1, marginLeft: 12 },
  dogName: { fontSize: 16, fontWeight: '800', color: COLORS.text },
  dogBreed: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  shelterRow: { flexDirection: 'row', alignItems: 'center', marginTop: 3 },
  shelterText: { fontSize: 11, color: COLORS.textSecondary, marginLeft: 3 },
  scoreBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.aiPurpleLight, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  scoreText: { fontSize: 13, fontWeight: '800', color: COLORS.aiPurple, marginLeft: 4 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 12, gap: 8 },
  tag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, backgroundColor: COLORS.greyLight },
  tagText: { fontSize: 11, fontWeight: '600', color: COLORS.textSecondary, textTransform: 'capitalize' },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15, paddingTop: 12, borderTopWidth: 1, borderTopColor: COLORS.divider },
  actionText: { fontSize: 12, fontWeight: '700', color: COLORS.primary },
});

export default MatchScoreCard;
