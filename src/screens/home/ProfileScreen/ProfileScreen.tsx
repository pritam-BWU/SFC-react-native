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
};

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

type MenuItem = {
  label: string;
  icon?: string;
  detail: string;
};

type MenuSection = {
  title: string;
  icon: string;
  onPress?: () => void;
  items?: MenuItem[];
};

type DetailContent = {
  title: string;
  body: string;
};

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
      items: [
        {
          label: 'FAQs',
          icon: ICONS.info,
          detail:
            'Common help topics include product freshness, membership benefits, pricing changes, delivery availability, and app account access. Product images, offers, and stock details are for app experience and may change.',
        },
        {
          label: 'Report an Issue',
          icon: ICONS.support,
          detail:
            'Use this option to report login trouble, wrong product details, missing membership information, payment display issues, or app bugs. Our team may use your account details only to investigate and respond.',
        },
      ],
    },
    {
      title: 'About Us',
      icon: ICONS.info,
    },
    {
      title: 'Legal & Policies',
      icon: ICONS.legal,
      items: [
        {
          label: 'Terms & Conditions',
          icon: ICONS.legal,
          detail:
            'By using Superfowl FoodClub, you agree to use the app responsibly. Product details, prices, discounts, delivery information, and membership benefits may change based on availability, suppliers, launch status, and service area.',
        },
        {
          label: 'Privacy Policy',
          icon: ICONS.shield,
          detail:
            'The app may use your name, phone number, login details, wishlist activity, membership choices, and browsing preferences to personalize your experience and manage account communication.',
        },
        {
          label: 'Refund Policy',
          icon: ICONS.card,
          detail:
            'Refund eligibility depends on the final payment status, order status, membership terms, and product condition at delivery. Demo payments or informational flows do not create a real refund claim.',
        },
        {
          label: 'Membership Policy',
          icon: ICONS.crown,
          detail:
            'Membership plans, savings, renewal reminders, and billing dates shown in the app are part of the membership experience. Final plan terms, charges, taxes, and benefits should be checked before any real purchase.',
        },
        {
          label: 'Account Deletion Policy',
          icon: ICONS.trash,
          detail:
            'Deleting your account may remove profile details, wishlist data, membership preferences, and future order communication history. Some records may be retained where required for legal, billing, or support reasons.',
        },
      ],
    },
    {
      title: 'Disclaimer',
      icon: ICONS.disclaimer,
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

      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={0.75}
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>{ICONS.back}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={styles.headerSpacer} />
      </View>

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
          {sections.map(section => (
            <View key={section.title} style={styles.sectionBlock}>
              <TouchableOpacity
                activeOpacity={0.78}
                style={styles.sectionRow}
                onPress={() =>
                  section.items
                    ? toggleSection(section.title)
                    : section.onPress?.()
                }
              >
                <View style={styles.sectionIconCircle}>
                  <Text style={styles.sectionIcon}>{section.icon}</Text>
                </View>
                <Text style={styles.sectionTitle}>{section.title}</Text>
                <Text style={styles.sectionArrow}>
                  {section.items && expandedSections[section.title]
                    ? ICONS.down
                    : ICONS.right}
                </Text>
              </TouchableOpacity>

              {expandedSections[section.title] &&
                section.items?.map(item => (
                  <TouchableOpacity
                    key={item.label}
                    activeOpacity={0.75}
                    style={styles.subRow}
                    onPress={() =>
                      setActiveDetail({
                        title: item.label,
                        body: item.detail,
                      })
                    }
                  >
                    <Text style={styles.subIcon}>{item.icon}</Text>
                    <Text style={styles.subText}>{item.label}</Text>
                    <Text style={styles.subArrow}>{ICONS.right}</Text>
                  </TouchableOpacity>
                ))}
            </View>
          ))}
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
            <Text style={styles.detailBody}>{activeDetail?.body}</Text>
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
  header: {
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PAGE_YELLOW,
    paddingHorizontal: 14,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  backIcon: {
    color: DARK,
    fontSize: 34,
    lineHeight: 34,
  },
  headerTitle: {
    flex: 1,
    color: DARK,
    fontSize: 20,
    fontWeight: '900',
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
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
  detailBody: {
    color: '#333333',
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '600',
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
