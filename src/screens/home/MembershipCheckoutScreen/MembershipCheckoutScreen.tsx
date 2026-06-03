import React from 'react';
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
import { getMembershipPlan, membershipTypes } from '../../../data/membershipData';
import {
  getMemberBenefitsForPlan,
  memberBenefitsTitle,
} from '../../../data/memberBenefits';
import { RootStackParamList } from '../../../navigation/types';

const { width } = Dimensions.get('window');

const RED = '#CC0000';
const DARK = '#101010';
const MUTED = '#5B5B5B';
const SOFT_YELLOW = '#FFF7D6';
const PALE_YELLOW = '#FFFDF0';
const BORDER = '#EFE5C2';
const BENEFIT_CARD_WIDTH = Math.min(154, width * 0.38);

const ICONS = {
  back: '\u2039',
  lock: '\u{1F512}',
  shield: '\u{1F6E1}\uFE0F',
  calendar: '\u25A3',
  tag: '\u25C7',
  bell: '\u{1F514}',
  check: '\u2713',
  right: '\u203A',
};

type Props = NativeStackScreenProps<RootStackParamList, 'MembershipCheckout'>;

const benefitIcons = [
  ICONS.tag,
  ICONS.calendar,
  ICONS.bell,
  ICONS.shield,
  ICONS.check,
];

const formatMoney = (amount: number) =>
  `\u20B9${amount.toLocaleString('en-IN')}`;

