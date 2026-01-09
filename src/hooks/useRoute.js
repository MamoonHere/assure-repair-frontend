import { useRef } from "react";
import {
  createRouteInfoWindow,
  createMarkerInfoWindow,
  createRouteMarkerElement,
} from "../utils/mapUtility";

export const useRoute = (mapRef) => {
  const routePolylineRef = useRef(null);
  const startMarkerRef = useRef(null);
  const destinationMarkerRef = useRef(null);
  const routeInfoWindowRef = useRef(null);
  const startInfoWindowRef = useRef(null);
  const destinationInfoWindowRef = useRef(null);

  const clearRoute = () => {
    if (routePolylineRef.current) {
      routePolylineRef.current.setMap(null);
      routePolylineRef.current = null;
    }
    if (startMarkerRef.current) {
      startMarkerRef.current.map = null;
      startMarkerRef.current = null;
    }
    if (destinationMarkerRef.current) {
      destinationMarkerRef.current.map = null;
      destinationMarkerRef.current = null;
    }
    if (routeInfoWindowRef.current) {
      routeInfoWindowRef.current.close();
      routeInfoWindowRef.current = null;
    }
    if (startInfoWindowRef.current) {
      startInfoWindowRef.current.close();
      startInfoWindowRef.current = null;
    }
    if (destinationInfoWindowRef.current) {
      destinationInfoWindowRef.current.close();
      destinationInfoWindowRef.current = null;
    }
  };

  const drawRoute = async (
    encodedPolyline,
    startLat,
    startLng,
    destLat,
    destLng,
    distance,
    duration,
    startName,
    destinationName
  ) => {
    try {
      clearRoute();
      const decodedPath =
        window.google.maps.geometry.encoding.decodePath(encodedPolyline);

      const polyline = new window.google.maps.Polyline({
        path: decodedPath,
        geodesic: true,
        strokeColor: "#5A9AE2",
        strokeOpacity: 1.0,
        strokeWeight: 4,
        icons: [
          {
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 3,
              strokeColor: "#5A9AE2",
              strokeWeight: 4,
            },
            offset: "0%",
            repeat: "20px",
          },
        ],
        map: mapRef.current,
      });

      routePolylineRef.current = polyline;
      const routeInfoWindow = createRouteInfoWindow(distance, duration);
      routeInfoWindowRef.current = routeInfoWindow;

      polyline.addListener("mouseover", (event) => {
        routeInfoWindow.setPosition(event.latLng);
        routeInfoWindow.open(mapRef.current);
      });
      polyline.addListener("mouseout", () => routeInfoWindow.close());

      const { AdvancedMarkerElement } = await google.maps.importLibrary(
        "marker"
      );

      const createMarker = (label, color, position, name) => {
        const element = createRouteMarkerElement(label, color);
        const marker = new AdvancedMarkerElement({
          map: mapRef.current,
          position,
          title: name,
          content: element,
        });
        const infoWindow = createMarkerInfoWindow(name);
        element.addEventListener("mouseenter", () =>
          infoWindow.open({ anchor: marker, map: mapRef.current })
        );
        element.addEventListener("mouseleave", () => infoWindow.close());
        return { marker, infoWindow };
      };

      const start = createMarker(
        "S",
        "#52c41a",
        { lat: startLat, lng: startLng },
        startName || "Start Location"
      );
      const dest = createMarker(
        "D",
        "#ff4d4f",
        { lat: destLat, lng: destLng },
        destinationName || "Destination"
      );

      startMarkerRef.current = start.marker;
      destinationMarkerRef.current = dest.marker;
      startInfoWindowRef.current = start.infoWindow;
      destinationInfoWindowRef.current = dest.infoWindow;

      const bounds = new window.google.maps.LatLngBounds();
      bounds.extend({ lat: startLat, lng: startLng });
      bounds.extend({ lat: destLat, lng: destLng });
      decodedPath.forEach((point) => bounds.extend(point));
      mapRef.current.fitBounds(bounds);
    } catch (error) {
      console.error("Error drawing route:", error);
    }
  };

  return {
    drawRoute,
    clearRoute,
  };
};
