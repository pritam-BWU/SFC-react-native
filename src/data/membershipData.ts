export type MembershipTypeId = 'flexible' | 'durable';
export type MembershipPlanId =
  | 'starter'
  | 'bronze'
  | 'silver'
  | 'gold'
  | 'platinum'
  | 'diamond';

export type MembershipPlan = {
  id: MembershipPlanId;
  name: string;
  monthlyConsumptionKg: number;
  yearlyConsumptionKg: number;
  approxPricePerKg: number;
  membershipFee: number;
  membershipFeeWithGst: number;
  offerPrice: number;
  usage: string;
  eligibility: string;
  icon: string;
  accent: string;
  softAccent: string;
  benefits: string[];
};

export type MembershipType = {
  id: MembershipTypeId;
  title: string;
  shortTitle: string;
  badge: string;
  validity: string;
  refundable: string;
  intro: string;
  icon: string;
  plans: MembershipPlan[];
};

const flexibleBenefits = [
  'Access to member-oriented pricing benefits on selected products',
  'Product updates and future ordering notifications',
  'Save favorites and manage preferences',
  'Access to member-exclusive campaigns and offers',
  'Standard member support assistance',
];

const durableBenefits = [
  'Enhanced member-oriented pricing benefits on selected products',
  'Priority access to future services and new features',
  'Priority member support and faster assistance',
  'Exclusive member campaigns and special access',
  'Premium account convenience and advanced features',
];

