import { apiClient } from "../apiClient";
import { K } from "../../constants/constants";

export const bouncieApi = {
  getAllVehicles: async () => {
    const response = await apiClient.get(
      K.EndPoints.Bouncie.GET_ALL_VEHICLES,
    );
    return response;
  }
};