const MembershipCheckoutScreen = ({ navigation, route }: Props) => {
  const membershipType = route.params?.membershipType ?? 'flexible';
  const planId = route.params?.planId ?? 'bronze';
  const membership = membershipTypes[membershipType];
  const plan = getMembershipPlan(membershipType, planId);

  if (!plan) {
    return null;
  }

  const gst = plan.membershipFeeWithGst - plan.membershipFee;
  const total = plan.offerPrice;
  const memberBenefits = getMemberBenefitsForPlan(membershipType, plan);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />

      <FoodClubHeader
        title="Subscribe to FoodClub Membership"
        showBack
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.secureNotice}>
          <Text style={styles.secureIcon}>{ICONS.shield}</Text>
          <Text style={styles.headerSub}>
            {ICONS.lock} Safe - Secure - No Auto-Renewal
          </Text>
          <Text style={styles.secureText}>100% Secure</Text>
        </View>

        <View style={styles.selectedCard}>
          <Text style={styles.selectedLabel}>You selected</Text>
          <View style={styles.planIconBox}>
            <Text style={styles.planHeroIcon}>{plan.icon}</Text>
          </View>
          <View style={styles.planCopy}>
            <Text style={styles.planTitle}>{plan.name} Plan</Text>
            <Text style={styles.planDesc}>
              {plan.monthlyConsumptionKg} kg monthly /{' '}
              {plan.yearlyConsumptionKg} kg yearly consumption
            </Text>
            <View style={styles.planMetaRow}>
              <View style={styles.metaItem}>
                <Text style={styles.metaIcon}>{ICONS.calendar}</Text>
                <View>
                  <Text style={styles.metaTitle}>{membership.validity}</Text>
                  <Text style={styles.metaSub}>Plan Duration</Text>
                </View>
              </View>
              <View style={styles.metaDivider} />
              <View style={styles.metaItem}>
                <Text style={styles.metaIcon}>{ICONS.shield}</Text>
                <View>
                  <Text style={styles.metaTitle}>{plan.eligibility}</Text>
                  <Text style={styles.metaSub}>Member Benefit</Text>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.priceBox}>
            <Text style={styles.monthPrice}>{formatMoney(total)}</Text>
            <Text style={styles.monthText}>Today&apos;s Offer</Text>
            <Text style={styles.billedAs}>Fees + GST</Text>
            <Text style={styles.yearPrice}>
              {formatMoney(plan.membershipFeeWithGst)}
            </Text>
          </View>
        </View>

        <View style={styles.benefitsCard}>
          <Text style={styles.sectionTitle}>
            {memberBenefitsTitle} for {plan.name}
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.benefitsRow}
          >
            {memberBenefits.map((benefit, index) => (
              <View key={benefit} style={styles.benefitItem}>
                <View style={styles.benefitIconCircle}>
                  <Text style={styles.benefitIcon}>
                    {benefitIcons[index] || ICONS.check}
                  </Text>
                </View>
                <Text style={styles.benefitTitle} numberOfLines={4}>
                  {benefit}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.paymentSummary}>
          <Text style={styles.sectionTitle}>Payment Summary</Text>
          <View style={styles.summaryLine}>
            <Text style={styles.summaryLabel}>Plan</Text>
            <Text style={styles.summaryValue}>
              {plan.name} Plan ({membership.validity})
            </Text>
          </View>
          <View style={styles.summaryLine}>
            <Text style={styles.summaryLabel}>Membership Fees</Text>
            <Text style={styles.summaryValue}>
              {formatMoney(plan.membershipFee)}
            </Text>
          </View>
          <View style={styles.summaryLine}>
            <Text style={styles.summaryLabel}>GST (18%)</Text>
            <Text style={styles.summaryValue}>{formatMoney(gst)}</Text>
          </View>
          <View style={styles.summaryLine}>
            <Text style={styles.summaryLabel}>Fees + GST</Text>
            <Text style={styles.summaryValue}>
              {formatMoney(plan.membershipFeeWithGst)}
            </Text>
          </View>
          <View style={styles.totalLine}>
            <Text style={styles.totalLabel}>Today&apos;s Offer</Text>
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

        <View style={styles.infoPanel}>
          <Text style={styles.infoTitle}>Secure membership checkout</Text>
          <Text style={styles.infoText}>
            Your selected plan will be activated after successful payment.
            Benefits are subject to product availability, service area, and
            membership policy.
          </Text>
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
              membershipType,
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
  headerSub: {
    flex: 1,
    color: MUTED,
    fontSize: 10,
    fontWeight: '700',
  },
  secureNotice: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#FFFDF0',
    borderWidth: 1,
    borderColor: BORDER,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  secureIcon: {
    color: RED,
    fontSize: 18,
    marginRight: 8,
  },
  secureText: {
    color: DARK,
    fontSize: 10,
    fontWeight: '900',
    textAlign: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 98,
  },
  selectedCard: {
    minHeight: 154,
    flexDirection: 'row',
    borderRadius: 18,
    borderWidth: 2,
    borderColor: RED,
    backgroundColor: '#FFFDF0',
    padding: 12,
    shadowColor: RED,
    shadowOpacity: 0.16,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  selectedLabel: {
    position: 'absolute',
    left: 18,
    top: 0,
    backgroundColor: RED,
    color: '#FFFFFF',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    overflow: 'hidden',
    paddingHorizontal: 18,
    paddingVertical: 6,
    fontSize: 10,
    fontWeight: '900',
  },
  planIconBox: {
    width: 86,
    height: 86,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: BORDER,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginRight: 12,
    marginTop: 16,
  },
  planHeroIcon: {
    color: RED,
    fontSize: 43,
  },
  planCopy: {
    flex: 1,
    paddingTop: 38,
  },
  planTitle: {
    color: DARK,
    fontSize: 22,
    fontWeight: '900',
  },
  planDesc: {
    color: DARK,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    marginTop: 6,
  },
  planMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  metaIcon: {
    color: RED,
    fontSize: 16,
    marginRight: 6,
  },
  metaTitle: {
    color: DARK,
    fontSize: 11,
    fontWeight: '900',
  },
  metaSub: {
    color: MUTED,
    fontSize: 9,
    fontWeight: '700',
    marginTop: 2,
  },
  metaDivider: {
    width: 1,
    height: 34,
    backgroundColor: BORDER,
    marginHorizontal: 8,
  },
  priceBox: {
    width: 96,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  monthPrice: {
    color: DARK,
    fontSize: 24,
    fontWeight: '900',
  },
  monthText: {
    color: DARK,
    fontSize: 9,
    fontWeight: '700',
    marginTop: 3,
  },
  billedAs: {
    color: MUTED,
    fontSize: 9,
    fontWeight: '700',
    marginTop: 10,
  },
  yearPrice: {
    color: RED,
    fontSize: 12,
    fontWeight: '900',
    marginTop: 4,
    textAlign: 'right',
  },
  benefitsCard: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: '#FFFFFF',
    padding: 12,
    marginTop: 12,
  },
  sectionTitle: {
    color: DARK,
    fontSize: 15,
    fontWeight: '900',
  },
  benefitsRow: {
    gap: 10,
    paddingTop: 12,
    paddingRight: 10,
  },
  benefitItem: {
    width: BENEFIT_CARD_WIDTH,
    minHeight: 96,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: PALE_YELLOW,
    paddingHorizontal: 10,
  },
  benefitIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: SOFT_YELLOW,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  benefitIcon: {
    color: RED,
    fontSize: 19,
  },
  benefitTitle: {
    flex: 1,
    color: DARK,
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '900',
  },
  paymentSummary: {
    borderRadius: 16,
    backgroundColor: SOFT_YELLOW,
    padding: 16,
    marginTop: 12,
  },
  summaryLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    gap: 10,
  },
  summaryLabel: {
    color: DARK,
    fontSize: 12,
    fontWeight: '700',
  },
  summaryValue: {
    flex: 1,
    color: DARK,
    fontSize: 12,
    fontWeight: '900',
    textAlign: 'right',
  },
  totalLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#DCC46C',
    paddingTop: 10,
    marginTop: 10,
  },
  totalLabel: {
    color: DARK,
    fontSize: 12,
    fontWeight: '900',
  },
  totalAmount: {
    color: RED,
    fontSize: 24,
    fontWeight: '900',
  },
  promiseRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  promiseCard: {
    flex: 1,
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: PALE_YELLOW,
    padding: 12,
  },
  promiseIcon: {
    color: RED,
    fontSize: 22,
    marginRight: 10,
  },
  promiseTextWrap: {
    flex: 1,
  },
  promiseTitle: {
    color: RED,
    fontSize: 12,
    fontWeight: '900',
  },
  promiseText: {
    color: DARK,
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '700',
    marginTop: 3,
  },
  infoPanel: {
    borderRadius: 14,
    backgroundColor: PALE_YELLOW,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 14,
    marginTop: 12,
  },
  infoTitle: {
    color: RED,
    fontSize: 14,
    fontWeight: '900',
  },
  infoText: {
    color: DARK,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '600',
    marginTop: 6,
  },
  payBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    minHeight: 78,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: BORDER,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  payLabel: {
    color: DARK,
    fontSize: 11,
    fontWeight: '900',
  },
  payAmount: {
    color: RED,
    fontSize: 22,
    fontWeight: '900',
    marginTop: 2,
  },
  paySub: {
    color: MUTED,
    fontSize: 9,
    fontWeight: '700',
    marginTop: 3,
  },
  payButton: {
    flex: 1,
    height: 54,
    borderRadius: 10,
    backgroundColor: RED,
    alignItems: 'center',
    justifyContent: 'center',
  },
  payButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },
});

export default MembershipCheckoutScreen;