export const membershipTypes: Record<MembershipTypeId, MembershipType> = {
  flexible: {
    id: 'flexible',
    title: 'Flexible Membership Access',
    shortTitle: 'Flexible Membership',
    badge: 'Refundable - 5-Year Validity',
    validity: '5-Year Validity',
    refundable: 'Refundable',
    intro:
      'Flexible membership with 5 years validity and eligible member-oriented benefits.',
    icon: '\u{1F6E1}\uFE0F',
    plans: [
      {
        id: 'bronze',
        name: 'Bronze',
        monthlyConsumptionKg: 1,
        yearlyConsumptionKg: 12,
        approxPricePerKg: 400,
        membershipFee: 4800,
        membershipFeeWithGst: 5664,
        offerPrice: 5000,
        usage: 'Light Usage',
        eligibility: '10% - 15%',
        icon: '\u{1F6E1}\uFE0F',
        accent: '#B5651D',
        softAccent: '#FFF2E4',
        benefits: flexibleBenefits,
      },
      {
        id: 'silver',
        name: 'Silver',
        monthlyConsumptionKg: 2,
        yearlyConsumptionKg: 24,
        approxPricePerKg: 400,
        membershipFee: 9600,
        membershipFeeWithGst: 11328,
        offerPrice: 10000,
        usage: 'Moderate Usage',
        eligibility: '15% - 20%',
        icon: '\u25C8',
        accent: '#8E99A8',
        softAccent: '#F1F4F8',
        benefits: flexibleBenefits,
      },
      {
        id: 'platinum',
        name: 'Platinum',
        monthlyConsumptionKg: 5,
        yearlyConsumptionKg: 60,
        approxPricePerKg: 400,
        membershipFee: 24000,
        membershipFeeWithGst: 28320,
        offerPrice: 25000,
        usage: 'High Household Usage',
        eligibility: '25% - 30%',
        icon: '\u25C9',
        accent: '#2EAAC4',
        softAccent: '#EAF9FC',
        benefits: flexibleBenefits,
      },
      {
        id: 'gold',
        name: 'Gold',
        monthlyConsumptionKg: 10,
        yearlyConsumptionKg: 120,
        approxPricePerKg: 400,
        membershipFee: 48000,
        membershipFeeWithGst: 56640,
        offerPrice: 50000,
        usage: 'Family Usage',
        eligibility: '20% - 25%',
        icon: '\u2605',
        accent: '#D8A000',
        softAccent: '#FFF6D8',
        benefits: flexibleBenefits,
      },
      {
        id: 'diamond',
        name: 'Diamond',
        monthlyConsumptionKg: 20,
        yearlyConsumptionKg: 240,
        approxPricePerKg: 400,
        membershipFee: 96000,
        membershipFeeWithGst: 113280,
        offerPrice: 100000,
        usage: 'Premium / High Volume Usage',
        eligibility: 'Up to 30%',
        icon: '\u25C7',
        accent: '#8B48D7',
        softAccent: '#F3EAFE',
        benefits: flexibleBenefits,
      },
    ],
  },
  durable: {
    id: 'durable',
    title: 'Long-Duration Membership Access',
    shortTitle: 'Long-Duration Membership',
    badge: 'Non-Refundable - Extended Validity',
    validity: 'Extended Validity',
    refundable: 'Non-Refundable',
    intro:
      'Extended validity membership with enhanced benefits and higher pricing eligibility.',
    icon: '\u{1F451}',
    plans: [
      {
        id: 'starter',
        name: 'Starter',
        monthlyConsumptionKg: 0,
        yearlyConsumptionKg: 0,
        approxPricePerKg: 0,
        membershipFee: 846,
        membershipFeeWithGst: 999,
        offerPrice: 999,
        usage: 'Starter Access',
        eligibility: 'Refer & Earn',
        icon: '\u2726',
        accent: '#CC0000',
        softAccent: '#FFF0EF',
        benefits: durableBenefits,
      },
      {
        id: 'bronze',
        name: 'Bronze',
        monthlyConsumptionKg: 1,
        yearlyConsumptionKg: 12,
        approxPricePerKg: 400,
        membershipFee: 4800,
        membershipFeeWithGst: 5664,
        offerPrice: 5000,
        usage: 'Light Usage',
        eligibility: '20% - 25%',
        icon: '\u{1F6E1}\uFE0F',
        accent: '#B5651D',
        softAccent: '#FFF2E4',
        benefits: durableBenefits,
      },
      {
        id: 'silver',
        name: 'Silver',
        monthlyConsumptionKg: 2,
        yearlyConsumptionKg: 24,
        approxPricePerKg: 400,
        membershipFee: 9600,
        membershipFeeWithGst: 11328,
        offerPrice: 10000,
        usage: 'Moderate Usage',
        eligibility: '25% - 30%',
        icon: '\u25C8',
        accent: '#8E99A8',
        softAccent: '#F1F4F8',
        benefits: durableBenefits,
      },
      {
        id: 'platinum',
        name: 'Platinum',
        monthlyConsumptionKg: 5,
        yearlyConsumptionKg: 60,
        approxPricePerKg: 400,
        membershipFee: 24000,
        membershipFeeWithGst: 28320,
        offerPrice: 25000,
        usage: 'High Household Usage',
        eligibility: '25% - 40%',
        icon: '\u25C9',
        accent: '#2EAAC4',
        softAccent: '#EAF9FC',
        benefits: durableBenefits,
      },
      {
        id: 'gold',
        name: 'Gold',
        monthlyConsumptionKg: 10,
        yearlyConsumptionKg: 120,
        approxPricePerKg: 400,
        membershipFee: 48000,
        membershipFeeWithGst: 56640,
        offerPrice: 50000,
        usage: 'Family Usage',
        eligibility: '30% - 35%',
        icon: '\u2605',
        accent: '#D8A000',
        softAccent: '#FFF6D8',
        benefits: durableBenefits,
      },
      {
        id: 'diamond',
        name: 'Diamond',
        monthlyConsumptionKg: 20,
        yearlyConsumptionKg: 240,
        approxPricePerKg: 400,
        membershipFee: 96000,
        membershipFeeWithGst: 113280,
        offerPrice: 100000,
        usage: 'Premium / High Volume Usage',
        eligibility: 'Up to 40%',
        icon: '\u25C7',
        accent: '#8B48D7',
        softAccent: '#F3EAFE',
        benefits: durableBenefits,
      },
    ],
  },
};

export const getMembershipPlan = (
  membershipType: MembershipTypeId,
  planId: MembershipPlanId,
) => membershipTypes[membershipType].plans.find(plan => plan.id === planId);
