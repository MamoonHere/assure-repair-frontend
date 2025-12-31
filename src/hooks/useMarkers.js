import { useEffect, useRef } from "react";
import {
  setBounds,
  doesMapExist,
  handleNewMarkerCase,
  handleExistingMarkerCase,
} from "../utils/mapUtility";

export const useMarkers = (mapRef, vehicles) => {
  const markersRef = useRef(new Map());
  const tooltipsRef = useRef(new Map());

  useEffect(() => {
    if (!doesMapExist()) return;

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
    setBounds(vehicles, mapRef);
  }, [mapRef, vehicles]);
};
