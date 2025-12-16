import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  TouchableOpacity,
  Animated,
  Dimensions,
  StatusBar,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import LinearGradient from 'react-native-linear-gradient';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { Colors } from '../../constants/colors';
import { Spacing } from '../../constants/spacing';
import { Typography } from '../../constants/typography';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const LoginScreen: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [position, setPosition] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string; position?: string }>({});
  const { login, isLoading } = useAuth();
  
  // Animation values
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(50);
  const scaleAnim = new Animated.Value(0.8);
  const logoRotateAnim = new Animated.Value(0);
  const buttonPulseAnim = new Animated.Value(1);
  
  const { width, height } = Dimensions.get('window');
  
  useEffect(() => {
    // Start entrance animations
    Animated.sequence([
      Animated.timing(logoRotateAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
    
    // Button pulse animation
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(buttonPulseAnim, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(buttonPulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );
    pulseAnimation.start();
    
    return () => pulseAnimation.stop();
  }, []);

  const positions = [
    { label: 'Villager', value: 'developer', icon: 'person' },
    { label: 'Village Officer', value: 'manager', icon: 'shield-checkmark' },
    { label: 'Secretary', value: 'designer', icon: 'document-text' },
  ];

  const validateForm = () => {
    const newErrors: { email?: string; password?: string; position?: string } = {};
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!position) newErrors.position = 'Please select a position';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
    
    // Button press animation
    Animated.sequence([
      Animated.timing(buttonPulseAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonPulseAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    
    try {
      await login({ email, password, position });
      let dashboardRoute = '/user-dashboard';
      if (position === 'manager') dashboardRoute = '/village-officer-dashboard';
      else if (position === 'designer') dashboardRoute = '/secretary-dashboard';
      Alert.alert('Success', 'Login successful!');
      setTimeout(() => router.push(dashboardRoute as any), 100);
    } catch (error) {
      Alert.alert('Login Failed', 'Invalid email or password. Please try again.');
    }
  };

  const renderPositionSelector = () => (
    <Animated.View style={[styles.positionContainer, { opacity: fadeAnim }]}>
      <Text style={styles.positionLabel}>Choose Your Role</Text>
      <View style={styles.positionGrid}>
        {positions.map((pos, index) => (
          <Animated.View
            key={pos.value}
            style={{
              transform: [
                {
                  scale: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.5, 1],
                  }),
                },
                {
                  translateY: slideAnim.interpolate({
                    inputRange: [50, 0],
                    outputRange: [30, 0],
                  }),
                },
              ],
              opacity: fadeAnim,
            }}
          >
            <TouchableOpacity
              style={[
                styles.positionCard,
                position === pos.value && styles.positionCardSelected,
              ]}
              onPress={() => {
                setPosition(pos.value);
                if (errors.position) setErrors(prev => ({ ...prev, position: '' }));
              }}
              activeOpacity={0.8}
            >
              <View style={[
                styles.iconContainer,
                position === pos.value && styles.iconContainerSelected
              ]}>
                <Ionicons 
                  name={pos.icon as any}
                  size={28} 
                  color={position === pos.value ? '#fff' : Colors.primary} 
                />
              </View>
              <Text style={[
                styles.positionCardText,
                position === pos.value && styles.positionCardTextSelected
              ]}>
                {pos.label}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>
      {errors.position && (
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={16} color={Colors.error} />
          <Text style={styles.errorText}>{errors.position}</Text>
        </View>
      )}
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Animated Background */}
      <LinearGradient
        colors={['#667eea', '#764ba2', '#f093fb', '#ffa0c9']}
        style={styles.gradientBackground}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Floating Orbs */}
        <Animated.View 
          style={[
            styles.orb,
            styles.orb1,
            {
              transform: [
                {
                  rotate: logoRotateAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '360deg'],
                  }),
                },
              ],
            }
          ]} 
        />
        <Animated.View 
          style={[
            styles.orb,
            styles.orb2,
            {
              transform: [
                {
                  rotate: logoRotateAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['360deg', '0deg'],
                  }),
                },
              ],
            }
          ]} 
        />
        <Animated.View 
          style={[
            styles.orb,
            styles.orb3,
            {
              transform: [
                {
                  scale: buttonPulseAnim,
                },
              ],
            }
          ]} 
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <View style={styles.content}>
              {/* Logo Section */}
              <Animated.View 
                style={[
                  styles.logoSection,
                  {
                    opacity: fadeAnim,
                    transform: [
                      { scale: scaleAnim },
                      { translateY: slideAnim }
                    ]
                  }
                ]}
              >
                <View style={styles.logoContainer}>
                  <LinearGradient
                    colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.7)', 'rgba(255,255,255,0.5)']}
                    style={styles.logoGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <FontAwesome5 name="landmark" size={50} color="#764ba2" />
                  </LinearGradient>
                </View>
                <Text style={styles.brandName}>GramSeva Portal</Text>
                <Text style={styles.tagline}>Digital Village Management System</Text>
              </Animated.View>

              {/* Login Card */}
              <Animated.View
                style={[
                  styles.formContainer,
                  {
                    opacity: fadeAnim,
                    transform: [
                      { scale: scaleAnim },
                      { translateY: slideAnim }
                    ]
                  }
                ]}
              >
                <View style={styles.glassCard}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.greeting}>Welcome Back!</Text>
                    <Text style={styles.instruction}>Sign in to continue serving your community</Text>
                  </View>

                  <View style={styles.formFields}>
                    {/* Email Input */}
                    <View style={styles.inputGroup}>
                      <View style={styles.inputWrapper}>
                        <MaterialIcons name="email" size={22} color="#764ba2" style={styles.inputIcon} />
                        <TextInput
                          style={styles.modernInput}
                          placeholder="Email address"
                          placeholderTextColor="#999"
                          value={email}
                          onChangeText={setEmail}
                          keyboardType="email-address"
                          autoCapitalize="none"
                        />
                      </View>
                      {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
                    </View>

                    {/* Password Input */}
                    <View style={styles.inputGroup}>
                      <View style={styles.inputWrapper}>
                        <MaterialIcons name="lock" size={22} color="#764ba2" style={styles.inputIcon} />
                        <TextInput
                          style={styles.modernInput}
                          placeholder="Password"
                          placeholderTextColor="#999"
                          value={password}
                          onChangeText={setPassword}
                          secureTextEntry
                        />
                      </View>
                      {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
                    </View>

                    {renderPositionSelector()}

                    {/* Login Button */}
                    <Animated.View style={{ transform: [{ scale: buttonPulseAnim }] }}>
                      <TouchableOpacity
                        style={styles.loginButton}
                        onPress={handleLogin}
                        disabled={isLoading}
                        activeOpacity={0.9}
                      >
                        <LinearGradient
                          colors={['#667eea', '#764ba2']}
                          style={styles.buttonGradient}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                        >
                          {isLoading ? (
                            <ActivityIndicator color="#fff" size="small" />
                          ) : (
                            <Text style={styles.buttonText}>Sign In</Text>
                          )}
                        </LinearGradient>
                      </TouchableOpacity>
                    </Animated.View>
                  </View>

                  {/* Footer */}
                  <View style={styles.cardFooter}>
                    <TouchableOpacity 
                      style={styles.forgotButton}
                      onPress={() => Alert.alert('Coming Soon', 'Forgot password feature will be available soon.')}
                    >
                      <Text style={styles.forgotText}>Forgot password?</Text>
                    </TouchableOpacity>
                    
                    <View style={styles.signupPrompt}>
                      <Text style={styles.signupNormal}>New to GramSeva? </Text>
                      <TouchableOpacity onPress={() => Alert.alert('Coming Soon', 'Sign up feature will be available soon.')}>
                        <Text style={styles.signupHighlight}>Register now</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Animated.View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
      
      {isLoading && <LoadingSpinner fullScreen />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientBackground: {
    flex: 1,
    position: 'relative',
  },
  orb: {
    position: 'absolute',
    borderRadius: 1000,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  orb1: {
    width: 200,
    height: 200,
    top: -50,
    right: -50,
  },
  orb2: {
    width: 150,
    height: 150,
    top: '30%',
    left: -30,
  },
  orb3: {
    width: 100,
    height: 100,
    bottom: '20%',
    right: 50,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: 'center',
    paddingTop: 60,
    paddingBottom: 40,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    marginBottom: 20,
  },
  logoGradient: {
    width: 90,
    height: 90,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.3,
    shadowRadius: 25,
    elevation: 15,
  },
  brandName: {
    fontSize: 42,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 8,
    letterSpacing: 2,
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 8,
  },
  tagline: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    fontStyle: 'italic',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  formContainer: {
    marginBottom: 30,
  },
  glassCard: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 30,
    padding: 35,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 25 },
    shadowOpacity: 0.15,
    shadowRadius: 40,
    elevation: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  cardHeader: {
    alignItems: 'center',
    marginBottom: 35,
  },
  greeting: {
    fontSize: 32,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  instruction: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  formFields: {
    gap: 25,
  },
  inputGroup: {
    marginBottom: 5,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#e9ecef',
    paddingHorizontal: 20,
    height: 60,
  },
  inputIcon: {
    marginRight: 15,
  },
  modernInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    height: 60,
  },
  errorText: {
    fontSize: 13,
    color: '#e74c3c',
    marginTop: 8,
    marginLeft: 10,
    fontWeight: '500',
  },
  positionContainer: {
    marginBottom: 15,
  },
  positionLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  positionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  positionCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  positionCardSelected: {
    backgroundColor: '#764ba2',
    borderColor: '#764ba2',
    shadowColor: '#764ba2',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(118, 75, 162, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  iconContainerSelected: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  positionCardText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '600',
    textAlign: 'center',
  },
  positionCardTextSelected: {
    color: '#fff',
    fontWeight: '700',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    gap: 8,
  },
  loginButton: {
    borderRadius: 20,
    overflow: 'hidden',
    marginTop: 15,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.4,
    shadowRadius: 25,
    elevation: 10,
  },
  buttonGradient: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1,
  },
  cardFooter: {
    alignItems: 'center',
    marginTop: 30,
    gap: 20,
  },
  forgotButton: {
    paddingVertical: 8,
  },
  forgotText: {
    fontSize: 15,
    color: '#764ba2',
    fontWeight: '600',
  },
  signupPrompt: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signupNormal: {
    fontSize: 15,
    color: '#666',
  },
  signupHighlight: {
    fontSize: 15,
    color: '#764ba2',
    fontWeight: '700',
  },
});

export default LoginScreen;