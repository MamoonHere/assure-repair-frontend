import { useGoogleMap } from "../hooks/useGoogleMap";
import { useVehiclesAPI } from "../hooks/useVehiclesAPI";
import { useMarkers } from "../hooks/useMarkers";
import { useSocketVehicles } from "../hooks/useSocketVehicles";
import { useRef } from "react";

const MapComponent = () => {
  const { mapRef } = useGoogleMap();
  const { vehicles, setVehicles } = useVehiclesAPI();
  const markersRef = useRef(new Map());
  const tooltipsRef = useRef(new Map());
  useMarkers(mapRef, vehicles);
  useSocketVehicles(setVehicles, markersRef, tooltipsRef);

  return (
    <div
      id="map-container"
      style={{
        width: "100%",
        height: "calc(100vh - 70px)",
        borderRadius: "8px",
        overflow: "hidden",
      }}
    />
  );
};

export default MapComponent;
