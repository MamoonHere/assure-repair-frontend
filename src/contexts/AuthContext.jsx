import {
  createContext,
  useContext,
  useReducer,
  useEffect,
} from "react";
import {
  tokenStorage,
  setupTokenRefresh,
  cleanupTokenRefresh,
  handleTokenRefresh,
} from "../utils/tokenUtility";
import { authApi } from "../services/requests/authApi";
import { ApiError } from "../services/apiClient";
import { message } from "antd";

const initialState = { user: null, isAuthenticated: false, isLoading: true };

const ACTIONS = {
  INIT: "INIT",                      // Initialize auth state on app startup or after token refresh
  LOGIN: "LOGIN",                    // Update state after a successful user login
  LOGOUT: "LOGOUT",                  // Clear auth state when logging out or session expires
  SET_LOADING: "SET_LOADING",        // Mark auth state as loading during async operations
};

const statusMessages = {
  401: "Invalid email or password",
  403: "Account is disabled or restricted",
  500: "Server error. Please try again later",
};

const authReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.INIT:
    case ACTIONS.LOGIN:
      return { ...state, ...action.payload, isLoading: false };
    case ACTIONS.LOGOUT:
      return { ...initialState, isLoading: false };
    case ACTIONS.SET_LOADING:
      return { ...state, isLoading: true };
    default:
      return state;
  }
};

const AuthContext = createContext(null);
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

/* 
Proactive token refresh: runs on app startup and periodically to keep the session valid, 
unlike ApiClient refresh which is reactive and only triggers on 401 Unauthorized responses. 
Inside useEffect, we setup proactive token refresh AFTER getting initial refresh token.
*/

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  useEffect(() => {
    const initSession = async () => {
      try {
        const refreshed = await handleTokenRefresh();
        if (!refreshed?.data) {
          throw new Error(refreshed?.message || "Token refresh failed");
        }
        dispatch({
          type: ACTIONS.INIT,
          payload: { user: refreshed.data?.user, isAuthenticated: true },
        });
        setupTokenRefresh();
      } catch (err) {
        console.error("Auth initialization error:", err);
        message.warning(err?.message || "Your session has expired. Please log in again.");
        dispatch({ type: ACTIONS.LOGOUT });
        tokenStorage.clear();
      }
    };
    initSession();
    return () => cleanupTokenRefresh();
  }, []);

  const login = async (email, password) => {
    dispatch({ type: ACTIONS.SET_LOADING });
    try {
      const response = await authApi.login(email, password);
      if (!response?.data)
        throw new Error(response?.message || "Could not log in");
      dispatch({
        type: ACTIONS.LOGIN,
        payload: { user: response.data.user, isAuthenticated: true },
      });
      setupTokenRefresh();
      return response;
    } catch (error) {
      console.error("Login error:", error);
      const msg =
        error instanceof ApiError
          ? statusMessages[error.status] || error.message
          : error.message || "Could not log in";
      message.error(msg);
      dispatch({ type: ACTIONS.LOGOUT });
    }
  };

  const logout = async (logoutAll = false) => {
    dispatch({ type: ACTIONS.SET_LOADING });
    try {
      if (logoutAll) {
        await authApi.logoutAll();
      } else {
        await authApi.logout();
      }
    } catch (error) {
      console.error("Logout error:", error);
      message.error("You have only been logged out locally");
    } finally {
      cleanupTokenRefresh();
      dispatch({ type: ACTIONS.LOGOUT });
      tokenStorage.clear();
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
