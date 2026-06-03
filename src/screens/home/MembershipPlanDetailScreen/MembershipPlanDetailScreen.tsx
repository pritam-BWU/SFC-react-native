import React from 'react';
import {
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

const RED = '#CC0000';
const DARK = '#101010';
const MUTED = '#5B5B5B';
const PAGE_YELLOW = '#FFF0AD';
const SOFT_YELLOW = '#FFF7D6';
const PALE_YELLOW = '#FFFDF0';
const BORDER = '#EFE5C2';

const ICONS = {
  back: '\u2039',
  tag: '\u25C7',
  info: 'i',
  check: '\u2713',
  update: '\u25A3',
  heart: '\u2665',
  campaign: '\u2726',
  support: '\u260E',
};

type Props = NativeStackScreenProps<RootStackParamList, 'MembershipPlanDetail'>;

const benefitIcons = [
  ICONS.tag,
  ICONS.update,
  ICONS.heart,
  ICONS.campaign,
  ICONS.support,
];

const formatMoney = (amount: number) =>
  `\u20B9${amount.toLocaleString('en-IN')}`;

const MembershipPlanDetailScreen = ({ navigation, route }: Props) => {
  const membershipType = route.params?.membershipType ?? 'flexible';
  const planId = route.params?.planId ?? 'bronze';
  const membership = membershipTypes[membershipType];
  const plan = getMembershipPlan(membershipType, planId);

  if (!plan) {
    return null;
  }

  const memberBenefits = getMemberBenefitsForPlan(membershipType, plan);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      <FoodClubHeader
        title={`${plan.name} Plan`}
        showBack
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroCard}>
          <View
            style={[
              styles.planIconWrap,
              { backgroundColor: plan.softAccent, borderColor: plan.accent },
            ]}
          >
            <Text style={[styles.planIcon, { color: plan.accent }]}>
              {plan.icon}
            </Text>
          </View>
          <View style={styles.heroCopy}>
            <Text style={styles.planName}>{plan.name}</Text>
            <Text style={styles.headerSub}>{membership.title}</Text>
            <Text style={styles.statusBadge}>{membership.refundable}</Text>
            <Text style={styles.validity}>{membership.validity}</Text>
            <Text style={styles.usageBadge}>{plan.usage}</Text>
          </View>
        </View>

        <View style={styles.eligibilityCard}>
          <View style={styles.eligibilityIcon}>
            <Text style={styles.eligibilityIconText}>{ICONS.tag}</Text>
          </View>
          <View style={styles.eligibilityCopy}>
            <Text style={styles.eligibilityTitle}>
              Member Pricing Eligibility
            </Text>
            <Text style={styles.eligibilityText}>
              <Text style={styles.eligibilityPercent}>{plan.eligibility}</Text>{' '}
              on selected products
            </Text>
          </View>
          <Text style={styles.infoIcon}>{ICONS.info}</Text>
        </View>

        <View style={styles.priceCard}>
          <Text style={styles.priceHeading}>Plan Price Details</Text>
          <View style={styles.priceGrid}>
            <View style={styles.priceItem}>
              <Text style={styles.priceLabel}>Monthly KG</Text>
              <Text style={styles.priceValue}>{plan.monthlyConsumptionKg}</Text>
            </View>
            <View style={styles.priceItem}>
              <Text style={styles.priceLabel}>Yearly KG</Text>
              <Text style={styles.priceValue}>{plan.yearlyConsumptionKg}</Text>
            </View>
            <View style={styles.priceItem}>
              <Text style={styles.priceLabel}>Approx / KG</Text>
              <Text style={styles.priceValue}>
                {formatMoney(plan.approxPricePerKg)}
              </Text>
            </View>
          </View>
          <View style={styles.offerRow}>
            <View>
              <Text style={styles.offerLabel}>Today's Offer</Text>
              <Text style={styles.offerSub}>
                Fees + GST value {formatMoney(plan.membershipFeeWithGst)}
              </Text>
            </View>
            <Text style={styles.offerPrice}>{formatMoney(plan.offerPrice)}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>{memberBenefitsTitle}</Text>
        <View style={styles.benefitList}>
          {memberBenefits.map((benefit, index) => (
            <View key={benefit} style={styles.benefitRow}>
              <View style={styles.benefitIconCircle}>
                <Text style={styles.benefitIcon}>
                  {benefitIcons[index] || ICONS.check}
                </Text>
              </View>
              <Text style={styles.benefitText}>{benefit}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          activeOpacity={0.86}
          style={styles.joinButton}
          onPress={() =>
            navigation.navigate('MembershipCheckout', {
              membershipType,
              planId,
            })
          }
        >
          <Text style={styles.joinText}>View Details & Payment</Text>
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
    color: RED,
    fontSize: 12,
    fontWeight: '800',
    textAlign: 'left',
    marginTop: 4,
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 22,
    paddingBottom: 106,
  },
  heroCard: {
    minHeight: 154,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: PALE_YELLOW,
    padding: 20,
  },
  planIconWrap: {
    width: 86,
    height: 86,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 22,
  },
  planIcon: {
    fontSize: 46,
  },
  heroCopy: {
    flex: 1,
  },
  planName: {
    color: DARK,
    fontSize: 22,
    fontWeight: '900',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    color: RED,
    backgroundColor: SOFT_YELLOW,
    borderRadius: 12,
    overflow: 'hidden',
    paddingHorizontal: 10,
    paddingVertical: 4,
    fontSize: 11,
    fontWeight: '900',
    marginTop: 8,
  },
  validity: {
    color: DARK,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 10,
  },
  usageBadge: {
    alignSelf: 'flex-start',
    color: DARK,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    paddingHorizontal: 10,
    paddingVertical: 4,
    fontSize: 11,
    fontWeight: '700',
    marginTop: 12,
  },
  eligibilityCard: {
    minHeight: 70,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: SOFT_YELLOW,
    paddingHorizontal: 14,
    marginTop: 16,
  },
  eligibilityIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: PAGE_YELLOW,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  eligibilityIconText: {
    color: RED,
    fontSize: 22,
  },
  eligibilityCopy: {
    flex: 1,
  },
  eligibilityTitle: {
    color: DARK,
    fontSize: 12,
    fontWeight: '900',
  },
  eligibilityText: {
    color: DARK,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 5,
  },
  eligibilityPercent: {
    color: RED,
    fontWeight: '900',
  },
  infoIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: MUTED,
    color: MUTED,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '900',
    textAlign: 'center',
  },
  sectionTitle: {
    color: DARK,
    fontSize: 16,
    fontWeight: '900',
    marginTop: 24,
    marginBottom: 14,
  },
  priceCard: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: PALE_YELLOW,
    padding: 14,
    marginTop: 16,
  },
  priceHeading: {
    color: RED,
    fontSize: 14,
    fontWeight: '900',
  },
  priceGrid: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  priceItem: {
    flex: 1,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    padding: 9,
  },
  priceLabel: {
    color: MUTED,
    fontSize: 9,
    fontWeight: '800',
  },
  priceValue: {
    color: DARK,
    fontSize: 13,
    fontWeight: '900',
    marginTop: 4,
  },
  offerRow: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 8,
    backgroundColor: SOFT_YELLOW,
    paddingHorizontal: 12,
    marginTop: 10,
    gap: 12,
  },
  offerLabel: {
    color: DARK,
    fontSize: 12,
    fontWeight: '900',
  },
  offerSub: {
    color: MUTED,
    fontSize: 9,
    fontWeight: '700',
    marginTop: 3,
  },
  offerPrice: {
    color: RED,
    fontSize: 20,
    fontWeight: '900',
  },
  benefitList: {
    gap: 14,
  },
  benefitRow: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
  },
  benefitIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: SOFT_YELLOW,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  benefitIcon: {
    color: RED,
    fontSize: 21,
  },
  benefitText: {
    flex: 1,
    color: DARK,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700',
  },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopWidth: 1,
    borderTopColor: BORDER,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  joinButton: {
    height: 56,
    borderRadius: 8,
    backgroundColor: RED,
    alignItems: 'center',
    justifyContent: 'center',
  },
  joinText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },
});

export default MembershipPlanDetailScreen;
