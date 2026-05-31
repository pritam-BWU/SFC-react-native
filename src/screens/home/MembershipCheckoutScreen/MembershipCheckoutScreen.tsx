import React, { useEffect, useRef, useState } from 'react';
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
const SOFT_YELLOW = '#FFF7D6';
const BENEFIT_CARD_WIDTH = Math.min(132, width * 0.34);

const ICONS = {
  back: '\u2039',
  lock: '\u{1F512}',
  shield: '\u{1F6E1}\uFE0F',
  crown: '\u{1F451}',
  leaf: '\u{1F331}',
  star: '\u2606',
  gold: '\u2605',
  calendar: '\u25A3',
  tag: '\u25C7',
  rocket: '\u25B3',
  bell: '\u{1F514}',
  support: '\u260E',
  check: '\u2713',
  card: '\u25AD',
  bank: '\u25B3',
  people: '\u25C9',
  doc: '\u25A4',
  right: '\u203A',
};

type Props = NativeStackScreenProps<RootStackParamList, 'MembershipCheckout'>;
type PlanId = RootStackParamList['MembershipCheckout']['planId'];

type Plan = {
  id: PlanId;
  name: string;
  price: number;
  yearly: number;
  description: string;
  icon: string;
  access: string;
  best: boolean;
};

const plans: Record<PlanId, Plan> = {
  basic: {
    id: 'basic',
    name: 'Basic',
    price: 99,
    yearly: 1188,
    description: 'Start your journey with member benefits',
    icon: ICONS.leaf,
    access: 'Basic Access',
    best: false,
  },
  silver: {
    id: 'silver',
    name: 'Silver',
    price: 199,
    yearly: 2388,
    description: 'More value with extra member perks',
    icon: ICONS.star,
    access: 'Extra Access',
    best: false,
  },
  gold: {
    id: 'gold',
    name: 'Gold',
    price: 399,
    yearly: 4788,
    description: 'Enhanced benefits for smart shoppers',
    icon: ICONS.gold,
    access: 'Smart Access',
    best: false,
  },
  platinum: {
    id: 'platinum',
    name: 'Platinum',
    price: 699,
    yearly: 8388,
    description: 'Premium benefits for maximum value',
    icon: ICONS.crown,
    access: 'Full Access',
    best: true,
  },
};

const benefitCopy = {
  basic: [
    ['Member Pricing', 'Special prices on eligible products'],
    ['Exclusive Updates', 'Member-only offers and arrivals'],
    ['Quality Assurance', 'Hygienic, trusted sourcing promise'],
  ],
  silver: [
    ['Member Pricing', 'Special prices on eligible products'],
    ['Early Access', 'Be first when ordering opens'],
    ['Exclusive Updates', 'Member-only offers and arrivals'],
    ['Quality Assurance', 'Hygienic, trusted sourcing promise'],
  ],
  gold: [
    ['Member Pricing', 'Special prices on eligible products'],
    ['Early Access', 'Be first when ordering opens'],
    ['Exclusive Updates', 'Member-only offers and arrivals'],
    ['Quality Assurance', 'Hygienic, trusted sourcing promise'],
    ['Priority Support', 'Faster assistance for members'],
  ],
  platinum: [
    ['Member Pricing', 'Special prices on eligible products'],
    ['Early Access', 'Be first when ordering opens'],
    ['Exclusive Updates', 'Member-only offers and arrivals'],
    ['Quality Assurance', 'Hygienic, trusted sourcing promise'],
    ['Priority Support', 'Faster assistance for members'],
  ],
};

const benefitIcons = [
  ICONS.tag,
  ICONS.rocket,
  ICONS.bell,
  ICONS.shield,
  ICONS.support,
];

const paymentMethods = [
  {
    id: 'upi',
    title: 'UPI / Pay via App',
    sub: 'Pay securely using any UPI app',
    icon: 'UPI',
  },
  {
    id: 'card',
    title: 'Cards (Credit / Debit)',
    sub: 'Visa, MasterCard, RuPay & more',
    icon: ICONS.card,
  },
  {
    id: 'bank',
    title: 'Net Banking',
    sub: 'All major banks',
    icon: ICONS.bank,
  },
];

