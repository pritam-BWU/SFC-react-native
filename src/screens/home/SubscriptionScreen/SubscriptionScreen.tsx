import React, { useState } from 'react';
import {
  Dimensions,
  Modal,
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
  membershipTypes,
  MembershipTypeId,
} from '../../../data/membershipData';
import {
  getMemberBenefitsPreview,
  memberBenefitsTitle,
} from '../../../data/memberBenefits';
import membershipPolicy from '../../../../membership_policy.json';
import refundPolicy from '../../../../refund_and_cancellation.json';
import termsPolicy from '../../../../terms_conditions.json';
import { RootStackParamList } from '../../../navigation/types';

const { width } = Dimensions.get('window');

const RED = '#CC0000';
const DARK = '#101010';
const MUTED = '#5B5B5B';
const PAGE_YELLOW = '#FFF0AD';
const SOFT_YELLOW = '#FFF7D6';
const PALE_YELLOW = '#FFFDF0';
const BORDER = '#EFE5C2';

const ICONS = {
  back: '\u2039',
  right: '\u2192',
  shield: '\u{1F6E1}\uFE0F',
  crown: '\u{1F451}',
  tag: '\u25C7',
  bag: '\u{1F6CD}\uFE0F',
  cart: '\u{1F6D2}',
  heart: '\u2665',
  info: 'i',
  check: '\u2713',
};

type Props = NativeStackScreenProps<RootStackParamList, 'Subscription'>;
type PolicyDocument = {
  title?: string;
  paragraphs?: string[];
};

const howItWorks = [
  {
    icon: ICONS.shield,
    title: 'Choose Your Membership',
    text: 'Select a membership category and plan that suits your usage.',
  },
  {
    icon: ICONS.tag,
    title: 'Enjoy Member Benefits',
    text: 'Get access to member pricing eligibility, updates and features.',
  },
  {
    icon: ICONS.cart,
    title: 'Shop & Save',
    text: 'Apply your membership benefits on eligible products while shopping.',
  },
  {
    icon: ICONS.heart,
    title: 'We Grow Together',
    text: 'Be a part of the Superfowl Food Club community and grow with us.',
  },
];

