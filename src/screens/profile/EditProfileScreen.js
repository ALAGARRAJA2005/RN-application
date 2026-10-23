import React, { useState, useRef } from 'react';
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
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { colors } from '../../theme/colors';

export const EditProfileScreen = ({ navigation }) => {
  const { currentUser, updateProfile, switchRole } = useApp();
  const isAdmin = currentUser?.role === 'admin';

  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [address, setAddress] = useState(currentUser?.address || '');
  const [tier, setTier] = useState(currentUser?.tier || 'Gold Customer Member');

  const [errors, setErrors] = useState({});
  const saveBtnScale = useRef(new Animated.Value(1)).current;

  // Requirement: "Profile and Edit Profile Screen (only Customer)"
  if (isAdmin) {
    return (
      <View style={styles.restrictedContainer}>
        <View style={styles.restrictedCard}>
          <View style={styles.restrictedIconBox}>
            <Ionicons name="lock-closed" size={44} color="#7C3AED" />
          </View>
          <Text style={styles.restrictedTitle}>Access Restricted</Text>
          <Text style={styles.restrictedSubtitle}>
            Edit Profile screen is strictly reserved for Customer accounts only.
          </Text>
          <TouchableOpacity
            style={styles.switchCustBtn}
            onPress={() => switchRole('customer')}
            activeOpacity={0.85}
          >
            <Ionicons name="person" size={16} color="#FFFFFF" />
            <Text style={styles.switchCustBtnText}>Switch to Customer Mode</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backStoreBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backStoreText}>← Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const validate = () => {
    let errs = {};

    if (!name.trim() || name.trim().length < 3) {
      errs.name = 'Full Name must be at least 3 characters';
    }

    const cleanPhone = phone.trim().replace(/\D/g, '');
    if (!phone.trim()) {
      errs.phone = 'Mobile number is required';
    } else if (cleanPhone.length !== 10) {
      errs.phone = 'Mobile number must be exactly 10 digits';
    }

    if (!address.trim() || address.trim().length < 8) {
      errs.address = 'Delivery address must be at least 8 characters';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSavePressIn = () => {
    Animated.spring(saveBtnScale, { toValue: 0.94, useNativeDriver: true }).start();
  };

  const handleSavePressOut = () => {
    Animated.spring(saveBtnScale, { toValue: 1, friction: 3, useNativeDriver: true }).start();
  };

  const handleSave = () => {
    if (!validate()) return;

    updateProfile({
      name: name.trim(),
      phone: phone.trim(),
      address: address.trim(),
      tier: tier.trim(),
    });

    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      {/* Top Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity
          style={styles.circleBackBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-back" size={20} color={colors.text} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Edit Profile</Text>

        <View style={{ width: 42 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        bounces={true}
        overScrollMode="never"
      >
        {/* Avatar Badge (No profile photo image) */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarInitial}>
              {name?.charAt(0)?.toUpperCase() || 'R'}
            </Text>
          </View>
          <View style={styles.avatarHint}>
            <Text style={styles.avatarHintText}>Customer Account</Text>
          </View>
        </View>

        {/* Edit Form */}
        <View style={styles.formCard}>
          <Text style={styles.cardHeader}>Customer Profile Details</Text>

          {/* Full Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name *</Text>
            <View style={[styles.inputBox, errors.name && styles.inputBoxError]}>
              <Ionicons name="person-outline" size={18} color={colors.textMuted} />
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter customer name"
                placeholderTextColor={colors.textMuted}
              />
            </View>
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          </View>

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address (Read-Only)</Text>
            <View style={[styles.inputBox, styles.inputBoxDisabled]}>
              <Ionicons name="mail-outline" size={18} color={colors.textMuted} />
              <TextInput
                style={[styles.input, { color: colors.textMuted }]}
                value={currentUser?.email}
                editable={false}
              />
              <Ionicons name="lock-closed" size={14} color={colors.textMuted} />
            </View>
          </View>

          {/* Phone */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mobile Phone Number (10 Digits) *</Text>
            <View style={[styles.inputBox, errors.phone && styles.inputBoxError]}>
              <Ionicons name="call-outline" size={18} color={colors.textMuted} />
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="9876543210"
                placeholderTextColor={colors.textMuted}
                keyboardType="phone-pad"
                maxLength={10}
              />
            </View>
            {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
          </View>

          {/* Member Tier */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Customer Loyalty Tier</Text>
            <View style={styles.inputBox}>
              <Ionicons name="ribbon-outline" size={18} color={colors.accent} />
              <TextInput
                style={styles.input}
                value={tier}
                onChangeText={setTier}
                placeholder="e.g. Gold Customer Member"
                placeholderTextColor={colors.textMuted}
              />
            </View>
          </View>

          {/* Delivery Address */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Default Delivery Address *</Text>
            <View
              style={[
                styles.textAreaBox,
                errors.address && styles.inputBoxError,
              ]}
            >
              <Ionicons
                name="location-outline"
                size={18}
                color={colors.textMuted}
                style={{ marginTop: 4 }}
              />
              <TextInput
                style={styles.textArea}
                value={address}
                onChangeText={setAddress}
                placeholder="House/Flat No, Street, Landmark, City, PIN"
                placeholderTextColor={colors.textMuted}
                multiline
                numberOfLines={3}
              />
            </View>
            {errors.address && <Text style={styles.errorText}>{errors.address}</Text>}
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => navigation.goBack()}
              activeOpacity={0.8}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <Animated.View style={{ flex: 1, transform: [{ scale: saveBtnScale }] }}>
              <TouchableOpacity
                style={styles.saveButton}
                onPressIn={handleSavePressIn}
                onPressOut={handleSavePressOut}
                onPress={handleSave}
                activeOpacity={0.9}
              >
                <Text style={styles.saveText}>Save Changes</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
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
  topHeader: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  circleBackBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.3,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  avatarSection: {
    alignItems: 'center',
    marginVertical: 14,
  },
  avatarPlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    elevation: 4,
    shadowColor: colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  avatarInitial: {
    fontSize: 38,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  avatarHint: {
    marginTop: 8,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  avatarHintText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
  },
  formCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 18,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  cardHeader: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 6,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inputBoxError: {
    borderColor: colors.danger,
    backgroundColor: colors.dangerLight,
  },
  inputBoxDisabled: {
    backgroundColor: '#F1F5F9',
    borderColor: colors.borderLight,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  textAreaBox: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 88,
  },
  textArea: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: colors.text,
    textAlignVertical: 'top',
  },
  errorText: {
    fontSize: 11,
    color: colors.danger,
    marginTop: 4,
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 18,
    alignItems: 'center',
  },
  cancelButton: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 12,
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  saveButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  saveText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  restrictedContainer: {
    flex: 1,
    backgroundColor: colors.creamLight,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  restrictedCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    width: '100%',
    maxWidth: 380,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  restrictedIconBox: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#EDE9FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  restrictedTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#7C3AED',
    marginBottom: 8,
    textAlign: 'center',
  },
  restrictedSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 20,
  },
  switchCustBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7C3AED',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
    width: '100%',
    justifyContent: 'center',
    marginBottom: 12,
  },
  switchCustBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 8,
  },
  backStoreBtn: {
    paddingVertical: 10,
  },
  backStoreText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '600',
  },
});
