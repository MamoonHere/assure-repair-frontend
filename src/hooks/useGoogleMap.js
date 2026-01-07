import { useEffect, useRef } from "react";
import { K } from "../constants/constants";
import { doesScriptExist, doesMapExist } from "../utils/mapUtility";

export const useGoogleMap = (
  defaultCenter = { lat: 32.7767, lng: -96.797 },
  zoom = 10,
  mapId = "MAP_ID"
) => {
  const mapRef = useRef(null);
  const placesApiRef = useRef(null);

  const loadGoogleMapsScript = () => {
    return new Promise((resolve, reject) => {
      const callbackName = `initGoogleMaps_${Date.now()}`;
      window[callbackName] = () => {
        delete window[callbackName];
        resolve();
      };
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${K.GoogleMaps.apiKey}&libraries=geometry,marker&loading=async&callback=${callbackName}`;
      script.async = true;
      script.defer = true;
      script.onerror = () => {
        delete window[callbackName];
        reject(new Error("Failed to load Google Maps script"));
      };
      document.head.appendChild(script);
    });
  };

  const initializeGoogleMap = async () => {
    const mapContainer = document.getElementById("map-container");
    mapRef.current = new window.google.maps.Map(mapContainer, {
      center: defaultCenter,
      zoom,
      mapId,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
    });
    const { Place, AutocompleteSessionToken, AutocompleteSuggestion } = (await google.maps.importLibrary('places'));
    placesApiRef.current = { Place, AutocompleteSessionToken, AutocompleteSuggestion }
    console.log("Map mounted");
  };

  useEffect(() => {
    (async () => {
      try {
        if (!doesScriptExist()) {
          await loadGoogleMapsScript();
        }
        if (doesMapExist() && !mapRef.current) {
          await initializeGoogleMap();
        }
      } catch (error) {
        console.error("Error initializing map:", error);
      }
    })();
  }, []);

  return { mapRef, placesApiRef };
};