const MembershipCard = ({
  id,
  onPress,
}: {
  id: MembershipTypeId;
  onPress: (id: MembershipTypeId) => void;
}) => {
  const item = membershipTypes[id];
  const benefits = getMemberBenefitsPreview(id, 3);

  return (
    <TouchableOpacity
      activeOpacity={0.86}
      style={styles.categoryCard}
      onPress={() => onPress(id)}
    >
      <View style={styles.categoryIconCircle}>
        <Text style={styles.categoryIcon}>{item.icon}</Text>
      </View>
      <View style={styles.categoryCopy}>
        <Text style={styles.categoryTitle}>{item.title.toUpperCase()}</Text>
        <Text style={styles.statusBadge}>{item.refundable.toUpperCase()}</Text>
        <View style={styles.bulletRow}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.bulletText}>{item.validity}</Text>
        </View>
        <View style={styles.bulletRow}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.bulletText}>{item.refundable} as per policy</Text>
        </View>
        <Text style={styles.categoryText}>{item.intro}</Text>
        <Text style={styles.categoryBenefitHeading}>{memberBenefitsTitle}</Text>
        <View style={styles.categoryBenefitList}>
          {benefits.map(benefit => (
            <View key={benefit} style={styles.categoryBenefitRow}>
              <Text style={styles.categoryBenefitIcon}>{ICONS.check}</Text>
              <Text style={styles.categoryBenefitText}>{benefit}</Text>
            </View>
          ))}
        </View>
        <View style={styles.exploreButton}>
          <Text style={styles.exploreText}>Explore Plans {ICONS.right}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const SubscriptionScreen = ({ navigation }: Props) => {
  const [activePolicy, setActivePolicy] = useState<PolicyDocument | null>(null);

  const openPlans = (membershipType: MembershipTypeId) => {
    navigation.navigate('MembershipPlanList', { membershipType });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      <FoodClubHeader
        title="Membership"
        showBack
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.heroTitle}>
          Choose Your{'\n'}Membership Category
        </Text>
        <Text style={styles.heroText}>
          Select the membership experience that best suits your needs.
        </Text>

        <View style={styles.categorySection}>
          <MembershipCard id="flexible" onPress={openPlans} />
          <MembershipCard id="durable" onPress={openPlans} />
        </View>

        <View style={styles.termsCard}>
          <Text style={styles.termsIcon}>{ICONS.shield}</Text>
          <View style={styles.termsTextWrap}>
            <Text style={styles.termsText}>All memberships are subject to </Text>
            <TouchableOpacity onPress={() => setActivePolicy(termsPolicy)}>
              <Text style={styles.termsLink}>Terms</Text>
            </TouchableOpacity>
            <Text style={styles.termsText}>, </Text>
            <TouchableOpacity onPress={() => setActivePolicy(membershipPolicy)}>
              <Text style={styles.termsLink}>Membership Policy</Text>
            </TouchableOpacity>
            <Text style={styles.termsText}>, & </Text>
            <TouchableOpacity onPress={() => setActivePolicy(refundPolicy)}>
              <Text style={styles.termsLink}>Refund Policy</Text>
            </TouchableOpacity>
            <Text style={styles.termsText}>.</Text>
          </View>
        </View>

        <Text style={styles.worksHeading}>How Membership Works</Text>
        <View style={styles.worksHero}>
          <Text style={styles.bagIcon}>{ICONS.bag}</Text>
          <View style={styles.discountBubble}>
            <Text style={styles.discountText}>%</Text>
          </View>
        </View>
        <View style={styles.worksList}>
          {howItWorks.map(step => (
            <View key={step.title} style={styles.workCard}>
              <View style={styles.workIconCircle}>
                <Text style={styles.workIcon}>{step.icon}</Text>
              </View>
              <View style={styles.workCopy}>
                <Text style={styles.workTitle}>{step.title}</Text>
                <Text style={styles.workText}>{step.text}</Text>
              </View>
            </View>
          ))}
        </View>

        <Text style={styles.compareHeading}>Compare at a glance</Text>
        <View style={styles.compareGrid}>
          <View style={styles.compareColumn}>
            <Text style={[styles.compareHeader, styles.flexibleHeader]}>
              Flexible (Refundable)
            </Text>
            <Text style={styles.compareCell}>5 Years</Text>
            <Text style={styles.compareCell}>Refundable as per policy</Text>
            <Text style={[styles.compareStrong, styles.flexibleText]}>
              Generally 10% - 30%*
            </Text>
            <Text style={styles.compareSub}>on selected products</Text>
            <Text style={styles.compareCell}>Standard Support</Text>
            <Text style={styles.compareCell}>Users who prefer flexibility</Text>
          </View>
          <View style={styles.compareColumn}>
            <Text style={[styles.compareHeader, styles.durableHeader]}>
              Long-Duration (Non-Refundable)
            </Text>
            <Text style={styles.compareCell}>Lifetime / Extended</Text>
            <Text style={styles.compareCell}>Non-Refundable</Text>
            <Text style={[styles.compareStrong, styles.durableText]}>
              Generally 20% - 40%*
            </Text>
            <Text style={styles.compareSub}>on selected products</Text>
            <Text style={styles.compareCell}>Priority Support</Text>
            <Text style={styles.compareCell}>Users who want maximum benefits</Text>
          </View>
        </View>

        <View style={styles.bottomNote}>
          <Text style={styles.bottomNoteText}>
            {ICONS.check} Membership benefits are applicable as per the terms
            and conditions of Superfowl Food Club.
          </Text>
        </View>
      </ScrollView>
      <Modal
        visible={Boolean(activePolicy)}
        transparent
        animationType="fade"
        onRequestClose={() => setActivePolicy(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.policyCard}>
            <Text style={styles.policyTitle}>{activePolicy?.title || 'Policy'}</Text>
            <ScrollView style={styles.policyScroll}>
              <Text style={styles.policyBody}>
                {activePolicy?.paragraphs?.join('\n\n') ||
                  'Please review this policy from the app profile policy section.'}
              </Text>
            </ScrollView>
            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.policyButton}
              onPress={() => setActivePolicy(null)}
            >
              <Text style={styles.policyButtonText}>Got it</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  content: {
    paddingHorizontal: 18,
    paddingTop: 22,
    paddingBottom: 24,
  },
  heroTitle: {
    color: DARK,
    fontSize: 25,
    lineHeight: 30,
    fontWeight: '900',
  },
  heroText: {
    color: MUTED,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 14,
    maxWidth: width * 0.82,
  },
  categorySection: {
    gap: 14,
  },
  categoryCard: {
    minHeight: 258,
    flexDirection: 'row',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: '#FFFFFF',
    padding: 16,
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  categoryIconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: RED,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 18,
  },
  categoryIcon: {
    color: PAGE_YELLOW,
    fontSize: 31,
  },
  categoryCopy: {
    flex: 1,
  },
  categoryTitle: {
    color: RED,
    fontSize: 16,
    lineHeight: 20,
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
    fontSize: 10,
    fontWeight: '900',
    marginTop: 8,
    marginBottom: 8,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  bullet: {
    color: DARK,
    fontSize: 14,
    marginRight: 8,
  },
  bulletText: {
    color: DARK,
    fontSize: 12,
    fontWeight: '700',
  },
  categoryText: {
    color: DARK,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '600',
    marginTop: 12,
  },
  categoryBenefitHeading: {
    color: RED,
    fontSize: 11,
    fontWeight: '900',
    marginTop: 12,
  },
  categoryBenefitList: {
    gap: 6,
    marginTop: 8,
  },
  categoryBenefitRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  categoryBenefitIcon: {
    color: RED,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '900',
    marginRight: 7,
  },
  categoryBenefitText: {
    flex: 1,
    color: DARK,
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '700',
  },
  exploreButton: {
    alignSelf: 'flex-start',
    borderRadius: 8,
    backgroundColor: RED,
    paddingHorizontal: 14,
    paddingVertical: 9,
    marginTop: 12,
  },
  exploreText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },
  termsCard: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: PALE_YELLOW,
    borderWidth: 1,
    borderColor: BORDER,
    paddingHorizontal: 14,
    marginTop: 18,
  },
  termsIcon: {
    color: RED,
    fontSize: 22,
    marginRight: 10,
  },
  termsText: {
    color: DARK,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '700',
  },
  termsTextWrap: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  termsLink: {
    color: RED,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '900',
    textDecorationLine: 'underline',
  },
  worksHeading: {
    color: DARK,
    fontSize: 18,
    fontWeight: '900',
    textAlign: 'center',
    marginTop: 24,
  },
  worksHero: {
    height: 116,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bagIcon: {
    color: RED,
    fontSize: 70,
  },
  discountBubble: {
    position: 'absolute',
    right: width * 0.24,
    bottom: 20,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: PAGE_YELLOW,
    borderWidth: 2,
    borderColor: RED,
    alignItems: 'center',
    justifyContent: 'center',
  },
  discountText: {
    color: RED,
    fontSize: 22,
    fontWeight: '900',
  },
  worksList: {
    gap: 12,
  },
  compareHeading: {
    color: DARK,
    fontSize: 18,
    fontWeight: '900',
    textAlign: 'center',
    marginTop: 22,
    marginBottom: 12,
  },
  compareGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  compareColumn: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  compareHeader: {
    minHeight: 48,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '900',
    paddingHorizontal: 8,
    paddingVertical: 10,
  },
  flexibleHeader: {
    color: '#158A2B',
    backgroundColor: '#F3FBF0',
  },
  durableHeader: {
    color: '#5B35C7',
    backgroundColor: '#F6F1FF',
  },
  compareCell: {
    minHeight: 44,
    color: DARK,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '700',
    textAlign: 'center',
    textAlignVertical: 'center',
    borderTopWidth: 1,
    borderTopColor: BORDER,
    paddingHorizontal: 8,
    paddingVertical: 9,
  },
  compareStrong: {
    minHeight: 32,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '900',
    textAlign: 'center',
    borderTopWidth: 1,
    borderTopColor: BORDER,
    paddingHorizontal: 8,
    paddingTop: 9,
  },
  flexibleText: {
    color: '#158A2B',
  },
  durableText: {
    color: '#5B35C7',
  },
  compareSub: {
    color: MUTED,
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '700',
    textAlign: 'center',
    paddingBottom: 9,
  },
  workCard: {
    minHeight: 82,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    shadowColor: '#000000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  workIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: SOFT_YELLOW,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  workIcon: {
    color: RED,
    fontSize: 24,
  },
  workCopy: {
    flex: 1,
  },
  workTitle: {
    color: DARK,
    fontSize: 13,
    fontWeight: '900',
  },
  workText: {
    color: MUTED,
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '600',
    marginTop: 4,
  },
  bottomNote: {
    borderRadius: 8,
    backgroundColor: PALE_YELLOW,
    padding: 14,
    marginTop: 18,
  },
  bottomNoteText: {
    color: RED,
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '800',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.48)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  policyCard: {
    width: '100%',
    maxHeight: '78%',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: '#FFFFFF',
    padding: 18,
  },
  policyTitle: {
    color: DARK,
    fontSize: 19,
    fontWeight: '900',
    marginBottom: 10,
  },
  policyScroll: {
    maxHeight: 360,
  },
  policyBody: {
    color: '#333333',
    fontSize: 13,
    lineHeight: 20,
    fontWeight: '600',
  },
  policyButton: {
    height: 44,
    borderRadius: 8,
    backgroundColor: RED,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  policyButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },
});

export default SubscriptionScreen;
