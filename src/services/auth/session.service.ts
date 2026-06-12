import { AuthProfile, AuthResponse, AuthUser } from '../../types/auth.types';
import { tokenService } from './token.service';

let authUser: AuthUser | null = null;
let authProfile: AuthProfile | null = null;

export const authSession = {
  setAuth(response: AuthResponse) {
    tokenService.setToken(response.token);
    authUser = response.user;
    authProfile = response.profile;
  },

  getUser() {
    return authUser;
  },

  getProfile() {
    return authProfile;
  },

  clear() {
    authUser = null;
    authProfile = null;
    tokenService.clearToken();
  },
};
