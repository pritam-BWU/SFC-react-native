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
import { Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { changePassword } from '../../../api/auth.api';
import { RootStackParamList } from '../../../navigation/types';
import { authSession } from '../../../services/auth/session.service';
import styles from '../LoginScreen/Login.styles';

type Props = NativeStackScreenProps<RootStackParamList, 'PasswordChange'>;

const backgroundImage = require('../../../images.png');
const logoImage = require('../../../logo_image_clean.png');

const PasswordChangeScreen: React.FC<Props> = ({ navigation }) => {
  const scrollRef = useRef<ScrollView>(null);
  const [loginId, setLoginId] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
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

  const handleSave = async () => {
    if (!loginId.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      Alert.alert(
        'Missing details',
        'Please enter your email or phone number and both password fields.',
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Password mismatch', 'Please re-enter the same new password.');
      return;
    }

    try {
      setLoading(true);
      await changePassword({
        login_id: loginId,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });
      authSession.clear();
      navigation.replace('Login');
    } catch (error) {
      Alert.alert(
        'Password update failed',
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
            scrollEnabled={false}
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
                Change <Text style={styles.cardTitleAccent}>Password</Text>
              </Text>
              <Text style={styles.cardSubtitle}>
                Save a new password for your SFC account
              </Text>

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
                  onFocus={() => scrollToField(230)}
                  returnKeyType="next"
                />
              </View>

              <Text style={styles.label}>New Password</Text>
              <View style={styles.inputShell}>
                <View style={styles.inputIcon}>
                  <LockKeyhole size={22} color="#FFD43B" strokeWidth={2.1} />
                </View>
                <TextInput
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder="Enter new password"
                  placeholderTextColor="rgba(255,255,255,0.58)"
                  style={styles.field}
                  caretHidden={false}
                  selectionColor="#FFE56A"
                  cursorColor="#FFE56A"
                  autoComplete="new-password"
                  textContentType="newPassword"
                  importantForAutofill="yes"
                  onFocus={() => scrollToField(320)}
                  returnKeyType="next"
                  secureTextEntry={!newPasswordVisible}
                />
                <TouchableOpacity
                  activeOpacity={0.75}
                  onPress={() => setNewPasswordVisible(current => !current)}
                  style={styles.eyeButton}
                >
                  {newPasswordVisible ? (
                    <Eye size={22} color="#FFFFFF" strokeWidth={2} />
                  ) : (
                    <EyeOff size={22} color="#FFFFFF" strokeWidth={2} />
                  )}
                </TouchableOpacity>
              </View>

              <Text style={styles.label}>Re-enter New Password</Text>
              <View style={styles.inputShell}>
                <View style={styles.inputIcon}>
                  <LockKeyhole size={22} color="#FFD43B" strokeWidth={2.1} />
                </View>
                <TextInput
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Re-enter new password"
                  placeholderTextColor="rgba(255,255,255,0.58)"
                  style={styles.field}
                  caretHidden={false}
                  selectionColor="#FFE56A"
                  cursorColor="#FFE56A"
                  autoComplete="new-password"
                  textContentType="newPassword"
                  importantForAutofill="yes"
                  onFocus={() => scrollToField(430)}
                  onSubmitEditing={handleSave}
                  returnKeyType="done"
                  secureTextEntry={!confirmPasswordVisible}
                />
                <TouchableOpacity
                  activeOpacity={0.75}
                  onPress={() => setConfirmPasswordVisible(current => !current)}
                  style={styles.eyeButton}
                >
                  {confirmPasswordVisible ? (
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
                onPress={handleSave}
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
                  <Text style={styles.buttonText}>Save</Text>
                </LinearGradient>
              </TouchableOpacity>

              <View style={styles.signUpRow}>
                <View style={styles.signUpLine} />
                <Text style={styles.signUpCopy}>Remember your password?</Text>
                <View style={styles.signUpLine} />
              </View>
              <TouchableOpacity
                activeOpacity={0.75}
                onPress={() => navigation.replace('Login')}
              >
                <Text style={styles.signUpText}>Login</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </LinearGradient>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

export default PasswordChangeScreen;
