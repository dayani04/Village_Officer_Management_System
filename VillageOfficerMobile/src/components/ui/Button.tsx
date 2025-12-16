import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ViewStyle, 
  TextStyle, 
  ActivityIndicator 
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Colors } from '../../constants/colors';
import { Spacing } from '../../constants/spacing';
import { Typography } from '../../constants/typography';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
}) => {
  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: Spacing.borderRadius.md,
      alignItems: 'center',
      justifyContent: 'center',
    };

    const sizeStyles = {
      small: { paddingVertical: Spacing.sm, paddingHorizontal: Spacing.lg },
      medium: { paddingVertical: Spacing.md, paddingHorizontal: Spacing.xl },
      large: { paddingVertical: Spacing.lg, paddingHorizontal: Spacing.xxl },
    };

    const variantStyles = {
      primary: {
        backgroundColor: Colors.primary,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
      },
      secondary: {
        backgroundColor: Colors.gray,
      },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: Colors.primary,
      },
    };

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
      ...(disabled && { opacity: 0.6 }),
      ...style,
    };
  };

  const getTextStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      fontWeight: '700' as const,
      textTransform: 'uppercase',
      letterSpacing: 1.2,
    };

    const sizeStyles = {
      small: { fontSize: Typography.sm },
      medium: { fontSize: Typography.base },
      large: { fontSize: Typography.lg },
    };

    const variantStyles = {
      primary: { color: Colors.whiteText },
      secondary: { color: Colors.text },
      outline: { color: Colors.primary },
    };

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
      ...textStyle,
    };
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={Colors.whiteText} size="small" />
      ) : (
        <Text style={getTextStyle()}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

export default Button;
