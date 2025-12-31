import { useEffect } from "react";
import { io } from "socket.io-client";
import { K } from "../constants/constants";
import {
  handleSocketConnected,
  handleSocketDisconnected,
  handleSocketThrownError,
  handleSocketCleanup,
} from "../utils/socketUtility";

export const useSocketVehicles = (setVehicles, markersRef, tooltipsRef) => {
  const updateVehicleData = (gps, tripInformation, imei) => {
    setVehicles((previousVehiclesInfo) =>
      previousVehiclesInfo.map((vehicle) => {
        if (vehicle.imei !== imei) return vehicle;
        return {
          ...vehicle,
          stats: {
            ...vehicle.stats,
            location: {
              ...vehicle.stats?.location,
              lat: gps.lat,
              lon: gps.lon,
              heading: gps.heading,
            },
            speed: tripInformation.speed,
            lastUpdated: tripInformation.timestamp,
          },
        };
      })
    );
  };

  const processEventPayload = (eventPayload) => {
    eventPayload.forEach((event) => {
      const imei = event.imei;
      const tripInformation = event.data[0];
      const gps = tripInformation.gps;
      const marker = markersRef.current.get(imei);
      const tooltipData = tooltipsRef.current.get(imei);
      if (marker) {
        marker.position = { lat: gps.lat, lng: gps.lon };
        if (gps.heading !== undefined && tooltipData?.arrow) {
          tooltipData.arrow.style.transform = `translateX(-50%) rotate(${gps.heading}deg)`;
        }
        updateVehicleData(gps, tripInformation, imei);
      }
    });
  };

  const handleSocketReceivingEvent = (socket) => {
    socket.onAny((_, ...eventPayload) => {
      processEventPayload(eventPayload);
    });
  };

  useEffect(() => {
    const socket = io(K.NetworkCall.baseURL, { withCredentials: true });

    handleSocketConnected(socket);
    handleSocketThrownError(socket);
    handleSocketDisconnected(socket);
    handleSocketReceivingEvent(socket);

    return () => handleSocketCleanup(socket);
  }, []);
};
