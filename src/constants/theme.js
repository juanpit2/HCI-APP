export const COLORS = {
  // Primarios (Púrpura Profundo - Principal)
  primary: '#6C5CE7',
  primaryLight: '#F3F0FF',
  primaryDark: '#5046B4',
  
  // Secundarios (Naranja Vibrante)
  secondary: '#FF9F1C',
  secondaryLight: '#FFF5E6',
  secondaryDark: '#E6891A',

  // Acentos (Teal/Cyan para toques modernos)
  accent: '#00CEC9',
  accentLight: '#E0F7FA',

  // Superficies
  background: '#F5F7FA',
  surface: '#FFFFFF',
  card: '#FFFFFF',

  // Textos
  text: '#1A1A2E',
  textSecondary: '#6B7280',
  textLight: '#9CA3AF',

  // Estados
  error: '#EF4444',
  errorLight: '#FEE2E2',
  success: '#10B981',
  successLight: '#D1FAE5',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  info: '#3B82F6',
  infoLight: '#DBEAFE',

  // Urgencia
  urgentHigh: '#EF4444',
  urgentMedium: '#F59E0B',
  urgentLow: '#10B981',

  // Neutros
  white: '#FFFFFF',
  black: '#000000',
  grey: '#9E9E9E',
  greyLight: '#F3F4F6',
  border: '#E5E7EB',
  divider: '#F0F0F0',

  // IA
  aiPurple: '#8B5CF6',
  aiPurpleLight: '#EDE9FE',

  // Overlay
  overlay: 'rgba(0,0,0,0.5)',
  overlayLight: 'rgba(0,0,0,0.1)',
};

export const SIZES = {
  // Espaciado
  xs: 4,
  sm: 8,
  base: 8,
  small: 12,
  font: 14,
  medium: 16,
  large: 18,
  xl: 20,
  extraLarge: 24,
  xxl: 32,

  // Border Radius
  radius: 16,
  radiusMedium: 20,
  radiusLarge: 24,
  radiusFull: 100,

  // Iconos
  iconSmall: 16,
  iconMedium: 24,
  iconLarge: 32,
};

export const SHADOWS = {
  light: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  heavy: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
};

export const FONTS = {
  h1: { fontSize: 28, fontWeight: '800', color: COLORS.text },
  h2: { fontSize: 22, fontWeight: '700', color: COLORS.text },
  h3: { fontSize: 18, fontWeight: '700', color: COLORS.text },
  body: { fontSize: 14, fontWeight: '400', color: COLORS.text },
  bodyBold: { fontSize: 14, fontWeight: '600', color: COLORS.text },
  caption: { fontSize: 12, fontWeight: '400', color: COLORS.textSecondary },
  captionBold: { fontSize: 12, fontWeight: '600', color: COLORS.textSecondary },
  small: { fontSize: 10, fontWeight: '400', color: COLORS.textLight },
};
