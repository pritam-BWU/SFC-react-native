let authToken: string | null = null;

export const tokenService = {
  setToken(token: string) {
    authToken = token;
  },

  getToken() {
    return authToken;
  },

  clearToken() {
    authToken = null;
  },

  getAuthHeader() {
    return authToken ? { Authorization: `Token ${authToken}` } : {};
  },
};
