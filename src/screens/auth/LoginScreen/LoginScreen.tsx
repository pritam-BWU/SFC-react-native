import React, { useState } from 'react';
import {
  Alert,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { RootStackParamList } from '../../../navigation/types';
import styles from './Login.styles';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const backgroundImage = require('../../../images.png');
const logoImage = require('../../../images.png');

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [acceptedDisclaimer, setAcceptedDisclaimer] = useState(false);

  const handleContinue = () => {
    if (!loginId.trim() || password.trim().length < 4) {
      Alert.alert(
        'Missing details',
        'Please enter your email or phone and password.',
      );
      return;
    }

    setShowDisclaimer(true);
  };

  const handleAcceptDisclaimer = () => {
    if (!acceptedDisclaimer) {
      return;
    }

    setShowDisclaimer(false);
    navigation.replace('Home');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
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
          <View style={styles.content}>
            <View style={styles.languagePill}>
              <Icon name="web" size={20} color="#FFD43B" />
              <Text style={styles.languageText}>English</Text>
              <Icon name="chevron-down" size={22} color="#FFFFFF" />
            </View>

            <View style={styles.middleSection}>
              <View style={styles.logoFrame}>
                <Image
                  source={logoImage}
                  style={styles.logoImage}
                  resizeMode="cover"
                />
              </View>

              <Text style={styles.brandTitle}>Superfowl</Text>
              <Text style={styles.brandAccent}>FoodClub</Text>

              <View style={styles.taglineRow}>
                <View style={styles.taglineLine} />
                <View style={styles.taglineMark} />
                <View style={styles.taglineLine} />
              </View>
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

                <Text style={styles.label}>Email or Phone</Text>
                <View style={styles.inputShell}>
                  <Icon name="account-outline" size={24} color="#FFD43B" />
                  <TextInput
                    value={loginId}
                    onChangeText={setLoginId}
                    placeholder="Enter email or phone"
                    placeholderTextColor="rgba(255,255,255,0.58)"
                    style={styles.field}
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                </View>

                <Text style={styles.label}>Password</Text>
                <View style={styles.inputShell}>
                  <Icon name="lock-outline" size={23} color="#FFD43B" />
                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Enter password"
                    placeholderTextColor="rgba(255,255,255,0.58)"
                    style={styles.field}
                    secureTextEntry={!passwordVisible}
                  />
                  <TouchableOpacity
                    activeOpacity={0.75}
                    onPress={() => setPasswordVisible(current => !current)}
                    style={styles.eyeButton}
                  >
                    <Icon
                      name={passwordVisible ? 'eye-outline' : 'eye-off-outline'}
                      size={22}
                      color="#FFFFFF"
                    />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  activeOpacity={0.75}
                  onPress={() =>
                    Alert.alert(
                      'Forgot password',
                      'Password recovery will be available soon.',
                    )
                  }
                >
                  <Text style={styles.forgotText}>Forgot Password?</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.88}
                  style={styles.button}
                  onPress={handleContinue}
                >
                  <LinearGradient
                    colors={['#FFD739', '#FF8317', '#E80016']}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={styles.buttonGradient}
                  >
                    <Text style={styles.buttonText}>Login</Text>
                    <Icon name="arrow-right" size={28} color="#FFFFFF" />
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
          </View>
        </LinearGradient>
      </ImageBackground>

      <Modal
        visible={showDisclaimer}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDisclaimer(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.disclaimerCard}>
            <Text style={styles.disclaimerTitle}>
              Privacy Policy & Disclaimer
            </Text>
            <Text style={styles.disclaimerIntro}>
              Please read and accept before entering Chicken App.
            </Text>

            <ScrollView
              style={styles.disclaimerScroll}
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.disclaimerText}>
                Chicken App uses your login details only to identify your
                account, personalize your app experience, manage wishlist
                preferences, membership details, product browsing, and future
                order communication.
              </Text>
              <Text style={styles.disclaimerText}>
                Product images, prices, discounts, nutrition details, quality
                notes, membership benefits, and delivery information are shown
                for app experience and may change based on availability,
                supplier updates, launch status, and service area.
              </Text>
              <Text style={styles.disclaimerText}>
                E-commerce ordering and delivery features may be introduced in
                future updates. Until then, buttons such as order, payment, and
                delivery may be demo or informational flows.
              </Text>
              <Text style={styles.disclaimerText}>
                Membership plans, savings, billing dates, and payment success
                screens shown in the app are for app membership experience.
                Final charges, taxes, and plan terms should be checked before
                any real purchase.
              </Text>
              <Text style={styles.disclaimerText}>
                By continuing, you agree to use the app responsibly and accept
                that food freshness, stock, delivery timing, and offers may vary
                by location and availability.
              </Text>
            </ScrollView>

            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.acceptRow}
              onPress={() => setAcceptedDisclaimer(current => !current)}
            >
              <View
                style={[
                  styles.checkbox,
                  acceptedDisclaimer && styles.checkboxActive,
                ]}
              >
                {acceptedDisclaimer && (
                  <Icon name="check" size={17} color="#FFFFFF" />
                )}
              </View>
              <Text style={styles.acceptText}>
                I have read and accept the Privacy Policy & Disclaimer.
              </Text>
            </TouchableOpacity>

            <View style={styles.modalActions}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.cancelButton}
                onPress={() => setShowDisclaimer(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.85}
                disabled={!acceptedDisclaimer}
                style={[
                  styles.acceptButton,
                  !acceptedDisclaimer && styles.acceptButtonDisabled,
                ]}
                onPress={handleAcceptDisclaimer}
              >
                <Text style={styles.acceptButtonText}>Accept & Continue</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
