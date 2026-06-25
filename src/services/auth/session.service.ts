import { AuthProfile, AuthResponse, AuthUser } from '../../types/auth.types';
import { asyncStorage } from '../storage/asyncStorage';
import { tokenService } from './token.service';

let authUser: AuthUser | null = null;
let authProfile: AuthProfile | null = null;
const AUTH_STORAGE_KEY = 'sfc.auth.session';

const persistCurrentSession = () => {
  const token = tokenService.getToken();
  if (!token || !authUser || !authProfile) {
    return;
  }

  void asyncStorage.setString(
    AUTH_STORAGE_KEY,
    JSON.stringify({
      message: 'Session restored.',
      token,
      user: authUser,
      profile: authProfile,
    }),
  );
};

export const authSession = {
  setAuth(response: AuthResponse) {
    tokenService.setToken(response.token);
    authUser = response.user;
    authProfile = response.profile;
    void asyncStorage.setString(AUTH_STORAGE_KEY, JSON.stringify(response));
  },

  async restoreAuth() {
    const storedSession = await asyncStorage.getString(AUTH_STORAGE_KEY);
    if (!storedSession) {
      return false;
    }

    try {
      const response = JSON.parse(storedSession) as AuthResponse;
      tokenService.setToken(response.token);
      authUser = response.user;
      authProfile = response.profile;
      return Boolean(response.token && response.user && response.profile);
    } catch {
      await asyncStorage.remove(AUTH_STORAGE_KEY);
      return false;
    }
  },

  getUser() {
    return authUser;
  },

  getProfile() {
    return authProfile;
  },

  updateProfile(profile: AuthProfile) {
    authProfile = profile;
    persistCurrentSession();
  },

  clear() {
    authUser = null;
    authProfile = null;
    tokenService.clearToken();
    void asyncStorage.remove(AUTH_STORAGE_KEY);
  },
};
