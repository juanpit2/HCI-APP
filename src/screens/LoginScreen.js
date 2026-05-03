import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Dimensions, Image, Animated } from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { User, Dog } from 'lucide-react-native';
import { useAppContext } from '../context/AppContext';

const { width, height } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  const { setUserRole } = useAppContext();
  const [showOptions, setShowOptions] = useState(false);

  const handleRoleSelect = (role) => {
    setUserRole(role);
    navigation.navigate('Main');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Background Decor */}
      <View style={styles.decorYellow} />
      <View style={styles.decorBlue1} />
      <View style={styles.decorBlue2} />

      <View style={styles.content}>
        
        {/* Top Image Section */}
        <View style={styles.imageSection}>
          <View style={styles.purpleCircleBackground}>
            <View style={styles.purpleCircleInner} />
          </View>
          <Image 
            source={require('../../assets/milo.png')} 
            style={styles.heroImage}
            resizeMode="contain"
          />
        </View>

        {/* Text Section */}
        <View style={styles.textSection}>
          <Text style={styles.titleText}>
            <Text style={{ color: '#FFC107' }}>Find </Text>
            Your Best{'\n'}
            Companion <Text style={{ color: COLORS.aiPurple }}>With Us</Text>
          </Text>
          <Text style={styles.subtitleText}>
            Join & discover the best suitable pets in{'\n'}your location or near you.
          </Text>
          
          <View style={styles.paginationDots}>
            <View style={[styles.dot, styles.dotActive]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>
        </View>

        {/* Buttons Section */}
        <View style={styles.actionSection}>
          {!showOptions ? (
            <TouchableOpacity 
              style={[styles.exploreBtn, SHADOWS.medium]}
              onPress={() => setShowOptions(true)}
            >
              <Text style={styles.exploreBtnText}>Explore</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.optionsContainer}>
              <TouchableOpacity 
                style={[styles.roleBtn, styles.ownerBtn, SHADOWS.light]}
                onPress={() => handleRoleSelect('dueño')}
              >
                <User color={COLORS.white} size={20} style={styles.btnIcon} />
                <Text style={styles.ownerBtnText}>Soy Dueño</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.roleBtn, styles.walkerBtn]}
                onPress={() => handleRoleSelect('voluntario')}
              >
                <Dog color={COLORS.aiPurple} size={20} style={styles.btnIcon} />
                <Text style={styles.walkerBtnText}>Soy Cuidador</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  
  /* Decorative elements based on image */
  decorYellow: { position: 'absolute', top: -40, right: -40, width: 120, height: 120, borderRadius: 60, backgroundColor: '#FFE600' },
  decorBlue1: { position: 'absolute', top: 50, left: 40, width: 30, height: 30, borderRadius: 15, backgroundColor: '#42D7FF' },
  decorBlue2: { position: 'absolute', top: 150, right: 30, width: 24, height: 24, borderRadius: 12, backgroundColor: '#8B85FF' },

  content: { flex: 1, justifyContent: 'space-between', paddingHorizontal: 30, paddingVertical: 20 },

  /* Image Section */
  imageSection: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 40, minHeight: 300 },
  purpleCircleBackground: { position: 'absolute', width: width * 0.75, height: width * 0.75, borderRadius: (width * 0.75) / 2, backgroundColor: '#EBE5FF', justifyContent: 'center', alignItems: 'center' },
  purpleCircleInner: { width: width * 0.65, height: width * 0.65, borderRadius: (width * 0.65) / 2, backgroundColor: COLORS.aiPurple },
  heroImage: { width: '100%', height: '110%', position: 'absolute', bottom: -20 },

  /* Text Section */
  textSection: { alignItems: 'center', marginTop: 20 },
  titleText: { fontSize: 32, fontWeight: '900', color: COLORS.text, textAlign: 'center', lineHeight: 42 },
  subtitleText: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', marginTop: 15, lineHeight: 22 },
  
  paginationDots: { flexDirection: 'row', justifyContent: 'center', marginTop: 30, gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#E0E0E0' },
  dotActive: { width: 24, backgroundColor: COLORS.aiPurple },

  /* Action Section */
  actionSection: { paddingVertical: 30, minHeight: 140, justifyContent: 'flex-end' },
  exploreBtn: { backgroundColor: COLORS.aiPurple, paddingVertical: 18, borderRadius: 30, alignItems: 'center', width: '100%' },
  exploreBtnText: { color: COLORS.white, fontSize: 16, fontWeight: '700' },

  optionsContainer: { width: '100%', gap: 15 },
  roleBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 18, borderRadius: 30, width: '100%' },
  ownerBtn: { backgroundColor: COLORS.aiPurple },
  ownerBtnText: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
  walkerBtn: { backgroundColor: COLORS.white, borderWidth: 1.5, borderColor: COLORS.aiPurple },
  walkerBtnText: { color: COLORS.aiPurple, fontSize: 16, fontWeight: '700' },
  btnIcon: { marginRight: 10 },
});

export default LoginScreen;
