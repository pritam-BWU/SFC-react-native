export type Gender = 'M' | 'F' | 'O';

export type AuthUser = {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
};

export type AuthProfile = {
  id: string;
  full_name: string;
  email_address: string;
  phone_number: string;
  gender: Gender | '';
  subscription_plan_id: number | null;
  subscription_status_id: number | null;
  subscription_status: string;
  is_active: boolean;
};

export type AuthResponse = {
  message: string;
  token: string;
  user: AuthUser;
  profile: AuthProfile;
};

export type LoginRequest = {
  login_id: string;
  password: string;
};

export type SignupRequest = {
  full_name: string;
  login_id: string;
  gender: Gender;
  password: string;
};

export type PasswordChangeRequest = {
  login_id: string;
  new_password: string;
  confirm_password: string;
};
