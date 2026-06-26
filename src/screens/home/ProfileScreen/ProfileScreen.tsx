import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  Modal,
  NativeModules,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  ArrowLeft,
  Bell,
  Check,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  CreditCard,
  Crown,
  FileText,
  Headphones,
  Home,
  Info,
  LockKeyhole,
  LogOut,
  MessageCircleWarning,
  Paperclip,
  Pencil,
  Phone,
  ReceiptText,
  ScrollText,
  Settings,
  Share2,
  ShieldCheck,
  Trash2,
  TriangleAlert,
  UserRound,
  X,
} from 'lucide-react-native';
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
import {
  createIssueReport,
  getIssueReports,
  uploadIssueReportDocuments,
} from '../../../api/report.api';
import {
  getMobileProfile,
  updateMobileProfile,
  UpdateProfileRequest,
} from '../../../api/profile.api';
import ProfileAccountFields from '../../../components/ProfileAccountFields';
import { API_BASE_URL } from '../../../constants/api';
import { RootStackParamList } from '../../../navigation/types';
import { authSession } from '../../../services/auth/session.service';
import { Gender } from '../../../types/auth.types';
import {
  IssueReport,
  IssueReportDocument,
  LocalIssueReportDocument,
} from '../../../types/report.types';
import { getProfileCompletion } from '../../../utils/profileCompletion';

const RED = '#CC0000';
const DARK = '#101010';
const MUTED = '#5B5B5B';
const PAGE_YELLOW = '#FFF0AD';
const SOFT_YELLOW = '#FFF7D6';
const BORDER = '#F1DFA0';
const PALE_BACKGROUND = '#FFFDF0';
const MAX_REPORT_DOCUMENTS = 10;
const logoImage = require('../../../logo_image_clean.png');
type IconComponent = typeof Home;

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

type MenuItem = {
  label: string;
  icon: IconComponent;
  detail?: string;
  onPress?: () => void;
};

type MenuSection = {
  title: string;
  icon: IconComponent;
  detail?: string;
  onPress?: () => void;
  items?: MenuItem[];
};

type DetailContent = {
  title: string;
  body: string;
  type?: 'text' | 'faqs' | 'report' | 'submitted';
};

type ReportMode = 'create' | 'history';

