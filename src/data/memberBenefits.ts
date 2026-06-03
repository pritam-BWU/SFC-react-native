import memberBenefitsData from './member_benefits.json';
import { MembershipPlan, MembershipTypeId } from './membershipData';

const categoryIdByMembershipType: Record<MembershipTypeId, string> = {
  flexible: 'flexible_membership_access',
  durable: 'long_duration_membership_access',
};

export const getMemberBenefitsCategory = (membershipType: MembershipTypeId) =>
  memberBenefitsData.categories.find(
    category => category.id === categoryIdByMembershipType[membershipType],
  );

export const getMemberBenefitsForPlan = (
  membershipType: MembershipTypeId,
  plan: Pick<MembershipPlan, 'name' | 'benefits'>,
) => {
  const category = getMemberBenefitsCategory(membershipType);
  const planBenefits = category?.plans.find(
    item => item.name.toLowerCase() === plan.name.toLowerCase(),
  );

  return planBenefits?.benefits ?? plan.benefits;
};

export const getMemberBenefitsPreview = (
  membershipType: MembershipTypeId,
  count = 3,
) => {
  const category = getMemberBenefitsCategory(membershipType);
  const firstPlan = category?.plans[0];

  return firstPlan?.benefits.slice(0, count) ?? [];
};

export const memberBenefitsTitle = memberBenefitsData.title;
