import { authApi } from "../services/requests/authApi";
import { K } from "../constants/constants";

let accessTokenMemory = null;
let accessTokenExpiry = null;
let refreshPromise = null;
let refreshInterval = null;

const decodeExp = (token) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return typeof payload.exp === "number" ? payload.exp * 1000 : null;
  } catch {
    return null;
  }
};

export const tokenStorage = {
  getAccessToken: () => accessTokenMemory,
  setAccessToken: (token) => {
    accessTokenMemory = token;
    if (token) {
      accessTokenExpiry = decodeExp(token);
    } else {
      accessTokenExpiry = null;
    }
  },
  getTokenExpiry: () => accessTokenExpiry,
  setTokenExpiry: (expiresAtMs) => {
    accessTokenExpiry = expiresAtMs ?? decodeExp(accessTokenMemory);
  },
  isAccessTokenExpired: () => {
    if (!accessTokenMemory) return true;
    const expiry = accessTokenExpiry ?? decodeExp(accessTokenMemory);
    if (!expiry) return true;
    return expiry - Date.now() < 0;
  },
  isAccessTokenNearExpiry: (thresholdSeconds = 60) => {
    if (!accessTokenMemory) return true;
    const expiry = accessTokenExpiry ?? decodeExp(accessTokenMemory);
    if (!expiry) return true;
    return expiry - Date.now() < thresholdSeconds * 1000;
  },
  clear: () => {
    accessTokenMemory = null;
    accessTokenExpiry = null;
  },
};

export const handleTokenRefresh = async (
  expiryThresholdSeconds = K.TokenRefresh.EXPIRY_THRESHOLD_SECONDS
) => {
  if (refreshPromise) return refreshPromise;
  if (tokenStorage.isAccessTokenNearExpiry(expiryThresholdSeconds)) {
    refreshPromise = authApi
      .refreshToken()
      .then((res) => ({
        data: res.data || null,
        message: res.message || "Token refreshed successfully",
      }))
      .catch((err) => ({
        data: null,
        message: err.message || "Token refresh failed",
      }))
      .finally(() => {
        refreshPromise = null;
      });
    return await refreshPromise;
  }
  return {
    data: { token: tokenStorage.getAccessToken() },
    message: "Token still valid",
  };
};

export const setupTokenRefresh = (
  intervalMs = K.TokenRefresh.CHECK_INTERVAL_MS,
  expiryThresholdSeconds = K.TokenRefresh.EXPIRY_THRESHOLD_SECONDS
) => {
  if (refreshInterval) return;
  const checkAndRefresh = async () => {
    try {
      const refreshed = await handleTokenRefresh(expiryThresholdSeconds);
      if (!refreshed?.data) {
        console.warn("Periodic token refresh failed:", refreshed?.message);
      }
    } catch (err) {
      console.error("Periodic token refresh error:", err);
    }
  };
  refreshInterval = setInterval(checkAndRefresh, intervalMs);
  checkAndRefresh();
};

export const cleanupTokenRefresh = () => {
  if (refreshInterval) {
    clearInterval(refreshInterval);
    refreshInterval = null;
  }
};
