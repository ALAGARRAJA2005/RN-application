import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { ProductsListScreen } from '../screens/products/ProductsListScreen';
import { FavoritesScreen } from '../screens/favorites/FavoritesScreen';
import { CartScreen } from '../screens/cart/CartScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { AdminManageScreen } from '../screens/admin/AdminManageScreen';
import { useApp } from '../context/AppContext';
import { colors } from '../theme/colors';

const Tab = createBottomTabNavigator();

export const TabNavigator = () => {
  const { cartItemCount, favorites, currentUser } = useApp();
  const isAdmin = currentUser?.role === 'admin';

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#F1F5F9',
          height: 62,
          paddingBottom: 8,
          paddingTop: 6,
          elevation: 8,
          shadowColor: '#000',
          shadowOpacity: 0.06,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: -2 },
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700',
        },
      }}
    >
      {/* 1. Home / Groceries Screen (Both Admin & Customer) */}
      <Tab.Screen
        name="ProductsTab"
        component={ProductsListScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={styles.iconContainer}>
              <Ionicons
                name={focused ? 'home' : 'home-outline'}
                size={22}
                color={focused ? colors.primary : color}
              />
              {focused && <View style={styles.activePill} />}
            </View>
          ),
        }}
      />

      {/* CUSTOMER ONLY: 2. Favourite Screen */}
      {!isAdmin && (
        <Tab.Screen
          name="FavoritesTab"
          component={FavoritesScreen}
          options={{
            tabBarLabel: 'Favourite',
            tabBarBadge: favorites.length > 0 ? favorites.length : undefined,
            tabBarBadgeStyle: {
              backgroundColor: colors.danger,
              fontSize: 9,
              fontWeight: '700',
            },
            tabBarIcon: ({ color, size, focused }) => (
              <View style={styles.iconContainer}>
                <Ionicons
                  name={focused ? 'heart' : 'heart-outline'}
                  size={22}
                  color={focused ? colors.danger : color}
                />
                {focused && <View style={[styles.activePill, { backgroundColor: colors.danger }]} />}
              </View>
            ),
          }}
        />
      )}

      {/* CUSTOMER ONLY: 3. My Cart Screen (Admin la cart vara kudathu - ONLY Customer!) */}
      {!isAdmin && (
        <Tab.Screen
          name="CartTab"
          component={CartScreen}
          options={{
            tabBarLabel: 'My Cart',
            tabBarBadge: cartItemCount > 0 ? cartItemCount : undefined,
            tabBarBadgeStyle: {
              backgroundColor: colors.primary,
              fontSize: 9,
              fontWeight: '700',
            },
            tabBarIcon: ({ color, size, focused }) => (
              <View style={styles.iconContainer}>
                <Ionicons
                  name={focused ? 'cart' : 'cart-outline'}
                  size={22}
                  color={focused ? colors.primary : color}
                />
                {focused && <View style={styles.activePill} />}
              </View>
            ),
          }}
        />
      )}

      {/* ADMIN ONLY: 4. Manage Stock & Catalog */}
      {isAdmin && (
        <Tab.Screen
          name="AdminManageTab"
          component={AdminManageScreen}
          options={{
            tabBarLabel: 'Manage Stock',
            tabBarIcon: ({ color, size, focused }) => (
              <View style={styles.iconContainer}>
                <Ionicons
                  name={focused ? 'cube' : 'cube-outline'}
                  size={22}
                  color={focused ? '#7C3AED' : color}
                />
                {focused && <View style={[styles.activePill, { backgroundColor: '#7C3AED' }]} />}
              </View>
            ),
          }}
        />
      )}

      {/* CUSTOMER ONLY: 5. Profile Screen (Only Customer!) */}
      {!isAdmin && (
        <Tab.Screen
          name="ProfileTab"
          component={ProfileScreen}
          options={{
            tabBarLabel: 'Profile',
            tabBarIcon: ({ color, size, focused }) => (
              <View style={styles.iconContainer}>
                <Ionicons
                  name={focused ? 'person' : 'person-outline'}
                  size={22}
                  color={focused ? colors.primary : color}
                />
                {focused && <View style={styles.activePill} />}
              </View>
            ),
          }}
        />
      )}
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  activePill: {
    position: 'absolute',
    bottom: -6,
    width: 14,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.primary,
  },
});
