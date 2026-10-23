import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import {
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { colors } from '../theme/colors';

export const CustomDrawerContent = (props) => {
  const { currentUser, switchRole, logout, favorites, cartItemCount } = useApp();
  const isAdmin = currentUser?.role === 'admin';

  const handleLogout = () => {
    logout();
    props.navigation.replace('AuthHome');
  };

  return (
    <View style={styles.container}>
      <DrawerContentScrollView {...props} contentContainerStyle={styles.scroll}>
        {/* Header User Card (No profile photo image, letter badge) */}
        <View style={styles.headerCard}>
          <View
            style={[
              styles.avatarPlaceholder,
              isAdmin ? styles.avatarAdmin : styles.avatarCustomer,
            ]}
          >
            <Text style={styles.avatarText}>
              {currentUser?.name?.charAt(0)?.toUpperCase() || (isAdmin ? 'A' : 'R')}
            </Text>
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.userName} numberOfLines={1}>
              {currentUser?.name || 'FreshMart User'}
            </Text>
            <Text style={styles.userEmail} numberOfLines={1}>
              {currentUser?.email}
            </Text>

            <View style={styles.roleContainer}>
              <View
                style={[
                  styles.roleBadge,
                  isAdmin ? styles.adminBadge : styles.customerBadge,
                ]}
              >
                <Ionicons
                  name={isAdmin ? 'shield-checkmark' : 'person'}
                  size={12}
                  color={isAdmin ? '#7C3AED' : colors.primary}
                />
                <Text
                  style={[
                    styles.roleBadgeText,
                    isAdmin ? styles.adminBadgeText : styles.customerBadgeText,
                  ]}
                >
                  {isAdmin ? 'ADMIN' : 'CUSTOMER'}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.switchRoleBtn}
                onPress={() => switchRole(isAdmin ? 'customer' : 'admin')}
              >
                <Text style={styles.switchRoleText}>Toggle Role</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Stats Banner: For Customer shows Cart, for Admin shows Inventory */}
        {!isAdmin ? (
          <View style={styles.statsBanner}>
            <TouchableOpacity
              style={styles.statCol}
              onPress={() => props.navigation.navigate('MainTabs', { screen: 'CartTab' })}
            >
              <Ionicons name="cart" size={16} color={colors.primary} />
              <Text style={styles.statNumber}>{cartItemCount}</Text>
              <Text style={styles.statDesc}>My Cart</Text>
            </TouchableOpacity>

            <View style={styles.statDivider} />

            <TouchableOpacity
              style={styles.statCol}
              onPress={() => props.navigation.navigate('MainTabs', { screen: 'FavoritesTab' })}
            >
              <Ionicons name="heart" size={16} color={colors.danger} />
              <Text style={styles.statNumber}>{favorites.length}</Text>
              <Text style={styles.statDesc}>Favourite</Text>
            </TouchableOpacity>

            <View style={styles.statDivider} />

            <View style={styles.statCol}>
              <Ionicons name="wallet" size={16} color={colors.accent} />
              <Text style={styles.statNumber}>
                Rs {currentUser?.walletBalance?.toFixed(0) || '750'}
              </Text>
              <Text style={styles.statDesc}>Wallet</Text>
            </View>
          </View>
        ) : (
          <View style={styles.statsBanner}>
            <View style={styles.statCol}>
              <Ionicons name="shield-checkmark" size={16} color="#7C3AED" />
              <Text style={styles.statNumber}>ADMIN</Text>
              <Text style={styles.statDesc}>Portal</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statCol}>
              <Ionicons name="cube" size={16} color="#7C3AED" />
              <Text style={styles.statNumber}>9 Items</Text>
              <Text style={styles.statDesc}>Stock</Text>
            </View>
          </View>
        )}

        {/* Navigation Items */}
        <View style={styles.menuList}>
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => props.navigation.navigate('MainTabs', { screen: 'ProductsTab' })}
          >
            <View style={styles.navItemLeft}>
              <Ionicons name="home-outline" size={20} color={colors.primary} />
              <Text style={styles.navItemText}>Daily Grocery Food (Home)</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
          </TouchableOpacity>

          {/* Customer ONLY navigation options */}
          {!isAdmin && (
            <>
              <TouchableOpacity
                style={styles.navItem}
                onPress={() => props.navigation.navigate('MainTabs', { screen: 'FavoritesTab' })}
              >
                <View style={styles.navItemLeft}>
                  <Ionicons name="heart-outline" size={20} color={colors.danger} />
                  <Text style={styles.navItemText}>Favourite Screen (Customer)</Text>
                </View>
                {favorites.length > 0 && (
                  <View style={styles.countBadge}>
                    <Text style={styles.countBadgeText}>{favorites.length}</Text>
                  </View>
                )}
              </TouchableOpacity>

              {/* Cart is ONLY for Customer */}
              <TouchableOpacity
                style={styles.navItem}
                onPress={() => props.navigation.navigate('MainTabs', { screen: 'CartTab' })}
              >
                <View style={styles.navItemLeft}>
                  <Ionicons name="cart-outline" size={20} color={colors.primary} />
                  <Text style={styles.navItemText}>My Cart (Customer Only)</Text>
                </View>
                {cartItemCount > 0 && (
                  <View style={[styles.countBadge, { backgroundColor: colors.primary }]}>
                    <Text style={styles.countBadgeText}>{cartItemCount}</Text>
                  </View>
                )}
              </TouchableOpacity>

              {/* Profile & Edit Profile is ONLY for Customer */}
              <TouchableOpacity
                style={styles.navItem}
                onPress={() => props.navigation.navigate('MainTabs', { screen: 'ProfileTab' })}
              >
                <View style={styles.navItemLeft}>
                  <Ionicons name="person-outline" size={20} color={colors.primary} />
                  <Text style={styles.navItemText}>Profile & Edit Profile (Customer)</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
              </TouchableOpacity>
            </>
          )}

          {/* Admin only options */}
          {isAdmin && (
            <>
              <TouchableOpacity
                style={styles.navItem}
                onPress={() => props.navigation.navigate('MainTabs', { screen: 'AdminManageTab' })}
              >
                <View style={styles.navItemLeft}>
                  <Ionicons name="cube-outline" size={20} color="#7C3AED" />
                  <Text style={styles.navItemText}>Manage Stock & Inventory</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
              </TouchableOpacity>
            </>
          )}
        </View>
      </DrawerContentScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.signOutBtn}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Ionicons name="log-out-outline" size={20} color={colors.danger} />
          <Text style={styles.signOutText}>Sign Out & Go to Welcome</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.creamLight,
  },
  scroll: {
    paddingTop: 10,
  },
  headerCard: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  avatarPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  avatarCustomer: {
    backgroundColor: colors.primary,
  },
  avatarAdmin: {
    backgroundColor: '#7C3AED',
  },
  avatarText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  headerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },
  userEmail: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 1,
  },
  roleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  customerBadge: {
    backgroundColor: colors.primaryLight,
  },
  adminBadge: {
    backgroundColor: '#EDE9FE',
  },
  roleBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    marginLeft: 3,
  },
  customerBadgeText: {
    color: colors.primary,
  },
  adminBadgeText: {
    color: '#7C3AED',
  },
  switchRoleBtn: {
    backgroundColor: colors.surface,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  switchRoleText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  statsBanner: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    marginHorizontal: 16,
    marginTop: 14,
    borderRadius: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.borderLight,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 5,
  },
  statCol: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.text,
    marginTop: 2,
  },
  statDesc: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border,
    height: '70%',
    alignSelf: 'center',
  },
  menuList: {
    marginTop: 16,
    paddingHorizontal: 12,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 13,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 4,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  navItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  navItemText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginLeft: 12,
  },
  countBadge: {
    backgroundColor: colors.danger,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  countBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    backgroundColor: colors.surface,
  },
  signOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEE2E2',
    paddingVertical: 12,
    borderRadius: 12,
  },
  signOutText: {
    color: colors.danger,
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 8,
  },
});
