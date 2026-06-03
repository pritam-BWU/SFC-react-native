import React, { useState } from 'react';
import {
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
import aboutPolicy from '../../../../about.json';
import accountDeletionPolicy from '../../../../account_deletation.json';
import disclaimerPolicy from '../../../../disclaimer.json';
import faqsPolicy from '../../../../faqs.json';
import membershipPolicy from '../../../../membership_policy.json';
import privacyPolicy from '../../../../privacy_policy.json';
import refundPolicy from '../../../../refund_and_cancellation.json';
import termsPolicy from '../../../../terms_conditions.json';
import { RootStackParamList } from '../../../navigation/types';

const RED = '#CC0000';
const DARK = '#101010';
const MUTED = '#5B5B5B';
const PAGE_YELLOW = '#FFF0AD';
const SOFT_YELLOW = '#FFF7D6';
const BORDER = '#F1DFA0';
const PALE_BACKGROUND = '#FFFDF0';

const ICONS = {
  back: '\u2039',
  user: '\u{1F464}',
  home: '\u2302',
  products: '\u25A6',
  crown: '\u{1F451}',
  account: '\u25A3',
  support: '\u260E',
  info: 'i',
  legal: '\u25A4',
  disclaimer: '!',
  settings: '\u2699',
  share: '\u22EF',
  right: '\u203A',
  down: '\u2304',
  edit: '\u270E',
  card: '\u25AD',
  shield: '\u{1F6E1}\uFE0F',
  bell: '\u{1F514}',
  lock: '\u{1F512}',
  trash: '\u232B',
  bug: '\u25C7',
  helpOutline: '?',
  membershipOutline: '\u25C7',
  reportOutline: '!',
  supportOutline: '\u25CE',
};

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

type MenuItem = {
  label: string;
  icon?: string;
  outlineIcon?: string;
  detail?: string;
};

type MenuSection = {
  title: string;
  icon: string;
  outlineIcon?: string;
  detail?: string;
  onPress?: () => void;
  items?: MenuItem[];
};

type DetailContent = {
  title: string;
  body: string;
  type?: 'text' | 'faqs' | 'report';
};

type PolicyBlock = {
  heading?: string;
  paragraphs?: string[];
  points?: string[];
  after_points?: string[];
  sub_sections?: PolicyBlock[];
};

type PolicyDocument = {
  title?: string;
  paragraphs?: string[];
  sections?: PolicyBlock[];
};

type FaqDocument = {
  title?: string;
  categories?: Array<{
    heading: string;
    faqs: Array<{
      faq_id: string;
      question: string;
      answer: string;
    }>;
  }>;
};

const formatPolicyBlock = (block: PolicyBlock, depth = 0): string[] => {
  const lines: string[] = [];
  const prefix = depth > 0 ? '  ' : '';

  if (block.heading) {
    lines.push(`${prefix}${block.heading}`);
  }

  block.paragraphs?.forEach(paragraph => {
    lines.push(`${prefix}${paragraph}`);
  });

  block.points?.forEach(point => {
    lines.push(`${prefix}- ${point}`);
  });

  block.after_points?.forEach(paragraph => {
    lines.push(`${prefix}${paragraph}`);
  });

  block.sub_sections?.forEach(subSection => {
    lines.push(...formatPolicyBlock(subSection, depth + 1));
  });

  return lines;
};

const formatPolicyDocument = (document: PolicyDocument) => {
  const lines: string[] = [];

  document.paragraphs?.forEach(paragraph => lines.push(paragraph));
  document.sections?.forEach(section => {
    if (lines.length) {
      lines.push('');
    }
    lines.push(...formatPolicyBlock(section));
  });

  return {
    title: document.title || 'Policy',
    body: lines.join('\n\n'),
  };
};

const policyDetails: Record<string, DetailContent> = {
  'FAQs': formatPolicyDocument(faqsPolicy),
  'About Us': formatPolicyDocument(aboutPolicy),
  'Disclaimer': formatPolicyDocument(disclaimerPolicy),
  'Terms & Conditions': formatPolicyDocument(termsPolicy),
  'Privacy Policy': formatPolicyDocument(privacyPolicy),
  'Refund Policy': formatPolicyDocument(refundPolicy),
  'Membership Policy': formatPolicyDocument(membershipPolicy),
  'Account Deletion Policy': formatPolicyDocument(accountDeletionPolicy),
};

const faqDocument = faqsPolicy as FaqDocument;

const reportIssueSections = [
  {
    title: 'What can you report?',
    text: 'Login trouble, wrong product details, missing membership information, payment display issues, or any app bug that affects your experience.',
  },
  {
    title: 'Details to include',
    text: 'Mention the screen name, what you expected, what happened, and any membership or payment reference if the issue is related to billing.',
  },
  {
    title: 'Privacy note',
    text: 'Support may use your account details only to investigate and respond to the reported issue.',
  },
];

const ProfileScreen = ({ navigation }: Props) => {
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({});
  const [activeDetail, setActiveDetail] = useState<DetailContent | null>(null);

  const toggleSection = (title: string) => {
    setExpandedSections(current => ({
      ...current,
      [title]: !current[title],
    }));
  };

  const sections: MenuSection[] = [
    {
      title: 'Home',
      icon: ICONS.home,
      onPress: () => navigation.navigate('Home'),
    },
    {
      title: 'Products',
      icon: ICONS.products,
    },
    {
      title: 'Membership',
      icon: ICONS.crown,
      outlineIcon: ICONS.membershipOutline,
      onPress: () => navigation.navigate('Subscription'),
    },
    {
      title: 'My Account',
      icon: ICONS.account,
      items: [
        {
          label: 'Edit Profile',
          icon: ICONS.edit,
          detail:
            'Update your name, phone number, delivery preferences, and account display details. These details help Superfowl FoodClub personalize browsing, membership benefits, and future order communication.',
        },
        {
          label: 'Membership Status',
          icon: ICONS.crown,
          outlineIcon: ICONS.membershipOutline,
          detail:
            'View your active membership plan, renewal status, savings benefits, and plan validity. Membership benefits shown in the app may vary by service area, stock availability, and current offers.',
        },
        {
          label: 'Payment History',
          icon: ICONS.card,
          detail:
            'Review membership and future order payment records linked with your account. Demo screens may show sample payment data until real checkout and delivery services are enabled.',
        },
      ],
    },
    {
      title: 'Support / Help',
      icon: ICONS.support,
      outlineIcon: ICONS.supportOutline,
      items: [
        {
          label: 'FAQs',
          icon: ICONS.info,
          outlineIcon: ICONS.helpOutline,
        },
        {
          label: 'Report an Issue',
          icon: ICONS.support,
          outlineIcon: ICONS.reportOutline,
          detail:
            'Use this option to report login trouble, wrong product details, missing membership information, payment display issues, or app bugs. Our team may use your account details only to investigate and respond.',
        },
      ],
    },
    {
      title: 'About Us',
      icon: ICONS.info,
      detail: policyDetails['About Us'].body,
    },
    {
      title: 'Legal & Policies',
      icon: ICONS.legal,
      items: [
        {
          label: 'Terms & Conditions',
          icon: ICONS.legal,
        },
        {
          label: 'Privacy Policy',
          icon: ICONS.shield,
        },
        {
          label: 'Refund Policy',
          icon: ICONS.card,
        },
        {
          label: 'Membership Policy',
          icon: ICONS.crown,
          outlineIcon: ICONS.membershipOutline,
        },
        {
          label: 'Account Deletion Policy',
          icon: ICONS.trash,
        },
      ],
    },
    {
      title: 'Disclaimer',
      icon: ICONS.disclaimer,
      detail: policyDetails.Disclaimer.body,
    },
    {
      title: 'Share APK',
      icon: ICONS.share,
    },
    {
      title: 'Settings',
      icon: ICONS.settings,
      items: [
        {
          label: 'Privacy & Security',
          icon: ICONS.shield,
          detail:
            'Manage account protection preferences and review how login details are used. Keep your password private and contact support if you notice unauthorized access.',
        },
        {
          label: 'Change Password',
          icon: ICONS.lock,
          detail:
            'Change your password regularly to protect your account. Choose a password that is not shared with other apps and avoid sending it to anyone through chat or phone.',
        },
        {
          label: 'Delete Account',
          icon: ICONS.trash,
          detail:
            'Account deletion is permanent for app profile data and may affect membership access, saved preferences, wishlist items, and future order communication.',
        },
        {
          label: 'Notification',
          icon: ICONS.bell,
          detail:
            'Control general app notifications about product availability, offers, app updates, membership information, and important account notices.',
        },
        {
          label: 'Membership Updates',
          icon: ICONS.crown,
          outlineIcon: ICONS.membershipOutline,
          detail:
            'Receive updates about membership benefits, plan changes, savings information, and new subscription features when they become available in your service area.',
        },
        {
          label: 'Renewal Reminders',
          icon: ICONS.bell,
          detail:
            'Renewal reminders help you track membership expiry and billing dates. Final renewal amount and terms should be checked before making any real payment.',
        },
        {
          label: 'Push Notifications',
          icon: ICONS.bell,
          detail:
            'Push notifications may include offers, freshness updates, delivery announcements, membership reminders, and account alerts. You can adjust device-level notification permissions anytime.',
        },
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={PAGE_YELLOW} barStyle="dark-content" />

      <FoodClubHeader
        title="Profile"
        showBack
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarIcon}>{ICONS.user}</Text>
          </View>
          <View style={styles.profileTextCol}>
            <Text style={styles.profileName}>Superfowl FoodClub User</Text>
            <Text style={styles.profilePhone}>
              Member account and app settings
            </Text>
          </View>
          <TouchableOpacity activeOpacity={0.8} style={styles.editButton}>
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.menuCard}>
          {sections.map(section => {
            const SectionOutlineIcon = section.outlineIcon;

            return (
              <View key={section.title} style={styles.sectionBlock}>
                <TouchableOpacity
                  activeOpacity={0.78}
                  style={styles.sectionRow}
                  onPress={() =>
                    section.items
                      ? toggleSection(section.title)
                      : section.detail
                        ? setActiveDetail({
                            title:
                              policyDetails[section.title]?.title ||
                              section.title,
                            body: section.detail,
                          })
                        : section.onPress?.()
                  }
                >
                  <View style={styles.sectionIconCircle}>
                    <Text style={styles.sectionIcon}>
                      {SectionOutlineIcon || section.icon}
                    </Text>
                  </View>
                  <Text style={styles.sectionTitle}>{section.title}</Text>
                  {section.items && expandedSections[section.title] ? (
                    <Text style={styles.sectionArrow}>{ICONS.down}</Text>
                  ) : (
                    <Text style={styles.sectionArrow}>{ICONS.right}</Text>
                  )}
                </TouchableOpacity>

              {expandedSections[section.title] &&
                section.items?.map(item => {
                  const SubOutlineIcon = item.outlineIcon;

                  return (
                    <TouchableOpacity
                      key={item.label}
                      activeOpacity={0.75}
                      style={styles.subRow}
                      onPress={() => {
                        if (item.label === 'FAQs') {
                          setActiveDetail({
                            title: faqsPolicy.title || 'FAQs',
                            body: '',
                            type: 'faqs',
                          });
                          return;
                        }

                        if (item.label === 'Report an Issue') {
                          setActiveDetail({
                            title: item.label,
                            body: item.detail || '',
                            type: 'report',
                          });
                          return;
                        }

                        setActiveDetail(
                          policyDetails[item.label] || {
                            title: item.label,
                            body: item.detail || '',
                          },
                        );
                      }}
                    >
                      <View style={styles.subIconBox}>
                        <Text style={styles.subIcon}>
                          {SubOutlineIcon || item.icon}
                        </Text>
                      </View>
                      <Text style={styles.subText}>{item.label}</Text>
                      <Text style={styles.subArrow}>{ICONS.right}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            );
          })}
        </View>
      </ScrollView>

      <Modal
        visible={Boolean(activeDetail)}
        transparent
        animationType="fade"
        onRequestClose={() => setActiveDetail(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.detailCard}>
            <Text style={styles.detailTitle}>{activeDetail?.title}</Text>
            <ScrollView
              style={styles.detailScroll}
              showsVerticalScrollIndicator={false}
            >
              {activeDetail?.type === 'faqs' ? (
                <View style={styles.faqList}>
                  {faqDocument.categories?.map(category => (
                    <View key={category.heading} style={styles.faqCategory}>
                      <View style={styles.faqCategoryHeader}>
                        <Text style={styles.faqCategoryIcon}>
                          {ICONS.helpOutline}
                        </Text>
                        <Text style={styles.faqCategoryTitle}>
                          {category.heading}
                        </Text>
                      </View>
                      {category.faqs.map(faq => (
                        <View key={faq.faq_id} style={styles.faqCard}>
                          <Text style={styles.faqQuestion}>
                            {faq.question}
                          </Text>
                          <Text style={styles.faqAnswer}>{faq.answer}</Text>
                        </View>
                      ))}
                    </View>
                  ))}
                </View>
              ) : activeDetail?.type === 'report' ? (
                <View style={styles.reportList}>
                  <View style={styles.reportHero}>
                    <Text style={styles.reportHeroIcon}>{ICONS.bug}</Text>
                    <Text style={styles.reportHeroText}>
                      Share the issue clearly so support can review it faster.
                    </Text>
                  </View>
                  {reportIssueSections.map(section => (
                    <View key={section.title} style={styles.reportCard}>
                      <Text style={styles.reportTitle}>{section.title}</Text>
                      <Text style={styles.reportText}>{section.text}</Text>
                    </View>
                  ))}
                </View>
              ) : (
                <Text style={styles.detailBody}>{activeDetail?.body}</Text>
              )}
            </ScrollView>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.detailButton}
              onPress={() => setActiveDetail(null)}
            >
              <Text style={styles.detailButtonText}>Got it</Text>
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
    backgroundColor: PAGE_YELLOW,
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    padding: 14,
    paddingBottom: 28,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: SOFT_YELLOW,
    padding: 14,
    marginBottom: 12,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: RED,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarIcon: {
    color: '#FFFFFF',
    fontSize: 27,
  },
  profileTextCol: {
    flex: 1,
  },
  profileName: {
    color: DARK,
    fontSize: 18,
    fontWeight: '900',
  },
  profilePhone: {
    color: MUTED,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
  },
  editButton: {
    borderRadius: 10,
    backgroundColor: RED,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  editText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },
  menuCard: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  sectionBlock: {
    borderBottomWidth: 1,
    borderBottomColor: '#F5EAC8',
  },
  sectionRow: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
  },
  sectionIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: SOFT_YELLOW,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  sectionIcon: {
    color: RED,
    fontSize: 18,
    fontWeight: '900',
  },
  sectionTitle: {
    flex: 1,
    color: DARK,
    fontSize: 15,
    fontWeight: '900',
  },
  sectionArrow: {
    color: RED,
    fontSize: 22,
    fontWeight: '900',
  },
  subRow: {
    minHeight: 40,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PALE_BACKGROUND,
    paddingLeft: 56,
    paddingRight: 12,
  },
  subIconBox: {
    width: 24,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  subIcon: {
    width: 24,
    color: RED,
    fontSize: 14,
    fontWeight: '900',
  },
  subText: {
    flex: 1,
    color: '#333333',
    fontSize: 13,
    fontWeight: '700',
  },
  subArrow: {
    color: MUTED,
    fontSize: 18,
    fontWeight: '900',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.48)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  detailCard: {
    width: '100%',
    maxHeight: '82%',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: '#FFFFFF',
    padding: 18,
  },
  detailTitle: {
    color: DARK,
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '900',
    marginBottom: 10,
  },
  detailScroll: {
    maxHeight: 430,
  },
  detailBody: {
    color: '#333333',
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '600',
  },
  faqList: {
    gap: 14,
    paddingBottom: 2,
  },
  faqCategory: {
    gap: 9,
  },
  faqCategoryHeader: {
    minHeight: 34,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: SOFT_YELLOW,
    paddingHorizontal: 12,
  },
  faqCategoryIcon: {
    width: 18,
    color: RED,
    fontSize: 15,
    lineHeight: 18,
    fontWeight: '900',
    textAlign: 'center',
  },
  faqCategoryTitle: {
    flex: 1,
    color: RED,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '900',
    marginLeft: 8,
  },
  faqCard: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F3E5B7',
    backgroundColor: '#FFFFFF',
    padding: 12,
  },
  faqQuestion: {
    color: DARK,
    fontSize: 14,
    lineHeight: 19,
    fontWeight: '900',
  },
  faqAnswer: {
    color: '#444444',
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '600',
    marginTop: 7,
  },
  reportList: {
    gap: 10,
  },
  reportHero: {
    minHeight: 70,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: SOFT_YELLOW,
    padding: 14,
  },
  reportHeroIcon: {
    width: 30,
    color: RED,
    fontSize: 26,
    lineHeight: 30,
    fontWeight: '900',
    textAlign: 'center',
  },
  reportHeroText: {
    flex: 1,
    color: DARK,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '800',
    marginLeft: 12,
  },
  reportCard: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F3E5B7',
    backgroundColor: PALE_BACKGROUND,
    padding: 12,
  },
  reportTitle: {
    color: RED,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '900',
  },
  reportText: {
    color: '#444444',
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '600',
    marginTop: 6,
  },
  detailButton: {
    height: 46,
    borderRadius: 12,
    backgroundColor: RED,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
  },
  detailButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },
});

export default ProfileScreen;
