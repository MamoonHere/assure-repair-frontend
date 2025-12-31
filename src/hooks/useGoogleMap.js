import { useEffect, useRef } from "react";
import { K } from "../constants/constants";
import { doesScriptExist } from "../utils/mapUtility";

export const useGoogleMap = (
  defaultCenter = { lat: 32.7767, lng: -96.797 },
  zoom = 10,
  mapId = "MAP_ID"
) => {
  const mapRef = useRef(null);

  const loadGoogleMapsScript = () => {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${K.GoogleMaps.apiKey}&libraries=geometry,marker`;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () =>
        reject(new Error("Failed to load Google Maps script"));
      document.head.appendChild(script);
    });
  };

  const initializeGoogleMap = () => {
    const mapContainer = document.getElementById("map-container");
    mapRef.current = new window.google.maps.Map(mapContainer, {
      center: defaultCenter,
      zoom,
      mapId,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
    });
    console.log("Map mounted");
  };

  useEffect(() => {
    (async () => {
      try {
        if (!doesScriptExist()) {
          await loadGoogleMapsScript();
          initializeGoogleMap();
        }
      } catch (error) {
        console.error("Error initializing map:", error);
      }
    })();
  }, []);

  return { mapRef };
};
