import { AuthProfile } from '../types/auth.types';

export type RequiredProfileField = {
  key: keyof AuthProfile;
  label: string;
};

export const requiredProfileFields: RequiredProfileField[] = [
  { key: 'full_name', label: 'Name' },
  { key: 'dob', label: 'DoB' },
  { key: 'gender', label: 'Gender' },
  { key: 'nationality', label: 'Nationality' },
  { key: 'address', label: 'Address' },
  { key: 'city', label: 'City' },
  { key: 'state', label: 'State/Province' },
  { key: 'postal_code', label: 'ZIP/Postal code' },
  { key: 'phone_number', label: 'Phone' },
  { key: 'email_address', label: 'Email' },
];

export const getProfileCompletion = (profile: AuthProfile | null) => {
  if (!profile) {
    return {
      percentage: 0,
      missingFields: requiredProfileFields.map(field => field.label),
      isComplete: false,
    };
  }

  const missingFields = requiredProfileFields
    .filter(field => {
      const value = profile[field.key];
      return value === undefined || value === null || String(value).trim() === '';
    })
    .map(field => field.label);
  const completedFields = requiredProfileFields.length - missingFields.length;

  return {
    percentage: Math.round((completedFields / requiredProfileFields.length) * 100),
    missingFields,
    isComplete: missingFields.length === 0,
  };
};
