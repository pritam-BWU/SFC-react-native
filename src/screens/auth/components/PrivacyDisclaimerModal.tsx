import React, { useEffect, useState } from 'react';
import {
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import styles from '../LoginScreen/Login.styles';

type Props = {
  visible: boolean;
  onAccept: () => void;
  onClose: () => void;
};

const ICONS = {
  check: '\u2713',
};

const PrivacyDisclaimerModal = ({ visible, onAccept, onClose }: Props) => {
  const [acceptedDisclaimer, setAcceptedDisclaimer] = useState(false);

  useEffect(() => {
    if (visible) {
      setAcceptedDisclaimer(false);
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.disclaimerCard}>
          <Text style={styles.disclaimerTitle}>
            Privacy Policy & Disclaimer
          </Text>
          <Text style={styles.disclaimerIntro}>
            Please read and accept before entering SFC.
          </Text>

          <ScrollView
            style={styles.disclaimerScroll}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.disclaimerText}>
              SFC uses your login details only to identify your account,
              personalize your app experience, manage wishlist preferences,
              membership details, product browsing, and future order
              communication.
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
              screens shown in the app are for app membership experience. Final
              charges, taxes, and plan terms should be checked before any real
              purchase.
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
                <Text style={styles.checkboxIcon}>{ICONS.check}</Text>
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
              onPress={onClose}
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
              onPress={onAccept}
            >
              <Text style={styles.acceptButtonText}>Accept & Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default PrivacyDisclaimerModal;
