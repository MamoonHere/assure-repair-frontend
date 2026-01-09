import { useEffect, useRef } from "react";
import {
  setBounds,
  doesMapExist,
  handleNewMarkerCase,
  handleExistingMarkerCase,
} from "../utils/mapUtility";

export const useMarkers = (mapRef, vehicles, markersRef, tooltipsRef) => {
  const hasSetInitialBounds = useRef(false);
  const previousVehicleCount = useRef(0);

  useEffect(() => {
    if (!doesMapExist()) return;

    let hasNewMarkers = false;
    const currentVehicleCount = vehicles.length;

    vehicles.forEach((vehicle) => {
      if (!vehicle.stats?.location) return;
      const { lat, lon, heading } = vehicle.stats.location;
      const position = { lat, lng: lon };

      if (markersRef.current.has(vehicle.imei)) {
        handleExistingMarkerCase(
          vehicle,
          markersRef,
          tooltipsRef,
          heading,
          position
        );
      } else {
        hasNewMarkers = true;
        handleNewMarkerCase(
          vehicle,
          markersRef,
          tooltipsRef,
          heading,
          position,
          mapRef
        );
      }
    });

    if (
      !hasSetInitialBounds.current ||
      hasNewMarkers ||
      currentVehicleCount !== previousVehicleCount.current
    ) {
      setBounds(vehicles, mapRef);
      hasSetInitialBounds.current = true;
    }

    previousVehicleCount.current = currentVehicleCount;
  }, [vehicles]);
};
