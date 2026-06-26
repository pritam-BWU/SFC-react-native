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

import FoodClubHeader from '../../../components/common/FoodClubHeader/FoodClubHeader';
import {
  getMembershipPlan,
  membershipTypes,
} from '../../../data/membershipData';
import {
  getMemberBenefitsForPlan,
  memberBenefitsTitle,
} from '../../../data/memberBenefits';
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

const benefitIcons = [
  ICONS.tag,
  ICONS.clock,
  ICONS.document,
  ICONS.heart,
  ICONS.headset,
];

const actions = [
  { label: 'Browse Products', icon: ICONS.bag, route: 'Home' },
  { label: 'View My Plan', icon: ICONS.crown, route: 'Subscription' },
  { label: 'Update Profile', icon: ICONS.user, route: 'Profile' },
  { label: 'Contact Support', icon: ICONS.headset, route: 'Profile' },
] as const;

const MembershipSuccessScreen = ({ navigation, route }: Props) => {
  const membershipType = route.params?.membershipType ?? 'flexible';
  const planId = route.params?.planId ?? 'bronze';
  const membership = membershipTypes[membershipType];
  const plan = getMembershipPlan(membershipType, planId);
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

  if (!plan) {
    return null;
  }

  const memberBenefits = getMemberBenefitsForPlan(membershipType, plan);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      <FoodClubHeader title="Payment Successful" />
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
              Payment Received{'\n'}Approval Pending
            </Text>
            <Text style={styles.heroText}>
              Thank you for completing the payment. Your membership is now
              waiting for office confirmation.
            </Text>
          </View>

          <View style={styles.memberCard}>
            <Text style={styles.cardBrand}>Superfowl Food Club</Text>
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
              <View>
                <Text style={styles.cardLabel} numberOfLines={1}>
                  Member Category
                </Text>
                <Text style={styles.cardValue} numberOfLines={1}>
                  {plan.name}
                </Text>
              </View>
              <View style={styles.cardDivider} />
              <View style={styles.cardDateCol}>
                <Text style={styles.cardLabel} numberOfLines={1}>
                  Member Type
                </Text>
                <Text style={styles.cardValue} numberOfLines={1}>
                  {membership.shortTitle}
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
              Your {plan.name} {membership.shortTitle.toLowerCase()} payment is
              complete. Benefits unlock after admin approval.
            </Text>
          </View>
          {membershipType === 'flexible' && (
            <View style={styles.billingBox}>
              <Text style={styles.billingLabel} numberOfLines={1}>
                Next Renewal
              </Text>
              <Text style={styles.billingDate}>{ICONS.calendar} 25 May 2026</Text>
            </View>
          )}
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
          <Text style={styles.benefitsHeading}>{memberBenefitsTitle}</Text>
          <View style={styles.benefitsRow}>
            {memberBenefits.map((benefit, index) => (
              <View key={benefit} style={styles.benefitItem}>
                <Text style={styles.benefitIcon}>
                  {benefitIcons[index] || ICONS.check}
                </Text>
                <Text style={styles.benefitTitle}>{benefit}</Text>
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
          {actions.map(action => (
            <TouchableOpacity
              key={action.label}
              activeOpacity={0.8}
              style={styles.actionButton}
              onPress={() => navigation.navigate(action.route)}
            >
              <Text style={styles.actionIcon}>{action.icon}</Text>
              <Text style={styles.actionText} numberOfLines={1}>
                {action.label}
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
    minHeight: Math.max(210, Math.min(248, height * 0.29)),
    alignItems: 'stretch',
  },
  welcomeCopy: {
    alignItems: 'center',
  },
  successCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: RED,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 8,
  },
  successCheck: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: '900',
  },
  heroTitle: {
    color: DARK,
    fontSize: 22,
    lineHeight: 27,
    fontWeight: '900',
    textAlign: 'center',
  },
  heroText: {
    color: '#333333',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  memberCard: {
    width: '100%',
    minHeight: 154,
    borderRadius: 16,
    backgroundColor: RED,
    padding: 16,
    justifyContent: 'space-between',
    marginTop: 16,
  },
  cardBrand: {
    color: '#FFFFFF',
    fontSize: 25,
    lineHeight: 30,
    fontWeight: '900',
  },
  cardMember: {
    color: SOFT_YELLOW,
    fontSize: 18,
    lineHeight: 23,
    fontWeight: '900',
    marginTop: 4,
  },
  cardDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cardDateCol: {
    flex: 1,
    alignItems: 'flex-end',
  },
  cardLabel: {
    color: '#FFE8B3',
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '700',
  },
  cardValue: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '900',
    marginTop: 4,
  },
  cardDivider: {
    width: 1,
    height: 42,
    backgroundColor: '#FFE8B3',
    marginHorizontal: 16,
  },
  paymentCard: {
    minHeight: Math.max(108, Math.min(126, height * 0.145)),
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: RED,
    backgroundColor: PALE_YELLOW,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginTop: 14,
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
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: '#FFFFFF',
    padding: 12,
    marginTop: 10,
  },
  benefitsHeading: {
    color: RED,
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '900',
  },
  benefitsRow: {
    marginTop: 14,
    gap: 10,
  },
  benefitItem: {
    width: '100%',
    minHeight: 76,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: PALE_YELLOW,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  benefitIcon: {
    width: 42,
    color: RED,
    fontSize: 27,
    textAlign: 'center',
    marginRight: 12,
  },
  benefitTitle: {
    flex: 1,
    color: DARK,
    fontSize: 14,
    lineHeight: 19,
    fontWeight: '900',
    textAlign: 'left',
  },
  noteBox: {
    minHeight: 46,
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
    fontSize: 11,
    lineHeight: 15,
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
});

export default MembershipSuccessScreen;
