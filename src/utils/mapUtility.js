import React from "react";
import { CarFilled } from "@ant-design/icons";

const createMarkerElement = (rotation = 0) => {
  const element = document.createElement("div");
  Object.assign(element.style, {
    width: "36px",
    height: "48px",
    backgroundColor: "#184281",
    clipPath: "polygon(50% 0%, 100% 100%, 50% 82%, 0% 100%)",
    transform: `rotate(${rotation}deg)`,
    filter: "drop-shadow(0px 3px 4px rgba(0,0,0,0.25))",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), filter 0.3s ease",
    border: "2px solid #000",
    position: "relative",
    overflow: "hidden",
  });
  element.addEventListener("mouseenter", () => {
    element.style.filter = "drop-shadow(0px 4px 6px rgba(0,0,0,0.35))";
    element.style.transform = `rotate(${rotation}deg) scale(1.05)`;
  });
  element.addEventListener("mouseleave", () => {
    element.style.filter = "drop-shadow(0px 3px 4px rgba(0,0,0,0.25))";
    element.style.transform = `rotate(${rotation}deg) scale(1)`;
  });

  const iconWrapper = document.createElement("div");
  Object.assign(iconWrapper.style, {
    marginTop: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  });
  const icon = document.createElement("img");
  icon.src = "/wrench-icon.svg";
  icon.alt = "Marker icon";
  Object.assign(icon.style, {
    width: "15px",
    height: "15px",
    pointerEvents: "none",
  });

  iconWrapper.appendChild(icon);
  element.appendChild(iconWrapper);
  return element;
};

const createInfoWindowObject = (vehicle) => ({
  content: `
    <div style="
      background: linear-gradient(90deg, rgb(34, 36, 92) 0%, rgb(14, 95, 165) 100%);
      padding: 16px;
      border-radius: 8px;
      min-width: 280px;
      color: white;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    ">
      <div style="
        font-size: 18px;
        font-weight: 600;
        margin-bottom: 12px;
        padding-bottom: 8px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.2);
      ">
        ${vehicle.nickName || "Unnamed Vehicle"}
      </div>
      
      <div style="display: flex; flex-direction: column; gap: 8px;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span style="opacity: 0.8; font-size: 13px;">Make:</span>
          <span style="font-weight: 500;">${vehicle.model?.make || "N/A"}</span>
        </div>
        
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span style="opacity: 0.8; font-size: 13px;">Model:</span>
          <span style="font-weight: 500;">${vehicle.model?.name || "N/A"}</span>
        </div>
        
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span style="opacity: 0.8; font-size: 13px;">Year:</span>
          <span style="font-weight: 500;">${vehicle.model?.year || "N/A"}</span>
        </div>
        
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span style="opacity: 0.8; font-size: 13px;">VIN:</span>
          <span style="font-weight: 500; font-size: 12px;">${
            vehicle.vin || "N/A"
          }</span>
        </div>
        
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span style="opacity: 0.8; font-size: 13px;">IMEI:</span>
          <span style="font-weight: 500; font-size: 12px;">${
            vehicle.imei || "N/A"
          }</span>
        </div>
        
        <div style="
          margin-top: 8px;
          padding-top: 12px;
          border-top: 1px solid rgba(255, 255, 255, 0.2);
          display: flex;
          justify-content: space-between;
          align-items: center;
        ">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="opacity: 0.8; font-size: 13px;">Speed:</span>
            <span style="
              background: rgba(255, 255, 255, 0.15);
              padding: 4px 12px;
              border-radius: 12px;
              font-weight: 600;
              font-size: 14px;
            ">${vehicle.stats?.speed || 0} mph</span>
          </div>
          
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="
              width: 8px;
              height: 8px;
              border-radius: 50%;
              background: ${vehicle.stats?.isRunning ? "#52c41a" : "#ff4d4f"};
              box-shadow: 0 0 8px ${
                vehicle.stats?.isRunning ? "#52c41a" : "#ff4d4f"
              };
            "></span>
            <span style="font-size: 13px; font-weight: 500;">
              ${vehicle.stats?.isRunning ? "Running" : "Stopped"}
            </span>
          </div>
        </div>
      </div>
    </div>
  `,
  disableAutoPan: false,
});

const attachListeners = (infoWindow, markerElement, mapRef) => {
  infoWindow.addListener("domready", () => {
    const iwCloseBtn = document.querySelector(".gm-ui-hover-effect");
    if (iwCloseBtn) {
      iwCloseBtn.style.display = "none";
    }
  });
  markerElement.addEventListener("mouseenter", () => {
    infoWindow.open({ anchor: markerElement, map: mapRef.current });
  });
  markerElement.addEventListener("mouseleave", () => {
    infoWindow.close();
  });
};

export const handleExistingMarkerCase = (
  vehicle,
  markersRef,
  tooltipsRef,
  heading,
  position
) => {
  const marker = markersRef.current.get(vehicle.imei);
  marker.position = position;

  const tooltipData = tooltipsRef.current.get(vehicle.imei);
  if (tooltipData?.element && heading !== undefined) {
    tooltipData.element.style.transform = `rotate(${heading}deg)`;
  }
};

