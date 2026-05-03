import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';

const CustomButton = ({ title, onPress, type = 'primary', style, textStyle, icon }) => {
  const isPrimary = type === 'primary';
  
  return (
    <TouchableOpacity 
      style={[
        styles.button, 
        isPrimary ? styles.primary : styles.secondary,
        SHADOWS.light,
        style
      ]} 
      onPress={onPress}
    >
      <View style={styles.content}>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <Text style={[
          styles.text, 
          isPrimary ? styles.primaryText : styles.secondaryText,
          textStyle
        ]}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '100%',
    height: 56,
    borderRadius: SIZES.radiusLarge,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: SIZES.base,
  },
  primary: {
    backgroundColor: COLORS.secondary,
  },
  secondary: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
  },
  primaryText: {
    color: COLORS.white,
  },
  secondaryText: {
    color: COLORS.text,
  },
  iconContainer: {
    marginRight: SIZES.base,
  },
});

export default CustomButton;
