import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
 
import { RootStackParamList } from '../../../navigation/types';
import { loginUser } from '../../../api/auth.api';
import PrivacyDisclaimerModal from '../components/PrivacyDisclaimerModal';
import styles from './Login.styles';
 
type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;
 
const backgroundImage = require('../../../images.png');
const logoImage = require('../../../logo_image_clean.png');

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const scrollRef = useRef<ScrollView>(null);
  const [loginId, setLoginId] = useState('');
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
 
  const handleContinue = async () => {
    if (!loginId.trim() || !password.trim()) {
      Alert.alert(
        'Missing details',
        'Please enter your email or phone number and password.',
      );
      return;
    }
 
    try {
      setLoading(true);
      await loginUser({
        login_id: loginId,
        password,
      });
      setShowDisclaimer(true);
    } catch (error) {
      Alert.alert(
        'Login failed',
        error instanceof Error
          ? error.message
          : 'Please check your email/phone and password.',
      );
    } finally {
      setLoading(false);
    }
  };
 
  const handleAcceptDisclaimer = () => {
    setShowDisclaimer(false);
    navigation.replace('Home');
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
          {/* ─── CHANGE 1: English language pill removed ─── */}
 
          <ScrollView
            ref={scrollRef}
            style={styles.formScroll}
            contentContainerStyle={styles.content}
            automaticallyAdjustKeyboardInsets
            contentInsetAdjustmentBehavior="always"
            keyboardDismissMode="interactive"
            keyboardShouldPersistTaps="handled"
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          >
            {/* ─── CHANGE 2: Middle section shifted up (no top spacer) ─── */}
            <View style={styles.middleSection}>
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
 
              <View style={styles.loginCard}>
                <Text style={styles.cardTitle}>
                  Welcome <Text style={styles.cardTitleAccent}>Back</Text>
                </Text>
                <Text style={styles.cardSubtitle}>
                  Login to continue your fresh meat experience
                </Text>
 
                {/* ─── CHANGE 3a: Email/Phone field — phone-outline icon ─── */}
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
                    onFocus={() => scrollToField(260)}
                    returnKeyType="next"
                  />
                </View>
 
                {/* ─── CHANGE 3b: Password field — lock icon + eye toggle (already present) ─── */}
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
                    autoComplete="current-password"
                    textContentType="password"
                    importantForAutofill="yes"
                    onFocus={() => scrollToField(360)}
                    onSubmitEditing={handleContinue}
                    returnKeyType="done"
                    secureTextEntry={!passwordVisible}
                  />
                  {/* Eye icon — toggles password visibility */}
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
                  activeOpacity={0.75}
                  onPress={() => navigation.navigate('PasswordChange')}
                >
                  <Text style={styles.forgotText}>Forgot Password?</Text>
                </TouchableOpacity>
 
                <TouchableOpacity
                  activeOpacity={0.88}
                  disabled={loading}
                  style={[styles.button, loading && styles.buttonDisabled]}
                  onPress={handleContinue}
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
                    <Text style={styles.buttonText}>Login</Text>
                  </LinearGradient>
                </TouchableOpacity>
 
                <View style={styles.signUpRow}>
                  <View style={styles.signUpLine} />
                  <Text style={styles.signUpCopy}>Don't have an account?</Text>
                  <View style={styles.signUpLine} />
                </View>
                <TouchableOpacity
                  activeOpacity={0.75}
                  onPress={() => navigation.navigate('SignUp')}
                >
                  <Text style={styles.signUpText}>Sign Up</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </LinearGradient>
      </ImageBackground>
 
      <PrivacyDisclaimerModal
        visible={showDisclaimer}
        onAccept={handleAcceptDisclaimer}
        onClose={() => setShowDisclaimer(false)}
      />
    </KeyboardAvoidingView>
  );
};
 
export default LoginScreen;
 
