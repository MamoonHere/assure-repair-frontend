import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { AutoComplete, Input, Space, Typography, Spin } from "antd";
import {
  SearchOutlined,
  EnvironmentOutlined,
  CarFilled,
  LoadingOutlined,
} from "@ant-design/icons";
import { useTheme } from "../hooks/useTheme";
import debounce from "lodash.debounce";

const { Text } = Typography;

const displayVehiclesInDropDown = (vehicles) => {
  return vehicles.map((vehicle) => {
    return {
      label: (
        <span>
          <CarFilled style={{ color: "#184281", marginRight: "5px" }} />
          {vehicle.nickName}
        </span>
      ),
      value: vehicle.nickName,
    };
  });
};

const autocompleteLoading = (loading) => {
  return loading ? (
    <Spin
      size="small"
      indicator={<LoadingOutlined spin />}
      style={{
        display: "flex",
        justifyContent: "center",
        padding: "10px 0",
      }}
    />
  ) : (
    "No results found"
  );
};

const getSessionToken = (ref, placesApiRef) => {
  if (!ref.current) {
    const { AutocompleteSessionToken } = placesApiRef.current;
    ref.current = new AutocompleteSessionToken();
  }
  return ref.current;
};

const MapSider = ({ vehicles = [], placesApiRef }) => {
  const { colors, borderRadius, spacing, shadows } = useTheme();
  const [startLocation, setStartLocation] = useState({
    value: null,
    options: [],
    loading: false,
  });
  const [destination, setDestination] = useState({
    value: null,
    options: [],
    loading: false,
  });
  const startSessionTokenRef = useRef(null);
  const destinationSessionTokenRef = useRef(null);

  const vehicleOptions = useMemo(
    () => displayVehiclesInDropDown(vehicles),
    [vehicles]
  );

  const fetchPlacesSuggestions = useCallback(
    async (value, isStart, sessionRef) => {
      const { AutocompleteSuggestion } = placesApiRef.current;
      const request = {
        input: value,
        language: "en-US",
        region: "us",
        locationRestriction: {
          south: 24.396308,
          west: -125.0,
          north: 49.384358,
          east: -66.93457,
        },
      };
      request.sessionToken = getSessionToken(sessionRef, placesApiRef);
      const { suggestions } =
        await AutocompleteSuggestion.fetchAutocompleteSuggestions(request);
      const results = [];
      for (let suggestion of suggestions) {
        const placePrediction = suggestion.placePrediction;
        results.push({
          label: placePrediction.text.toString(),
          value: placePrediction.placeId,
        });
      }
      if (isStart) {
        setStartLocation((prev) => ({
          ...prev,
          options: [...results, ...vehicleOptions],
          loading: false,
        }));
      } else {
        setDestination((prev) => ({
          ...prev,
          options: results,
          loading: false,
        }));
      }
    },
    [vehicles]
  );

  const debouncedSearch = useMemo(
    () =>
      debounce(async (searchText, isStart, sessionRef) => {
        if (!searchText?.trim()) {
          if (isStart) {
            setStartLocation((prev) => ({
              ...prev,
              options: vehicleOptions,
              loading: false,
            }));
          } else {
            setDestination((prev) => ({
              ...prev,
              options: [],
              loading: false,
            }));
          }
          return;
        }
        try {
          await fetchPlacesSuggestions(searchText, isStart, sessionRef);
        } catch (error) {
          console.error("Search error:", error);
        }
      }, 3000),
    [fetchPlacesSuggestions]
  );

  const handleSearchForStartLocation = (searchText) => {
    setStartLocation((prev) => ({
      ...prev,
      loading: true,
      options: [],
    }));
    debouncedSearch(searchText, true, startSessionTokenRef);
  };

  const handleSearchForDestination = (searchText) => {
    setDestination((prev) => ({ ...prev, loading: true, options: [] }));
    debouncedSearch(searchText, false, destinationSessionTokenRef);
  };

  const handleSelectForStartLocation = (_, option) => {
    setStartLocation((prev) => ({ ...prev, value: option.label }));
    startSessionTokenRef.current = null;
  };

  const handleSelectForDestination = (_, option) => {
    setDestination((prev) => ({ ...prev, value: option.label }));
    destinationSessionTokenRef.current = null;
  };

  useEffect(() => {
    if (vehicles.length) {
      setStartLocation((prev) => ({
        ...prev,
        options: vehicleOptions,
      }));
    }
    return () => {
      debouncedSearch.cancel();
    };
  }, [vehicles]);

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
        <div>
          <Text
            strong
            style={{ display: "block", marginBottom: spacing.marginSM }}
          >
            Start Location:
          </Text>
          <AutoComplete
            value={startLocation.value}
            options={startLocation.options}
            disabled={!vehicles.length}
            style={{ width: "100%" }}
            placeholder="Enter location"
            notFoundContent={autocompleteLoading(startLocation.loading)}
            showSearch={{
              onSearch: handleSearchForStartLocation,
              filterOption: false,
            }}
            onChange={(value) =>
              setStartLocation((prev) => ({ ...prev, value }))
            }
            onSelect={handleSelectForStartLocation}
          >
            <Input
              prefix={<SearchOutlined style={{ color: colors.textTertiary }} />}
              style={{
                borderRadius: borderRadius.base,
                boxShadow: "0 0 6px rgba(24, 66, 129, 0.35)",
              }}
            />
          </AutoComplete>
        </div>

        <div>
          <Text
            strong
            style={{ display: "block", marginBottom: spacing.marginSM }}
          >
            Target Location:
          </Text>
          <AutoComplete
            value={destination.value}
            options={destination.options}
            disabled={!vehicles.length}
            style={{ width: "100%" }}
            placeholder="Enter destination"
            notFoundContent={autocompleteLoading(destination.loading)}
            showSearch={{
              onSearch: handleSearchForDestination,
              filterOption: false,
            }}
            onChange={(value) => setDestination((prev) => ({ ...prev, value }))}
            onSelect={handleSelectForDestination}
          >
            <Input
              prefix={
                <EnvironmentOutlined style={{ color: colors.textTertiary }} />
              }
              style={{
                borderRadius: borderRadius.base,
                boxShadow: "0 0 6px rgba(24, 66, 129, 0.35)",
              }}
            />
          </AutoComplete>
        </div>
      </Space>
    </div>
  );
};

export default MapSider;
