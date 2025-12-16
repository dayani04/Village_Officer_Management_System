import React from 'react';
import { View, StyleSheet, ViewStyle, ViewProps } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Colors } from '../../constants/colors';
import { Spacing } from '../../constants/spacing';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'gradient' | 'outlined';
  padding?: number;
  margin?: number;
}

const Card: React.FC<CardProps> = ({
  children,
  style,
  variant = 'default',
  padding = Spacing.lg,
  margin = 0,
  ...props
}) => {
  const getCardStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: Spacing.borderRadius.xl,
      margin,
      padding,
      shadowColor: Colors.primary,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.12,
      shadowRadius: 16,
      elevation: 8,
    };

    const variantStyles = {
      default: {
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: Colors.borderLight,
      },
      gradient: {
        backgroundColor: 'transparent',
      },
      outlined: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: Colors.primary,
      },
    };

    return {
      ...baseStyle,
      ...variantStyles[variant],
      ...style,
    };
  };

  if (variant === 'gradient') {
    return (
      <LinearGradient
        colors={[Colors.gradientStart, Colors.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={getCardStyle()}
        {...props}
      >
        {children}
      </LinearGradient>
    );
  }

  return (
    <View style={getCardStyle()} {...props}>
      {children}
    </View>
  );
};

export default Card;
