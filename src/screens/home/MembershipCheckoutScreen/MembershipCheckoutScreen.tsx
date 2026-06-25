import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import RazorpayCheckout, { PaymentErrorData } from 'react-native-razorpay';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  getMobileProfile,
  updateMobileProfile,
  UpdateProfileRequest,
} from '../../../api/profile.api';
import { confirmPayment, createPaymentOrder } from '../../../api/subscription.api';
import FoodClubHeader from '../../../components/common/FoodClubHeader/FoodClubHeader';
import { getMembershipPlan, membershipTypes } from '../../../data/membershipData';
import {
  getMemberBenefitsForPlan,
  memberBenefitsTitle,
} from '../../../data/memberBenefits';
import { RootStackParamList } from '../../../navigation/types';
import { authSession } from '../../../services/auth/session.service';
import { Gender } from '../../../types/auth.types';
import { getProfileCompletion } from '../../../utils/profileCompletion';

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

const genderOptions: Array<{ label: string; value: Gender }> = [
  { label: 'Male', value: 'M' },
  { label: 'Female', value: 'F' },
  { label: 'Other', value: 'O' },
];

const emptyProfileForm: UpdateProfileRequest = {
  full_name: '',
  dob: '',
  gender: 'O',
  nationality: '',
  address: '',
  city: '',
  state: '',
  postal_code: '',
  phone_number: '',
  email_address: '',
};

const formatMoney = (amount: number) =>
  `\u20B9${amount.toLocaleString('en-IN')}`;

