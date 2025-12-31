import { useEffect, useState } from "react";
import { bouncieApi } from "../services/requests/bouncieApi";

export const useVehiclesAPI = () => {
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await bouncieApi.getAllVehicles();
        setVehicles(response.data || []);
      } catch (err) {
        console.error("Error fetching vehicles:", err);
      }
    };
    fetchVehicles();
  }, []);

  return { vehicles, setVehicles };
};
