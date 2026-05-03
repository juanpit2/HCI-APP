import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { Star, ShieldCheck } from 'lucide-react-native';

const WalkerCard = ({ walker, onPress }) => {
  return (
    <TouchableOpacity style={[styles.card, SHADOWS.light]} onPress={onPress}>
      <View style={styles.imageContainer}>
        {/* Placeholder para la imagen del paseador */}
        <View style={styles.placeholderImg}>
           <Text style={{ fontSize: 20 }}>👤</Text>
        </View>
        {walker.verified && (
          <View style={styles.verifiedBadge}>
            <ShieldCheck color={COLORS.white} size={12} />
          </View>
        )}
      </View>
      
      <View style={styles.info}>
        <Text style={styles.name}>{walker.name}</Text>
        <View style={styles.ratingRow}>
          <Star color="#FFD700" fill="#FFD700" size={14} />
          <Text style={styles.ratingText}>{walker.rating} ({walker.reviews} reviews)</Text>
        </View>
        <View style={styles.statusContainer}>
          <Text style={[styles.statusText, { color: walker.available ? COLORS.primary : COLORS.grey }]}>
            {walker.available ? 'Available today' : 'Available tomorrow'}
          </Text>
        </View>
      </View>
      
      <TouchableOpacity style={styles.matchBadge}>
        <Text style={styles.matchText}>{walker.match}% Match</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    padding: SIZES.medium,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.medium,
    marginHorizontal: 2, // Para no cortar la sombra
  },
  imageContainer: {
    position: 'relative',
  },
  placeholderImg: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  info: {
    flex: 1,
    marginLeft: SIZES.medium,
  },
  name: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  statusContainer: {
    marginTop: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  matchBadge: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: SIZES.base,
    paddingVertical: 4,
    borderRadius: 10,
  },
  matchText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
});

export default WalkerCard;
