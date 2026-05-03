import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { Bell, CheckCircle2, MapPin, Calendar, Brain, AlertTriangle, Trophy, ChevronRight } from 'lucide-react-native';
import { NOTIFICATIONS } from '../constants/mockData';

const ICON_MAP = {
  urgencia: <AlertTriangle color={COLORS.urgentHigh} size={20} />,
  recomendacion: <Brain color={COLORS.aiPurple} size={20} />,
  paseo_completado: <CheckCircle2 color={COLORS.success} size={20} />,
  logro: <Trophy color={COLORS.warning} size={20} />,
};

const COLOR_MAP = {
  urgencia: COLORS.urgentHigh,
  recomendacion: COLORS.aiPurple,
  paseo_completado: COLORS.success,
  logro: COLORS.warning,
};

const NotificationsScreen = ({ navigation }) => {
  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.card, SHADOWS.light, !item.read && styles.unreadCard]}
      activeOpacity={0.7}
      onPress={() => {
        if (item.dogId) navigation.navigate('DogProfile', { dogId: item.dogId });
      }}
    >
      <View style={[styles.iconContainer, { backgroundColor: COLOR_MAP[item.type] + '15' }]}>
        {ICON_MAP[item.type]}
      </View>
      <View style={styles.content}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
          {!item.read && <View style={styles.unreadDot} />}
        </View>
        <Text style={styles.cardMessage} numberOfLines={2}>{item.message}</Text>
        <Text style={styles.cardTime}>{item.time}</Text>
      </View>
      <ChevronRight color={COLORS.border} size={18} />
    </TouchableOpacity>
  );

  const unreadCount = NOTIFICATIONS.filter(n => !n.read).length;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Notificaciones</Text>
          {unreadCount > 0 && (
            <Text style={styles.headerSubtitle}>{unreadCount} sin leer</Text>
          )}
        </View>
        <TouchableOpacity style={styles.clearBtn}>
          <Text style={styles.clearText}>Marcar leídas</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={NOTIFICATIONS}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
    padding: SIZES.large,
  },
  headerTitle: { fontSize: 26, fontWeight: '800', color: COLORS.text },
  headerSubtitle: { fontSize: 13, color: COLORS.aiPurple, fontWeight: '600', marginTop: 2 },
  clearBtn: { padding: 8 },
  clearText: { fontSize: 13, color: COLORS.primary, fontWeight: '600' },
  listContent: { padding: SIZES.large, paddingTop: 0 },
  card: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.white, padding: SIZES.medium,
    borderRadius: SIZES.radius, marginBottom: SIZES.sm,
  },
  unreadCard: { borderLeftWidth: 3, borderLeftColor: COLORS.aiPurple },
  iconContainer: {
    width: 44, height: 44, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center',
  },
  content: { flex: 1, marginLeft: SIZES.medium, marginRight: SIZES.sm },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardTitle: { fontSize: 15, fontWeight: '700', color: COLORS.text, flex: 1 },
  unreadDot: {
    width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.aiPurple, marginLeft: 6,
  },
  cardMessage: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 18, marginTop: 3 },
  cardTime: { fontSize: 11, color: COLORS.textLight, marginTop: 4 },
});

export default NotificationsScreen;
