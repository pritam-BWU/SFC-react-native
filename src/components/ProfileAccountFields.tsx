import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  getStates,
  StateOption,
} from '../api/location.api';
import { UpdateProfileRequest } from '../api/profile.api';
import { Gender } from '../types/auth.types';

const RED = '#CC0000';
const DARK = '#101010';
const MUTED = '#5B5B5B';
const BORDER = '#EFE5C2';
const SOFT_YELLOW = '#FFF7D6';

type Props = {
  profileForm: UpdateProfileRequest;
  updateProfileForm: (field: keyof UpdateProfileRequest, value: string) => void;
};

type SearchOption = {
  id: number;
  label: string;
  value: string;
};

const genderOptions: Array<{ label: string; value: Gender }> = [
  { label: 'Male', value: 'M' },
  { label: 'Female', value: 'F' },
  { label: 'Other', value: 'O' },
];

const pad = (value: number) => String(value).padStart(2, '0');
const monthNames = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const parseDateValue = (value: string) => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  const now = new Date();
  if (!match) {
    return {
      year: now.getFullYear() - 18,
      month: 1,
      day: 1,
    };
  }

  return {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
  };
};

const formatDateValue = (year: number, month: number, day: number) =>
  `${year}-${pad(month)}-${pad(day)}`;

const daysInMonth = (year: number, month: number) =>
  new Date(year, month, 0).getDate();

