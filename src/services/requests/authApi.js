import { apiClient } from "../apiClient";
import { K } from "../../constants/constants";
import { tokenStorage } from "../../utils/tokenUtility";

export const authApi = {
  login: async (email, password) => {
    const response = await apiClient.post(
      K.EndPoints.Auth.LOGIN,
      { skipAuth: true },
      {
        email,
        password,
      },
    );
    if (response.data) {
      const { accessToken, expiresAt, user } = response.data;
      tokenStorage.setAccessToken(accessToken);
      tokenStorage.setTokenExpiry(expiresAt);
    }
    return response;
  },
  refreshToken: async () => {
    try {
      const response = await apiClient.post(K.EndPoints.Auth.REFRESH, {
        skipAuth: true,
        skipRefresh: true,
      });
      if (response.data) {
        const { accessToken, expiresAt } = response.data;
        tokenStorage.setAccessToken(accessToken);
        tokenStorage.setTokenExpiry(expiresAt);
        return response;
      }
      tokenStorage.clear();
      return response;
    } catch (error) {
      tokenStorage.clear();
      throw error;
    }
  },
  logout: async () => {
    const response = await apiClient.post(K.EndPoints.Auth.LOGOUT);
    return response;
  },
  logoutAll: async () => {
    const response = await apiClient.post(K.EndPoints.Auth.LOGOUT_ALL);
    return response;
  },
};
