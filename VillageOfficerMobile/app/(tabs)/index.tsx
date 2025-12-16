import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/src/context/AuthContext';
import { Colors } from '@/src/constants/colors';
import { Spacing } from '@/src/constants/spacing';
import { Typography } from '@/src/constants/typography';
import Button from '@/src/components/ui/Button';
import Input from '@/src/components/ui/Input';
import Card from '@/src/components/ui/Card';
import Header from '@/src/components/ui/Header';
import LoadingSpinner from '@/src/components/ui/LoadingSpinner';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [position, setPosition] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string; position?: string }>({});
  const { login, isLoading, user, isAuthenticated } = useAuth();
  const router = useRouter();

  const positions = [
    { label: 'Villager', value: 'developer' },
    { label: 'Village Officer', value: 'manager' },
    { label: 'Secretary', value: 'designer' },
  ];

  const validateForm = () => {
    const newErrors: { email?: string; password?: string; position?: string } = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!position) {
      newErrors.position = 'Please select a position';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      await login({ email, password, position });
      
      // Navigate based on position
      let dashboardRoute: string;
      switch (position) {
        case 'manager':
          dashboardRoute = '/village-officer-dashboard';
          break;
        case 'designer':
          dashboardRoute = '/secretary-dashboard';
          break;
        case 'developer':
        default:
          dashboardRoute = '/user-dashboard';
          break;
      }
      
      Alert.alert('Success', 'Login successful!');
      
      // Navigate after alert
      setTimeout(() => {
        router.push(dashboardRoute as any);
      }, 100);
    } catch (error: any) {
      Alert.alert('Login Failed', error.error || 'Invalid email or password. Please try again.');
    }
  };

  // Navigation is now handled in handleLogin to prevent duplicate redirects

  const renderPositionSelector = () => (
    <View style={styles.positionContainer}>
      <Text style={styles.positionLabel}>Position</Text>
      <View style={styles.positionButtons}>
        {positions.map((pos) => (
          <TouchableOpacity
            key={pos.value}
            style={[
              styles.positionButton,
              position === pos.value && styles.positionButtonSelected,
            ]}
            onPress={() => {
              setPosition(pos.value);
              if (errors.position) {
                setErrors(prev => ({ ...prev, position: '' }));
              }
            }}
          >
            <Text
              style={[
                styles.positionButtonText,
                position === pos.value && styles.positionButtonTextSelected,
              ]}
            >
              {pos.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {errors.position && (
        <Text style={styles.errorText}>{errors.position}</Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Header title="Login" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.content}>
            <Card variant="default" padding={Spacing.xxl}>
              <View style={styles.formContainer}>
                <Text style={styles.loginTitle}>Login</Text>

                <Input
                  label="Email"
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  error={errors.email}
                />

                <Input
                  label="Password"
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter your password"
                  secureTextEntry
                  error={errors.password}
                />

                {renderPositionSelector()}

                <Button
                  title={isLoading ? 'Logging in...' : 'Login'}
                  onPress={handleLogin}
                  loading={isLoading}
                  disabled={isLoading}
                  size="large"
                  style={styles.loginButton}
                />
              </View>
            </Card>

            <View style={styles.footer}>
              <TouchableOpacity onPress={() => Alert.alert('Feature Coming Soon', 'Forgot password feature will be available soon.')}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      {isLoading && <LoadingSpinner fullScreen />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: Spacing.lg,
    justifyContent: 'center',
  },
  formContainer: {
    gap: Spacing.lg,
  },
  loginTitle: {
    fontSize: Typography.xxxl,
    fontWeight: '700' as const,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  positionContainer: {
    marginBottom: Spacing.lg,
  },
  positionLabel: {
    fontSize: Typography.sm,
    fontWeight: '700' as const,
    color: Colors.primary,
    marginBottom: Spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  positionButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  positionButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: Spacing.borderRadius.md,
    backgroundColor: Colors.white,
    alignItems: 'center',
  },
  positionButtonSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  positionButtonText: {
    fontSize: Typography.sm,
    color: Colors.text,
    fontWeight: '500' as const,
  },
  positionButtonTextSelected: {
    color: Colors.whiteText,
    fontWeight: '700' as const,
  },
  errorText: {
    fontSize: Typography.sm,
    color: Colors.error,
    marginTop: Spacing.sm,
    fontWeight: '500' as const,
  },
  loginButton: {
    marginTop: Spacing.lg,
  },
  footer: {
    alignItems: 'center',
    marginTop: Spacing.xl,
  },
  forgotPasswordText: {
    fontSize: Typography.base,
    color: Colors.primary,
    fontWeight: '600' as const,
  },
});
