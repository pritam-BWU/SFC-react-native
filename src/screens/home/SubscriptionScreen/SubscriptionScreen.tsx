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
import {
  membershipTypes,
  MembershipTypeId,
} from '../../../data/membershipData';
import {
  getMemberBenefitsPreview,
  memberBenefitsTitle,
} from '../../../data/memberBenefits';
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
          <Text style={styles.termsText}>
            All memberships are subject to our Terms, Membership Policy and
            Refund Policy.
          </Text>
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

        <View style={styles.bottomNote}>
          <Text style={styles.bottomNoteText}>
            {ICONS.check} Membership benefits are applicable as per the terms
            and conditions of Superfowl Food Club.
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
    flex: 1,
    color: DARK,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '700',
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
});

export default SubscriptionScreen;