const formatMoney = (amount: number) =>
  `\u20B9${amount.toLocaleString('en-IN')}`;

const MembershipCheckoutScreen = ({ navigation, route }: Props) => {
  const plan = plans[route.params.planId];
  const benefitScrollRef = useRef<ScrollView>(null);
  const benefitIndexRef = useRef(0);
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const gst = Math.round(plan.yearly * 0.18);
  const total = plan.yearly + gst;
  const monthlyTotal = plan.price * 12;
  const yearlySave = Math.max(0, monthlyTotal - plan.yearly);
  const benefits = benefitCopy[plan.id];

  useEffect(() => {
    const timer = setInterval(() => {
      benefitIndexRef.current = (benefitIndexRef.current + 1) % benefits.length;
      benefitScrollRef.current?.scrollTo({
        x: benefitIndexRef.current * (BENEFIT_CARD_WIDTH + 8),
        animated: true,
      });
    }, 2200);

    return () => clearInterval(timer);
  }, [benefits.length]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={0.75}
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>{ICONS.back}</Text>
        </TouchableOpacity>
        <View style={styles.headerCopy}>
          <Text style={styles.headerTitle}>
            Subscribe to Superfowl FoodClub Membership
          </Text>
          <Text style={styles.headerSub}>
            {ICONS.lock} Safe - Secure - No Auto-Renewal
          </Text>
        </View>
        <View style={styles.secureBadge}>
          <Text style={styles.secureIcon}>{ICONS.shield}</Text>
          <Text style={styles.secureText}>100%{'\n'}Secure</Text>
        </View>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={styles.selectedCard}>
          <Text style={styles.selectedLabel}>You selected</Text>
          <View style={styles.planIconBox}>
            <Text style={styles.planHeroIcon}>{plan.icon}</Text>
          </View>
          <View style={styles.planCopy}>
            <View style={styles.planTitleRow}>
              <Text style={styles.planTitle}>{plan.name} Plan</Text>
              {plan.best && <Text style={styles.bestBadge}>Best Value</Text>}
            </View>
            <Text style={styles.planDesc}>{plan.description}</Text>
            <View style={styles.planMetaRow}>
              <View style={styles.metaItem}>
                <Text style={styles.metaIcon}>{ICONS.calendar}</Text>
                <View>
                  <Text style={styles.metaTitle}>12 Months</Text>
                  <Text style={styles.metaSub}>Plan Duration</Text>
                </View>
              </View>
              <View style={styles.metaDivider} />
              <View style={styles.metaItem}>
                <Text style={styles.metaIcon}>{ICONS.shield}</Text>
                <View>
                  <Text style={styles.metaTitle}>{plan.access}</Text>
                  <Text style={styles.metaSub}>All Member Benefits</Text>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.priceBox}>
            <Text style={styles.monthPrice}>{formatMoney(plan.price)}</Text>
            <Text style={styles.monthText}>per month</Text>
            <Text style={styles.billedAs}>Billed as</Text>
            <View style={styles.yearBox}>
              <Text style={styles.yearPrice}>
                {formatMoney(plan.yearly)} / year
              </Text>
              <Text style={styles.saveText}>
                Save {formatMoney(yearlySave)}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.benefitsCard}>
          <Text style={styles.sectionTitle}>
            What you get with {plan.name} Plan
          </Text>
          <ScrollView
            ref={benefitScrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.benefitsRow}
            snapToInterval={BENEFIT_CARD_WIDTH + 8}
            decelerationRate="fast"
          >
            {benefits.map(([title], index) => (
              <View key={title} style={styles.benefitItem}>
                <View style={styles.benefitIconCircle}>
                  <Text style={styles.benefitIcon}>{benefitIcons[index]}</Text>
                </View>
                <Text style={styles.benefitTitle}>{title}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.paymentSummary}>
          <Text style={styles.sectionTitle}>Payment Summary</Text>
          <View style={styles.summaryLine}>
            <Text style={styles.summaryLabel}>Plan</Text>
            <Text style={styles.summaryValue}>
              {plan.name} Plan (12 Months)
            </Text>
          </View>
          <View style={styles.summaryLine}>
            <Text style={styles.summaryLabel}>Price</Text>
            <Text style={styles.summaryValue}>{formatMoney(plan.yearly)}</Text>
          </View>
          <View style={styles.summaryLine}>
            <Text style={styles.summaryLabel}>GST (18%)</Text>
            <Text style={styles.summaryValue}>{formatMoney(gst)}</Text>
          </View>
          <View style={styles.totalLine}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalAmount}>{formatMoney(total)}</Text>
          </View>
        </View>

        <View style={styles.promiseRow}>
          <View style={styles.promiseCard}>
            <Text style={styles.promiseIcon}>{ICONS.shield}</Text>
            <View style={styles.promiseTextWrap}>
              <Text style={styles.promiseTitle}>No Auto-Renewal</Text>
              <Text style={styles.promiseText}>
                Renew only when you choose.
              </Text>
            </View>
          </View>
          <View style={styles.promiseCard}>
            <Text style={styles.promiseIcon}>{ICONS.check}</Text>
            <View style={styles.promiseTextWrap}>
              <Text style={styles.promiseTitle}>Cancel Anytime</Text>
              <Text style={styles.promiseText}>Cancel or upgrade anytime.</Text>
            </View>
          </View>
        </View>

        <Text style={styles.paymentTitle}>Choose a payment method</Text>
        <View style={styles.methodList}>
          {paymentMethods.map(method => {
            const active = paymentMethod === method.id;
            return (
              <TouchableOpacity
                key={method.id}
                activeOpacity={0.85}
                style={[styles.methodRow, active && styles.methodRowActive]}
                onPress={() => setPaymentMethod(method.id)}
              >
                <View style={[styles.radio, active && styles.radioActive]}>
                  {active && <Text style={styles.radioDot}>{ICONS.check}</Text>}
                </View>
                <Text style={styles.methodIcon}>{method.icon}</Text>
                <View style={styles.methodCopy}>
                  <View style={styles.methodTitleRow}>
                    <Text style={styles.methodTitle}>{method.title}</Text>
                    {method.id === 'upi' && (
                      <Text style={styles.recommended}>Recommended</Text>
                    )}
                  </View>
                  <Text style={styles.methodSub}>{method.sub}</Text>
                </View>
                <Text style={styles.methodArrow}>{ICONS.right}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.trustRow}>
          <View style={styles.trustItem}>
            <Text style={styles.trustIcon}>{ICONS.lock}</Text>
            <Text style={styles.trustTitle}>Secure Payments</Text>
            <Text style={styles.trustText}>256-bit encrypted</Text>
          </View>
          <View style={styles.trustItem}>
            <Text style={styles.trustIcon}>{ICONS.people}</Text>
            <Text style={styles.trustTitle}>Trusted by Thousands</Text>
            <Text style={styles.trustText}>Growing community</Text>
          </View>
          <View style={styles.trustItem}>
            <Text style={styles.trustIcon}>{ICONS.doc}</Text>
            <Text style={styles.trustTitle}>No Hidden Charges</Text>
            <Text style={styles.trustText}>What you see is what you pay</Text>
          </View>
          <View style={styles.trustItem}>
            <Text style={styles.trustIcon}>{ICONS.shield}</Text>
            <Text style={styles.trustTitle}>Made in India</Text>
            <Text style={styles.trustText}>For our community</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.payBar}>
        <View>
          <Text style={styles.payLabel}>Total Payable</Text>
          <Text style={styles.payAmount}>{formatMoney(total)}</Text>
          <Text style={styles.paySub}>Inclusive of all taxes</Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.payButton}
          onPress={() =>
            navigation.navigate('MembershipSuccess', {
              planId: plan.id,
            })
          }
        >
          <Text style={styles.payButtonText}>
            {ICONS.lock} Pay Securely Now {ICONS.right}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F2',
    paddingHorizontal: 12,
    paddingBottom: 4,
  },
  backButton: {
    width: 34,
    height: 34,
    justifyContent: 'center',
  },
  backIcon: {
    color: DARK,
    fontSize: 34,
    lineHeight: 34,
  },
  headerCopy: {
    flex: 1,
    paddingHorizontal: 8,
  },
  headerTitle: {
    color: DARK,
    fontSize: 14,
    fontWeight: '900',
  },
  headerSub: {
    color: MUTED,
    fontSize: 9,
    fontWeight: '700',
    marginTop: 2,
  },
  secureBadge: {
    width: 58,
    minHeight: 34,
    borderRadius: 8,
    backgroundColor: '#FFFDF0',
    borderWidth: 1,
    borderColor: '#EFE5C2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  secureIcon: {
    color: RED,
    fontSize: 14,
  },
  secureText: {
    color: DARK,
    fontSize: 8,
    lineHeight: 10,
    fontWeight: '900',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    paddingHorizontal: 8,
    paddingTop: 5,
    paddingBottom: 80,
  },
  selectedCard: {
    minHeight: Math.max(116, Math.min(136, height * 0.16)),
    flexDirection: 'row',
    borderRadius: 14,
    borderWidth: 2,
    borderColor: RED,
    backgroundColor: '#FFFDF0',
    padding: 10,
    shadowColor: RED,
    shadowOpacity: 0.16,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  selectedLabel: {
    position: 'absolute',
    left: 12,
    top: 0,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    backgroundColor: RED,
    color: '#FFFFFF',
    fontSize: 9.5,
    fontWeight: '900',
    paddingHorizontal: 12,
    paddingVertical: 4,
    overflow: 'hidden',
  },
  planIconBox: {
    width: 66,
    height: 66,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EFE5C2',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 28,
    marginRight: 10,
  },
  planHeroIcon: {
    color: RED,
    fontSize: 36,
  },
  planCopy: {
    flex: 1,
    paddingTop: 21,
  },
  planTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  planTitle: {
    color: DARK,
    fontSize: 18,
    fontWeight: '900',
  },
  bestBadge: {
    color: '#FFFFFF',
    backgroundColor: RED,
    borderRadius: 14,
    overflow: 'hidden',
    paddingHorizontal: 7,
    paddingVertical: 3,
    fontSize: 8,
    fontWeight: '900',
  },
  planDesc: {
    color: DARK,
    fontSize: 10.5,
    fontWeight: '700',
    marginTop: 5,
  },
  planMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  metaIcon: {
    color: RED,
    fontSize: 16,
    marginRight: 5,
  },
  metaTitle: {
    color: DARK,
    fontSize: 10.5,
    fontWeight: '900',
  },
  metaSub: {
    color: MUTED,
    fontSize: 8.5,
    fontWeight: '700',
    marginTop: 1,
  },
  metaDivider: {
    width: 1,
    height: 26,
    backgroundColor: '#EFE5C2',
    marginHorizontal: 6,
  },
  priceBox: {
    width: width * 0.23,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  monthPrice: {
    color: DARK,
    fontSize: 21,
    fontWeight: '900',
  },
  monthText: {
    color: DARK,
    fontSize: 8,
    fontWeight: '700',
    marginTop: 2,
  },
  billedAs: {
    color: MUTED,
    fontSize: 8,
    fontWeight: '700',
    marginTop: 6,
  },
  yearBox: {
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: SOFT_YELLOW,
    paddingHorizontal: 5,
    paddingVertical: 5,
    marginTop: 4,
  },
  yearPrice: {
    color: RED,
    fontSize: 10.5,
    fontWeight: '900',
  },
  saveText: {
    color: DARK,
    fontSize: 7.5,
    fontWeight: '700',
    marginTop: 2,
  },
  benefitsCard: {
    minHeight: 86,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#EFE5C2',
    backgroundColor: '#FFFFFF',
    padding: 8,
    marginTop: 7,
  },
  sectionTitle: {
    color: DARK,
    fontSize: 12,
    fontWeight: '900',
  },
  benefitsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
    paddingRight: 8,
  },
  benefitItem: {
    width: BENEFIT_CARD_WIDTH,
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 9,
    backgroundColor: '#FFFDF0',
    borderWidth: 1,
    borderColor: '#EFE5C2',
    paddingHorizontal: 9,
  },
  benefitIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: SOFT_YELLOW,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  benefitIcon: {
    color: RED,
    fontSize: 17,
  },
  benefitTitle: {
    flex: 1,
    color: DARK,
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '900',
  },
  paymentSummary: {
    minHeight: 116,
    borderRadius: 12,
    backgroundColor: SOFT_YELLOW,
    padding: 11,
    marginTop: 7,
  },
  summaryLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  summaryLabel: {
    color: DARK,
    fontSize: 10.5,
    fontWeight: '700',
  },
  summaryValue: {
    color: DARK,
    fontSize: 10.5,
    fontWeight: '900',
  },
  totalLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#DCC46C',
    paddingTop: 6,
    marginTop: 6,
  },
  totalLabel: {
    color: DARK,
    fontSize: 10,
    fontWeight: '900',
  },
  totalAmount: {
    color: RED,
    fontSize: 20,
    fontWeight: '900',
  },
  promiseRow: {
    flexDirection: 'row',
    gap: 7,
    marginTop: 7,
  },
  promiseCard: {
    flex: 1,
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#FFFDF0',
    borderWidth: 1,
    borderColor: '#EFE5C2',
    padding: 8,
  },
  promiseIcon: {
    color: RED,
    fontSize: 20,
    marginRight: 7,
  },
  promiseTextWrap: {
    flex: 1,
  },
  promiseTitle: {
    color: RED,
    fontSize: 10.5,
    fontWeight: '900',
  },
  promiseText: {
    color: DARK,
    fontSize: 8.5,
    lineHeight: 11,
    fontWeight: '700',
    marginTop: 2,
  },
  paymentTitle: {
    color: DARK,
    fontSize: 14,
    fontWeight: '900',
    marginTop: 9,
    marginBottom: 6,
  },
  methodList: {
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#EFE5C2',
    overflow: 'hidden',
  },
  methodRow: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EFE5C2',
    paddingHorizontal: 10,
  },
  methodRowActive: {
    backgroundColor: '#FFFDF0',
    borderWidth: 1,
    borderColor: RED,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: MUTED,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  radioActive: {
    backgroundColor: RED,
    borderColor: RED,
  },
  radioDot: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
  },
  methodIcon: {
    width: 44,
    color: RED,
    fontSize: 16,
    fontWeight: '900',
    textAlign: 'center',
  },
  methodCopy: {
    flex: 1,
  },
  methodTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  methodTitle: {
    color: DARK,
    fontSize: 12,
    fontWeight: '900',
  },
  recommended: {
    color: RED,
    backgroundColor: SOFT_YELLOW,
    borderRadius: 12,
    overflow: 'hidden',
    paddingHorizontal: 6,
    paddingVertical: 2,
    fontSize: 7,
    fontWeight: '900',
  },
  methodSub: {
    color: '#333333',
    fontSize: 9.5,
    fontWeight: '600',
    marginTop: 3,
  },
  methodArrow: {
    color: RED,
    fontSize: 20,
    fontWeight: '900',
  },
  trustRow: {
    minHeight: 48,
    flexDirection: 'row',
    borderRadius: 9,
    backgroundColor: SOFT_YELLOW,
    marginTop: 6,
    overflow: 'hidden',
  },
  trustItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: '#EFE5C2',
    paddingHorizontal: 4,
  },
  trustIcon: {
    color: RED,
    fontSize: 14,
  },
  trustTitle: {
    color: DARK,
    fontSize: 7.5,
    fontWeight: '900',
    textAlign: 'center',
    marginTop: 2,
  },
  trustText: {
    color: DARK,
    fontSize: 6.5,
    lineHeight: 8,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 2,
  },
  payBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: '#EFE5C2',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  payLabel: {
    color: DARK,
    fontSize: 10,
    fontWeight: '900',
  },
  payAmount: {
    color: RED,
    fontSize: 19,
    fontWeight: '900',
    marginTop: 2,
  },
  paySub: {
    color: MUTED,
    fontSize: 8,
    fontWeight: '700',
    marginTop: 3,
  },
  payButton: {
    flex: 1,
    height: 46,
    borderRadius: 8,
    backgroundColor: RED,
    alignItems: 'center',
    justifyContent: 'center',
  },
  payButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },
});

export default MembershipCheckoutScreen;
