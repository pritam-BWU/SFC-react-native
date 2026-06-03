import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { RootStackParamList } from '../../../navigation/types';

export const BOTTOM_NAV_HEIGHT = 78;

type MainTabRoute = 'Home' | 'Categories' | 'Subscription' | 'Notifications' | 'Profile';

type Props = {
  activeRoute?: keyof RootStackParamList;
  onNavigate: (route: MainTabRoute) => void;
};

const RED = '#CC0000';
const MUTED = '#555555';

const tabs: Array<{
  route: MainTabRoute;
  label: string;
  icon: string;
  featured?: boolean;
}> = [
  { route: 'Home', label: 'Home', icon: '\u2302' },
  { route: 'Categories', label: 'Categories', icon: '\u25A6' },
  { route: 'Subscription', label: 'Membership', icon: '\u265B', featured: true },
  { route: 'Notifications', label: 'Notifications', icon: '\u25CF' },
  { route: 'Profile', label: 'Profile', icon: '\u25CE' },
] as const;

const membershipRoutes: Array<keyof RootStackParamList> = [
  'Subscription',
  'MembershipPlanList',
  'MembershipPlanDetail',
  'MembershipCheckout',
  'MembershipSuccess',
];

const isActive = (
  activeRoute: keyof RootStackParamList | undefined,
  route: MainTabRoute,
) => {
  if (!activeRoute) {
    return false;
  }

  if (route === 'Subscription') {
    return membershipRoutes.includes(activeRoute);
  }

  return activeRoute === route;
};

const BottomNavigation = ({ activeRoute, onNavigate }: Props) => {
  return (
    <View style={styles.bar}>
      {tabs.map(({ route, label, icon, featured }) => {
        const active = isActive(activeRoute, route);

        if (featured) {
          return (
            <TouchableOpacity
              key={route}
              activeOpacity={0.78}
              style={styles.featuredTab}
              onPress={() => onNavigate(route)}
            >
              <View style={styles.featuredCircle}>
                <Text style={styles.featuredIcon}>{icon}</Text>
              </View>
              <Text style={[styles.label, styles.featuredLabel, active && styles.active]}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        }

        return (
          <TouchableOpacity
            key={route}
            activeOpacity={0.78}
            style={styles.tab}
            onPress={() => onNavigate(route)}
          >
            <Text style={[styles.icon, active && styles.active]}>{icon}</Text>
            <Text style={[styles.label, active && styles.active]}>{label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: BOTTOM_NAV_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#EFEFEF',
    backgroundColor: '#FFFFFF',
    paddingBottom: 8,
    elevation: 14,
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -3 },
  },
  tab: {
    width: 68,
    alignItems: 'center',
    paddingTop: 8,
  },
  featuredTab: {
    width: 86,
    alignItems: 'center',
    marginTop: -28,
  },
  featuredCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: RED,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    elevation: 7,
    shadowColor: RED,
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  label: {
    color: MUTED,
    fontSize: 10,
    fontWeight: '700',
    marginTop: 4,
  },
  icon: {
    color: MUTED,
    fontSize: 24,
    fontWeight: '900',
    lineHeight: 26,
  },
  featuredIcon: {
    color: '#FFFFFF',
    fontSize: 29,
    fontWeight: '900',
    lineHeight: 32,
  },
  featuredLabel: {
    color: RED,
    fontSize: 9.5,
    fontWeight: '900',
    marginTop: 0,
  },
  active: {
    color: RED,
  },
});

export default BottomNavigation;