const DatePickerField = ({
  value,
  onSelect,
}: {
  value: string;
  onSelect: (value: string) => void;
}) => {
  const [visible, setVisible] = useState(false);
  const initialParts = parseDateValue(value);
  const [year, setYear] = useState(initialParts.year);
  const [month, setMonth] = useState(initialParts.month);
  const [day, setDay] = useState(initialParts.day);
  const currentYear = new Date().getFullYear();
  const years = useMemo(
    () => Array.from({ length: 101 }, (_, index) => currentYear - index),
    [currentYear],
  );
  const months = useMemo(() => Array.from({ length: 12 }, (_, index) => index + 1), []);
  const days = useMemo(
    () => Array.from({ length: daysInMonth(year, month) }, (_, index) => index + 1),
    [month, year],
  );

  useEffect(() => {
    const maxDay = daysInMonth(year, month);
    if (day > maxDay) {
      setDay(maxDay);
    }
  }, [day, month, year]);

  const openPicker = () => {
    const parts = parseDateValue(value);
    setYear(parts.year);
    setMonth(parts.month);
    setDay(parts.day);
    setVisible(true);
  };

  const renderColumn = (
    label: string,
    items: number[],
    selectedValue: number,
    onChange: (nextValue: number) => void,
    formatter: (item: number) => string,
  ) => (
    <View style={styles.dateColumnWrap}>
      <Text style={styles.dateColumnLabel}>{label}</Text>
      <ScrollView style={styles.dateColumn} showsVerticalScrollIndicator>
        {items.map(item => {
          const selected = selectedValue === item;
          return (
            <TouchableOpacity
              key={item}
              activeOpacity={0.75}
              style={[styles.dateOption, selected && styles.dateOptionActive]}
              onPress={() => onChange(item)}
            >
              <Text style={[styles.dateOptionText, selected && styles.dateOptionTextActive]}>
                {formatter(item)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );

  return (
    <>
      <TouchableOpacity activeOpacity={0.8} style={styles.inputButton} onPress={openPicker}>
        <Text style={[styles.inputButtonText, !value && styles.placeholderText]}>
          {value || 'Select date of birth'}
        </Text>
        <Text style={styles.chevron}>v</Text>
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.pickerCard}>
            <Text style={styles.pickerTitle}>Date of Birth</Text>
            <Text style={styles.pickerValue}>
              {formatDateValue(year, month, day)}
            </Text>
            <View style={styles.datePickerRow}>
              {renderColumn('Month', months, month, setMonth, item => monthNames[item - 1])}
              {renderColumn('Date', days, day, setDay, item => pad(item))}
              {renderColumn('Year', years, year, setYear, String)}
            </View>
            <View style={styles.actionRow}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.cancelButton}
                onPress={() => setVisible(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.85}
                style={styles.doneButton}
                onPress={() => {
                  onSelect(formatDateValue(year, month, day));
                  setVisible(false);
                }}
              >
                <Text style={styles.doneText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const SearchSelectField = ({
  label,
  value,
  placeholder,
  options,
  disabled,
  loading,
  onSelect,
}: {
  label: string;
  value: string;
  placeholder: string;
  options: SearchOption[];
  disabled?: boolean;
  loading?: boolean;
  onSelect: (option: SearchOption) => void;
}) => {
  const [visible, setVisible] = useState(false);
  const [query, setQuery] = useState('');
  const filteredOptions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return options;
    }
    return options.filter(option => option.label.toLowerCase().includes(normalizedQuery));
  }, [options, query]);

  const openSelect = () => {
    if (disabled) {
      Alert.alert('Selection required', `Please select ${label === 'City' ? 'State' : 'City'} first.`);
      return;
    }
    setQuery('');
    setVisible(true);
  };

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.8}
        style={[styles.inputButton, disabled && styles.inputButtonDisabled]}
        onPress={openSelect}
      >
        <Text style={[styles.inputButtonText, !value && styles.placeholderText]}>
          {value || placeholder}
        </Text>
        {loading ? <ActivityIndicator size="small" color={RED} /> : <Text style={styles.chevron}>v</Text>}
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.selectCard}>
            <Text style={styles.pickerTitle}>{label}</Text>
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder={`Search ${label.toLowerCase()}`}
              autoCapitalize="words"
              style={styles.searchInput}
            />
            <ScrollView style={styles.optionList} keyboardShouldPersistTaps="handled">
              {filteredOptions.map(option => (
                <TouchableOpacity
                  key={option.id}
                  activeOpacity={0.75}
                  style={styles.selectOption}
                  onPress={() => {
                    onSelect(option);
                    setVisible(false);
                  }}
                >
                  <Text style={styles.selectOptionText}>{option.label}</Text>
                </TouchableOpacity>
              ))}
              {!loading && !filteredOptions.length && (
                <Text style={styles.emptyText}>No matching master data found.</Text>
              )}
            </ScrollView>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.closeSelectButton}
              onPress={() => setVisible(false)}
            >
              <Text style={styles.cancelText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const ProfileAccountFields = ({ profileForm, updateProfileForm }: Props) => {
  const [states, setStates] = useState<StateOption[]>([]);
  const [statesLoading, setStatesLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setStatesLoading(true);
    getStates()
      .then(nextStates => {
        if (isMounted) {
          setStates(nextStates);
        }
      })
      .catch(error => {
        Alert.alert(
          'Location master failed',
          error instanceof Error ? error.message : 'Could not load states.',
        );
      })
      .finally(() => {
        if (isMounted) {
          setStatesLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const stateOptions = useMemo(
    () =>
      states.map(state => ({
        id: state.id,
        label: state.name,
        value: state.name,
      })),
    [states],
  );

  return (
    <>
      <Text style={styles.inputLabel}>Name</Text>
      <TextInput
        value={profileForm.full_name}
        onChangeText={value => updateProfileForm('full_name', value)}
        placeholder="Full name"
        style={styles.textInput}
      />

      <Text style={styles.inputLabel}>DoB</Text>
      <DatePickerField value={profileForm.dob} onSelect={value => updateProfileForm('dob', value)} />

      <Text style={styles.inputLabel}>Gender</Text>
      <View style={styles.genderRow}>
        {genderOptions.map(option => {
          const selected = profileForm.gender === option.value;
          return (
            <TouchableOpacity
              key={option.value}
              activeOpacity={0.78}
              style={[styles.genderButton, selected && styles.genderButtonActive]}
              onPress={() => updateProfileForm('gender', option.value)}
            >
              <Text style={[styles.genderText, selected && styles.genderTextActive]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.inputLabel}>Nationality</Text>
      <TextInput
        value={profileForm.nationality}
        onChangeText={value => updateProfileForm('nationality', value)}
        placeholder="Nationality"
        style={styles.textInput}
      />

      <Text style={styles.inputLabel}>Address</Text>
      <TextInput
        value={profileForm.address}
        onChangeText={value => updateProfileForm('address', value)}
        placeholder="Address"
        multiline
        style={[styles.textInput, styles.addressInput]}
      />

      <Text style={styles.inputLabel}>State</Text>
      <SearchSelectField
        label="State"
        value={profileForm.state}
        placeholder="Select state"
        options={stateOptions}
        loading={statesLoading}
        onSelect={option => updateProfileForm('state', option.value)}
      />

      <Text style={styles.inputLabel}>City</Text>
      <TextInput
        value={profileForm.city}
        onChangeText={value => updateProfileForm('city', value)}
        placeholder="City"
        autoCapitalize="words"
        style={styles.textInput}
      />

      <Text style={styles.inputLabel}>Postal Code</Text>
      <TextInput
        value={profileForm.postal_code}
        onChangeText={value => updateProfileForm('postal_code', value)}
        placeholder="Postal code"
        keyboardType="number-pad"
        style={styles.textInput}
      />

      <Text style={styles.inputLabel}>Phone</Text>
      <TextInput
        value={profileForm.phone_number}
        onChangeText={value => updateProfileForm('phone_number', value)}
        placeholder="Phone number"
        keyboardType="phone-pad"
        style={styles.textInput}
      />

      <Text style={styles.inputLabel}>Email</Text>
      <TextInput
        value={profileForm.email_address}
        onChangeText={value => updateProfileForm('email_address', value)}
        placeholder="Email address"
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.textInput}
      />
    </>
  );
};

const styles = StyleSheet.create({
  inputLabel: {
    marginTop: 14,
    marginBottom: 7,
    color: DARK,
    fontSize: 12,
    fontWeight: '900',
  },
  textInput: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    color: DARK,
    fontSize: 13,
    fontWeight: '700',
  },
  addressInput: {
    minHeight: 82,
    paddingTop: 12,
    textAlignVertical: 'top',
  },
  inputButton: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  inputButtonDisabled: {
    backgroundColor: '#F7F1DA',
  },
  inputButtonText: {
    flex: 1,
    color: DARK,
    fontSize: 13,
    fontWeight: '800',
  },
  placeholderText: {
    color: '#9A8F68',
  },
  chevron: {
    color: RED,
    fontSize: 14,
    fontWeight: '900',
  },
  genderRow: {
    flexDirection: 'row',
    gap: 8,
  },
  genderButton: {
    flex: 1,
    minHeight: 42,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  genderButtonActive: {
    borderColor: RED,
    backgroundColor: RED,
  },
  genderText: {
    color: DARK,
    fontSize: 12,
    fontWeight: '900',
  },
  genderTextActive: {
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.48)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
  },
  pickerCard: {
    width: '100%',
    maxHeight: '78%',
    borderRadius: 20,
    backgroundColor: SOFT_YELLOW,
    padding: 18,
  },
  selectCard: {
    width: '100%',
    maxHeight: '78%',
    borderRadius: 20,
    backgroundColor: SOFT_YELLOW,
    padding: 18,
  },
  pickerTitle: {
    color: DARK,
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 6,
  },
  pickerValue: {
    color: RED,
    fontSize: 13,
    fontWeight: '900',
    marginBottom: 14,
  },
  datePickerRow: {
    flexDirection: 'row',
    gap: 8,
    height: 260,
  },
  dateColumnWrap: {
    flex: 1,
  },
  dateColumn: {
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  dateColumnLabel: {
    marginBottom: 6,
    textAlign: 'center',
    color: MUTED,
    fontSize: 11,
    fontWeight: '900',
  },
  dateOption: {
    minHeight: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F6E8AF',
  },
  dateOptionActive: {
    backgroundColor: RED,
  },
  dateOptionText: {
    color: DARK,
    fontSize: 13,
    fontWeight: '800',
  },
  dateOptionTextActive: {
    color: '#FFFFFF',
  },
  actionRow: {
    marginTop: 16,
    flexDirection: 'row',
    gap: 10,
  },
  cancelButton: {
    flex: 1,
    minHeight: 46,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: RED,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneButton: {
    flex: 1,
    minHeight: 46,
    borderRadius: 12,
    backgroundColor: RED,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: {
    color: RED,
    fontSize: 13,
    fontWeight: '900',
  },
  doneText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },
  searchInput: {
    minHeight: 46,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    color: DARK,
    fontSize: 13,
    fontWeight: '700',
  },
  optionList: {
    marginTop: 12,
    maxHeight: 330,
  },
  selectOption: {
    minHeight: 46,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F4E4AA',
    paddingHorizontal: 8,
  },
  selectOptionText: {
    color: DARK,
    fontSize: 13,
    fontWeight: '800',
  },
  emptyText: {
    paddingVertical: 24,
    textAlign: 'center',
    color: MUTED,
    fontSize: 13,
    fontWeight: '700',
  },
  closeSelectButton: {
    marginTop: 12,
    minHeight: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: RED,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ProfileAccountFields;
