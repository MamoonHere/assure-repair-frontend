import { useState, useCallback, useMemo, useRef } from "react";
import debounce from "lodash.debounce";
import {
  getSessionToken,
  getLatLngFromPlaceId,
  displayVehiclesInDropDown,
} from "../utils/mapUtility";

export const useLocationSearch = (vehicles, placesApiRef) => {
  const sessionTokenRef = useRef(null);
  const [location, setLocation] = useState({
    value: null,
    options: [],
    loading: false,
    latitude: null,
    longitude: null,
  });
  const vehicleOptions = useMemo(
    () => displayVehiclesInDropDown(vehicles),
    [vehicles]
  );

  const fetchPlacesSuggestions = async (value, sessionRef) => {
    const { AutocompleteSuggestion } = placesApiRef.current;
    const { suggestions } =
      await AutocompleteSuggestion.fetchAutocompleteSuggestions({
        input: value,
        language: "en-US",
        region: "us",
        locationRestriction: {
          south: 24.396308,
          west: -125.0,
          north: 49.384358,
          east: -66.93457,
        },
        sessionToken: getSessionToken(sessionRef, placesApiRef),
      });
    return suggestions.map((s) => ({
      label: s.placePrediction.text.toString(),
      value: s.placePrediction.placeId,
      type: "location",
    }));
  };

  const debouncedSearch = useMemo(
    () =>
      debounce(async (searchText, sessionRef, includeVehicles = false) => {
        if (!searchText?.trim()) {
          setLocation((prev) => ({
            ...prev,
            options: includeVehicles ? vehicleOptions : [],
            loading: false,
          }));
          return;
        }
        try {
          const results = await fetchPlacesSuggestions(searchText, sessionRef);
          setLocation((prev) => ({
            ...prev,
            options: includeVehicles
              ? [...results, ...vehicleOptions]
              : results,
            loading: false,
          }));
        } catch (error) {
          console.error("Search error:", error);
          setLocation((prev) => ({
            ...prev,
            loading: false,
          }));
        }
      }, 3000),
    [vehicleOptions]
  );

  const handleSearch = useCallback(
    (searchText, includeVehicles = false) => {
      setLocation((prev) => ({
        ...prev,
        loading: true,
        options: [],
      }));
      debouncedSearch(searchText, sessionTokenRef, includeVehicles);
    },
    [debouncedSearch]
  );

  const handleSelect = async (id, option, vehicles) => {
    const locationValue =
      typeof option.label === "string"
        ? option.label
        : option.label.props.children[1];
    let latitude, longitude;

    if (option.type === "driver") {
      const vehicle = vehicles.find((item) => item.imei == id);
      latitude = vehicle.stats.location.lat;
      longitude = vehicle.stats.location.lon;
    } else {
      const response = await getLatLngFromPlaceId(
        id,
        placesApiRef,
        sessionTokenRef.current
      );
      latitude = response.lat;
      longitude = response.lng;
    }

    setLocation((prev) => ({
      ...prev,
      value: locationValue,
      latitude: latitude,
      longitude: longitude,
    }));

    sessionTokenRef.current = null;
    return { latitude, longitude };
  };

  return {
    location,
    setLocation,
    handleSearch,
    handleSelect,
    sessionTokenRef,
  };
};
