import { useGoogleMap } from "../hooks/useGoogleMap";
import { useVehiclesAPI } from "../hooks/useVehiclesAPI";
import { useMarkers } from "../hooks/useMarkers";
import { useSocketVehicles } from "../hooks/useSocketVehicles";
import { useRef, useState } from "react";
import { Spin } from "antd";
import MapSider from "../components/MapSider";

const MapComponent = () => {
  const { mapRef, placesApiRef } = useGoogleMap();
  const { vehicles } = useVehiclesAPI();
  const markersRef = useRef(new Map());
  const tooltipsRef = useRef(new Map());
  const [isRouteLoading, setIsRouteLoading] = useState(false);
  useMarkers(mapRef, vehicles);
  //useSocketVehicles(setVehicles, markersRef, tooltipsRef);

  return (
    <div
      style={{
        display: "flex",
        height: "calc(100vh - 70px)",
        position: "relative",
      }}
    >
      <MapSider
        vehicles={vehicles}
        placesApiRef={placesApiRef}
        mapRef={mapRef}
        setIsRouteLoading={setIsRouteLoading}
      />
      <div
        id="map-container"
        style={{
          flex: 1,
          height: "calc(100vh - 70px)",
          borderRadius: "8px",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {isRouteLoading && (
          <>
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundColor: "rgba(0, 0, 0, 0.3)",
                zIndex: 999,
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1000,
                pointerEvents: "none",
              }}
            >
              <Spin size="large" />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MapComponent;
