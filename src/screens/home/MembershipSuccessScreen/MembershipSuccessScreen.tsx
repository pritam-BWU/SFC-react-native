import React, { useEffect, useRef } from 'react';
import {
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RootStackParamList } from '../../../navigation/types';

const { width, height } = Dimensions.get('window');

const RED = '#CC0000';
const DARK = '#101010';
const SOFT_YELLOW = '#FFF7D6';
const PALE_YELLOW = '#FFFDF0';
const BORDER = '#EFE5C2';
const NEXT_CARD_WIDTH = Math.min(150, width * 0.38);

const ICONS = {
  check: '\u2713',
  crown: '\u{1F451}',
  calendar: '\u25A3',
  tag: '\u25C7',
  bell: '\u{1F514}',
  heart: '\u2661',
  document: '\u25A4',
  clock: '\u25F7',
  headset: '\u260E',
  bag: '\u{1F6CD}\uFE0F',
  user: '\u{1F464}',
  gift: '\u{1F381}',
  home: '\u2302',
  grid: '\u25A6',
  right: '\u203A',
};

type Props = NativeStackScreenProps<RootStackParamList, 'MembershipSuccess'>;
type PlanId = RootStackParamList['MembershipSuccess']['planId'];

const planNames: Record<PlanId, string> = {
  basic: 'Basic',
  silver: 'Silver',
  gold: 'Gold',
  platinum: 'Platinum',
};

const nextSteps = [
  {
    icon: ICONS.tag,
    title: 'Explore Member Pricing',
    text: 'Browse products to see member pricing on eligible items.',
  },
  {
    icon: ICONS.bell,
    title: 'Stay Updated',
    text: "We'll notify you when ordering becomes available.",
  },
  {
    icon: ICONS.heart,
    title: 'Save Your Favorites',
    text: 'Save products you love and access them anytime.',
  },
  {
    icon: ICONS.document,
    title: 'Manage Your Plan',
    text: 'View benefits, billing details and manage your membership.',
  },
];

const benefits = [
  ['Member Pricing Access', 'Special pricing on eligible products', ICONS.tag],
  ['Early Access', 'Priority access when ordering launches', ICONS.clock],
  [
    'Product Insights',
    'Detailed information on sourcing and freshness',
    ICONS.document,
  ],
  [
    'Saved Preferences',
    'Save favorites and preferences for faster browsing',
    ICONS.heart,
  ],
  ['Priority Support', 'Faster assistance for member queries', ICONS.headset],
];

const actions = [
  ['Browse Products', ICONS.bag],
  ['View My Plan', ICONS.crown],
  ['Update Profile', ICONS.user],
  ['Contact Support', ICONS.headset],
];

