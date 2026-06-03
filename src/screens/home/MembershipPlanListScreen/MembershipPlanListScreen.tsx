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
import { membershipTypes } from '../../../data/membershipData';
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
  right: '\u203A',
  info: 'i',
  check: '\u2713',
};

type Props = NativeStackScreenProps<RootStackParamList, 'MembershipPlanList'>;

const formatMoney = (amount: number) =>
  `\u20B9${amount.toLocaleString('en-IN')}`;

const MembershipPlanListScreen = ({ navigation, route }: Props) => {
  const membershipType = route.params?.membershipType ?? 'flexible';
  const membership = membershipTypes[membershipType];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      <FoodClubHeader
        title={membership.title}
        showBack
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.introCard}>
          <View style={styles.introIconCircle}>
            <Text style={styles.introIcon}>{membership.icon}</Text>
          </View>
          <Text style={styles.introText}>{membership.intro}</Text>
        </View>
        <Text style={styles.headerBadge}>{membership.badge}</Text>

        <Text style={styles.sectionTitle}>Choose Your Plan</Text>
        <View style={styles.planList}>
          {membership.plans.map(plan => {
            const benefits = getMemberBenefitsForPlan(membership.id, plan);

            return (
              <View
                key={plan.id}
                style={styles.planCard}
              >
                <View style={styles.planMainRow}>
                  <View
                    style={[
                      styles.planIconWrap,
                      {
                        backgroundColor: plan.softAccent,
                        borderColor: plan.accent,
                      },
                    ]}
                  >
                    <Text style={[styles.planIcon, { color: plan.accent }]}>
                      {plan.icon}
                    </Text>
                  </View>
                  <View style={styles.planCopy}>
                    <Text style={styles.planName}>{plan.name}</Text>
                    <Text style={styles.planUsage}>{plan.usage}</Text>
                    <Text style={styles.planEligibility}>{plan.eligibility}</Text>
                    <Text style={styles.planSub}>Member Pricing Eligibility</Text>
                    <View style={styles.priceRow}>
                      <Text style={styles.offerLabel}>Today's Offer</Text>
                      <Text style={styles.offerPrice}>
                        {formatMoney(plan.offerPrice)}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.planBenefitsBlock}>
                  <Text style={styles.planBenefitsTitle}>{memberBenefitsTitle}</Text>
                  {benefits.map(benefit => (
                    <View key={benefit} style={styles.planBenefitRow}>
                      <Text style={styles.planBenefitIcon}>{ICONS.check}</Text>
                      <Text style={styles.planBenefitText}>{benefit}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.planActionRow}>
                  <TouchableOpacity
                    activeOpacity={0.85}
                    style={styles.detailButton}
                    onPress={() =>
                      navigation.navigate('MembershipPlanDetail', {
                        membershipType: membership.id,
                        planId: plan.id,
                      })
                    }
                  >
                    <Text style={styles.detailButtonText}>View Details</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.85}
                    style={styles.paymentButton}
                    onPress={() =>
                      navigation.navigate('MembershipCheckout', {
                        membershipType: membership.id,
                        planId: plan.id,
                      })
                    }
                  >
                    <Text style={styles.paymentButtonText}>
                      Payment {ICONS.right}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>

        <View style={styles.noteCard}>
          <Text style={styles.noteIcon}>{ICONS.info}</Text>
          <Text style={styles.noteText}>
            Benefits and pricing eligibility may vary depending on product
            category, availability and other operational conditions.
          </Text>
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
  headerBadge: {
    alignSelf: 'center',
    color: RED,
    backgroundColor: SOFT_YELLOW,
    borderRadius: 12,
    overflow: 'hidden',
    paddingHorizontal: 10,
    paddingVertical: 4,
    fontSize: 10,
    fontWeight: '900',
    marginTop: 12,
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 22,
    paddingBottom: 24,
  },
  introCard: {
    minHeight: 82,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: PALE_YELLOW,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 16,
  },
  introIconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: PAGE_YELLOW,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  introIcon: {
    color: RED,
    fontSize: 24,
  },
  introText: {
    flex: 1,
    color: DARK,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '700',
  },
  sectionTitle: {
    color: DARK,
    fontSize: 16,
    fontWeight: '900',
    marginTop: 22,
    marginBottom: 14,
  },
  planList: {
    gap: 12,
  },
  planCard: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: '#FFFFFF',
    padding: 16,
    shadowColor: '#000000',
    shadowOpacity: 0.07,
    shadowRadius: 7,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  planMainRow: {
    minHeight: 92,
    flexDirection: 'row',
    alignItems: 'center',
  },
  planIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 18,
  },
  planIcon: {
    fontSize: 32,
  },
  planCopy: {
    flex: 1,
  },
  planName: {
    color: DARK,
    fontSize: 17,
    fontWeight: '900',
  },
  planUsage: {
    color: DARK,
    fontSize: 11,
    fontWeight: '700',
    marginTop: 3,
  },
  planEligibility: {
    color: RED,
    fontSize: 14,
    fontWeight: '900',
    marginTop: 10,
  },
  planSub: {
    color: DARK,
    fontSize: 10,
    fontWeight: '700',
    marginTop: 2,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 8,
    backgroundColor: PALE_YELLOW,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginTop: 10,
  },
  offerLabel: {
    color: MUTED,
    fontSize: 10,
    fontWeight: '800',
  },
  offerPrice: {
    color: RED,
    fontSize: 14,
    fontWeight: '900',
  },
  planBenefitsBlock: {
    borderRadius: 8,
    backgroundColor: PALE_YELLOW,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 10,
    marginTop: 14,
    gap: 6,
  },
  planBenefitsTitle: {
    color: RED,
    fontSize: 11,
    fontWeight: '900',
    marginBottom: 2,
  },
  planBenefitRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  planBenefitIcon: {
    color: RED,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '900',
    marginRight: 8,
  },
  planBenefitText: {
    flex: 1,
    color: DARK,
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '700',
  },
  planActionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  detailButton: {
    flex: 1,
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: RED,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailButtonText: {
    color: RED,
    fontSize: 12,
    fontWeight: '900',
  },
  paymentButton: {
    flex: 1,
    height: 44,
    borderRadius: 8,
    backgroundColor: RED,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },
  noteCard: {
    minHeight: 62,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: PALE_YELLOW,
    borderWidth: 1,
    borderColor: BORDER,
    paddingHorizontal: 12,
    marginTop: 18,
  },
  noteIcon: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: MUTED,
    color: MUTED,
    fontSize: 13,
    lineHeight: 20,
    fontWeight: '900',
    textAlign: 'center',
    marginRight: 12,
  },
  noteText: {
    flex: 1,
    color: MUTED,
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '600',
  },
});

export default MembershipPlanListScreen;
