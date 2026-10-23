import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  Dimensions,
  Animated,
  Easing,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { colors } from '../../theme/colors';

const { width } = Dimensions.get('window');

export const AuthHomeScreen = ({ navigation }) => {
  const { login, signup } = useApp();

  const [showAuthForm, setShowAuthForm] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [selectedRole, setSelectedRole] = useState('customer'); // 'customer' or 'admin'

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  // --- 3D Animation Values ---
  const floatAnim = useRef(new Animated.Value(0)).current;
  const rotateYAnim = useRef(new Animated.Value(0)).current;
  const rotateXAnim = useRef(new Animated.Value(0)).current;
  const btnScaleAnim = useRef(new Animated.Value(1)).current;
  const btnTiltAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 3D Floating Bobbing Loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 2500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // 3D Rotating Gyro Loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(rotateYAnim, {
          toValue: 1,
          duration: 3200,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(rotateYAnim, {
          toValue: -1,
          duration: 3200,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(rotateYAnim, {
          toValue: 0,
          duration: 1600,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // 3D X-Tilt Loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(rotateXAnim, {
          toValue: 1,
          duration: 2800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(rotateXAnim, {
          toValue: -1,
          duration: 2800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(rotateXAnim, {
          toValue: 0,
          duration: 1400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // 3D Interpolations
  const translateY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -18],
  });

  const rotateY = rotateYAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-16deg', '0deg', '16deg'],
  });

  const rotateX = rotateXAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-8deg', '0deg', '8deg'],
  });

  const shadowScale = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.75],
  });

  const shadowOpacity = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.35, 0.15],
  });

  const handleBtnPressIn = () => {
    Animated.parallel([
      Animated.spring(btnScaleAnim, { toValue: 0.95, useNativeDriver: true }),
      Animated.spring(btnTiltAnim, { toValue: 1, useNativeDriver: true }),
    ]).start();
  };

  const handleBtnPressOut = () => {
    Animated.parallel([
      Animated.spring(btnScaleAnim, { toValue: 1, friction: 3, useNativeDriver: true }),
      Animated.spring(btnTiltAnim, { toValue: 0, friction: 3, useNativeDriver: true }),
    ]).start();
  };

  const btnRotateX = btnTiltAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '10deg'],
  });

  const validate = () => {
    let errs = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      errs.email = 'Email address is required';
    } else if (!emailRegex.test(email.trim())) {
      errs.email = 'Enter a valid email address';
    }

    if (!password) {
      errs.password = 'Password is required';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }

    if (isSignUp) {
      if (!name.trim() || name.trim().length < 3) {
        errs.name = 'Full name must be at least 3 characters';
      }

      const phoneRegex = /^[0-9]{10}$/;
      if (!phone.trim()) {
        errs.phone = '10-digit Phone number is required';
      } else if (!phoneRegex.test(phone.trim().replace(/\D/g, ''))) {
        errs.phone = 'Phone number must be exactly 10 digits';
      }

      if (password !== confirmPassword) {
        errs.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleAuthSubmit = () => {
    if (!validate()) return;

    if (isSignUp) {
      signup({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        role: selectedRole,
      });
    } else {
      login(email.trim(), password, selectedRole);
    }

    navigation.replace('MainDrawer');
  };

  const handleQuickLogin = (role) => {
    setSelectedRole(role);
    if (role === 'admin') {
      login('alagarraja@freshmart.com', 'admin123', 'admin');
    } else {
      login('ragul@freshmart.com', 'customer123', 'customer');
    }
    navigation.replace('MainDrawer');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        bounces={true}
        overScrollMode="never"
      >
        {/* Figma Screen 1: Top Hero Fruit Cluster with 3D Float Animation */}
        <View style={styles.heroSection}>
          <View style={styles.mintBackdrop} />

          {/* 3D Animated Fruit Cluster */}
          <View style={styles.threeDContainer}>
            <Animated.View
              style={[
                styles.threeDImageWrapper,
                {
                  transform: [
                    { perspective: 800 },
                    { translateY: translateY },
                    { rotateY: rotateY },
                    { rotateX: rotateX },
                  ],
                },
              ]}
            >
              <Image
                source={{
                  uri: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=900&q=85',
                }}
                style={styles.fruitClusterImg}
                resizeMode="contain"
              />
            </Animated.View>

            {/* 3D Dynamic Ground Shadow */}
            <Animated.View
              style={[
                styles.groundShadow,
                {
                  transform: [{ scaleX: shadowScale }, { scaleY: shadowScale }],
                  opacity: shadowOpacity,
                },
              ]}
            />
          </View>

          {/* 3D Badge Indicator */}
          <View style={styles.badge3D}>
            <Ionicons name="sparkles" size={12} color={colors.primary} />
            <Text style={styles.badge3DText}>3D Interactive Grocery Experience</Text>
          </View>

          {/* Dots Indicator: [— • •] */}
          <View style={styles.dotsRow}>
            <View style={styles.activeDot} />
            <View style={styles.inactiveDot} />
            <View style={styles.inactiveDot} />
          </View>

          {/* Title & Subtitle from Figma */}
          <Text style={styles.figmaTitle}>Grocery Shop</Text>
          <Text style={styles.figmaSubtitle}>
            The easiest way to buy your grocery shopping
          </Text>

          {/* Main "Get Started" 3D Animated Button from Figma */}
          {!showAuthForm ? (
            <View style={styles.actionBlock}>
              <Animated.View
                style={{
                  transform: [
                    { perspective: 600 },
                    { scale: btnScaleAnim },
                    { rotateX: btnRotateX },
                  ],
                }}
              >
                <TouchableOpacity
                  style={styles.getStartedBtn}
                  onPressIn={handleBtnPressIn}
                  onPressOut={handleBtnPressOut}
                  onPress={() => setShowAuthForm(true)}
                  activeOpacity={0.9}
                >
                  <Text style={styles.getStartedBtnText}>Get Started</Text>
                  <Ionicons name="arrow-forward" size={18} color="#FFFFFF" style={{ marginLeft: 8 }} />
                </TouchableOpacity>
              </Animated.View>

              {/* Examiner Fast Login Row (Customer & Admin) */}
              <View style={styles.fastLoginCard}>
                <Text style={styles.fastLoginTitle}>⚡ 1-Tap Login For Evaluator:</Text>
                <View style={styles.fastBtnRow}>
                  <TouchableOpacity
                    style={styles.fastCustBtn}
                    onPress={() => handleQuickLogin('customer')}
                  >
                    <Ionicons name="person" size={14} color={colors.primary} />
                    <Text style={styles.fastCustText}>Customer (Ragul)</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.fastAdminBtn}
                    onPress={() => handleQuickLogin('admin')}
                  >
                    <Ionicons name="shield-checkmark" size={14} color="#7C3AED" />
                    <Text style={styles.fastAdminText}>Admin (Alagarraja)</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ) : (
            /* Sign In / Sign Up Card Form */
            <View style={styles.authCard}>
              <View style={styles.tabToggle}>
                <TouchableOpacity
                  style={[styles.toggleBtn, !isSignUp && styles.toggleBtnActive]}
                  onPress={() => {
                    setIsSignUp(false);
                    setErrors({});
                  }}
                >
                  <Text style={[styles.toggleText, !isSignUp && styles.toggleTextActive]}>
                    Sign In
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.toggleBtn, isSignUp && styles.toggleBtnActive]}
                  onPress={() => {
                    setIsSignUp(true);
                    setErrors({});
                  }}
                >
                  <Text style={[styles.toggleText, isSignUp && styles.toggleTextActive]}>
                    Sign Up
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Role Toggle: Customer vs Admin */}
              <View style={styles.roleRow}>
                <TouchableOpacity
                  style={[
                    styles.roleChip,
                    selectedRole === 'customer' && styles.roleChipCustomerActive,
                  ]}
                  onPress={() => setSelectedRole('customer')}
                >
                  <Ionicons
                    name="person"
                    size={14}
                    color={selectedRole === 'customer' ? colors.primary : colors.textSecondary}
                  />
                  <Text
                    style={[
                      styles.roleChipText,
                      selectedRole === 'customer' && styles.roleChipCustomerText,
                    ]}
                  >
                    Customer
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.roleChip,
                    selectedRole === 'admin' && styles.roleChipAdminActive,
                  ]}
                  onPress={() => setSelectedRole('admin')}
                >
                  <Ionicons
                    name="shield-checkmark"
                    size={14}
                    color={selectedRole === 'admin' ? '#7C3AED' : colors.textSecondary}
                  />
                  <Text
                    style={[
                      styles.roleChipText,
                      selectedRole === 'admin' && styles.roleChipAdminText,
                    ]}
                  >
                    Store Admin
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Form Inputs */}
              {isSignUp && (
                <View style={styles.inputBox}>
                  <Ionicons name="person-outline" size={18} color={colors.textSecondary} />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Full Name *"
                    placeholderTextColor={colors.textMuted}
                    value={name}
                    onChangeText={setName}
                  />
                </View>
              )}
              {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

              <View style={styles.inputBox}>
                <Ionicons name="mail-outline" size={18} color={colors.textSecondary} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Email Address *"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

              {isSignUp && (
                <View style={styles.inputBox}>
                  <Ionicons name="call-outline" size={18} color={colors.textSecondary} />
                  <TextInput
                    style={styles.textInput}
                    placeholder="10-digit Mobile Number *"
                    placeholderTextColor={colors.textMuted}
                    keyboardType="phone-pad"
                    maxLength={10}
                    value={phone}
                    onChangeText={setPhone}
                  />
                </View>
              )}
              {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}

              <View style={styles.inputBox}>
                <Ionicons name="lock-closed-outline" size={18} color={colors.textSecondary} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Password (min 6 chars) *"
                  placeholderTextColor={colors.textMuted}
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={18}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
              </View>
              {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

              {isSignUp && (
                <View style={styles.inputBox}>
                  <Ionicons name="shield-outline" size={18} color={colors.textSecondary} />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Confirm Password *"
                    placeholderTextColor={colors.textMuted}
                    secureTextEntry={!showPassword}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                  />
                </View>
              )}
              {errors.confirmPassword && (
                <Text style={styles.errorText}>{errors.confirmPassword}</Text>
              )}

              <TouchableOpacity
                style={styles.getStartedBtn}
                onPress={handleAuthSubmit}
                activeOpacity={0.85}
              >
                <Text style={styles.getStartedBtnText}>
                  {isSignUp
                    ? `Create ${selectedRole === 'admin' ? 'Admin' : 'Customer'} Account`
                    : `Sign In as ${selectedRole === 'admin' ? 'Admin' : 'Customer'}`}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.backLink}
                onPress={() => setShowAuthForm(false)}
              >
                <Text style={styles.backLinkText}>← Back to Welcome</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.creamLight,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  heroSection: {
    alignItems: 'center',
    paddingTop: 20,
    paddingHorizontal: 24,
  },
  mintBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 380,
    backgroundColor: colors.mintLight,
    borderBottomLeftRadius: 180,
    borderBottomRightRadius: 180,
  },
  threeDContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    height: 270,
  },
  threeDImageWrapper: {
    zIndex: 2,
  },
  fruitClusterImg: {
    width: width * 0.72,
    height: 250,
  },
  groundShadow: {
    position: 'absolute',
    bottom: 5,
    width: width * 0.55,
    height: 18,
    borderRadius: 50,
    backgroundColor: '#000000',
    zIndex: 1,
  },
  badge3D: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
    marginTop: 6,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  badge3DText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
    marginLeft: 4,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 14,
    zIndex: 2,
  },
  activeDot: {
    width: 24,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#202020',
    marginRight: 6,
  },
  inactiveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#B5B5B5',
    marginRight: 6,
  },
  figmaTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#202020',
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  figmaSubtitle: {
    fontSize: 14,
    color: '#71717A',
    textAlign: 'center',
    marginTop: 6,
    paddingHorizontal: 20,
    lineHeight: 20,
  },
  actionBlock: {
    width: '100%',
    marginTop: 22,
  },
  getStartedBtn: {
    backgroundColor: colors.primary,
    height: 52,
    borderRadius: 26,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    elevation: 5,
    shadowColor: colors.primary,
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  getStartedBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  fastLoginCard: {
    backgroundColor: colors.primaryLight,
    borderRadius: 16,
    padding: 12,
    marginTop: 18,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  fastLoginTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primaryDark,
    marginBottom: 8,
  },
  fastBtnRow: {
    flexDirection: 'row',
  },
  fastCustBtn: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  fastCustText: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 4,
  },
  fastAdminBtn: {
    flex: 1,
    backgroundColor: '#EDE9FE',
    paddingVertical: 8,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
    borderWidth: 1,
    borderColor: '#7C3AED',
  },
  fastAdminText: {
    color: '#7C3AED',
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 4,
  },
  authCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    width: '100%',
    marginTop: 18,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  tabToggle: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 14,
    padding: 4,
    marginBottom: 12,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 10,
  },
  toggleBtnActive: {
    backgroundColor: '#FFFFFF',
    elevation: 2,
  },
  toggleText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  toggleTextActive: {
    color: '#1C1917',
    fontWeight: '800',
  },
  roleRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  roleChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginHorizontal: 3,
  },
  roleChipCustomerActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  roleChipAdminActive: {
    backgroundColor: '#EDE9FE',
    borderColor: '#7C3AED',
  },
  roleChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
    marginLeft: 4,
  },
  roleChipCustomerText: {
    color: colors.primary,
    fontWeight: '700',
  },
  roleChipAdminText: {
    color: '#7C3AED',
    fontWeight: '700',
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
    height: 46,
    marginBottom: 10,
  },
  textInput: {
    flex: 1,
    height: '100%',
    marginLeft: 8,
    fontSize: 13,
    color: '#1C1917',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 11,
    marginBottom: 6,
    marginLeft: 4,
  },
  backLink: {
    alignItems: 'center',
    marginTop: 12,
  },
  backLinkText: {
    fontSize: 13,
    color: '#71717A',
    fontWeight: '600',
  },
});