const MembershipSuccessScreen = ({ navigation, route }: Props) => {
  const planName = planNames[route.params.planId];
  const nextScrollRef = useRef<ScrollView>(null);
  const nextIndexRef = useRef(0);

  useEffect(() => {
    const timer = setInterval(() => {
      nextIndexRef.current = (nextIndexRef.current + 1) % nextSteps.length;
      nextScrollRef.current?.scrollTo({
        x: nextIndexRef.current * (NEXT_CARD_WIDTH + 8),
        animated: true,
      });
    }, 2200);

    return () => clearInterval(timer);
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.page}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={styles.heroRow}>
          <View style={styles.welcomeCopy}>
            <View style={styles.successCircle}>
              <Text style={styles.successCheck}>{ICONS.check}</Text>
            </View>
            <Text style={styles.heroTitle}>
              Welcome to Superfowl FoodClub{'\n'}as a Member!
            </Text>
            <Text style={styles.heroText}>
              Thank you for joining. You are now part of Superfowl FoodClub and can enjoy
              member benefits.
            </Text>
          </View>

          <View style={styles.memberCard}>
            <Text style={styles.cardBrand}>Superfowl FoodClub</Text>
            <Text style={styles.cardMember}>MEMBER</Text>
            <View style={styles.cardDetailsRow}>
              <View>
                <Text style={styles.cardLabel} numberOfLines={1}>
                  Member ID
                </Text>
                <Text style={styles.cardValue} numberOfLines={1}>
                  FCM12345678
                </Text>
              </View>
              <View style={styles.cardDivider} />
              <View style={styles.cardDateCol}>
                <Text style={styles.cardLabel} numberOfLines={1}>
                  Member Since
                </Text>
                <Text style={styles.cardValue} numberOfLines={1}>
                  25 May 2025
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.paymentCard}>
          <View style={styles.paymentIconWrap}>
            <Text style={styles.paymentIcon}>{ICONS.crown}</Text>
          </View>
          <View style={styles.paymentCopy}>
            <Text style={styles.paymentTitle} numberOfLines={1}>
              Payment Successful!
            </Text>
            <Text style={styles.paymentText}>
              Your {planName} membership is active and all member benefits are
              unlocked.
            </Text>
          </View>
          <View style={styles.billingBox}>
            <Text style={styles.billingLabel} numberOfLines={1}>
              Next Billing Date
            </Text>
            <Text style={styles.billingDate}>{ICONS.calendar} 25 May 2026</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>What's Next?</Text>
        <ScrollView
          ref={nextScrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.nextRow}
          snapToInterval={NEXT_CARD_WIDTH + 8}
          decelerationRate="fast"
        >
          {nextSteps.map((step, index) => (
            <View key={step.title} style={styles.nextCard}>
              <Text style={styles.stepBadge}>{index + 1}</Text>
              <View style={styles.nextIconWrap}>
                <Text style={styles.nextIcon}>{step.icon}</Text>
              </View>
              <Text style={styles.nextTitle} numberOfLines={2}>
                {step.title}
              </Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.benefitsCard}>
          <Text style={styles.benefitsHeading}>Your Membership Benefits</Text>
          <View style={styles.benefitsRow}>
            {benefits.map(([title, , icon]) => (
              <View key={title} style={styles.benefitItem}>
                <Text style={styles.benefitIcon}>{icon}</Text>
                <Text style={styles.benefitTitle} numberOfLines={2}>
                  {title}
                </Text>
              </View>
            ))}
          </View>
          <View style={styles.noteBox}>
            <Text style={styles.noteIcon}>i</Text>
            <Text style={styles.noteText}>
              Benefits may vary by plan and product availability. Ordering
              features will be introduced in future app updates.
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionRow}>
          {actions.map(([label, icon]) => (
            <TouchableOpacity
              key={label}
              activeOpacity={0.8}
              style={styles.actionButton}
            >
              <Text style={styles.actionIcon}>{icon}</Text>
              <Text style={styles.actionText} numberOfLines={1}>
                {label}
              </Text>
              <Text style={styles.actionArrow}>{ICONS.right}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.footerCta}>
          <View style={styles.giftCircle}>
            <Text style={styles.giftIcon}>{ICONS.gift}</Text>
          </View>
          <View style={styles.footerCopy}>
            <Text style={styles.footerTitle} numberOfLines={1}>
              Thanks for being early!
            </Text>
            <Text style={styles.footerText} numberOfLines={2}>
              As we grow, you'll get first access to new products, offers and
              features.
            </Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.exploreButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.exploreText} numberOfLines={2}>
              Explore Products
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.bottomTabs}>
        <View style={styles.bottomTab}>
          <Text style={styles.tabIcon}>{ICONS.home}</Text>
          <Text style={styles.tabText}>Home</Text>
        </View>
        <View style={styles.bottomTab}>
          <Text style={styles.tabIcon}>{ICONS.grid}</Text>
          <Text style={styles.tabText}>Products</Text>
        </View>
        <View style={styles.bottomTab}>
          <Text style={[styles.tabIcon, styles.tabActive]}>{ICONS.crown}</Text>
          <Text style={[styles.tabText, styles.tabActive]}>Membership</Text>
        </View>
        <View style={styles.bottomTab}>
          <Text style={styles.tabIcon}>{ICONS.bell}</Text>
          <Text style={styles.tabText}>Updates</Text>
        </View>
        <View style={styles.bottomTab}>
          <Text style={styles.tabIcon}>{ICONS.user}</Text>
          <Text style={styles.tabText}>Account</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  page: {
    flexGrow: 1,
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 72,
  },
  heroRow: {
    minHeight: Math.max(110, Math.min(138, height * 0.165)),
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  welcomeCopy: {
    flex: 1,
  },
  successCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: RED,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 4,
  },
  successCheck: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '900',
  },
  heroTitle: {
    color: DARK,
    fontSize: 20,
    lineHeight: 23,
    fontWeight: '900',
  },
  heroText: {
    color: '#333333',
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '600',
    marginTop: 6,
  },
  memberCard: {
    width: width * 0.4,
    height: 104,
    borderRadius: 12,
    backgroundColor: RED,
    padding: 12,
    justifyContent: 'center',
  },
  cardBrand: {
    color: '#FFFFFF',
    fontSize: 21,
    fontWeight: '900',
  },
  cardMember: {
    color: SOFT_YELLOW,
    fontSize: 16,
    fontWeight: '900',
    marginTop: 8,
  },
  cardDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 13,
  },
  cardDateCol: {
    flex: 1,
  },
  cardLabel: {
    color: '#FFE8B3',
    fontSize: 7,
    fontWeight: '700',
  },
  cardValue: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '900',
    marginTop: 2,
  },
  cardDivider: {
    width: 1,
    height: 26,
    backgroundColor: '#FFE8B3',
    marginHorizontal: 8,
  },
  paymentCard: {
    minHeight: Math.max(92, Math.min(112, height * 0.13)),
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: RED,
    backgroundColor: PALE_YELLOW,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginTop: 10,
    shadowColor: RED,
    shadowOpacity: 0.14,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  paymentIconWrap: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: BORDER,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  paymentIcon: {
    color: RED,
    fontSize: 34,
  },
  paymentCopy: {
    flex: 1,
    paddingRight: 8,
  },
  paymentTitle: {
    color: RED,
    fontSize: 20,
    fontWeight: '900',
  },
  paymentText: {
    color: DARK,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    marginTop: 6,
  },
  billingBox: {
    width: width * 0.28,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: BORDER,
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  billingLabel: {
    color: RED,
    fontSize: 9,
    fontWeight: '900',
  },
  billingDate: {
    color: RED,
    fontSize: 11,
    fontWeight: '900',
    marginTop: 6,
  },
  sectionTitle: {
    color: DARK,
    fontSize: 15,
    fontWeight: '900',
    marginTop: 10,
    marginBottom: 6,
  },
  nextRow: {
    flexDirection: 'row',
    gap: 8,
    paddingRight: 12,
  },
  nextCard: {
    width: NEXT_CARD_WIDTH,
    minHeight: 104,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingTop: 12,
    paddingBottom: 10,
  },
  stepBadge: {
    position: 'absolute',
    top: 7,
    left: 7,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: RED,
    color: '#FFFFFF',
    fontSize: 10,
    lineHeight: 18,
    fontWeight: '900',
    textAlign: 'center',
    overflow: 'hidden',
  },
  nextIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: SOFT_YELLOW,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
  },
  nextIcon: {
    color: RED,
    fontSize: 23,
  },
  nextTitle: {
    color: DARK,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '900',
    textAlign: 'center',
    marginTop: 10,
  },
  benefitsCard: {
    minHeight: 132,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: '#FFFFFF',
    padding: 9,
    marginTop: 8,
  },
  benefitsHeading: {
    color: RED,
    fontSize: 14,
    fontWeight: '900',
  },
  benefitsRow: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 7,
  },
  benefitItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 72,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: PALE_YELLOW,
    paddingHorizontal: 5,
  },
  benefitIcon: {
    color: RED,
    fontSize: 24,
  },
  benefitTitle: {
    color: DARK,
    fontSize: 8.5,
    lineHeight: 10.5,
    fontWeight: '900',
    textAlign: 'center',
    marginTop: 6,
  },
  noteBox: {
    height: 34,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: PALE_YELLOW,
    paddingHorizontal: 10,
    marginTop: 9,
  },
  noteIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: RED,
    color: RED,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '900',
    textAlign: 'center',
    marginRight: 10,
  },
  noteText: {
    flex: 1,
    color: DARK,
    fontSize: 8,
    lineHeight: 10,
    fontWeight: '700',
  },
  actionRow: {
    height: 42,
    flexDirection: 'row',
    gap: 5,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 9,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 5,
  },
  actionIcon: {
    color: RED,
    fontSize: 13,
    marginRight: 3,
  },
  actionText: {
    flex: 1,
    color: DARK,
    fontSize: 7.5,
    fontWeight: '900',
  },
  actionArrow: {
    color: RED,
    fontSize: 14,
    fontWeight: '900',
  },
  footerCta: {
    height: 72,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: SOFT_YELLOW,
    paddingHorizontal: 12,
    marginTop: 9,
  },
  giftCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  giftIcon: {
    color: RED,
    fontSize: 22,
  },
  footerCopy: {
    flex: 1,
  },
  footerTitle: {
    color: DARK,
    fontSize: 12,
    fontWeight: '900',
  },
  footerText: {
    color: DARK,
    fontSize: 8.5,
    lineHeight: 10.5,
    fontWeight: '600',
    marginTop: 4,
  },
  exploreButton: {
    width: width * 0.22,
    height: 38,
    borderRadius: 9,
    backgroundColor: RED,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exploreText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
    textAlign: 'center',
  },
  bottomTabs: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 58,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#EFEFEF',
    backgroundColor: '#FFFFFF',
    paddingBottom: 4,
  },
  bottomTab: {
    width: width / 5,
    alignItems: 'center',
  },
  tabIcon: {
    color: '#444444',
    fontSize: 20,
  },
  tabText: {
    color: '#444444',
    fontSize: 9,
    fontWeight: '700',
    marginTop: 2,
  },
  tabActive: {
    color: RED,
  },
});

export default MembershipSuccessScreen;
