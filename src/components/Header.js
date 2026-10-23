import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useApp } from '../context/AppContext';
import { colors } from '../theme/colors';

export const Header = ({ title = 'FreshMart', showBack = false, rightAction }) => {
  const navigation = useNavigation();
  const { currentUser, cartItemCount, switchRole } = useApp();

  const isAdmin = currentUser?.role === 'admin';

  return (
    <View style={styles.container}>
      <View style={styles.leftRow}>
        {showBack ? (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.openDrawer && navigation.openDrawer()}
            activeOpacity={0.7}
          >
            <Ionicons name="menu-outline" size={26} color={colors.text} />
          </TouchableOpacity>
        )}

        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          {currentUser && (
            <TouchableOpacity
              onPress={() => switchRole(isAdmin ? 'customer' : 'admin')}
              style={[
                styles.roleBadge,
                isAdmin ? styles.adminBadge : styles.customerBadge,
              ]}
              activeOpacity={0.8}
            >
              <Ionicons
                name={isAdmin ? 'shield-checkmark' : 'person'}
                size={11}
                color={isAdmin ? colors.roleAdmin : colors.primary}
              />
              <Text
                style={[
                  styles.roleBadgeText,
                  isAdmin ? styles.adminBadgeText : styles.customerBadgeText,
                ]}
              >
                {isAdmin ? 'ADMIN' : 'CUSTOMER'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.rightRow}>
        {rightAction ? (
          rightAction
        ) : (
          <TouchableOpacity
            style={styles.cartButton}
            onPress={() => navigation.navigate('CartTab')}
            activeOpacity={0.7}
          >
            <Ionicons name="cart-outline" size={24} color={colors.text} />
            {cartItemCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>
                  {cartItemCount > 99 ? '99+' : cartItemCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 64,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.3,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 12,
    marginLeft: 8,
  },
  customerBadge: {
    backgroundColor: colors.roleCustomerLight,
  },
  adminBadge: {
    backgroundColor: colors.roleAdminLight,
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
    color: colors.roleAdmin,
  },
  rightRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: colors.danger,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: colors.surface,
  },
  cartBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
});