export const handleNewMarkerCase = (
  vehicle,
  markersRef,
  tooltipsRef,
  heading,
  position,
  mapRef
) => {
  const { AdvancedMarkerElement } = window.google.maps.marker;
  const element = createMarkerElement(heading);
  const marker = new AdvancedMarkerElement({
    map: mapRef.current,
    position,
    title: vehicle.nickName,
    content: element,
  });
  const infoWindow = new window.google.maps.InfoWindow(
    createInfoWindowObject(vehicle)
  );
  attachListeners(infoWindow, marker, mapRef);
  markersRef.current.set(vehicle.imei, marker);
  tooltipsRef.current.set(vehicle.imei, { infoWindow, element });
};

export const setBounds = (vehicles, mapRef) => {
  const bounds = new window.google.maps.LatLngBounds();
  vehicles.forEach((v) => {
    if (v.stats?.location)
      bounds.extend({ lat: v.stats.location.lat, lng: v.stats.location.lon });
  });
  if (!bounds.isEmpty()) mapRef.current.fitBounds(bounds);
};

export const doesScriptExist = () => {
  return !!document.querySelector(`script[src*="maps.googleapis.com"]`);
};

export const doesMapExist = () => {
  return window.google && window.google.maps;
};

export const formatDuration = (seconds) => {
  if (!seconds) return "N/A";
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
};

export const formatDistance = (meters) => {
  if (!meters) return "N/A";
  return meters >= 1000 ? `${(meters / 1000).toFixed(1)} km` : `${meters} m`;
};

export const parseDuration = (durationString) => {
  return durationString ? parseInt(durationString.replace("s", ""), 10) : null;
};

export const getSessionToken = (ref, placesApiRef) => {
  if (!ref.current) {
    const { AutocompleteSessionToken } = placesApiRef.current;
    ref.current = new AutocompleteSessionToken();
  }
  return ref.current;
};

export const getLatLngFromPlaceId = async (
  placeId,
  placesApiRef,
  sessionToken
) => {
  const { Place } = placesApiRef.current;
  const place = new Place({
    id: placeId,
    requestedLanguage: "en",
    sessionToken: sessionToken,
  });
  await place.fetchFields({ fields: ["location"] });
  return {
    lat: place.location.lat(),
    lng: place.location.lng(),
  };
};

export const displayVehiclesInDropDown = (vehicles) => {
  return vehicles.map((vehicle) => ({
    label: React.createElement(
      "span",
      null,
      React.createElement(CarFilled, {
        style: { color: "#184281", marginRight: "5px" },
      }),
      vehicle.nickName
    ),
    value: vehicle.imei,
    type: "driver",
  }));
};

export const hideInfoWindowCloseButton = (infoWindow) => {
  infoWindow.addListener("domready", () => {
    const closeBtn = document.querySelector(".gm-ui-hover-effect");
    if (closeBtn) closeBtn.style.display = "none";
  });
};

export const createRouteInfoWindow = (distance, duration) => {
  const infoWindow = new window.google.maps.InfoWindow({
    content: `
      <div style="padding: 12px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; min-width: 200px;">
        <div style="font-size: 16px; font-weight: 600; margin-bottom: 8px; color: #184281;">Route Information</div>
        <div style="display: flex; flex-direction: column; gap: 6px;">
          <div style="display: flex; justify-content: space-between;">
            <span style="color: #666;">Distance:</span>
            <span style="font-weight: 500;">${formatDistance(distance)}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: #666;">Drive Time:</span>
            <span style="font-weight: 500;">${formatDuration(duration)}</span>
          </div>
        </div>
      </div>
    `,
  });
  hideInfoWindowCloseButton(infoWindow);
  return infoWindow;
};

export const createMarkerInfoWindow = (name) => {
  const infoWindow = new window.google.maps.InfoWindow({
    content: `<div style="padding: 12px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      <div style="font-size: 16px; font-weight: 600; color: #184281;">${name}</div>
    </div>`,
  });
  hideInfoWindowCloseButton(infoWindow);
  return infoWindow;
};

export const createRouteMarkerElement = (label, backgroundColor) => {
  const element = document.createElement("div");

  element.style.cssText = `
    width: 32px;
    height: 32px;
    background-color: ${backgroundColor};
    border-radius: 50%;
    border: 3px solid ${backgroundColor};
    box-shadow: 0 2px 6px rgba(0,0,0,0.3);
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    font-weight: bold;
    color: white;
    cursor: pointer;
  `;

  const tip = document.createElement("div");
  tip.style.cssText = `
    position: absolute;
    bottom: -12px;
    left: 50%;
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-top: 12px solid ${backgroundColor};
    transform: translateX(-50%);
  `;

  element.textContent = label;
  element.appendChild(tip);

  return element;
};
