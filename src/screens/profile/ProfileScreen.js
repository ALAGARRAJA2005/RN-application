import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { colors } from '../../theme/colors';

export const ProfileScreen = ({ navigation }) => {
  const { currentUser, favorites, cartItemCount, logout, switchRole } = useApp();
  const isAdmin = currentUser?.role === 'admin';

  const editBtnScale = useRef(new Animated.Value(1)).current;

  const handleEditPressIn = () => {
    Animated.spring(editBtnScale, { toValue: 0.94, useNativeDriver: true }).start();
  };

  const handleEditPressOut = () => {
    Animated.spring(editBtnScale, { toValue: 1, friction: 3, useNativeDriver: true }).start();
  };

  // Requirement: "Profile and Edit Profile Screen (only Customer)"
  if (isAdmin) {
    return (
      <View style={styles.restrictedContainer}>
        <View style={styles.restrictedCard}>
          <View style={styles.restrictedIconBox}>
            <Ionicons name="lock-closed" size={44} color="#7C3AED" />
          </View>
          <Text style={styles.restrictedTitle}>Customer Profile Only</Text>
          <Text style={styles.restrictedSubtitle}>
            Per model exam requirements, Profile and Edit Profile screens are strictly reserved for Customer accounts. Admins have access to stock, catalog, and inventory management.
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
            onPress={() => navigation.navigate('ProductsTab')}
          >
            <Text style={styles.backStoreText}>← Back to Grocery Store</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity
          style={styles.circleBackBtn}
          onPress={() => navigation.openDrawer && navigation.openDrawer()}
          activeOpacity={0.8}
        >
          <Ionicons name="menu-outline" size={22} color={colors.text} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Customer Profile</Text>

        <TouchableOpacity
          style={styles.circleBackBtn}
          onPress={() => navigation.navigate('EditProfile')}
          activeOpacity={0.8}
        >
          <Ionicons name="create-outline" size={18} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        bounces={true}
        overScrollMode="never"
      >
        {/* Customer Profile Card */}
        <View style={styles.profileHeaderCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarInitial}>
                {currentUser?.name?.charAt(0)?.toUpperCase() || 'R'}
              </Text>
            </View>
            <View style={styles.avatarBadge}>
              <Ionicons name="checkmark-circle" size={22} color={colors.primary} />
            </View>
          </View>

          <Text style={styles.userName}>{currentUser?.name || 'Customer User'}</Text>
          <Text style={styles.userEmail}>{currentUser?.email}</Text>

          {/* Member Tier Pill */}
          <View style={styles.tierPill}>
            <Ionicons name="sparkles" size={13} color={colors.accent} />
            <Text style={styles.tierText}>
              {currentUser?.tier || 'Gold Customer Member'}
            </Text>
          </View>

          {/* 3D Animated Edit Profile Action Button */}
          <Animated.View style={{ transform: [{ scale: editBtnScale }] }}>
            <TouchableOpacity
              style={styles.editProfileBtn}
              onPressIn={handleEditPressIn}
              onPressOut={handleEditPressOut}
              onPress={() => navigation.navigate('EditProfile')}
              activeOpacity={0.9}
            >
              <Ionicons name="create-outline" size={16} color="#FFFFFF" />
              <Text style={styles.editProfileBtnText}>Edit Profile</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* User Stats Grid */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{currentUser?.ordersCount || 14}</Text>
            <Text style={styles.statLabel}>Orders</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={[styles.statValue, { color: colors.danger }]}>{favorites.length}</Text>
            <Text style={styles.statLabel}>Favourites</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={[styles.statValue, { color: colors.primary }]}>
              Rs {currentUser?.walletBalance?.toFixed(0) || '750'}
            </Text>
            <Text style={styles.statLabel}>Grocery Wallet</Text>
          </View>
        </View>

        {/* Personal Details Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Contact & Delivery Details</Text>

          <View style={styles.infoRow}>
            <View style={styles.infoIconBox}>
              <Ionicons name="call-outline" size={18} color={colors.primary} />
            </View>
            <View style={styles.infoTextCol}>
              <Text style={styles.infoLabel}>Phone Number</Text>
              <Text style={styles.infoValue}>{currentUser?.phone || '+91 9876543210'}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.infoIconBox}>
              <Ionicons name="location-outline" size={18} color={colors.primary} />
            </View>
            <View style={styles.infoTextCol}>
              <Text style={styles.infoLabel}>Delivery Address</Text>
              <Text style={styles.infoValue}>
                {currentUser?.address || 'Flat 402, Green Valley Apartments, MG Road, Bangalore'}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.infoIconBox}>
              <Ionicons name="calendar-outline" size={18} color={colors.primary} />
            </View>
            <View style={styles.infoTextCol}>
              <Text style={styles.infoLabel}>Member Since</Text>
              <Text style={styles.infoValue}>{currentUser?.joinedDate || 'January 2026'}</Text>
            </View>
          </View>
        </View>

        {/* Customer Account Settings */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Preferences</Text>

          <TouchableOpacity
            style={styles.prefRow}
            onPress={() => navigation.navigate('FavoritesTab')}
          >
            <View style={styles.prefLeft}>
              <Ionicons name="heart" size={18} color={colors.danger} />
              <Text style={styles.prefText}>My Wishlist & Favourites</Text>
            </View>
            <View style={styles.prefRight}>
              <Text style={styles.prefCount}>{favorites.length} items</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
            </View>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.prefRow}
            onPress={() => navigation.navigate('CartTab')}
          >
            <View style={styles.prefLeft}>
              <Ionicons name="cart" size={18} color={colors.primary} />
              <Text style={styles.prefText}>My Grocery Cart</Text>
            </View>
            <View style={styles.prefRight}>
              <Text style={styles.prefCount}>{cartItemCount} items</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
            </View>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.prefRow}
            onPress={() => switchRole('admin')}
          >
            <View style={styles.prefLeft}>
              <Ionicons name="shield-checkmark" size={18} color="#7C3AED" />
              <Text style={styles.prefText}>Switch to Admin Mode</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => {
            logout();
            navigation.replace('AuthHome');
          }}
          activeOpacity={0.8}
        >
          <Ionicons name="log-out-outline" size={18} color={colors.danger} />
          <Text style={styles.logoutBtnText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
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
  profileHeaderCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 10,
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
  avatarBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },
  userName: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 3,
  },
  userEmail: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 10,
  },
  tierPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accentLight,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 16,
  },
  tierText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.accent,
    marginLeft: 5,
  },
  editProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 14,
    elevation: 2,
    shadowColor: colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  editProfileBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 6,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: 'center',
    marginHorizontal: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 5,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  statValue: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  sectionCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 5,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 14,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  infoIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  infoTextCol: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 13,
    color: colors.text,
    fontWeight: '700',
    marginTop: 1,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: 10,
  },
  prefRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  prefLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  prefText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    marginLeft: 10,
  },
  prefRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  prefCount: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
    marginRight: 4,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEE2E2',
    paddingVertical: 14,
    borderRadius: 16,
    marginTop: 6,
  },
  logoutBtnText: {
    color: colors.danger,
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 6,
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