const MembershipCheckoutScreen = ({ navigation, route }: Props) => {
  const [paymentInProgress, setPaymentInProgress] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSnapshot, setProfileSnapshot] = useState(authSession.getProfile());
  const [profileForm, setProfileForm] = useState<UpdateProfileRequest>(() => {
    const currentProfile = authSession.getProfile();
    return {
      full_name: currentProfile?.full_name || '',
      dob: currentProfile?.dob || '',
      gender: currentProfile?.gender || 'O',
      nationality: currentProfile?.nationality || '',
      address: currentProfile?.address || '',
      city: currentProfile?.city || '',
      state: currentProfile?.state || '',
      postal_code: currentProfile?.postal_code || '',
      phone_number: currentProfile?.phone_number || '',
      email_address: currentProfile?.email_address || '',
    };
  });
  const [referralCode, setReferralCode] = useState('');
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
  const profile = profileSnapshot;
  const completion = getProfileCompletion(profile);

  React.useEffect(() => {
    let isMounted = true;
    getMobileProfile()
      .then(nextProfile => {
        if (!isMounted) {
          return;
        }
        setProfileSnapshot(nextProfile);
        setProfileForm({
          full_name: nextProfile.full_name || '',
          dob: nextProfile.dob || '',
          gender: nextProfile.gender || 'O',
          nationality: nextProfile.nationality || '',
          address: nextProfile.address || '',
          city: nextProfile.city || '',
          state: nextProfile.state || '',
          postal_code: nextProfile.postal_code || '',
          phone_number: nextProfile.phone_number || '',
          email_address: nextProfile.email_address || '',
        });
      })
      .catch(() => undefined);

    return () => {
      isMounted = false;
    };
  }, []);

  const updateProfileForm = (
    field: keyof UpdateProfileRequest,
    value: string,
  ) => {
    setProfileForm(current => ({
      ...current,
      [field]: field === 'gender' ? (value as Gender) : value,
    }));
  };

  const handleProfileSave = async () => {
    const missingFields = [
      !profileForm.full_name.trim() && 'Name',
      !profileForm.dob.trim() && 'DoB',
      !profileForm.gender && 'Gender',
      !profileForm.nationality.trim() && 'Nationality',
      !profileForm.address.trim() && 'Address',
      !profileForm.city.trim() && 'City',
      !profileForm.state.trim() && 'State/Province',
      !profileForm.postal_code.trim() && 'ZIP/Postal code',
      !profileForm.phone_number.trim() && 'Phone',
      !profileForm.email_address.trim() && 'Email',
    ].filter(Boolean);

    if (missingFields.length) {
      Alert.alert('Complete profile', `Please fill: ${missingFields.join(', ')}`);
      return;
    }

    try {
      setProfileSaving(true);
      const updatedProfile = await updateMobileProfile({
        ...profileForm,
        full_name: profileForm.full_name.trim(),
        dob: profileForm.dob.trim(),
        nationality: profileForm.nationality.trim(),
        address: profileForm.address.trim(),
        city: profileForm.city.trim(),
        state: profileForm.state.trim(),
        postal_code: profileForm.postal_code.trim(),
        phone_number: profileForm.phone_number.trim(),
        email_address: profileForm.email_address.trim(),
      });
      setProfileSnapshot(updatedProfile);
      Alert.alert('Profile saved', 'You can continue to payment now.');
    } catch (error) {
      Alert.alert(
        'Profile update failed',
        error instanceof Error ? error.message : 'Please try again.',
      );
    } finally {
      setProfileSaving(false);
    }
  };

  const handlePayment = async () => {
    if (paymentInProgress) {
      return;
    }

    setPaymentInProgress(true);

    try {
      const paymentOrder = await createPaymentOrder({
        membership_type: membershipType,
        plan_id: plan.id,
        referral_code: referralCode.trim().toUpperCase(),
      });

      if (!paymentOrder.razorpay_key_id || !paymentOrder.gateway_order_id) {
        throw new Error('Payment gateway is not configured for this plan.');
      }

      const paymentResult = await RazorpayCheckout.open({
        key: paymentOrder.razorpay_key_id,
        amount: paymentOrder.amount_in_paise,
        currency: paymentOrder.order.currency,
        name: 'Superfowl FoodClub',
        description: `${paymentOrder.order.subscription_plan_name} Membership`,
        order_id: paymentOrder.gateway_order_id,
        prefill: {
          name: profile?.full_name,
          email: profile?.email_address,
          contact: profile?.phone_number,
        },
        notes: {
          local_order_id: String(paymentOrder.order.id),
          receipt: paymentOrder.receipt,
        },
        theme: {
          color: RED,
        },
        modal: {
          confirm_close: true,
        },
      });

      await confirmPayment({
        payment_order_id: paymentOrder.order.id,
        razorpay_payment_id: paymentResult.razorpay_payment_id,
        razorpay_order_id: paymentResult.razorpay_order_id,
        razorpay_signature: paymentResult.razorpay_signature,
        raw_payload: paymentResult,
      });

      navigation.navigate('MembershipSuccess', {
        membershipType,
        planId: plan.id,
      });
    } catch (error) {
      const paymentError = error as PaymentErrorData;
      const message =
        error instanceof Error
          ? error.message
          : paymentError.description ||
            paymentError.reason ||
            'Payment was cancelled or could not be completed.';

      Alert.alert('Payment not completed', message);
    } finally {
      setPaymentInProgress(false);
    }
  };

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
            {ICONS.lock}{' '}
            {membershipType === 'durable'
              ? 'Safe & Secure - No-Renewal'
              : 'Safe - Secure - No Auto-Renewal'}
          </Text>
          <Text style={styles.secureText}>100% Secure</Text>
        </View>

        <View style={styles.selectedCard}>
          <Text style={styles.selectedLabel}>You selected</Text>
          <Text style={styles.categoryTag}>{membership.shortTitle}</Text>
          <View style={styles.planIconBox}>
            <Text style={styles.planHeroIcon}>{plan.icon}</Text>
          </View>
          <View style={styles.planCopy}>
            <Text style={styles.planTitle}>{plan.name} Plan</Text>
            <Text style={styles.planDesc}>
              Member benefits on selected products.
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
                  <Text style={styles.metaSub}>Member benefits on selected products.</Text>
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

        {!completion.isComplete ? (
          <View style={styles.profileGateCard}>
            <View style={styles.profileGateHeader}>
              <Text style={styles.sectionTitle}>Complete account details</Text>
              <Text style={styles.profileGatePercent}>{completion.percentage}%</Text>
            </View>
            <Text style={styles.profileGateText}>
              Membership payment opens after all mandatory account fields are saved.
            </Text>
            {!!completion.missingFields.length && (
              <Text style={styles.profileMissingText}>
                Missing: {completion.missingFields.join(', ')}
              </Text>
            )}

            <Text style={styles.profileInputLabel}>Name</Text>
            <TextInput value={profileForm.full_name} onChangeText={value => updateProfileForm('full_name', value)} placeholder="Full name" style={styles.profileInput} />
            <Text style={styles.profileInputLabel}>DoB</Text>
            <TextInput value={profileForm.dob} onChangeText={value => updateProfileForm('dob', value)} placeholder="YYYY-MM-DD" style={styles.profileInput} />
            <Text style={styles.profileInputLabel}>Gender</Text>
            <View style={styles.profileGenderRow}>
              {genderOptions.map(option => {
                const selected = profileForm.gender === option.value;
                return (
                  <TouchableOpacity key={option.value} activeOpacity={0.78} style={[styles.profileGenderButton, selected && styles.profileGenderButtonActive]} onPress={() => updateProfileForm('gender', option.value)}>
                    <Text style={[styles.profileGenderText, selected && styles.profileGenderTextActive]}>{option.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <Text style={styles.profileInputLabel}>Nationality</Text>
            <TextInput value={profileForm.nationality} onChangeText={value => updateProfileForm('nationality', value)} placeholder="Nationality" style={styles.profileInput} />
            <Text style={styles.profileInputLabel}>Address</Text>
            <TextInput value={profileForm.address} onChangeText={value => updateProfileForm('address', value)} placeholder="Address" multiline style={[styles.profileInput, styles.profileAddressInput]} />
            <Text style={styles.profileInputLabel}>City</Text>
            <TextInput value={profileForm.city} onChangeText={value => updateProfileForm('city', value)} placeholder="City" style={styles.profileInput} />
            <Text style={styles.profileInputLabel}>State/Province</Text>
            <TextInput value={profileForm.state} onChangeText={value => updateProfileForm('state', value)} placeholder="State or province" style={styles.profileInput} />
            <Text style={styles.profileInputLabel}>ZIP/Postal code</Text>
            <TextInput value={profileForm.postal_code} onChangeText={value => updateProfileForm('postal_code', value)} placeholder="ZIP or postal code" keyboardType="number-pad" style={styles.profileInput} />
            <Text style={styles.profileInputLabel}>Phone</Text>
            <TextInput value={profileForm.phone_number} onChangeText={value => updateProfileForm('phone_number', value)} placeholder="Phone number" keyboardType="phone-pad" style={styles.profileInput} />
            <Text style={styles.profileInputLabel}>Email</Text>
            <TextInput value={profileForm.email_address} onChangeText={value => updateProfileForm('email_address', value)} placeholder="Email address" keyboardType="email-address" autoCapitalize="none" style={styles.profileInput} />

            <TouchableOpacity activeOpacity={0.85} disabled={profileSaving} style={[styles.profileSaveButton, profileSaving && styles.payButtonDisabled]} onPress={handleProfileSave}>
              {profileSaving ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.profileSaveText}>Save and Continue</Text>}
            </TouchableOpacity>
          </View>
        ) : (
          <>
        <View style={styles.referralCard}>
          <Text style={styles.sectionTitle}>Referral Code</Text>
          <Text style={styles.referralText}>
            If a friend shared a referral code with you, add it here before payment.
          </Text>
          <TextInput
            value={referralCode}
            onChangeText={value => setReferralCode(value.toUpperCase())}
            placeholder="Optional referral code"
            autoCapitalize="characters"
            autoCorrect={false}
            style={styles.profileInput}
          />
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

        <View style={styles.disclaimerCard}>
          <Text style={styles.disclaimerTitle}>Membership Disclaimer:</Text>
          <Text style={styles.disclaimerText}>
            Membership plans provide access to selected member-oriented platform
            benefits and future service conveniences. Membership does not
            guarantee fixed savings, financial returns, product availability, or
            uninterrupted future services. Benefits may vary depending on
            operational regions, product categories, availability, and future
            platform updates.
          </Text>
        </View>

        <View style={styles.promiseRow}>
          <View style={styles.promiseCard}>
            <Text style={styles.promiseIcon}>{ICONS.shield}</Text>
            <View style={styles.promiseTextWrap}>
              <Text style={styles.promiseTitle}>
                {membershipType === 'durable' ? 'No-Renewal' : 'No Auto-Renewal'}
              </Text>
              <Text style={styles.promiseText}>
                {membershipType === 'durable'
                  ? 'Pay one time and enjoy extended benefits.'
                  : 'Renew at your wish after the validity expires.'}
              </Text>
            </View>
          </View>
          <View style={styles.promiseCard}>
            <Text style={styles.promiseIcon}>{ICONS.check}</Text>
            <View style={styles.promiseTextWrap}>
              <Text style={styles.promiseTitle}>Upgrade Anytime</Text>
              <Text style={styles.promiseText}>Upgrade your plan anytime.</Text>
            </View>
          </View>
        </View>

        <View style={styles.infoPanel}>
          <Text style={styles.infoTitle}>Secure membership checkout</Text>
          <Text style={styles.infoText}>
            Your selected plan will move to office approval after successful
            payment. Benefits are subject to product availability, service area,
            and membership policy.
          </Text>
        </View>
          </>
        )}
      </ScrollView>

      {completion.isComplete && (
      <View style={styles.payBar}>
        <View>
          <Text style={styles.payLabel}>Total Payable</Text>
          <Text style={styles.payAmount}>{formatMoney(total)}</Text>
          <Text style={styles.paySub}>Inclusive of all taxes</Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.85}
          disabled={paymentInProgress}
          style={[styles.payButton, paymentInProgress && styles.payButtonDisabled]}
          onPress={handlePayment}
        >
          {paymentInProgress ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.payButtonText}>
              {ICONS.lock} Pay Securely Now {ICONS.right}
            </Text>
          )}
        </TouchableOpacity>
      </View>
      )}
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
  categoryTag: {
    position: 'absolute',
    left: 118,
    top: 0,
    backgroundColor: '#2EAAC4',
    color: '#FFFFFF',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    overflow: 'hidden',
    paddingHorizontal: 12,
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
    paddingTop: 42,
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
  profileGateCard: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: '#FFFFFF',
    padding: 14,
    marginTop: 12,
  },
  profileGateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  profileGatePercent: {
    minWidth: 48,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: RED,
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
    textAlign: 'center',
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  profileGateText: {
    color: MUTED,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '700',
    marginTop: 8,
  },
  profileMissingText: {
    color: RED,
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '800',
    marginTop: 8,
  },
  profileInputLabel: {
    color: DARK,
    fontSize: 12,
    fontWeight: '900',
    marginTop: 10,
    marginBottom: 6,
  },
  profileInput: {
    minHeight: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: PALE_YELLOW,
    color: DARK,
    fontSize: 13,
    fontWeight: '700',
    paddingHorizontal: 12,
  },
  profileAddressInput: {
    minHeight: 76,
    paddingTop: 10,
    textAlignVertical: 'top',
  },
  profileGenderRow: {
    flexDirection: 'row',
    gap: 8,
  },
  profileGenderButton: {
    flex: 1,
    minHeight: 42,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: PALE_YELLOW,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileGenderButtonActive: {
    backgroundColor: RED,
    borderColor: RED,
  },
  profileGenderText: {
    color: RED,
    fontSize: 12,
    fontWeight: '900',
  },
  profileGenderTextActive: {
    color: '#FFFFFF',
  },
  profileSaveButton: {
    height: 50,
    borderRadius: 12,
    backgroundColor: RED,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
  },
  profileSaveText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },
  referralCard: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: '#FFFFFF',
    padding: 12,
    marginTop: 12,
  },
  referralText: {
    color: MUTED,
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '700',
    marginTop: 6,
    marginBottom: 10,
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
  disclaimerCard: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: PALE_YELLOW,
    padding: 14,
    marginTop: 12,
  },
  disclaimerTitle: {
    color: RED,
    fontSize: 13,
    fontWeight: '900',
  },
  disclaimerText: {
    color: DARK,
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '600',
    marginTop: 6,
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
  payButtonDisabled: {
    opacity: 0.72,
  },
  payButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },
});

export default MembershipCheckoutScreen;