type DocumentPickerModule = {
  pickDocuments: () => Promise<LocalIssueReportDocument[]>;
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

const buildDocumentUrl = (url: string) => {
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  return `${API_BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
};

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

const getDocumentName = (document: IssueReportDocument) =>
  document.original_name || document.url.split('/').pop() || 'Attachment';

const documentPicker = (
  NativeModules as { SfcDocumentPicker?: DocumentPickerModule }
).SfcDocumentPicker;

const formatReportDate = (value: string) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return date.toLocaleDateString(undefined, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const ProfileScreen = ({ navigation }: Props) => {
  const [profileSnapshot, setProfileSnapshot] = useState(authSession.getProfile());
  const profile = profileSnapshot;
  const user = authSession.getUser();
  const completion = getProfileCompletion(profile);
  const profileName =
    profile?.full_name ||
    [user?.first_name, user?.last_name].filter(Boolean).join(' ') ||
    'SFC User';
  const profileContact =
    profile?.phone_number ||
    profile?.email_address ||
    user?.email ||
    'Member account and app settings';
  const [editProfileVisible, setEditProfileVisible] = useState(false);
  const [profileForm, setProfileForm] =
    useState<UpdateProfileRequest>(emptyProfileForm);
  const [profileSaving, setProfileSaving] = useState(false);
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({});
  const [activeDetail, setActiveDetail] = useState<DetailContent | null>(null);
  const [activeFaqCategory, setActiveFaqCategory] = useState<string | null>(null);
  const [reportMessage, setReportMessage] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<LocalIssueReportDocument[]>(
    [],
  );
  const [reportMode, setReportMode] = useState<ReportMode>('create');
  const [reports, setReports] = useState<IssueReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<IssueReport | null>(
    null,
  );
  const [reportsLoading, setReportsLoading] = useState(false);
  const [reportSubmitting, setReportSubmitting] = useState(false);

  const fillProfileForm = () => {
    const currentProfile = authSession.getProfile();
    setProfileForm({
      full_name: currentProfile?.full_name || '',
      dob: currentProfile?.dob || '',
      gender: currentProfile?.gender || 'O',
      nationality: currentProfile?.nationality || '',
      address: currentProfile?.address || '',
      city: currentProfile?.city || '',
      state: currentProfile?.state || '',
      postal_code: currentProfile?.postal_code || '',
      phone_number: currentProfile?.phone_number || '',
      email_address: currentProfile?.email_address || user?.email || '',
    });
  };

  useEffect(() => {
    let isMounted = true;
    getMobileProfile()
      .then(nextProfile => {
        if (isMounted) {
          setProfileSnapshot(nextProfile);
        }
      })
      .catch(() => undefined);

    return () => {
      isMounted = false;
    };
  }, []);

  const openProfileEditor = () => {
    fillProfileForm();
    setEditProfileVisible(true);
  };

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
      !profileForm.state.trim() && 'State',
      !profileForm.postal_code.trim() && 'Postal Code',
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
      setEditProfileVisible(false);
      Alert.alert('Profile saved', 'Your account details are updated.');
    } catch (error) {
      Alert.alert(
        'Profile update failed',
        error instanceof Error ? error.message : 'Please try again.',
      );
    } finally {
      setProfileSaving(false);
    }
  };

  const toggleSection = (title: string) => {
    setExpandedSections(current => ({
      ...current,
      [title]: !current[title],
    }));
  };

  const loadReportHistory = async () => {
    try {
      setReportsLoading(true);
      const reportHistory = (await getIssueReports()).filter(report =>
        Boolean(report.report_id),
      );
      setReports(reportHistory);
      setSelectedReport(currentReport =>
        currentReport
          ? reportHistory.find(
              report => report.report_id === currentReport.report_id,
            ) || currentReport
          : null,
      );
    } catch (error) {
      Alert.alert(
        'Report history failed',
        error instanceof Error
          ? error.message
          : 'Could not load your report history.',
      );
    } finally {
      setReportsLoading(false);
    }
  };

  const openReportIssue = () => {
    setReportMode('create');
    setSelectedReport(null);
    setActiveDetail({
      title: 'Report an Issue',
      body: '',
      type: 'report',
    });
    loadReportHistory();
  };

  const showReportHistory = () => {
    setReportMode('history');
    setSelectedReport(null);
    loadReportHistory();
  };

  const handleAttachFiles = async () => {
    if (!documentPicker) {
      Alert.alert(
        'File manager unavailable',
        'Document picking is not available on this device build.',
      );
      return;
    }

    try {
      const selectedFiles = await documentPicker.pickDocuments();

      if (!selectedFiles.length) {
        return;
      }

      setAttachedFiles(currentFiles => {
        const nextFiles = [...currentFiles];

        selectedFiles.forEach(file => {
          if (
            nextFiles.length < MAX_REPORT_DOCUMENTS &&
            !nextFiles.some(currentFile => currentFile.uri === file.uri)
          ) {
            nextFiles.push(file);
          }
        });

        if (
          currentFiles.length + selectedFiles.length > MAX_REPORT_DOCUMENTS
        ) {
          Alert.alert(
            'Attachment limit reached',
            `You can attach up to ${MAX_REPORT_DOCUMENTS} documents.`,
          );
        }

        return nextFiles;
      });
    } catch (error) {
      Alert.alert(
        'File manager failed',
        error instanceof Error
          ? error.message
          : 'Could not open the file manager.',
      );
    }
  };

  const handleReportSubmit = async () => {
    if (reportMessage.trim().length < 10) {
      Alert.alert(
        'More details needed',
        'Please write at least 10 characters about the issue.',
      );
      return;
    }

    try {
      setReportSubmitting(true);
      const createdReport = await createIssueReport({
        description: reportMessage,
      });

      if (attachedFiles.length) {
        try {
          await uploadIssueReportDocuments(
            createdReport.report_id,
            attachedFiles,
          );
        } catch (uploadError) {
          setReportMessage('');
          setAttachedFiles([]);
          setReportMode('history');
          await loadReportHistory();
          Alert.alert(
            'Report saved',
            `Report ${createdReport.report_id} was saved, but the document upload failed. ${
              uploadError instanceof Error
                ? uploadError.message
                : 'Please try again later.'
            }`,
          );
          return;
        }
      }

      setReportMessage('');
      setAttachedFiles([]);
      setReportMode('history');
      await loadReportHistory();
      setActiveDetail({
        title: 'Report Submitted',
        body: createdReport.report_id,
        type: 'submitted',
      });
    } catch (error) {
      Alert.alert(
        'Report failed',
        error instanceof Error
          ? error.message
          : 'Could not submit your issue report.',
      );
    } finally {
      setReportSubmitting(false);
    }
  };

  const openDocument = async (document: IssueReportDocument) => {
    try {
      const documentUrl = buildDocumentUrl(document.url);
      const canOpen = await Linking.canOpenURL(documentUrl);

      if (!canOpen) {
        Alert.alert('Cannot open file', 'No app is available to open this document.');
        return;
      }

      await Linking.openURL(documentUrl);
    } catch {
      Alert.alert('Cannot open file', 'Please try again later.');
    }
  };

  const sections: MenuSection[] = [
    {
      title: 'Home',
      icon: Home,
      onPress: () => navigation.navigate('Home'),
    },
    {
      title: 'Membership',
      icon: Crown,
      onPress: () => navigation.navigate('Subscription'),
    },
    {
      title: 'My Account',
      icon: UserRound,
      items: [
        {
          label: 'Edit Profile',
          icon: Pencil,
          onPress: openProfileEditor,
        },
        {
          label: 'Membership Status',
          icon: Crown,
          detail:
            'View your active membership plan, renewal status, savings benefits, and plan validity. Membership benefits shown in the app may vary by service area, stock availability, and current offers.',
        },
        {
          label: 'Payment History',
          icon: CreditCard,
          detail:
            'Review membership and future order payment records linked with your account. Demo screens may show sample payment data until real checkout and delivery services are enabled.',
        },
      ],
    },
    {
      title: 'Support / Help',
      icon: Headphones,
      items: [
        {
          label: 'FAQs',
          icon: CircleHelp,
        },
        {
          label: 'Report an Issue',
          icon: MessageCircleWarning,
          detail:
            'Use this option to report login trouble, wrong product details, missing membership information, payment display issues, or app bugs. Our team may use your account details only to investigate and respond.',
        },
        {
          label: 'Contact Us',
          icon: Phone,
          detail:
            'Email: suoerfowlfoods@gmail.com\n\nContact Number: +91 90000 00000',
        },
      ],
    },
    {
      title: 'About Us',
      icon: Info,
      detail: policyDetails['About Us'].body,
    },
    {
      title: 'Legal & Policies',
      icon: ScrollText,
      items: [
        {
          label: 'Terms & Conditions',
          icon: FileText,
        },
        {
          label: 'Privacy Policy',
          icon: ShieldCheck,
        },
        {
          label: 'Refund Policy',
          icon: ReceiptText,
        },
        {
          label: 'Membership Policy',
          icon: Crown,
        },
        {
          label: 'Account Deletion Policy',
          icon: Trash2,
        },
      ],
    },
    {
      title: 'Disclaimer',
      icon: TriangleAlert,
      detail: policyDetails.Disclaimer.body,
    },
    {
      title: 'Share APK',
      icon: Share2,
    },
    {
      title: 'Settings',
      icon: Settings,
      items: [
        {
          label: 'Privacy & Security',
          icon: ShieldCheck,
          detail:
            'Manage account protection preferences and review how login details are used. Keep your password private and contact support if you notice unauthorized access.',
        },
        {
          label: 'Change Password',
          icon: LockKeyhole,
          onPress: () => navigation.navigate('PasswordChange'),
        },
        {
          label: 'Delete Account',
          icon: Trash2,
          detail:
            'Account deletion is permanent for app profile data and may affect membership access, saved preferences, wishlist items, and future order communication.',
        },
        {
          label: 'Notification',
          icon: Bell,
          detail:
            'Control general app notifications about product availability, offers, app updates, membership information, and important account notices.',
        },
        {
          label: 'Membership Updates',
          icon: Crown,
          detail:
            'Receive updates about membership benefits, plan changes, savings information, and new subscription features when they become available in your service area.',
        },
        {
          label: 'Renewal Reminders',
          icon: Bell,
          detail:
            'Renewal reminders help you track membership expiry and billing dates. Final renewal amount and terms should be checked before making any real payment.',
        },
        {
          label: 'Push Notifications',
          icon: Bell,
          detail:
            'Push notifications may include offers, freshness updates, delivery announcements, membership reminders, and account alerts. You can adjust device-level notification permissions anytime.',
        },
      ],
    },
    {
      title: 'Logout',
      icon: LogOut,
      onPress: () => {
        authSession.clear();
        navigation.navigate('Login');
      },
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
          <View style={styles.avatarWrap}>
            <View style={styles.avatar}>
              <UserRound size={30} color="#FFFFFF" strokeWidth={2.2} />
            </View>
            <View
              style={[
                styles.completionBadge,
                completion.isComplete && styles.completionBadgeComplete,
              ]}
            >
              <Text style={styles.completionBadgeText}>
                {completion.percentage}%
              </Text>
            </View>
          </View>
          <View style={styles.profileTextCol}>
            <Text style={styles.profileName}>{profileName}</Text>
            <Text style={styles.profilePhone}>{profileContact}</Text>
            <Text
              style={[
                styles.profileCompletionText,
                completion.isComplete && styles.profileCompletionTextComplete,
              ]}
            >
              Account data {completion.percentage}% complete
            </Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.editButton}
            onPress={openProfileEditor}
          >
            <Pencil size={13} color="#FFFFFF" strokeWidth={2.4} />
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.menuCard}>
          {sections.map(section => {
            const SectionIcon = section.icon;

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
                    <SectionIcon size={19} color={RED} strokeWidth={2.3} />
                  </View>
                  <Text style={styles.sectionTitle}>{section.title}</Text>
                  {section.items && expandedSections[section.title] ? (
                    <ChevronDown size={21} color={RED} strokeWidth={2.6} />
                  ) : (
                    <ChevronRight size={21} color={RED} strokeWidth={2.6} />
                  )}
                </TouchableOpacity>

              {expandedSections[section.title] &&
                section.items?.map(item => {
                  const ItemIcon = item.icon;

                  return (
                    <TouchableOpacity
                      key={item.label}
                      activeOpacity={0.75}
                      style={styles.subRow}
                      onPress={() => {
                        if (item.onPress) {
                          item.onPress();
                          return;
                        }

                        if (item.label === 'FAQs') {
                          setActiveFaqCategory(null);
                          setActiveDetail({
                            title: faqsPolicy.title || 'FAQs',
                            body: '',
                            type: 'faqs',
                          });
                          return;
                        }

                        if (item.label === 'Report an Issue') {
                          openReportIssue();
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
                        <ItemIcon size={16} color={RED} strokeWidth={2.2} />
                      </View>
                      <Text style={styles.subText}>{item.label}</Text>
                      <ChevronRight size={18} color={MUTED} strokeWidth={2.4} />
                    </TouchableOpacity>
                  );
                })}
              </View>
            );
          })}
        </View>
      </ScrollView>

      <Modal
        visible={editProfileVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setEditProfileVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.detailCard}>
            <Text style={styles.detailTitle}>Complete Account Details</Text>
            <Text style={styles.profileEditHint}>
              All fields are mandatory before membership payment.
            </Text>
            <ScrollView
              style={styles.profileEditScroll}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <ProfileAccountFields
                profileForm={profileForm}
                updateProfileForm={updateProfileForm}
              />
            </ScrollView>

            <View style={styles.profileEditActions}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.profileCancelButton}
                onPress={() => setEditProfileVisible(false)}
              >
                <Text style={styles.profileCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.85}
                disabled={profileSaving}
                style={[
                  styles.profileSaveButton,
                  profileSaving && styles.detailButtonDisabled,
                ]}
                onPress={handleProfileSave}
              >
                {profileSaving ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.profileSaveText}>Save</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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
                  {!activeFaqCategory
                    ? faqDocument.categories?.map(category => (
                        <TouchableOpacity
                          key={category.heading}
                          activeOpacity={0.78}
                          style={styles.faqCategoryHeader}
                          onPress={() => setActiveFaqCategory(category.heading)}
                        >
                          <Text style={styles.faqCategoryTitle}>
                            {category.heading}
                          </Text>
                          <ChevronRight
                            size={18}
                            color={MUTED}
                            strokeWidth={2.4}
                          />
                        </TouchableOpacity>
                      ))
                    : faqDocument.categories
                        ?.find(category => category.heading === activeFaqCategory)
                        ?.faqs.map(faq => (
                          <View key={faq.faq_id} style={styles.faqCard}>
                            <Text style={styles.faqQuestion}>
                              {faq.question}
                            </Text>
                            <Text style={styles.faqAnswer}>{faq.answer}</Text>
                          </View>
                        ))}
                </View>
              ) : activeDetail?.type === 'report' ? (
                <View style={styles.reportForm}>
                  <View style={styles.reportModeRow}>
                    <TouchableOpacity
                      activeOpacity={0.82}
                      style={[
                        styles.reportModeButton,
                        reportMode === 'create' && styles.reportModeButtonActive,
                      ]}
                      onPress={() => setReportMode('create')}
                    >
                      <Text
                        style={[
                          styles.reportModeText,
                          reportMode === 'create' && styles.reportModeTextActive,
                        ]}
                      >
                        New Report
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      activeOpacity={0.82}
                      style={[
                        styles.reportModeButton,
                        reportMode === 'history' && styles.reportModeButtonActive,
                      ]}
                      onPress={showReportHistory}
                    >
                      <Text
                        style={[
                          styles.reportModeText,
                          reportMode === 'history' && styles.reportModeTextActive,
                        ]}
                      >
                        History
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {reportMode === 'create' ? (
                    <>
                      <Text style={styles.reportHint}>
                        Write your issue details and attach files if needed.
                      </Text>
                      <TextInput
                        value={reportMessage}
                        onChangeText={setReportMessage}
                        multiline
                        textAlignVertical="top"
                        placeholder="Write your message..."
                        placeholderTextColor={MUTED}
                        style={styles.reportInput}
                      />
                      <TouchableOpacity
                        activeOpacity={0.82}
                        style={styles.attachBox}
                        onPress={handleAttachFiles}
                      >
                        <View style={styles.attachIconBox}>
                          <Paperclip size={24} color={RED} strokeWidth={2.2} />
                        </View>
                        <View style={styles.attachCopy}>
                          <Text style={styles.attachTitle}>Attach files</Text>
                          <Text style={styles.attachText}>
                            Tap to add screenshots or documents.
                          </Text>
                        </View>
                      </TouchableOpacity>
                      {attachedFiles.map(file => (
                        <View key={file.uri} style={styles.attachmentPill}>
                          <Text style={styles.attachmentText}>{file.name}</Text>
                          <TouchableOpacity
                            activeOpacity={0.8}
                            style={styles.removeAttachmentButton}
                            onPress={() =>
                              setAttachedFiles(current =>
                                current.filter(item => item.uri !== file.uri),
                              )
                            }
                          >
                            <X size={13} color="#FFFFFF" strokeWidth={3} />
                          </TouchableOpacity>
                        </View>
                      ))}
                    </>
                  ) : selectedReport ? (
                    <View style={styles.reportDetailPanel}>
                      <TouchableOpacity
                        activeOpacity={0.78}
                        style={styles.reportBackRow}
                        onPress={() => setSelectedReport(null)}
                      >
                        <ArrowLeft size={16} color={RED} strokeWidth={2.4} />
                        <Text style={styles.reportBackText}>Report history</Text>
                      </TouchableOpacity>
                      <View style={styles.reportDetailHeader}>
                        <View style={styles.reportDetailIdBlock}>
                          <Text style={styles.reportHistoryId}>
                            {selectedReport.report_id}
                          </Text>
                          <Text style={styles.reportHistoryDate}>
                            {formatReportDate(selectedReport.created_at)}
                          </Text>
                        </View>
                        <Text style={styles.reportStatus}>
                          {selectedReport.status}
                        </Text>
                      </View>
                      <Text style={styles.reportDetailLabel}>Issue details</Text>
                      <Text style={styles.reportHistoryDescription}>
                        {selectedReport.description}
                      </Text>
                      <Text style={styles.reportDetailLabel}>Documents</Text>
                      {selectedReport.attachments.length ? (
                        <View style={styles.documentList}>
                          {selectedReport.attachments.map(document => (
                            <TouchableOpacity
                              key={document.id}
                              activeOpacity={0.78}
                              style={styles.documentRow}
                              onPress={() => openDocument(document)}
                            >
                              <View style={styles.documentIconBox}>
                                <Paperclip
                                  size={17}
                                  color={RED}
                                  strokeWidth={2.2}
                                />
                              </View>
                              <Text style={styles.documentName}>
                                {getDocumentName(document)}
                              </Text>
                              <ChevronRight
                                size={18}
                                color={MUTED}
                                strokeWidth={2.4}
                              />
                            </TouchableOpacity>
                          ))}
                        </View>
                      ) : (
                        <Text style={styles.noDocumentsText}>
                          No documents attached.
                        </Text>
                      )}
                    </View>
                  ) : reportsLoading ? (
                    <View style={styles.reportLoadingBox}>
                      <ActivityIndicator size="small" color={RED} />
                      <Text style={styles.reportLoadingText}>Loading reports...</Text>
                    </View>
                  ) : reports.length ? (
                    <View style={styles.reportHistoryList}>
                      {reports.map(report => (
                        <TouchableOpacity
                          key={report.report_id}
                          activeOpacity={0.82}
                          style={styles.reportHistoryCard}
                          onPress={() => setSelectedReport(report)}
                        >
                          <View style={styles.reportHistoryHeader}>
                            <Text style={styles.reportHistoryId}>
                              {report.report_id}
                            </Text>
                            <Text style={styles.reportStatus}>{report.status}</Text>
                            <TouchableOpacity
                              activeOpacity={0.78}
                              style={styles.reportEditButton}
                              onPress={() => setSelectedReport(report)}
                            >
                              <Pencil size={14} color="#FFFFFF" strokeWidth={2.4} />
                            </TouchableOpacity>
                          </View>
                          <Text style={styles.reportHistoryDate}>
                            {formatReportDate(report.created_at)}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  ) : (
                    <Text style={styles.emptyReportsText}>
                      No issue reports found yet.
                    </Text>
                  )}
                </View>
              ) : activeDetail?.type === 'submitted' ? (
                <View style={styles.submittedPanel}>
                  <LinearGradient
                    colors={['#FFD739', '#FF8A18', RED]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.submittedLogoAura}
                  >
                    <View style={styles.submittedLogoFrame}>
                      <Image
                        source={logoImage}
                        style={styles.submittedLogo}
                        resizeMode="contain"
                      />
                    </View>
                  </LinearGradient>
                  <View style={styles.submittedCheckBadge}>
                    <Check size={18} color="#FFFFFF" strokeWidth={3} />
                  </View>
                  <Text style={styles.submittedTitle}>Report submitted</Text>
                  <Text style={styles.submittedMessage}>
                    Thanks for sharing the issue. Our support team has received
                    it and will review the details shortly.
                  </Text>
                  <View style={styles.submittedTicket}>
                    <Text style={styles.submittedTicketLabel}>Ticket ID</Text>
                    <Text style={styles.submittedTicketValue}>
                      {activeDetail.body}
                    </Text>
                  </View>
                </View>
              ) : (
                <Text style={styles.detailBody}>{activeDetail?.body}</Text>
              )}
            </ScrollView>
            <TouchableOpacity
              activeOpacity={0.8}
              disabled={activeDetail?.type === 'report' && reportSubmitting}
              style={[
                styles.detailButton,
                activeDetail?.type === 'report' &&
                  reportSubmitting &&
                  styles.detailButtonDisabled,
              ]}
              onPress={() => {
                if (activeDetail?.type === 'faqs' && activeFaqCategory) {
                  setActiveFaqCategory(null);
                  return;
                }

                if (activeDetail?.type === 'report') {
                  if (reportMode === 'create') {
                    handleReportSubmit();
                    return;
                  }

                  setActiveDetail(null);
                  return;
                }

                setActiveDetail(null);
              }}
            >
              {activeDetail?.type === 'report' && reportSubmitting ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.detailButtonText}>
                  {activeDetail?.type === 'faqs' && activeFaqCategory
                    ? 'Back to Categories'
                    : activeDetail?.type === 'report'
                      ? reportMode === 'create'
                        ? 'Submit'
                        : 'Close'
                      : activeDetail?.type === 'submitted'
                        ? 'Done'
                      : 'Got it'}
                </Text>
              )}
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
  avatarWrap: {
    width: 64,
    height: 64,
    marginRight: 12,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: RED,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completionBadge: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    minWidth: 34,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    backgroundColor: '#F59E0B',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  completionBadgeComplete: {
    backgroundColor: '#059669',
  },
  completionBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
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
  profileCompletionText: {
    color: '#B45309',
    fontSize: 11,
    fontWeight: '900',
    marginTop: 4,
  },
  profileCompletionTextComplete: {
    color: '#047857',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
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
  profileEditHint: {
    color: MUTED,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '700',
    marginBottom: 12,
  },
  profileEditScroll: {
    maxHeight: 430,
  },
  profileInputLabel: {
    color: DARK,
    fontSize: 12,
    fontWeight: '900',
    marginBottom: 6,
    marginTop: 10,
  },
  profileInput: {
    minHeight: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F3E5B7',
    backgroundColor: PALE_BACKGROUND,
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
    backgroundColor: PALE_BACKGROUND,
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
  profileEditActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  profileCancelButton: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileCancelText: {
    color: RED,
    fontSize: 14,
    fontWeight: '900',
  },
  profileSaveButton: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    backgroundColor: RED,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileSaveText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
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
  reportForm: {
    gap: 12,
  },
  reportModeRow: {
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: PALE_BACKGROUND,
    padding: 4,
  },
  reportModeButton: {
    flex: 1,
    minHeight: 38,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  reportModeButtonActive: {
    backgroundColor: RED,
  },
  reportModeText: {
    color: RED,
    fontSize: 12,
    fontWeight: '900',
    textAlign: 'center',
  },
  reportModeTextActive: {
    color: '#FFFFFF',
  },
  reportHint: {
    color: DARK,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700',
  },
  reportInput: {
    minHeight: 122,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F3E5B7',
    backgroundColor: PALE_BACKGROUND,
    color: DARK,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  attachBox: {
    minHeight: 66,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: RED,
    backgroundColor: SOFT_YELLOW,
    paddingHorizontal: 12,
  },
  attachIconBox: {
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  attachCopy: {
    flex: 1,
  },
  attachTitle: {
    color: DARK,
    fontSize: 13,
    fontWeight: '900',
  },
  attachText: {
    color: MUTED,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '600',
    marginTop: 3,
  },
  attachmentPill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: BORDER,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  attachmentText: {
    color: RED,
    fontSize: 11,
    fontWeight: '900',
  },
  removeAttachmentButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: RED,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  removeAttachmentText: {
    color: '#FFFFFF',
    fontSize: 12,
    lineHeight: 14,
    fontWeight: '900',
  },
  reportLoadingBox: {
    minHeight: 92,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 12,
    backgroundColor: PALE_BACKGROUND,
    borderWidth: 1,
    borderColor: '#F3E5B7',
  },
  reportLoadingText: {
    color: MUTED,
    fontSize: 12,
    fontWeight: '700',
  },
  reportHistoryList: {
    gap: 10,
  },
  reportHistoryCard: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F3E5B7',
    backgroundColor: PALE_BACKGROUND,
    padding: 12,
  },
  reportHistoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  reportEditButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: RED,
  },
  reportEditIcon: {
    color: '#FFFFFF',
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '900',
  },
  reportHistoryId: {
    flex: 1,
    color: RED,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '900',
  },
  reportStatus: {
    borderRadius: 8,
    backgroundColor: SOFT_YELLOW,
    color: RED,
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '900',
    paddingHorizontal: 8,
    paddingVertical: 4,
    overflow: 'hidden',
  },
  reportHistoryDate: {
    color: MUTED,
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '700',
    marginTop: 2,
  },
  reportHistoryDescription: {
    color: '#333333',
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '600',
    marginTop: 8,
  },
  reportDetailPanel: {
    gap: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F3E5B7',
    backgroundColor: PALE_BACKGROUND,
    padding: 12,
  },
  reportBackRow: {
    alignSelf: 'flex-start',
    minHeight: 30,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  reportBackText: {
    color: RED,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '900',
  },
  reportDetailHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  reportDetailIdBlock: {
    flex: 1,
  },
  reportDetailLabel: {
    color: DARK,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '900',
    marginTop: 4,
  },
  documentList: {
    gap: 7,
    marginTop: 10,
  },
  documentRow: {
    minHeight: 38,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
  },
  documentIconBox: {
    width: 24,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  documentName: {
    flex: 1,
    color: DARK,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '800',
  },
  noDocumentsText: {
    color: MUTED,
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '700',
    marginTop: 9,
  },
  emptyReportsText: {
    color: MUTED,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '700',
    textAlign: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F3E5B7',
    backgroundColor: PALE_BACKGROUND,
    padding: 18,
  },
  submittedPanel: {
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F3E5B7',
    backgroundColor: PALE_BACKGROUND,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 18,
    overflow: 'hidden',
  },
  submittedLogoAura: {
    width: 94,
    height: 94,
    borderRadius: 47,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  submittedLogoFrame: {
    width: 78,
    height: 78,
    borderRadius: 39,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submittedLogo: {
    width: 64,
    height: 64,
  },
  submittedCheckBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    backgroundColor: RED,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -24,
    marginBottom: 12,
  },
  submittedCheckText: {
    color: '#FFFFFF',
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '900',
    textAlign: 'center',
  },
  submittedTitle: {
    color: DARK,
    fontSize: 20,
    lineHeight: 25,
    fontWeight: '900',
    textAlign: 'center',
  },
  submittedMessage: {
    color: MUTED,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 8,
  },
  submittedTicket: {
    width: '100%',
    minHeight: 54,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    marginTop: 16,
  },
  submittedTicketLabel: {
    color: MUTED,
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  submittedTicketValue: {
    color: RED,
    fontSize: 14,
    lineHeight: 19,
    fontWeight: '900',
    marginTop: 2,
    textAlign: 'center',
  },
  detailButton: {
    height: 46,
    borderRadius: 12,
    backgroundColor: RED,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
  },
  detailButtonDisabled: {
    opacity: 0.7,
  },
  detailButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },
});

export default ProfileScreen;
