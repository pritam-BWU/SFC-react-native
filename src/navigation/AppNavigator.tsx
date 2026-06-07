import React from 'react';
import {
  createNavigationContainerRef,
  NavigationContainer,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import BottomNavigation from '../components/common/BottomNavigation/BottomNavigation';
import LoginScreen from '../screens/auth/LoginScreen/LoginScreen';
import SignUpScreen from '../screens/auth/SignUpScreen/SignUpScreen';
import CategoriesScreen from '../screens/home/CategoriesScreen/CategoriesScreen';
import HomeScreen from '../screens/home/HomeScreen/HomeScreen';
import MembershipCheckoutScreen from '../screens/home/MembershipCheckoutScreen/MembershipCheckoutScreen';
import MembershipPlanDetailScreen from '../screens/home/MembershipPlanDetailScreen/MembershipPlanDetailScreen';
import MembershipPlanListScreen from '../screens/home/MembershipPlanListScreen/MembershipPlanListScreen';
import MembershipSuccessScreen from '../screens/home/MembershipSuccessScreen/MembershipSuccessScreen';
import NotificationsScreen from '../screens/home/NotificationsScreen/NotificationsScreen';
import ProductDetailScreen from '../screens/home/ProductDetailScreen/ProductDetailScreen';
import QualitySourceScreen from '../screens/home/QualitySourceScreen/QualitySourceScreen';
import ProfileScreen from '../screens/home/ProfileScreen/ProfileScreen';
import SearchResultsScreen from '../screens/home/SearchResultsScreen/SearchResultsScreen';
import SubscriptionScreen from '../screens/home/SubscriptionScreen/SubscriptionScreen';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const navigationRef = createNavigationContainerRef<RootStackParamList>();

type MainTabRoute =
  | 'Home'
  | 'Categories'
  | 'Subscription'
  | 'Notifications'
  | 'Profile';

const authRoutes: Array<keyof RootStackParamList> = ['Login', 'SignUp'];
const fullScreenRoutes: Array<keyof RootStackParamList> = ['MembershipCheckout'];

const AppNavigator = () => {
  const [activeRoute, setActiveRoute] =
    React.useState<keyof RootStackParamList>('Login');

  const updateActiveRoute = () => {
    const routeName = navigationRef.getCurrentRoute()?.name;

    if (routeName) {
      setActiveRoute(routeName as keyof RootStackParamList);
    }
  };

  const handleBottomNav = (route: MainTabRoute) => {
    if (!navigationRef.isReady()) {
      return;
    }

    navigationRef.navigate(route);
  };

  const showBottomNav =
    !authRoutes.includes(activeRoute) && !fullScreenRoutes.includes(activeRoute);

  return (
    <SafeAreaProvider>
      <NavigationContainer
        ref={navigationRef}
        onReady={updateActiveRoute}
        onStateChange={updateActiveRoute}
      >
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
          <Stack.Screen name="Categories" component={CategoriesScreen} />
          <Stack.Screen name="Notifications" component={NotificationsScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
          <Stack.Screen name="QualitySource" component={QualitySourceScreen} />
          <Stack.Screen name="SearchResults" component={SearchResultsScreen} />
          <Stack.Screen name="Subscription" component={SubscriptionScreen} />
          <Stack.Screen
            name="MembershipPlanList"
            component={MembershipPlanListScreen}
          />
          <Stack.Screen
            name="MembershipPlanDetail"
            component={MembershipPlanDetailScreen}
          />
          <Stack.Screen
            name="MembershipCheckout"
            component={MembershipCheckoutScreen}
          />
          <Stack.Screen
            name="MembershipSuccess"
            component={MembershipSuccessScreen}
          />
        </Stack.Navigator>
        {showBottomNav && (
          <BottomNavigation
            activeRoute={activeRoute}
            onNavigate={handleBottomNav}
          />
        )}
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default AppNavigator;
