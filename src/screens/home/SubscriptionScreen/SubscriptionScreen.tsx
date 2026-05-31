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
const MUTED = '#5B5B5B';
const PAGE_YELLOW = '#FFF0AD';
const SOFT_YELLOW = '#FFF7D6';
const HERO_HEIGHT = Math.max(96, Math.min(126, height * 0.15));
const REASON_CARD_WIDTH = Math.min(150, width * 0.38);
const PLAN_CARD_WIDTH = (width - 33) / 2;

const ICONS = {
  back: '\u2039',
  help: '?',
  tag: '\u25C7',
  clock: '\u25F7',
  update: '\u25A3',
  shield: '\u{1F6E1}\uFE0F',
  bookmark: '\u25AF',
  leaf: '\u{1F331}',
  star: '\u2606',
  gold: '\u2605',
  crown: '\u{1F451}',
  check: '\u2713',
  dash: '\u2212',
  lock: '\u{1F512}',
  right: '\u203A',
};

type Props = NativeStackScreenProps<RootStackParamList, 'Subscription'>;

type Plan = {
  id: RootStackParamList['MembershipCheckout']['planId'];
  name: string;
  price: string;
  yearly: string;
  description: string;
  icon: string;
  tint: string;
};

type CompareRow = {
  label: string;
  icon: string;
  values: boolean[];
};

const reasons = [
  {
    icon: ICONS.tag,
    title: 'Member Pricing',
    text: 'Access special member pricing on eligible products.',
  },
  {
    icon: ICONS.clock,
    title: 'Early Access',
    text: 'Be the first to shop when online ordering launches.',
  },
  {
    icon: ICONS.update,
    title: 'Exclusive Updates',
    text: 'Get member-only updates on offers, new arrivals & more.',
  },
  {
    icon: ICONS.shield,
    title: 'Quality Assurance',
    text: 'Our commitment to hygiene, quality and trusted sourcing.',
  },
  {
    icon: ICONS.bookmark,
    title: 'Saved & Easy',
    text: 'Save favorites and preferences for a smoother experience.',
  },
];

const plans: Plan[] = [
  {
    id: 'basic',
    name: 'Basic',
    price: '\u20B999',
    yearly: '\u20B91,188 / year',
    description: 'Start your journey with member benefits',
    icon: ICONS.leaf,
    tint: RED,
  },
  {
    id: 'silver',
    name: 'Silver',
    price: '\u20B9199',
    yearly: '\u20B92,388 / year',
    description: 'More value with extra member perks',
    icon: ICONS.star,
    tint: '#9B0000',
  },
  {
    id: 'gold',
    name: 'Gold',
    price: '\u20B9399',
    yearly: '\u20B94,788 / year',
    description: 'Enhanced benefits for smart shoppers',
    icon: ICONS.gold,
    tint: '#D8A000',
  },
  {
    id: 'platinum',
    name: 'Platinum',
    price: '\u20B9699',
    yearly: '\u20B98,388 / year',
    description: 'Premium benefits for maximum value',
    icon: ICONS.crown,
    tint: RED,
  },
];

const compareRows: CompareRow[] = [
  {
    icon: ICONS.shield,
    label: 'Member pricing on eligible products',
    values: [true, true, true, true],
  },
  {
    icon: ICONS.clock,
    label: 'Early access to ordering launch',
    values: [false, true, true, true],
  },
  {
    icon: ICONS.update,
    label: 'Member-only updates & offer notifications',
    values: [true, true, true, true],
  },
  {
    icon: ICONS.bookmark,
    label: 'Save favorites & product preferences',
    values: [true, true, true, true],
  },
  {
    icon: ICONS.tag,
    label: 'Access to product information & insights',
    values: [true, true, true, true],
  },
  {
    icon: ICONS.help,
    label: 'Priority customer support',
    values: [false, false, true, true],
  },
  {
    icon: ICONS.gold,
    label: 'Exclusive member events & previews',
    values: [false, false, true, true],
  },
];

