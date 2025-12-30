import { apiClient } from "../apiClient";
import { K } from "../../constants/constants";

export const userApi = {
  createUser: async (email, firstName, lastName) => {
    const response = await apiClient.post(
      K.EndPoints.User.CRUD,
      {},
      {
        email,
        firstName,
        lastName,
      }
    );
    return response;
  },
  updateUser: async (email, firstName, lastName, userId) => {
    const response = await apiClient.put(
      `${K.EndPoints.User.CRUD}/${userId}`,
      {},
      {
        email,
        firstName,
        lastName,
      }
    );
    return response;
  },
  deleteUser: async (userId) => {
    const response = await apiClient.delete(
      `${K.EndPoints.User.CRUD}/${userId}`
    );
    return response;
  },
  getAllUsers: async (page, limit) => {
    const response = await apiClient.get(
      `${K.EndPoints.User.CRUD}?page=${page}&limit=${limit}`
    );
    return response;
  },
  resendEmail: async (userId) => {
    const response = await apiClient.post(
      K.EndPoints.User.RESEND_PASSWORD_EMAIL.replace(":id", userId)
    );
    return response;
  },
  setPassword: async (token, password) => {
    const response = await apiClient.post(
      K.EndPoints.User.SET_PASSWORD,
      {},
      { token, password }
    );
    return response;
  },
};
