import { useEffect } from "react";
import { Space } from "antd";
import { SearchOutlined, EnvironmentOutlined } from "@ant-design/icons";
import { googleRestApi } from "../services/requests/googleRestApi";
import { useTheme } from "../hooks/useTheme";
import { useRoute } from "../hooks/useRoute";
import { useLocationSearch } from "../hooks/useLocationSearch";
import { parseDuration, displayVehiclesInDropDown } from "../utils/mapUtility";
import LocationInput from "./LocationInput";

const MapSider = ({
  vehicles = [],
  placesApiRef,
  mapRef,
  setIsRouteLoading,
}) => {
  const { spacing, shadows, colors } = useTheme();
  const { drawRoute, clearRoute } = useRoute(mapRef);
  const startLocation = useLocationSearch(vehicles, placesApiRef);
  const destination = useLocationSearch(vehicles, placesApiRef);

  const fetchAndDrawRoute = async (origin, dest) => {
    setIsRouteLoading(true);
    const originLat = origin.latitude;
    const originLon = origin.longitude;
    const destLat = dest.latitude;
    const destLon = dest.longitude;

    const body = {
      origin: {
        location: {
          latLng: {
            latitude: originLat,
            longitude: originLon,
          },
        },
      },
      destination: {
        location: {
          latLng: {
            latitude: destLat,
            longitude: destLon,
          },
        },
      },
      travelMode: "DRIVE",
      routingPreference: "TRAFFIC_AWARE",
      computeAlternativeRoutes: false,
      routeModifiers: {
        avoidTolls: false,
        avoidHighways: false,
        avoidFerries: false,
      },
      languageCode: "en-US",
      units: "METRIC",
    };

    try {
      const route = await googleRestApi.getRoute(body);
      console.log("Fetched Route: ", route);

      if (route?.routes?.[0]?.polyline?.encodedPolyline) {
        const routeData = route.routes[0];
        const encodedPolyline = routeData.polyline.encodedPolyline;
        const distance = routeData?.distanceMeters || null;
        const duration = parseDuration(routeData?.duration);

        await drawRoute(
          encodedPolyline,
          originLat,
          originLon,
          destLat,
          destLon,
          distance,
          duration,
          origin.value,
          dest.value
        );
      }
    } catch (error) {
      console.error("Error fetching route:", error);
    } finally {
      setIsRouteLoading(false);
    }
  };

  const handleStartChange = (value) => {
    if (!value) {
      clearRoute();
      startLocation.setLocation((prev) => ({
        ...prev,
        value: null,
        lat: null,
        lon: null,
      }));
    } else {
      clearRoute();
      startLocation.setLocation((prev) => ({ ...prev, value }));
    }
  };

  const handleDestinationChange = (value) => {
    if (!value) {
      clearRoute();
      destination.setLocation((prev) => ({
        ...prev,
        value: null,
        lat: null,
        lon: null,
      }));
    } else {
      clearRoute();
      destination.setLocation((prev) => ({ ...prev, value }));
    }
  };

  const handleStartSelect = async (id, option) => {
    clearRoute();
    const locationData = await startLocation.handleSelect(id, option, vehicles);
    if (destination.location.value && locationData) {
      await fetchAndDrawRoute(locationData, destination.location);
    }
  };

  const handleDestinationSelect = async (id, option) => {
    clearRoute();
    const locationData = await destination.handleSelect(id, option, vehicles);
    if (startLocation.location.value && locationData) {
      await fetchAndDrawRoute(startLocation.location, locationData);
    }
  };

  useEffect(() => {
    if (vehicles.length) {
      const vehicleOptions = displayVehiclesInDropDown(vehicles);
      startLocation.setLocation((prev) => ({
        ...prev,
        options: vehicleOptions,
      }));
    }
  }, [vehicles]);

  useEffect(() => {
    return () => {
      clearRoute();
    };
  }, []);

  return (
    <div
      style={{
        width: 320,
        height: "calc(100vh - 70px)",
        backgroundColor: "#EDF2F7",
        boxShadow: shadows.secondary,
        padding: spacing.paddingLG,
        overflowY: "auto",
        borderRight: "1px solid #184281",
      }}
    >
      <Space
        orientation="vertical"
        size="large"
        style={{ width: "100%", marginTop: spacing.marginSM }}
      >
        <LocationInput
          label="Start Location"
          value={startLocation.location.value}
          options={startLocation.location.options}
          loading={startLocation.location.loading}
          disabled={!vehicles.length}
          placeholder="Enter location"
          icon={<SearchOutlined style={{ color: colors.textTertiary }} />}
          onSearch={(value) => startLocation.handleSearch(value, true)}
          onChange={handleStartChange}
          onSelect={handleStartSelect}
        />

        <LocationInput
          label="Target Location"
          value={destination.location.value}
          options={destination.location.options}
          loading={destination.location.loading}
          disabled={!vehicles.length}
          placeholder="Enter destination"
          icon={<EnvironmentOutlined style={{ color: colors.textTertiary }} />}
          onSearch={(value) => destination.handleSearch(value, false)}
          onChange={handleDestinationChange}
          onSelect={handleDestinationSelect}
        />
      </Space>
    </div>
  );
};

export default MapSider;