const SubscriptionScreen = ({ navigation }: Props) => {
  const reasonScrollRef = useRef<ScrollView>(null);
  const reasonIndexRef = useRef(0);

  useEffect(() => {
    const timer = setInterval(() => {
      reasonIndexRef.current = (reasonIndexRef.current + 1) % reasons.length;
      reasonScrollRef.current?.scrollTo({
        x: reasonIndexRef.current * (REASON_CARD_WIDTH + 8),
        animated: true,
      });
    }, 2200);

    return () => clearInterval(timer);
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={0.75}
          style={styles.headerButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>{ICONS.back}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Superfowl FoodClub Membership</Text>
        <TouchableOpacity activeOpacity={0.75} style={styles.helpButton}>
          <Text style={styles.helpText}>{ICONS.help}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={styles.hero}>
          <View style={styles.heroCopy}>
            <Text style={styles.heroTitle}>More Value. More Benefits.</Text>
            <Text style={styles.heroTitleRed}>Better Food Experience.</Text>
            <Text style={styles.heroText}>
              Join Superfowl FoodClub and enjoy member pricing, early access to ordering
              and much more.
            </Text>
          </View>
          <View style={styles.memberCardArt}>
            <Text style={styles.crownArt}>{ICONS.crown}</Text>
            <Text style={styles.cardBrand}>Superfowl FoodClub</Text>
            <Text style={styles.cardMember}>MEMBER</Text>
          </View>
        </View>

        <Text style={[styles.sectionTitle, styles.reasonSectionTitle]}>
          Why become a Superfowl FoodClub Member?
        </Text>
        <ScrollView
          ref={reasonScrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.reasonScroller}
          contentContainerStyle={styles.reasonRow}
          snapToInterval={REASON_CARD_WIDTH + 8}
          decelerationRate="fast"
        >
          {reasons.map(reason => (
            <View key={reason.title} style={styles.reasonCard}>
              <Text style={styles.reasonIcon}>{reason.icon}</Text>
              <Text style={styles.reasonTitle}>{reason.title}</Text>
              <Text style={styles.reasonText}>{reason.text}</Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.plansHeader}>
          <View>
            <Text style={styles.sectionTitle}>Membership Plans</Text>
            <Text style={styles.sectionSub}>
              Choose the plan that suits you best
            </Text>
          </View>
          <Text style={styles.planBadge}>
            All plans include basic member access
          </Text>
        </View>

        <View style={styles.planGrid}>
          {plans.map(plan => (
            <View key={plan.name} style={styles.planCard}>
              <View style={styles.planTop}>
                <Text style={[styles.planIcon, { color: plan.tint }]}>
                  {plan.icon}
                </Text>
                <Text style={[styles.planName, { color: plan.tint }]}>
                  {plan.name}
                </Text>
              </View>
              <Text style={styles.planDesc}>{plan.description}</Text>
              <Text style={styles.planPrice}>
                {plan.price}
                <Text style={styles.month}> /month</Text>
              </Text>
              <Text style={styles.yearly}>Billed as {plan.yearly}</Text>
              <TouchableOpacity
                activeOpacity={0.85}
                style={[styles.chooseButton, { borderColor: plan.tint }]}
                onPress={() =>
                  navigation.navigate('MembershipCheckout', {
                    planId: plan.id,
                  })
                }
              >
                <Text style={[styles.chooseText, { color: plan.tint }]}>
                  Choose Plan
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={styles.compareTable}>
          <View style={styles.compareHeader}>
            <Text style={styles.compareTitle}>Compare Benefits</Text>
            {plans.map(plan => (
              <Text key={plan.name} style={styles.comparePlan}>
                {plan.name}
              </Text>
            ))}
          </View>
          {compareRows.map(row => (
            <View key={row.label} style={styles.compareRow}>
              <View style={styles.compareLabelWrap}>
                <Text style={styles.compareIcon}>{row.icon}</Text>
                <Text style={styles.compareLabel}>{row.label}</Text>
              </View>
              {row.values.map((hasBenefit, index) => (
                <Text
                  key={`${row.label}-${index}`}
                  style={[
                    styles.compareMark,
                    !hasBenefit && styles.compareDash,
                  ]}
                >
                  {hasBenefit ? ICONS.check : ICONS.dash}
                </Text>
              ))}
            </View>
          ))}
        </View>

        <View style={styles.safetyCard}>
          <Text style={styles.safetyIcon}>{ICONS.shield}</Text>
          <View style={styles.safetyTextWrap}>
            <Text style={styles.safetyTitle}>
              Safe. Transparent. No Auto-Renewal.
            </Text>
            <Text style={styles.safetyText}>
              You can cancel or upgrade your plan anytime from your account
              settings.
            </Text>
          </View>
          <Text style={styles.learnText}>Learn More {ICONS.right}</Text>
        </View>

        <View style={styles.noteCard}>
          <Text style={styles.noteIcon}>i</Text>
          <Text style={styles.noteText}>
            Benefits may vary by plan and product availability. Ordering
            features will be introduced in future app updates.
          </Text>
        </View>

        <View style={styles.trustRow}>
          <View style={styles.trustItem}>
            <Text style={styles.trustIcon}>{ICONS.lock}</Text>
            <Text style={styles.trustTitle}>Secure Payments</Text>
            <Text style={styles.trustText}>100% safe & secure</Text>
          </View>
          <View style={styles.trustItem}>
            <Text style={styles.trustIcon}>{ICONS.shield}</Text>
            <Text style={styles.trustTitle}>Trusted by Members</Text>
            <Text style={styles.trustText}>Growing community</Text>
          </View>
          <View style={styles.trustItem}>
            <Text style={styles.trustIcon}>{ICONS.shield}</Text>
            <Text style={styles.trustTitle}>Hygiene First</Text>
            <Text style={styles.trustText}>Quality you can trust</Text>
          </View>
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
  header: {
    height: 46,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F2',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
  },
  headerButton: {
    width: 34,
    height: 34,
    justifyContent: 'center',
  },
  backIcon: {
    color: DARK,
    fontSize: 34,
    lineHeight: 34,
  },
  headerTitle: {
    flex: 1,
    color: DARK,
    fontSize: 17,
    fontWeight: '900',
    textAlign: 'center',
  },
  helpButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: DARK,
    alignItems: 'center',
    justifyContent: 'center',
  },
  helpText: {
    color: DARK,
    fontSize: 16,
    fontWeight: '900',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    paddingBottom: 10,
  },
  hero: {
    height: HERO_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SOFT_YELLOW,
    paddingHorizontal: 16,
  },
  heroCopy: {
    flex: 1,
    paddingRight: 8,
  },
  heroTitle: {
    color: DARK,
    fontSize: 20,
    fontWeight: '900',
    lineHeight: 24,
  },
  heroTitleRed: {
    color: RED,
    fontSize: 19,
    fontWeight: '900',
    lineHeight: 23,
  },
  heroText: {
    color: '#333333',
    fontSize: 11,
    fontWeight: '600',
    lineHeight: 15,
    marginTop: 5,
    maxWidth: width * 0.58,
  },
  memberCardArt: {
    width: width * 0.28,
    height: 70,
    borderRadius: 8,
    backgroundColor: RED,
    justifyContent: 'center',
    paddingHorizontal: 10,
    transform: [{ rotate: '6deg' }],
  },
  crownArt: {
    position: 'absolute',
    right: 2,
    top: -25,
    color: '#D8A000',
    fontSize: 34,
    transform: [{ rotate: '-6deg' }],
  },
  cardBrand: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },
  cardMember: {
    color: PAGE_YELLOW,
    fontSize: 12,
    fontWeight: '900',
    marginTop: 12,
  },
  sectionTitle: {
    color: DARK,
    fontSize: 15,
    fontWeight: '900',
  },
  reasonSectionTitle: {
    paddingHorizontal: 12,
  },
  reasonScroller: {
    marginTop: 8,
  },
  reasonRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    gap: 8,
    paddingRight: 20,
  },
  reasonCard: {
    width: REASON_CARD_WIDTH,
    minHeight: 108,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#EFE5C2',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 10,
  },
  reasonIcon: {
    color: RED,
    fontSize: 25,
    lineHeight: 26,
  },
  reasonTitle: {
    color: DARK,
    fontSize: 10.5,
    fontWeight: '900',
    textAlign: 'center',
    marginTop: 6,
  },
  reasonText: {
    color: '#333333',
    fontSize: 9.2,
    lineHeight: 12,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 6,
  },
  plansHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    marginTop: 10,
  },
  sectionSub: {
    color: '#333333',
    fontSize: 10,
    fontWeight: '600',
    marginTop: 1,
  },
  planBadge: {
    color: MUTED,
    fontSize: 9,
    fontWeight: '700',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EFE5C2',
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  planGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    marginTop: 7,
    gap: 9,
  },
  planCard: {
    width: PLAN_CARD_WIDTH,
    minHeight: 136,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EFE5C2',
    backgroundColor: '#FFFFFF',
    padding: 9,
  },
  planTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  planIcon: {
    fontSize: 18,
  },
  planName: {
    flex: 1,
    fontSize: 13,
    fontWeight: '900',
  },
  planDesc: {
    color: '#333333',
    fontSize: 9,
    lineHeight: 12,
    fontWeight: '600',
    marginTop: 7,
    minHeight: 28,
  },
  planPrice: {
    color: DARK,
    fontSize: 17,
    fontWeight: '900',
    marginTop: 5,
  },
  month: {
    color: MUTED,
    fontSize: 8,
    fontWeight: '700',
  },
  yearly: {
    color: MUTED,
    fontSize: 8.5,
    fontWeight: '700',
    marginTop: 3,
  },
  chooseButton: {
    height: 29,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  chooseText: {
    fontSize: 9.5,
    fontWeight: '900',
  },
  compareTable: {
    marginHorizontal: 12,
    marginTop: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#EFE5C2',
    overflow: 'hidden',
  },
  compareHeader: {
    minHeight: 30,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFDF0',
    borderBottomWidth: 1,
    borderBottomColor: '#EFE5C2',
  },
  compareTitle: {
    width: '32%',
    color: DARK,
    fontSize: 11,
    fontWeight: '900',
    paddingLeft: 10,
  },
  comparePlan: {
    flex: 1,
    color: RED,
    fontSize: 9,
    fontWeight: '900',
    textAlign: 'center',
  },
  compareRow: {
    minHeight: 28,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F5EDD1',
  },
  compareLabelWrap: {
    width: '32%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  compareIcon: {
    width: 16,
    color: RED,
    fontSize: 12,
  },
  compareLabel: {
    flex: 1,
    color: '#333333',
    fontSize: 8.5,
    lineHeight: 10,
    fontWeight: '700',
  },
  compareMark: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
    textAlign: 'center',
    textAlignVertical: 'center',
    marginHorizontal: 14,
    borderRadius: 8,
    backgroundColor: RED,
    overflow: 'hidden',
  },
  compareDash: {
    color: '#FFFFFF',
    backgroundColor: '#A0A0A0',
  },
  safetyCard: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
    marginTop: 10,
    borderRadius: 10,
    backgroundColor: SOFT_YELLOW,
    padding: 9,
  },
  safetyIcon: {
    color: RED,
    fontSize: 26,
    marginRight: 9,
  },
  safetyTextWrap: {
    flex: 1,
  },
  safetyTitle: {
    color: DARK,
    fontSize: 11,
    fontWeight: '900',
  },
  safetyText: {
    color: '#333333',
    fontSize: 8.5,
    lineHeight: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  learnText: {
    color: RED,
    fontSize: 9,
    fontWeight: '900',
    marginLeft: 8,
  },
  noteCard: {
    minHeight: 42,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
    marginTop: 8,
    borderRadius: 10,
    backgroundColor: '#FFFDF0',
    padding: 9,
  },
  noteIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: MUTED,
    color: MUTED,
    fontSize: 14,
    fontWeight: '900',
    textAlign: 'center',
    lineHeight: 22,
    marginRight: 9,
  },
  noteText: {
    flex: 1,
    color: '#333333',
    fontSize: 9,
    lineHeight: 12,
    fontWeight: '600',
  },
  trustRow: {
    flexDirection: 'row',
    marginHorizontal: 12,
    marginTop: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#EFE5C2',
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  trustItem: {
    flex: 1,
    minHeight: 44,
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: '#EFE5C2',
    paddingHorizontal: 8,
  },
  trustIcon: {
    color: RED,
    fontSize: 15,
  },
  trustTitle: {
    color: DARK,
    fontSize: 9,
    fontWeight: '900',
    marginTop: 1,
  },
  trustText: {
    color: MUTED,
    fontSize: 8,
    fontWeight: '700',
  },
});

export default SubscriptionScreen;
