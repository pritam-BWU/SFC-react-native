import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import LoginScreen from '../screens/auth/LoginScreen/LoginScreen';
import SignUpScreen from '../screens/auth/SignUpScreen/SignUpScreen';
import HomeScreen from '../screens/home/HomeScreen/HomeScreen';
import MembershipCheckoutScreen from '../screens/home/MembershipCheckoutScreen/MembershipCheckoutScreen';
import MembershipSuccessScreen from '../screens/home/MembershipSuccessScreen/MembershipSuccessScreen';
import ProductDetailScreen from '../screens/home/ProductDetailScreen/ProductDetailScreen';
import ProfileScreen from '../screens/home/ProfileScreen/ProfileScreen';
import SubscriptionScreen from '../screens/home/SubscriptionScreen/SubscriptionScreen';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#FFFDF3' },
          }}
        >
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
          <Stack.Screen name="Subscription" component={SubscriptionScreen} />
          <Stack.Screen
            name="MembershipCheckout"
            component={MembershipCheckoutScreen}
          />
          <Stack.Screen
            name="MembershipSuccess"
            component={MembershipSuccessScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default AppNavigator;
