import { K } from "../constants/constants";
import { tokenStorage, handleTokenRefresh } from "../utils/tokenUtility";

export class ApiError extends Error {
  constructor(status, message = "Unknown error", data = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export class ApiClient {
  constructor({ baseURL, timeout = 10000 }) {
    this.baseURL = baseURL;
    this.timeout = timeout;
  }

  async request(endpoint, options = {}, retried = false) {
    const {
      method = "GET",
      body,
      headers = {},
      skipAuth = false,
      skipRefresh = false,
      ...rest
    } = options;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);
    const requestHeaders = {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true",
      ...headers,
    };
    if (!skipAuth) {
      const token = tokenStorage.getAccessToken();
      if (token) requestHeaders.Authorization = `Bearer ${token}`;
    }
    try {
      const res = await fetch(`${this.baseURL}${endpoint}`, {
        method,
        headers: requestHeaders,
        credentials: "include",
        signal: controller.signal,
        body:
          body && !["GET", "HEAD"].includes(method)
            ? JSON.stringify(body)
            : undefined,
        ...rest,
      });
      clearTimeout(timeoutId);
      const contentType = res.headers.get("content-type");
      const raw = contentType?.includes("application/json")
        ? await res.json()
        : await res.text();
      if (res.status === 401 && !skipRefresh && !retried) {
        await handleTokenRefresh();
        return this.request(endpoint, options, true);
      }
      if (retried && res.status === 401) {
        window.location.replace("/login");
      }
      if (!res.ok) {
        throw new ApiError(
          res.status,
          raw?.message || "Request failed",
          raw?.data ?? raw
        );
      }
      return {
        data: raw?.data ?? raw,
        message: raw?.message ?? "Success",
      };
    } catch (err) {
      clearTimeout(timeoutId);
      if (err.name === "AbortError") {
        throw new ApiError(408, "Request timeout");
      }
      if (err instanceof ApiError) {
        throw err;
      }
      throw new ApiError(0, err.message || "Network error");
    }
  }

  get(url, options) {
    return this.request(url, { ...options, method: "GET" });
  }
  post(url, options, body = {},) {
    return this.request(url, { ...options, method: "POST", body });
  }
  put(url, options, body = {},) {
    return this.request(url, { ...options, method: "PUT", body });
  }
  patch(url, options, body = {},) {
    return this.request(url, { ...options, method: "PATCH", body });
  }
  delete(url, options) {
    return this.request(url, { ...options, method: "DELETE" });
  }
}

export const apiClient = new ApiClient(K.NetworkCall);
