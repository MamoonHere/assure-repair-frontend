import { useGoogleMap } from "../hooks/useGoogleMap";
import { useVehiclesAPI } from "../hooks/useVehiclesAPI";
import { useMarkers } from "../hooks/useMarkers";
import { useSocketVehicles } from "../hooks/useSocketVehicles";
import { useRef } from "react";
import MapSider from "../components/MapSider";

const MapComponent = () => {
  const { mapRef, placesApiRef } = useGoogleMap();
  const { vehicles, setVehicles } = useVehiclesAPI();
  const markersRef = useRef(new Map());
  const tooltipsRef = useRef(new Map());
  useMarkers(mapRef, vehicles);
  //useSocketVehicles(setVehicles, markersRef, tooltipsRef);

  return (
    <div style={{ display: "flex", height: "calc(100vh - 70px)" }}>
      <MapSider  vehicles={vehicles} placesApiRef={placesApiRef}/>
      <div
        id="map-container"
        style={{
          flex: 1,
          height: "calc(100vh - 70px)",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      />
    </div>
  );
};

export default MapComponent;
