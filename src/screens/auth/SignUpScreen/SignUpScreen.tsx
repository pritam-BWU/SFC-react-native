import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Ticket,
  UserRound,
} from 'lucide-react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { signupUser } from '../../../api/auth.api';
import { RootStackParamList } from '../../../navigation/types';
import { Gender } from '../../../types/auth.types';
import PrivacyDisclaimerModal from '../components/PrivacyDisclaimerModal';
import styles from '../LoginScreen/Login.styles';

type Props = NativeStackScreenProps<RootStackParamList, 'SignUp'>;

const backgroundImage = require('../../../images.png');
const logoImage = require('../../../logo_image_clean.png');

const genderOptions: Array<{ label: string; value: Gender }> = [
  { label: 'Male', value: 'M' },
  { label: 'Female', value: 'F' },
  { label: 'Other', value: 'O' },
];

const SignUpScreen: React.FC<Props> = ({ navigation }) => {
  const scrollRef = useRef<ScrollView>(null);
  const [fullName, setFullName] = useState('');
  const [loginId, setLoginId] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [gender, setGender] = useState<Gender | null>(null);
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [loading, setLoading] = useState(false);

  const scrollToField = (y: number) => {
    setTimeout(() => {
      scrollRef.current?.scrollTo({ y, animated: true });
    }, 120);
  };

  useEffect(() => {
    const keyboardHideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    });

    return () => keyboardHideSubscription.remove();
  }, []);

  const handleSignUp = async () => {
    if (!fullName.trim() || !loginId.trim() || !gender || !password.trim()) {
      Alert.alert(
        'Missing details',
        'Please enter your name, email or phone number, gender, and password.',
      );
      return;
    }

    try {
      setLoading(true);
      await signupUser({
        full_name: fullName,
        login_id: loginId,
        gender,
        password,
        referral_code: referralCode,
      });
      setShowDisclaimer(true);
    } catch (error) {
      Alert.alert(
        'Signup failed',
        error instanceof Error
          ? error.message
          : 'Please check the details and try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
      style={styles.screen}
    >
      <ImageBackground
        source={backgroundImage}
        resizeMode="cover"
        style={styles.background}
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.28)', 'rgba(12,10,2,0.72)', '#100F05']}
          locations={[0, 0.55, 1]}
          style={styles.overlay}
        >
          <ScrollView
            ref={scrollRef}
            style={styles.formScroll}
            contentContainerStyle={styles.content}
            automaticallyAdjustKeyboardInsets
            contentInsetAdjustmentBehavior="always"
            keyboardDismissMode="interactive"
            keyboardShouldPersistTaps="handled"
            scrollEnabled
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.signupHero}>
              <View style={styles.logoFrame}>
                <Image
                  source={logoImage}
                  style={styles.logoImage}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.brandTitle}>Superfowl</Text>
              <Text style={styles.brandAccent}>FoodClub</Text>
              <Text style={styles.tagline}>
                Premium Quality. Fresh. Hygienic. Always.
              </Text>
            </View>

            <View style={styles.loginCard}>
              <Text style={styles.cardTitle}>
                Create <Text style={styles.cardTitleAccent}>Account</Text>
              </Text>
              <Text style={styles.cardSubtitle}>
                Sign up for your fresh meat experience
              </Text>

              <Text style={styles.label}>Full Name</Text>
              <View style={styles.inputShell}>
                <View style={styles.inputIcon}>
                  <UserRound size={22} color="#FFD43B" strokeWidth={2.1} />
                </View>
                <TextInput
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="Enter full name"
                  placeholderTextColor="rgba(255,255,255,0.58)"
                  style={styles.field}
                  caretHidden={false}
                  selectionColor="#FFE56A"
                  cursorColor="#FFE56A"
                  autoComplete="name"
                  textContentType="name"
                  importantForAutofill="yes"
                  onFocus={() => scrollToField(220)}
                  returnKeyType="next"
                />
              </View>

              <Text style={styles.label}>Email or Phone</Text>
              <View style={styles.inputShell}>
                <View style={styles.inputIcon}>
                  <Mail size={22} color="#FFD43B" strokeWidth={2.1} />
                </View>
                <TextInput
                  value={loginId}
                  onChangeText={setLoginId}
                  placeholder="Enter email or phone"
                  placeholderTextColor="rgba(255,255,255,0.58)"
                  style={styles.field}
                  caretHidden={false}
                  selectionColor="#FFE56A"
                  cursorColor="#FFE56A"
                  autoCapitalize="none"
                  autoComplete="username"
                  textContentType="username"
                  importantForAutofill="yes"
                  keyboardType="email-address"
                  onFocus={() => scrollToField(310)}
                  returnKeyType="next"
                />
              </View>

              <Text style={styles.label}>Referral Code (Optional)</Text>
              <View style={styles.inputShell}>
                <View style={styles.inputIcon}>
                  <Ticket size={22} color="#FFD43B" strokeWidth={2.1} />
                </View>
                <TextInput
                  value={referralCode}
                  onChangeText={setReferralCode}
                  placeholder="Enter referral code"
                  placeholderTextColor="rgba(255,255,255,0.58)"
                  style={styles.field}
                  caretHidden={false}
                  selectionColor="#FFE56A"
                  cursorColor="#FFE56A"
                  autoCapitalize="characters"
                  autoCorrect={false}
                  onFocus={() => scrollToField(400)}
                  returnKeyType="next"
                />
              </View>

              <Text style={styles.label}>Gender</Text>
              <View style={styles.genderRow}>
                {genderOptions.map(option => {
                  const selected = gender === option.value;

                  return (
                    <TouchableOpacity
                      key={option.value}
                      activeOpacity={0.78}
                      style={[
                        styles.genderOption,
                        selected && styles.genderOptionActive,
                      ]}
                      onPress={() => setGender(option.value)}
                    >
                      <Text
                        style={[
                          styles.genderText,
                          selected && styles.genderTextActive,
                        ]}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <Text style={styles.label}>Password</Text>
              <View style={styles.inputShell}>
                <View style={styles.inputIcon}>
                  <LockKeyhole size={22} color="#FFD43B" strokeWidth={2.1} />
                </View>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter password"
                  placeholderTextColor="rgba(255,255,255,0.58)"
                  style={styles.field}
                  caretHidden={false}
                  selectionColor="#FFE56A"
                  cursorColor="#FFE56A"
                  autoComplete="new-password"
                  textContentType="newPassword"
                  importantForAutofill="yes"
                  onFocus={() => scrollToField(500)}
                  onSubmitEditing={handleSignUp}
                  returnKeyType="done"
                  secureTextEntry={!passwordVisible}
                />
                <TouchableOpacity
                  activeOpacity={0.75}
                  onPress={() => setPasswordVisible(current => !current)}
                  style={styles.eyeButton}
                >
                  {passwordVisible ? (
                    <Eye size={22} color="#FFFFFF" strokeWidth={2} />
                  ) : (
                    <EyeOff size={22} color="#FFFFFF" strokeWidth={2} />
                  )}
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                activeOpacity={0.88}
                disabled={loading}
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleSignUp}
              >
                <LinearGradient
                  colors={['#FFD739', '#FF8317', '#E80016']}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={styles.buttonGradient}
                >
                  {loading && (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  )}
                  <Text style={styles.buttonText}>Sign Up</Text>
                </LinearGradient>
              </TouchableOpacity>

              <View style={styles.signUpRow}>
                <View style={styles.signUpLine} />
                <Text style={styles.signUpCopy}>Already have an account?</Text>
                <View style={styles.signUpLine} />
              </View>
              <TouchableOpacity
                activeOpacity={0.75}
                onPress={() => navigation.navigate('Login')}
              >
                <Text style={styles.signUpText}>Login</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </LinearGradient>
      </ImageBackground>
      <PrivacyDisclaimerModal
        visible={showDisclaimer}
        onAccept={() => {
          setShowDisclaimer(false);
          navigation.replace('Home');
        }}
        onClose={() => setShowDisclaimer(false)}
      />
    </KeyboardAvoidingView>
  );
};

export default SignUpScreen;
