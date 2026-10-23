import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { TabNavigator } from './TabNavigator';
import { CustomDrawerContent } from './CustomDrawerContent';
import { ProductsListScreen } from '../screens/products/ProductsListScreen';
import { FavoritesScreen } from '../screens/favorites/FavoritesScreen';
import { CartScreen } from '../screens/cart/CartScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { AdminManageScreen } from '../screens/admin/AdminManageScreen';
import { colors } from '../theme/colors';

const Drawer = createDrawerNavigator();

export const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerActiveTintColor: colors.primary,
        drawerInactiveTintColor: colors.textSecondary,
        drawerType: 'front',
        drawerStyle: {
          width: 300,
          backgroundColor: colors.creamLight,
        },
      }}
    >
      <Drawer.Screen
        name="MainTabs"
        component={TabNavigator}
        options={{
          drawerLabel: 'FreshMart Store',
        }}
      />
      <Drawer.Screen
        name="DrawerProducts"
        component={ProductsListScreen}
        options={{
          drawerLabel: 'Products List',
        }}
      />
      <Drawer.Screen
        name="DrawerFavorites"
        component={FavoritesScreen}
        options={{
          drawerLabel: 'My Favorites',
        }}
      />
      <Drawer.Screen
        name="DrawerCart"
        component={CartScreen}
        options={{
          drawerLabel: 'My Cart',
        }}
      />
      <Drawer.Screen
        name="DrawerProfile"
        component={ProfileScreen}
        options={{
          drawerLabel: 'Customer Profile',
        }}
      />
      <Drawer.Screen
        name="DrawerAdminManage"
        component={AdminManageScreen}
        options={{
          drawerLabel: 'Store Inventory (Admin)',
        }}
      />
    </Drawer.Navigator>
  );
};
