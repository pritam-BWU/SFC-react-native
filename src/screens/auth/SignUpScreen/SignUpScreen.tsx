import React, { useState } from 'react';
import {
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { RootStackParamList } from '../../../navigation/types';
import styles from '../LoginScreen/Login.styles';

type Props = NativeStackScreenProps<RootStackParamList, 'SignUp'>;

const backgroundImage = require('../../../images.png');

const SignUpScreen: React.FC<Props> = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleSignUp = () => {
    if (!fullName.trim() || !loginId.trim() || password.trim().length < 4) {
      Alert.alert(
        'Missing details',
        'Please enter your name, email or phone, and password.',
      );
      return;
    }

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
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.backPill}
              onPress={() => navigation.goBack()}
            >
              <Icon name="arrow-left" size={22} color="#FFD43B" />
              <Text style={styles.languageText}>Login</Text>
            </TouchableOpacity>

            <View style={styles.hero}>
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
                <Icon name="account-outline" size={26} color="#FFD43B" />
                <TextInput
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="Enter full name"
                  placeholderTextColor="rgba(255,255,255,0.58)"
                  style={styles.field}
                />
              </View>

              <Text style={styles.label}>Email or Phone</Text>
              <View style={styles.inputShell}>
                <Icon name="email-outline" size={25} color="#FFD43B" />
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
                <Icon name="lock-outline" size={25} color="#FFD43B" />
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
                    size={24}
                    color="#FFFFFF"
                  />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                activeOpacity={0.88}
                style={styles.button}
                onPress={handleSignUp}
              >
                <LinearGradient
                  colors={['#FFD739', '#FF8317', '#E80016']}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={styles.buttonGradient}
                >
                  <Text style={styles.buttonText}>Sign Up</Text>
                  <Icon name="arrow-right" size={30} color="#FFFFFF" />
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
          </View>
        </LinearGradient>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

export default SignUpScreen;
