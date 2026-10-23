import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthHomeScreen } from '../screens/auth/AuthHomeScreen';
import { DrawerNavigator } from './DrawerNavigator';
import { ProductDetailsScreen } from '../screens/products/ProductDetailsScreen';
import { EditProfileScreen } from '../screens/profile/EditProfileScreen';

const Stack = createNativeStackNavigator();

export const RootNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="AuthHome"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      {/* 1. Home Screen with options Sign up & Sign in (Admin and Customers) */}
      <Stack.Screen name="AuthHome" component={AuthHomeScreen} />

      {/* Main App Container with Drawer & Bottom Tabs */}
      <Stack.Screen name="MainDrawer" component={DrawerNavigator} />

      {/* 5. Product's Details Screen (only Customer) */}
      <Stack.Screen
        name="ProductDetails"
        component={ProductDetailsScreen}
        options={{
          animation: 'slide_from_bottom',
        }}
      />

      {/* 3. Edit Profile Screen (only Customer) */}
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{
          animation: 'slide_from_right',
        }}
      />
    </Stack.Navigator>
  );
};
