import React from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import FoodClubHeader from '../../../components/common/FoodClubHeader/FoodClubHeader';

const RED = '#CC0000';
const DARK = '#101010';
const MUTED = '#5B5B5B';
const PAGE_YELLOW = '#FFF0AD';
const SOFT_YELLOW = '#FFF7D6';
const BORDER = '#F1DFA0';

const notifications = [
  {
    id: 'membership',
    title: 'Membership updates',
    text: 'New member benefits and plan updates will appear here.',
    icon: '%',
  },
  {
    id: 'products',
    title: 'Product alerts',
    text: 'Fresh stock, new categories, and offer alerts will be shown here.',
    icon: '!',
  },
  {
    id: 'orders',
    title: 'Ordering coming soon',
    text: 'Delivery and order notifications will activate after ordering launches.',
    icon: '\u25F7',
  },
];

const NotificationsScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={PAGE_YELLOW} barStyle="dark-content" />
      <FoodClubHeader title="Notifications" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.subtitle}>Important app updates in one place.</Text>
        </View>

        {notifications.map(({ id, title, text, icon }) => (
          <View key={id} style={styles.card}>
            <View style={styles.iconCircle}>
              <Text style={styles.iconText}>{icon}</Text>
            </View>
            <View style={styles.copy}>
              <Text style={styles.cardTitle}>{title}</Text>
              <Text style={styles.cardText}>{text}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: PAGE_YELLOW,
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    paddingBottom: 96,
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 2,
  },
  subtitle: {
    color: MUTED,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 4,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 18,
    marginTop: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: SOFT_YELLOW,
    padding: 14,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconText: {
    color: RED,
    fontSize: 22,
    fontWeight: '900',
  },
  copy: {
    flex: 1,
  },
  cardTitle: {
    color: DARK,
    fontSize: 15,
    fontWeight: '900',
  },
  cardText: {
    color: MUTED,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '700',
    marginTop: 4,
  },
});

export default NotificationsScreen;
