import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { User, Settings, CreditCard, HelpCircle, LogOut, ChevronRight, ShieldCheck, Brain, TrendingUp, Award, Zap, Maximize, Clock, Dog } from 'lucide-react-native';
import { CURRENT_USER, DOGS } from '../constants/mockData';
import { useAppContext } from '../context/AppContext';

const AccountScreen = ({ navigation }) => {
  const { userRole, setUserRole } = useAppContext();

  const toggleRole = () => {
    const nextRole = userRole === 'dueño' ? 'voluntario' : 'dueño';
    setUserRole(nextRole);
    Alert.alert(
      'Rol Cambiado',
      `Ahora estás en modo ${nextRole === 'dueño' ? 'Dueño' : 'Paseador/Voluntario'}`
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <User color={COLORS.primary} size={40} />
            </View>
            <View style={styles.verifiedBadge}>
              <ShieldCheck color={COLORS.white} size={12} />
            </View>
          </View>
          <Text style={styles.userName}>{CURRENT_USER.name}</Text>
          <Text style={styles.userEmail}>cali.voluntario@pettrust.com</Text>
        </View>

        {/* Role Switcher */}
        <View style={[styles.card, SHADOWS.light]}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Modo de la App</Text>
            <View style={[styles.roleBadge, { backgroundColor: userRole === 'dueño' ? COLORS.primaryLight : COLORS.secondaryLight }]}>
              <Text style={[styles.roleBadgeText, { color: userRole === 'dueño' ? COLORS.primary : COLORS.secondary }]}>
                {userRole === 'dueño' ? 'Dueño' : 'Paseador'}
              </Text>
            </View>
          </View>
          <Text style={styles.cardDesc}>
            Cambia entre buscar paseadores para tus perros o ofrecerte como paseador voluntario.
          </Text>
          <TouchableOpacity style={styles.switchBtn} onPress={toggleRole}>
            <Text style={styles.switchBtnText}>Cambiar a modo {userRole === 'dueño' ? 'Paseador' : 'Dueño'}</Text>
          </TouchableOpacity>
        </View>

        {/* Menu Items */}
        <View style={styles.menu}>
          <MenuItem icon={<CreditCard color={COLORS.textSecondary} size={20} />} label="Métodos de Pago" />
          <MenuItem icon={<HelpCircle color={COLORS.textSecondary} size={20} />} label="Centro de Ayuda" />
          <MenuItem icon={<ShieldCheck color={COLORS.textSecondary} size={20} />} label="Seguridad y Privacidad" />
          <MenuItem icon={<Settings color={COLORS.textSecondary} size={20} />} label="Configuración de Cuenta" />
        </View>

        <TouchableOpacity style={styles.logoutBtn}>
          <LogOut color={COLORS.error} size={20} />
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const MenuItem = ({ icon, label }) => (
  <TouchableOpacity style={styles.menuItem}>
    <View style={styles.menuItemLeft}>
      {icon}
      <Text style={styles.menuItemLabel}>{label}</Text>
    </View>
    <ChevronRight color={COLORS.grey} size={18} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 25 },
  profileHeader: { alignItems: 'center', marginBottom: 35 },
  avatarContainer: { position: 'relative', marginBottom: 15 },
  avatar: { width: 90, height: 90, borderRadius: 45, backgroundColor: COLORS.white, justifyContent: 'center', alignItems: 'center', ...SHADOWS.light },
  verifiedBadge: { position: 'absolute', bottom: 5, right: 5, width: 24, height: 24, borderRadius: 12, backgroundColor: COLORS.success, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: COLORS.white },
  userName: { fontSize: 24, fontWeight: '800', color: COLORS.text },
  userEmail: { fontSize: 14, color: COLORS.textSecondary, marginTop: 4 },
  
  card: { backgroundColor: COLORS.white, borderRadius: 25, padding: 20, marginBottom: 30, ...SHADOWS.light },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  cardTitle: { fontSize: 16, fontWeight: '800', color: COLORS.text },
  roleBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  roleBadgeText: { fontSize: 11, fontWeight: '700' },
  cardDesc: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 20, marginBottom: 20 },
  switchBtn: { backgroundColor: COLORS.primary, padding: 15, borderRadius: 15, alignItems: 'center' },
  switchBtnText: { color: COLORS.white, fontWeight: '800', fontSize: 14 },

  menu: { backgroundColor: COLORS.white, borderRadius: 25, padding: 10, marginBottom: 30, ...SHADOWS.light },
  menuItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15 },
  menuItemLeft: { flexDirection: 'row', alignItems: 'center' },
  menuItemLabel: { fontSize: 15, fontWeight: '600', color: COLORS.text, marginLeft: 12 },

  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 20, gap: 10 },
  logoutText: { color: COLORS.error, fontSize: 15, fontWeight: '700' },
});

export default AccountScreen;
