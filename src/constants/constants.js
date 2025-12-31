const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

export const K = {
  GoogleMaps: {
    apiKey: GOOGLE_MAPS_API_KEY,
  },
  NetworkCall: {
    baseURL: API_BASE_URL,
    timeout: 30000,
    retryAttempts: 3,
    retryDelay: 1000,
  },
  EndPoints: {
    Auth: {
      LOGIN: "/auth/login",
      REFRESH: "/auth/refresh",
      LOGOUT: "/auth/logout",
      LOGOUT_ALL: "/auth/logout-all",
    },
    User: {
      CRUD: "/users",
      RESEND_PASSWORD_EMAIL: "/users/:id/resend-password-email",
      SET_PASSWORD: "/users/set-password",
    },
    Bouncie: {
      GET_ALL_VEHICLES: "/vehicles",
    },
  },
  TokenRefresh: {
    CHECK_INTERVAL_MS: parseInt(
      import.meta.env.VITE_TOKEN_REFRESH_INTERVAL_MS || "300000",
      10
    ),
    EXPIRY_THRESHOLD_SECONDS: parseInt(
      import.meta.env.VITE_TOKEN_EXPIRY_THRESHOLD_SEC || "60",
      10
    ),
  },
};
